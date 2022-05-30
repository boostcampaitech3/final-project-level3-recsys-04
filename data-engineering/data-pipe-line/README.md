# Redis Producer Consumer Base code

## requirements

```.sh
pip install -r requirements.txt
```

## How to use

1. Execute `consumer.py`
2. Execute `producer-xxxxx.py`

## Arguments

### `consumer.py`

```.sh
python consumer.py --time_interval [time]
```

- `time_interval` insert batch data time interval

### `producer-xxxxx.py`

```.sh
python producer-xxxxx.py --data_path [path] --token_idx [idx]
```

- `data_path` : data save path (not use)
- `token_idx` : if you use github oAuth tokens, write down token list in \*.yaml file. And this argument is start token idx


## Setting files

```.yaml
data_profile:
  links:
    - https://raw.githubusercontent.com/denolib/awesome-deno/main/README.md
    - https://raw.githubusercontent.com/sindresorhus/awesome-electron/main/readme.md
    - https://raw.githubusercontent.com/enaqx/awesome-react/master/README.md
    - https://raw.githubusercontent.com/sindresorhus/awesome-nodejs/main/readme.md
    - https://raw.githubusercontent.com/vuejs/awesome-vue/master/README.md
    - https://raw.githubusercontent.com/PatrickJS/awesome-angular/gh-pages/README.md
  category:
    - Deno
    - Electron
    - React
    - Node.js
    - Vue.js
    - Angular
  types:
    - BackEnd
    - Total
    - FrontEnd
    - BackEnd
    - FrontEnd
    - FrontEnd

db_profile:
  user: # username
  passwd: # password
  database: # your db

token:
  - # token 1
  - # token 2
  
cloud_info:
  host: # cloud host ip
```
