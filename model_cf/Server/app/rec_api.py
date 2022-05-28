import sys, os
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(os.path.abspath(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))))))

import pickle
from google.cloud import storage
import tarfile
from datetime import datetime
from pymongo import MongoClient
from typing import Optional
from fastapi import FastAPI
from pydantic import BaseModel
from app.inference import inference_api
from project.RecVAE.model import VAE
import torch
import numpy as np
from scipy import sparse
import json
## db connetion
os.environ["GOOGLE_APPLICATION_CREDENTIALS"]="noble-velocity-349915-f8beeb8a1f8a.json"
with open('data_dict.pkl','rb') as f:
     dbdict = pickle.load(f)
user = dbdict['user']
passwd = dbdict['passwd']
host = dbdict['host']
database = dbdict['database']
conn = MongoClient(f'mongodb+srv://{user}:{passwd}@{host}/{database}')

## download_file ( model.pt)
def download_file(model_name, db_conn, tag="", latest=True):
    
    if latest is True:
        ret = list(db_conn.find({"name": model_name, "tag":tag}).sort("time", -1).limit(1))[0]
    else:
        ret = list(db_conn.find_one({"name":model_name, "tag":tag}))[0]
    
    source_blob_name = ret["file_name"]
    storage_client = storage.Client()
    bucket = storage_client.bucket(ret["bucket_name"])
    blob = bucket.blob(source_blob_name)
    
    blob.download_to_filename(source_blob_name)
    print(f"file download complete: {source_blob_name}")

# FastAPI
app = FastAPI()
#model 
best_model = None
####  dict for match user_list to user vector
unique_sid_dir = 'unique_sid.txt'
unique_sid = []
with open(unique_sid_dir, 'r') as f:
    while True :
        line = f.readline().rstrip()
        if not line :
            break
        unique_sid.append(int(line))
show2id = dict((sid, i) for (i, sid) in enumerate(unique_sid))
id2show= dict(map(reversed,show2id.items())) 
show2id = dict((sid, i) for (i, sid) in enumerate(unique_sid))
id2show= dict(map(reversed,show2id.items())) 
def sid2id(x):
    return show2id[x]
def id2sid(x):
    return id2show[x]
### 
@app.on_event("startup")
def startup_event():
    ##load model.pt
    global best_model
    ## db connection
    db = conn.get_database("final_project") 
    collection = db.get_collection("model")
    ## model.pt download
    download_file("test", collection)

    ## model.pt read
    with open('test_nj_recomend.pt', 'rb') as f:
        best_model = torch.load(f)
    
@app.get("/")
def test():
    return {"ServerOn"}

###post용 item
class User_json(BaseModel):
    rids: list

#infer
@app.post("/model")
def infer_repo(user_json:User_json):
    #user_json -> user_list
    user_list = list(map(int,user_json.rids ))

    #user_list -> user_vector
    user_vector = list(map(sid2id, user_list))
    n_users = 1
    n_items = len(unique_sid)

    rows, cols = np.array([0 for _ in range(len(user_vector))]), np.array(user_vector)
    data = sparse.csr_matrix((np.ones_like(rows),
                                (rows, cols)), dtype='float64',
                                shape=(n_users, n_items))
    # model infer
    global best_model
    infer_list = inference_api(data, best_model)

    #recomend_vector -> recomend_list
    r_num = 10
    recomend_vector = []
    for item in infer_list[0]:
        if len(recomend_vector) == r_num:
            break
        if item not in user_vector:
            recomend_vector.append(item)    
    print(recomend_vector)
    recomend_list = list(map(id2sid, recomend_vector))
    # user
    user_json.rids = recomend_list
    return user_json


