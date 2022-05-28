import json
import os, sys

sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
import re
import time
from datetime import datetime

import yaml
import argparse
from distutils.util import strtobool

import requests
from dotenv import load_dotenv

from pymongo import MongoClient

from redisqueue import RedisQueue


def db_connect(user, passwd, database, **kwargs):
    db_connection_str = f"mongodb+srv://{user}:{passwd}@cluster0.dojne.mongodb.net/{database}"

    conn = MongoClient(db_connection_str)

    return conn["final_project"]


def get_repo_user_list(url, headers):
    res = requests.get(url, headers=headers)
    res.raise_for_status()

    data = res.json()

    return data


if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    load_dotenv(verbose=True)

    parser.add_argument("--token_idx", type=int, default=0)

    args = parser.parse_args()

    with open(os.getenv("SETTINGS")) as f:
        settings = yaml.load(f, Loader=yaml.FullLoader)

    token_list = settings["token"]
    token_idx = args.token_idx
    token = token_list[token_idx]
    token_count = 1
    data_profile = settings["data_profile"]
    db_profile = settings["db_profile"]
    cloud_info = settings["cloud_info"]
    headers = {"Authorization": "token " + token,
               "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) "
                             "Chrome/84.0.4147.89 Safari/537.36"}

    q = RedisQueue("final_project", host=cloud_info["host"], port=6379, db=0, decode_responses=True)

    print("Get repository data")
    db = db_connect(**db_profile)
    collection = db.get_collection("repository")
    repo_list = collection.find()

    url_list = []

    for repo in repo_list:
        rid = repo["rid"]
        login = repo["login"]
        repo_name = repo["repo_name"]
        star_pages = 10 if repo["star_pages"] > 10 else repo["star_pages"]

        base_url = f"https://api.github.com/repos/{login}/{repo_name}/stargazers?per_page=100&page="
        tmp_url = [(rid, base_url + str(page)) for page in range(1, star_pages + 1)]

        url_list.extend(tmp_url)

    url_idx = 0
    uid_list = []
    data_dict = dict()
    insert_dict = dict()
    update_dict = dict()

    while url_idx < len(url_list):
        rid, url = url_list[url_idx]

        try:
            data = get_repo_user_list(url, headers)

            for user in data:
                update_dict["rid"] = rid
                update_dict["uid"] = user["id"]

                if user["id"] not in uid_list:
                    insert_dict["uid"] = user["id"]
                    insert_dict["login"] = user["login"]
                    uid_list.append(user["id"])
                else:
                    insert_dict = dict()

                data_dict["insert"] = insert_dict
                data_dict["update"] = update_dict

                insert_data = json.dumps(data_dict)
                uid_list.append(user["id"])
                q.put(insert_data)

            url_idx += 1
        except requests.exceptions.HTTPError as httperr:
            if httperr.response.status_code == 403:
                if token_count >= len(token_list):
                    print("Wait token reset")
                    time.sleep(60 * 60)
                    token_count = 1
                else:
                    token_count += 1
                token_idx += 1
                token_idx = token_idx % len(token_list)
                token = token_list[token_idx]
                headers["Authorization"] = "token " + token
            elif httperr.response.status_code == 404:
                url_idx += 1