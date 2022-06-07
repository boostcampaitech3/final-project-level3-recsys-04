# CF(Collaborative Filtering) Inference Server
- 메인 서버와 API로 소통하며 user의 repo 방문 기록을 전달받으면 repo 추천 목록을 반환
- 정해진 시간마다 DB에서 mmodel.pt를 다운 받아서 model 업데이트를 진행 

## How to start
- main.py 실행시 uvicorn 을 통해 server를 가동   
  - ~# python main.py  
  - server: uvicorn   
  - port: 8090

## API list
### get('/')  
서버 실행 체크용

### post('/model') 
추론을 위한 API  
- request
  - user의 방문 repo 목록     
  - type: Json  
  - body: {rids: list[Int]}

- response 
  - model에서 추천하는 repo 목록
  - type: Json  
  - body: {rids: list[Int]}

## Model update
매일 KDT PM 5시에 model.pt를 다운받아 자동으로 model 업데이트
- udate 시간 변경 
  - check_model_update() 에서 wait_until() 의 입력값을 수정 ex) wait_until(hour, minute)
- udate 기간 변경 
  - check_model_update() 에서 asyncio.sleep() 입력값을 수정 (단위는 second)

## Notice
보안상으로 이유로 DB 관련 config 파일은 github에 존재하지 않음


