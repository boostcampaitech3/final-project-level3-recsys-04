<div>
  <img src="./img/boostcamp_logo.png"/>
</div>

# 💻 Github You may also Like

## Contents

- [👩🏻‍💻👨🏻‍💻 Members](#-members)
- [📱 Demo](#demo)
- [🛠 Service Architecture](#-service-architecture)
- [📁 Dataset](#-dataset)
- [❗️ About Service](#about-service)
  - [왜 개발하게 되었나요?](#왜-개발하게-되었나요)
  - [서비스 개발 방향](#서비스-개발-방향)
  - [참고자료](#참고자료)
- [❓ How to use](#-how-to-use)
  - [Front-End](#front-end)
  - [Back-End](#back-end)
  - [Model](#model)
  - [Data Pipeline](#data-pipeline)

## 👩🏻‍💻👨🏻‍💻 Members

<table align="center">
    <tr>
        <td align="center">박기범</td>
        <td align="center">정인식</td>
        <td align="center">조영하</td>
        <td align="center">조예진</td>
        <td align="center">최필규</td>
    </tr>
    <tr height="160px">
        <td align="center">
            <img height="120px" weight="120px" src="https://avatars.githubusercontent.com/u/61653740?v=4"/>
        </td>
        <td align="center">
            <img height="120px" weight="120px" src="https://avatars.githubusercontent.com/u/78129508?v=4"/>
        </td>
        <td align="center">
            <img height="120px" weight="120px" src="https://avatars.githubusercontent.com/u/67923359?v=4"/>
        </td>
        <td align="center">
            <img height="120px" weight="120px" src="https://avatars.githubusercontent.com/u/77298353?v=4"/>
        </td>
        <td align="center">
            <img height="120px" weight="120px" src="https://avatars.githubusercontent.com/u/79245575?v=4"/>
        </td>
    </tr>
        <td align="center">폴라</td>
        <td align="center">선비</td>
        <td align="center">코그</td>
        <td align="center">렉사</td>
        <td align="center">필</td>
    <tr>
    </tr>
    <tr>
        <td align="center"><code>Data Enigneer</code></td>
        <td align="center"><code>Data Scientist</code></td>
        <td align="center"><code>Back-End Engineer</code></td>
        <td align="center"><code>Front-End Engineer</code></td>
        <td align="center"><code>Data Scientist</code></td>
    </tr>
    <tr>
        <td align="center"><a href="https://github.com/cow-coding">Github</a></td>
        <td align="center"><a href="https://github.com/sunbi-s">Github</a></td>
        <td align="center"><a href="https://github.com/hawe66">Github</a></td>
        <td align="center"><a href="https://sweetdev.tistory.com">Blog</a></td>
        <td align="center"><a href="https://github.com/pilkyuchoi">Github</a></td>
    </tr>
    <tr>
        <td align="center">
          <code>데이터ETL</code> <code>배치학습</code> <code>DBA</code>
        </td>
        <td align="center">
          <code>RecVAE</code> <code>FastAPI</code> <br> <code>비동기 처리</code>
        </td>
        <td align="center">
          <code>API 코드</code>
        </td>
        <td align="center">
          <code>크롬익스텐션</code> <code>React+TS</code>
        </td>
        <td align="center">
          <code>Contents Based</code> <code>문서 임베딩</code> <br> <code>그래프 임베딩</code>
        </td>
    </tr>
</table>

## 📱 Demo

<div align="center">
  <img src="/img/demo.gif"/>
</div>

## 🛠 Service Architecture

![](/img/total_service.png)

## 📁 Dataset

- Github API를 활용한 데이터
  - Repository
  - User
- Repository 수집 베이스
  - [Awesome Series](https://github.com/sindresorhus/awesome#readme)
    - [Angular](https://github.com/PatrickJS/awesome-angular#readme)
    - [Deno](https://github.com/denolib/awesome-deno#readme)
    - [Electron](https://github.com/sindresorhus/awesome-electron#readme)
    - [Node.js](https://github.com/sindresorhus/awesome-nodejs#readme)
    - [React](https://github.com/enaqx/awesome-react#readme)
    - [Vue.js](https://github.com/vuejs/awesome-vue#readme)

## ❗️ About Service

- Github repository 개인화 추천 서비스
- 인기도, 유사도, 사용자 선호도 기반의 추천 리스트 제공
- 사용자 편의성을 위한 크롬 익스텐션 기반 서비스
  - Github.com에서 바로 확인 가능한 추천 목록 제공
  - 방문 repository 페이지에서 유사한 repository 추천 목록 제공
  - 신규 사용자를 위한 인기도 기반의 초기 서비스 제공 (Cold-Start 방지)

### 왜 개발하게 되었나요?

기존 Github에서 사용자가 원하는 repository를 찾는 방법은 크게 2가지가 있습니다. 

1. 이름 및 태그 등 repository 메타데이터를 통한 사용자의 직접 검색
2. 사용자 메타데이터를 사용한 github 자체의 Explore를 사용

위의 두 방법은 **사용자가 스스로 관심사를 명확히 알아야 한다**는 것과 **Explore탭의 새로운 아이템 갱신 빈도가 낮다는 점**이 핵심적인 문제점으로 작용합니다.  
추천 서비스는 사용자의 불편함을 최소화하여 사용자가 필요로 하는 정보를 제공하는 것이 핵심이라고 생각하여 저희가 파악한 문제를 해결하고자 Github repository 추천 서비스를 개발하게 되었습니다.

### 서비스 개발 방향

서비스에서 해결할 가장 큰 문제는 다음과 같았습니다.

- 사용자의 액션을 최소화하는 것
- 서비스 초기 사용자 및 새롭게 깃허브를 사용하는 유저에 대한 cold-start 문제
- 사용자에게 제공하는 추천 목록을 생성하는 모델 선정

대표적인 문제들을 해결하기위해 크롬 익스텐션을 활용하여 github.com 페이지 내에 추천 목록을 삽입하였고 인기도, 유사도, 사용자 선호도 기반의 모델 총 3개의 모델을 혼합하여 추천 리스트를 생성했습니다. 추천 시스템의 난제 중 하나인 cold-start 문제는 초기에 인기도 기반으로 추천목록을 제공하는 방식으로 해결하였습니다.

### 참고자료

- [발표자료](https://github.com/boostcampaitech3/final-project-level3-recsys-04/blob/main/img/presentation.pdf)

## ❓ How to use

### Front-End

- [Chrome Extension](https://github.com/boostcampaitech3/final-project-level3-recsys-04/tree/main/front-end)

### Back-End

- [Running API server](https://github.com/boostcampaitech3/final-project-level3-recsys-04/tree/main/api)

### Model

- [Model CF Server/Manual](https://github.com/boostcampaitech3/final-project-level3-recsys-04/tree/main/model_cf/Server)
- [Model CB Manual](https://github.com/boostcampaitech3/final-project-level3-recsys-04/tree/main/model_cb)

### Data Pipeline

- [Data ETL Pipeline Manual](https://github.com/boostcampaitech3/final-project-level3-recsys-04/tree/main/data-engineering/data-pipe-line)
- [Batch Train Pipeline Manual](https://github.com/boostcampaitech3/final-project-level3-recsys-04/tree/main/data-engineering/batch-dag)
