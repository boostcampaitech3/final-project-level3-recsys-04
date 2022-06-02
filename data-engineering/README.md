# Directory infromation

## Directory structure

```
.
├── README.md
├── batch-dag
│   ├── README.md
│   ├── batch_train.py
│   └── requirements.txt
├── data-pipe-line
│   ├── README.md
│   ├── consumer.py
│   ├── producer
│   │   ├── producer_repository.py
│   │   └── producer_user.py
│   ├── redisqueue.py
│   └── requirements.txt
└── user_star_in_item.py
```

## `batch-dag`

- This directory is about batch training pipeline dag
- DAG based on [Airflow](https://github.com/apache/airflow)

## `data-pipe-line`

- This directory is about producer-consumer pipeline codes
- Messsage queue server is redis

## `user_star_in_item.py`

- Make `star_in_item` field in `user_info` collection
- Algorithm
    - Get repository data from `repository` collection
    - Loop search results, and update `user_info` collection based on `star_user_list`
