# Batch train dags based on Apache Airflow

## requirements

```.sh
pip install pip --upgrade
pip install -r requirements.txt
```

## How to use

1. If you install `requirements.txt`, you can start airflow
2. Set the `AIRFLOW_HOME` environments
   ```bash
   export AIRFLOW_HOME=[your airflow home]
   ```
3. Airflow db init
  ```bash
  ariflow db init
  ```
4. Make admin user
   ```bash
   airflow users create \
   --username [username] \
   --password [password] \
   --firstname [your first name] \
   --lastname [your last name] \
   --role Admin \
   --email [your email address]
   ```
5. Make folder under `$AIRFLOW_HOME`
   ```bash
   mkdir $AIRFLOW_HOME/dags
   ```
6. `batch_train.py` file move to `$AIRFLOW_HOME/dags`
7. Exectue airflow webserver
   ```bash
   airflow webserver --port 8080
   ```
8. Execute airflow scheduler
   ```bash
   export AIRFLOW_HOME=[your airflow home]
   airflow scheduler
   ```

## Setting files

**You must write absolute path**

```.yaml
db_profile:
  host: # DB host
  user: # DB username
  password: # DB password
  database: # DB database

gcloud:
  credential_path: # google cloud user credential file path

save_path: # file save path 
```
