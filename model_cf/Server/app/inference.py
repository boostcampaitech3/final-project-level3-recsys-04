import sys, os
import torch
from scipy import sparse
import pandas as pd
import numpy as np
from tqdm import tqdm
import ast

def naive_sparse2tensor(data):
    return torch.FloatTensor(data.toarray())


def inference_api(data, model):
    device = torch.device("cuda:0")

    # min_uc하고  min_sc가 수동설정되어있음
  
    data_tensor = naive_sparse2tensor(data).to(device)

    model.eval()

    output = model(data_tensor, calculate_loss=False).cpu().detach().numpy()
    idx = np.argsort(-output, axis=1) # user별로 추천할 itemId가 순서대로 담긴 행렬

    return idx