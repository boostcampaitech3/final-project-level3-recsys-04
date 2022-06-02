import sys, os
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(os.path.abspath(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))))))

import torch
from scipy import sparse
import pandas as pd
import numpy as np
import bottleneck as bn
from dotenv import load_dotenv
from tqdm import tqdm
import ast

load_dotenv(verbose=True)

def naive_sparse2tensor(data):
    return torch.FloatTensor(data.toarray())

from preprocessing import filter_triplets, get_count, numerize
def inference(args, device, save_name):
    raw_data = pd.read_csv(os.path.join(os.getenv("DATA_PATH"), 'all_user_repo.csv'))
    # min_uc하고  min_sc가 수동설정되어있음
    raw_data, user_activity, item_popularity = filter_triplets(raw_data, min_uc=10, min_sc=10) 

    unique_sid = raw_data['item'].unique()
    unique_uid = raw_data['user'].unique()

    show2id = dict((sid, i) for (i, sid) in enumerate(unique_sid))
    profile2id = dict((pid, i) for (i, pid) in enumerate(unique_uid))

    raw = numerize(raw_data, profile2id, show2id)
    n_users = raw['uid'].max() + 1
    n_items = len(unique_sid)

    rows, cols = raw['uid'], raw['sid']
    data = sparse.csr_matrix((np.ones_like(rows),
                                (rows, cols)), dtype='float64',
                                shape=(n_users, n_items))

    data_tensor = naive_sparse2tensor(data).to(device)

    with open(os.path.join(args.dataset, f'models/{save_name}.pt'), 'rb') as f:
        model = torch.load(f)
    
    model.eval()

    k = 10
    output = model(data_tensor, calculate_loss=False).cpu().detach().numpy()
    idx = np.argsort(-output, axis=1) # user별로 추천할 itemId가 순서대로 담긴 행렬

    # pred_dic에 user별로 추천 영화 리스트로 넣기
    # idx의 행이 profile2id의 0,1,2... 순서 
    # userId, itemId값 딕셔너리 key, value 순서 0:46936 요렇게 바꿔주기
    id2profile= dict(map(reversed,profile2id.items()))
    id2show= dict(map(reversed,show2id.items())) 
    pred_dic = {}
    for i in tqdm(range(len(idx))):
        decoded = [id2show[x] for x in idx[i]]
        pred_dic[id2profile[i]] = decoded

    # 제출용 빈 데이터프레임 생성
    users = unique_uid.repeat(k)
    test_df = pd.DataFrame(users, columns=['user'])
    test_df['item']=0


    # 유저별 10개씩 추천
    index = 0
    for user in tqdm(unique_uid):
        temp_items = np.array(list(pred_dic[user]))
        top_k_items = temp_items[:k]
        for i in range(k):
            test_df.loc[index + i, 'item'] = top_k_items[i]
        index += k

    test_df.to_csv(os.path.join(args.dataset, f'preds/{save_name}.csv'), index=False)

def inference_api(data, model):
    device = torch.device("cuda:0")

    # min_uc하고  min_sc가 수동설정되어있음
  
    data_tensor = naive_sparse2tensor(data).to(device)

    model.eval()

    output = model(data_tensor, calculate_loss=False).cpu().detach().numpy()
    idx = np.argsort(-output, axis=1) # user별로 추천할 itemId가 순서대로 담긴 행렬

    return idx