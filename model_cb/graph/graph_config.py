#!/usr/bin/env python3
BASE_PATH = "./data/mysql-2016-01-08/graph_edges"

def get_torchbiggraph_config():

    config = dict(
        # I/O data
        entity_path=BASE_PATH,
        edge_paths=[f'{BASE_PATH}/graph-train_partitioned'],
        checkpoint_path=BASE_PATH,

        # Graph structure
        entities={
            'all': {'num_partitions': 4},
        },
        relations=[{
            'name': 'all_edges',
            'lhs': 'all',
            'rhs': 'all',
            'operator': 'complex_diagonal',
        }],
        dynamic_relations=True,

        # Scoring model
        dimension=100,
        global_emb=False,
        comparator='dot',

        # Training
        num_epochs=10,
        num_uniform_negs=100,
        loss_fn='softmax',
        lr=0.1,

        # Evaluation during training
        eval_fraction=0,  # to reproduce results, we need to use all training data
    )

    return config
