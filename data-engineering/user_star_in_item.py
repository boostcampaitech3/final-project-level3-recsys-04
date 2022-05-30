import os
import yaml
from tqdm import tqdm

from dotenv import load_dotenv
from pymongo import MongoClient


def db_connect(user, passwd, database, **kwargs):
    db_connection_str = f"mongodb+srv://{user}:{passwd}@cluster0.dojne.mongodb.net/{database}"

    conn = MongoClient(db_connection_str)

    return conn["final_project"]


if __name__ == '__main__':
    load_dotenv(verbose=True)

    with open("awesome_link.yaml") as f:
        settings = yaml.load(f, Loader=yaml.FullLoader)

    db_profile = settings["db_profile"]
    conn = db_connect(**db_profile)

    ret = conn["repository"].find({"star_user_list": {"$exists": True}})
    user_info = conn["user_info"]

    for item in tqdm(ret):
        rid = item["rid"]
        star_user_list = item["star_user_list"]

        user_info.update_many(
            {
                "uid": {
                    "$in": star_user_list
                }
            },
            {
                "$addToSet": {
                    "star_in_item": rid
                }
            }
        )

    print("DB update complete!")