# RecVAE

#### 먼저 python preprocessing.py --dataset(train_ratings.csv path) --output_dir(전처리파일들 저장할 곳) 하셔서 전처리 진행하시고
#### python run.py --dataset(전처리 파일들 저장한 곳) 하시고 기타 설정은 입맞에 맞게 바꿔주시면 됩니다(모델, 제출파일 이름은 --save 등등...)
#### run.py 실행시키실 때 --train True --infrenece True 하시면 훈련부터 제출파일 저장까지 한 번에 되고 하나씩 하고 싶으실 때는 원하시는 인자만 True로 주시면 됩니다.
#### 현재 n_heldout을 0으로 하기 위해 valid관련 코드를 다 주석처리 해놓은 상태입니다. n_heldout을 1 이상으로 하고 싶으시면 run, preprocessing, util에서 valid 관련 주석을 풀어주세요!

-------------------------------------

The official PyTorch implementation of the paper "RecVAE: A New Variational Autoencoder for Top-N Recommendations with Implicit Feedback".

In order to train RecVAE on MovieLens-20M dataset ([download link](http://files.grouplens.org/datasets/movielens/ml-20m.zip)), preprocess it using following script:

```sh
python preprocessing.py --dataset <path_to_csv_file> --output_dir <dataset_dir> --threshold 3.5 --heldout_users 10000
```

You can also use another dataset, it should contain columns `userId`, `movieId` and `rating` (in arbitrary order).

Then use the following command to start training:

```
python run.py --dataset <dataset_dir>
```

See `python run.py -h` for more information.

Current model is slightly different from the one described in the paper, you can find original code [here](https://github.com/ilya-shenbin/RecVAE/tree/wsdm).

Some sources from  [Variational autoencoders for collaborative filtering](https://github.com/dawenl/vae_cf) is partially used.

If you used this code for a publication, please cite our WSDM'20 paper
```
@inproceedings{10.1145/3336191.3371831,
  author = {Shenbin, Ilya and Alekseev, Anton and Tutubalina, Elena and Malykh, Valentin and Nikolenko, Sergey I.},
  title = {RecVAE: A New Variational Autoencoder for Top-N Recommendations with Implicit Feedback},
  year = {2020},
  isbn = {9781450368223},
  publisher = {Association for Computing Machinery},
  address = {New York, NY, USA},
  url = {https://doi.org/10.1145/3336191.3371831},
  doi = {10.1145/3336191.3371831},
  booktitle = {Proceedings of the 13th International Conference on Web Search and Data Mining},
  pages = {528–536},
  numpages = {9},
  keywords = {deep learning, collaborative filtering, variational autoencoders},
  location = {Houston, TX, USA},
  series = {WSDM ’20}
}
```

