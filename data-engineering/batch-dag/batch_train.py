import os
from urllib.request import BaseHandler
import yaml
from datetime import timedelta

import pandas as pd

from pymongo import MongoClient
from google.cloud import storage
import tarfile
from datetime import datetime

from airflow import DAG
from airflow.utils.dates import days_ago
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from airflow.operators.dummy import DummyOperator


def get_config():
    """
    Get config files and parsing data

    Returns:
        config: (type: json) config json file from .yaml file
    """
    with open("/opt/ml/dags/config.yaml") as f:
        config = yaml.load(f, Loader=yaml.FullLoader)
    
    return config


def get_count(tp, id):
    playcount_groupbyid = tp[[id]].groupby(id, as_index=True)
    count = playcount_groupbyid.size()
    return count


def filter_triplets(tp, min_uc=10, min_sc=10):
    if min_sc > 0:
        itemcount = get_count(tp, 'item')
        tp = tp[tp['item'].isin(itemcount.index[itemcount >= min_sc])]
    
    if min_uc > 0:
        usercount = get_count(tp, 'user')
        tp = tp[tp['user'].isin(usercount.index[usercount >= min_uc])]

    usercount, itemcount = get_count(tp, 'user'), get_count(tp, 'item') 
    return tp, usercount, itemcount


def preprocessing(**context):
    config = context["task_instance"].xcom_pull(task_ids="config_loader")
    
    # Database conenction and settings
    db_config = config["db_profile"]
    host, user, password, database = db_config["host"], db_config["user"], db_config["password"], db_config["database"]
    db_url = f"mongodb+srv://{user}:{password}@{host}/{database}"
    conn = MongoClient(db_url)
    db = conn.get_database("final_project")
    collection = db.get_collection("repository")
    
    # Get Data from db and make user-item dataframe
    filtering_query = {"stars": {"$gt": 10}}
    filtered_repository = pd.DataFrame(list(collection.find(filtering_query)))
    
    item_list = list()
    user_list = list()
    
    for i, item in filtered_repository.iterrows():
        if type(item["star_user_list"]) == type([]):
            item_temp = [item["rid"]] * len(item["star_user_list"])
            item_list.extend(item_temp)
            user_list.extend(item["star_user_list"])
        
    df_dict = dict()  
    df_dict["user"] = user_list
    df_dict["item"] = item_list
    repo_user_df = pd.DataFrame(df_dict)
    repo_user_df = repo_user_df.sort_values("user").reset_index(drop=True)
    
    # preprocessing for RecVAE
    save_path = os.path.join(config["save_path"], "all_user_repo.csv")
    pre_repo_user_df, user_count, item_count = filter_triplets(repo_user_df)
    pre_repo_user_df.to_csv(save_path, index=False)
    

def get_model_list():
    file_list = os.listdir("/opt/ml/dags/save_files/data/models")
    file_list = sorted(file_list, reverse=True)
    best = file_list[0]
    
    upload_config = {
        "file_path": f"/opt/ml/dags/save_files/data/models/{best}",
        "model_name": "RecVAE",
        "score": float(file_list[0].split("_")[2].split(".")[0]),
    }
    
    return upload_config
    
    
def file_to_storage(file_path=None, model_name=None, tag="", db_conn=None, file_name=None, tar_zip=False, **context):
    config = context["task_instance"].xcom_pull(task_ids="config_loader")
    upload_config = context["task_instance"].xcom_pull(task_ids="get_best_model_info")
    # google-cloud storage credentials
    cred = config["gcloud"]["credential_path"]
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = cred
    
    # Database conenction and settings
    db_config = config["db_profile"]
    host, user, password, database = db_config["host"], db_config["user"], db_config["password"], db_config["database"]
    db_url = f"mongodb+srv://{user}:{password}@{host}/{database}"
    conn = MongoClient(db_url)
    db = conn.get_database("final_project")
    collection = db.get_collection("model")
    db_conn = collection
    
    # File info settings
    file_path = upload_config["file_path"]
    model_name = upload_config["model_name"]
    score = upload_config["score"]
    
    if file_name is None:
        file_name = file_path.split("/")[-1]

    if tar_zip is True:
        tar_name = file_name.split(".")[0] + ".tar"
        with tarfile.open(file_name.split(".")[0] + ".tar") as f:
            f.add(file_path)
        file_name = tar_name

    storage_client = storage.Client()
    bucket = storage_client.bucket("model-save")
    blob = bucket.blob(file_name)

    blob.upload_from_filename(file_path)

    if db_conn is not None:
        db_conn.insert_one({
            "name": model_name,
            "bucket_name": "model-save",
            "file_name": file_name,
            "time": datetime.now(),
            "score": score,
            "tag": tag
        })

    print("model save complete!")


with DAG(
    dag_id="batch_train_recvae",
    description="RecVAE batch train dag",
    start_date=days_ago(2),
    schedule_interval=None,
    tags=["recsys", "recvae"]
) as dag:
    
    # config load task
    load_config = PythonOperator(
        task_id="config_loader",
        python_callable=get_config,
        owner="polar",
        retries=3,
        retry_delay=timedelta(minutes=3),
    )
    
    # install requirements
    install_requirements = BashOperator(
        task_id="install_requirements",
        bash_command="pip install -r /opt/ml/dags/recvae/requirements.txt",
        owner="polar",
        retries=3,
        retry_delay=timedelta(minutes=1),
    )
    
    # data preprocessing and save the file csv defore train recvae
    preprocessing = PythonOperator(
        task_id="preprocessing_base_data",
        python_callable=preprocessing,
        depends_on_past=True,
        provide_context=True,
        owner="polar",
        retries=3,
        retry_delay=timedelta(minutes=5),
    )
    
    # RecVAE Part Task
    ## RecVAE preprocessing
    vae_preprocessing = BashOperator(
        task_id="prepocessing_vae",
        bash_command="python /opt/ml/dags/recvae/preprocessing.py",
        owner="polar",
        retries=3,
        retry_delay=timedelta(minutes=5),
    )
    
    ## RecVAE training part
    model_train = BashOperator(
        task_id="model_train",
        bash_command="python /opt/ml/dags/recvae/run.py",
        owner="polar",
        retries=3,
        retry_delay=timedelta(minutes=10),
    )
    
    get_model_pt = PythonOperator(
        task_id="get_best_model_info",
        python_callable=get_model_list,
        depends_on_past=True,
        owner="polar",
        retries=3,
        retry_delay=timedelta(minutes=5),
    )
    
    # model.pt upload phase
    upload_to_storage = PythonOperator(
        task_id="upload_model",
        python_callable=file_to_storage,
        depends_on_past=True,
        provide_context=True,
        owner="polar",
        retries=3,
        retry_delay=timedelta(minutes=5),
    )
    
    
    [load_config, install_requirements] >> preprocessing >> vae_preprocessing >> model_train >> get_model_pt >> upload_to_storage
    
