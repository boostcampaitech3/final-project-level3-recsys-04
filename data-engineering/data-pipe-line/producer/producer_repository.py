import json
import os
import re
import time
from datetime import datetime

import yaml
import argparse
from distutils.util import strtobool

import requests
from dotenv import load_dotenv

from redisqueue import RedisQueue


def get_awesome_repo_list(url, lang, types):
    headers = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) "
                             "Chrome/84.0.4147.89 Safari/537.36"}
    res = requests.get(url, headers=headers)

    categories = list(filter(None, re.split(r"#{2,}", res.text)))
    ret_list = []
    url_dict = {
        "category": {
            "category_S": "",
            "category_M": "",
            "category_L": "",
        },
        "login": "",
        "repo_name": "",
    }

    for category in categories[1:]:
        cate = re.sub(r"[\[\]]|\(https:[a-z\.\/\-]*\)", "" ,category.split('\n')[0].strip())
        # urls = re.findall(r"^((?!apps).)*$", " ".join(urls))
        urls = re.findall(r"(?<=https://github.com/)[0-9a-zA-Z]+/[._0-9a-zA-Z\-]+", category)

        if len(urls) > 0:
            # if urls.split('/')[1] == "apps": continue
            cate_info = ["category_S", "category_M", "category_L"]
            category_dict = dict(zip(cate_info, [cate, lang, types]))

            for ur in urls:
                if ur.split("/")[0] == "apps": continue
                url_dict = {"login": ur.split("/")[0], "repo_name": ur.split("/")[1], "category": category_dict}
                ret_list.append(url_dict)

    return ret_list

def get_repository_infos(login, repo_name, headers):
    base_url = f"https://api.github.com/repos/{login}/{repo_name}"

    res = requests.get(base_url, headers=headers)
    res.raise_for_status()

    data = res.json()
    pages = 400 if data["stargazers_count"] // 100 + 1 > 400 else data["stargazers_count"] // 100 + 1

    return pages, data["id"], data["owner"]["id"], data["stargazers_count"], data["updated_at"], data["topics"]

def get_language_list(login, repo_name, headers):
    base_url = f"https://api.github.com/repos/{login}/{repo_name}/languages"

    res = requests.get(base_url, headers=headers)
    res.raise_for_status()

    data = res.json()

    return data


if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    load_dotenv(verbose=True)

    parser.add_argument("--dummy", type=lambda x: strtobool(x), default=True, help="Whether dummy or not")
    parser.add_argument("--data_path", type=str, default=os.getenv("DATA_PATH"), help="Data Save path")
    parser.add_argument("--token_idx", type=int, default=0)
    parser.add_argument("--sep", type=str, default="###")

    args = parser.parse_args()

    with open(os.getenv("SETTINGS")) as f:
        settings = yaml.load(f, Loader=yaml.FullLoader)

    token_list = settings["token"]
    token_idx = args.token_idx
    token = token_list[token_idx]
    data_profile = settings["data_profile"]
    cloud_info = settings["cloud_info"]
    headers = {"Authorization": "token " + token,
               "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) "
                             "Chrome/84.0.4147.89 Safari/537.36"}

    q = RedisQueue("final_project", host=cloud_info["host"], port=6379, db=0, decode_responses=True)

    repo_list = []

    for link, types, category in zip(data_profile["links"], data_profile["types"], data_profile["category"]):
        data = get_awesome_repo_list(link, category, types)
        repo_list.extend(data)

    exist_list = []
    token_loop = 0
    repo_idx = 0

    print("Now get basic information...")
    while repo_idx < len(repo_list):
        repo = repo_list[repo_idx]

        try:
            data = get_repository_infos(repo["login"], repo["repo_name"], headers)
            lang = get_language_list(repo["login"], repo["repo_name"], headers)

            repo["star_pages"] = data[0]
            repo["rid"] = data[1]
            repo["uid"] = data[2]
            repo["stars"] = data[3]
            repo["updated_at"] = data[4]
            repo["topics"] = data[5]
            repo["languages"] = lang

            repo_idx += 1
            
            if repo["rid"] not in exist_list:
                insert_data = json.dumps(repo)
                exist_list.append(repo["rid"])
                q.put(insert_data)

        except requests.exceptions.HTTPError as httperr:
            if httperr.response.status_code == 403:
                # wait token
                if token_loop == 4: 
                    print("Wait token reset")
                    token_loop = 0
                    time.sleep(60 * 60)
                else:
                    token_idx += 1
                    token_idx = token_idx % len(token_list)
                    token = token_list[token_idx]
                    headers["Authorization"] = "token " + token
                    token_loop += 1

            elif httperr.response.status_code == 404:
                repo_idx += 1

    




