const baseURL = 'https://127.0.0.1:3001'
export interface Repo {
  name: string,
  // login: string
  stars: number,
  languages: string,
  description: string,
  url: string
}
export interface RepoList {
  repoList: Repo[]
}

// 최초 repository init시
export async function initUser(username: string, starcount: number) : Promise<any> {
  fetch(`${baseURL}/init/${username}/${starcount}`)
  .then(res => {
    //fetch를 통해 받아온 res객체 안에
    //ok 프로퍼티가 있음
      if (!res.ok) {
        throw Error("could not fetch the data that resource");
      }
      return res.json();
    })
    .catch(err => {
      console.log(err)
    //에러시 Loading메세지 사라지고
    //에러메세지만 보이도록 설정
    });
}
// coldstart(설치시)
export async function coldstart() : Promise<any> {
  fetch(`${baseURL}/coldstart`)
  .then(res => {
    //fetch를 통해 받아온 res객체 안에
    //ok 프로퍼티가 있음
      if (!res.ok) {
        throw Error("could not fetch the data that resource");
      }
      return res.json();
    })
    .catch(err => {
      console.log(err)
    //에러시 Loading메세지 사라지고
    //에러메세지만 보이도록 설정
    });
}

// 레포지토리를 구경할 때
export async function clickedRepo(username: string, repoId:string) : Promise<any> {
  fetch(`${baseURL}/clicked/repo`, makeBody({'username': username, 'repoId': repoId}))
  .then(res => {
    //fetch를 통해 받아온 res객체 안에
    //ok 프로퍼티가 있음
      if (!res.ok) {
        throw Error("could not fetch the data that resource");
      }
      return res.json();
    })
    .catch(err => {
      console.log(err)
    //에러시 Loading메세지 사라지고
    //에러메세지만 보이도록 설정
    });
}

// github repo에 star을 한다
export async function star(username: string, repoId:string) : Promise<any> {
  fetch(`${baseURL}/update/starred/repo/${username}/${repoId}`)
  .then(res => {
    //fetch를 통해 받아온 res객체 안에
    //ok 프로퍼티가 있음
      if (!res.ok) {
        throw Error("could not fetch the data that resource");
      }
      return res.json();
    })
    .catch(err => {
      console.log(err)
    //에러시 Loading메세지 사라지고
    //에러메세지만 보이도록 설정
    });
}

// star 목록의 변동을 확인
export async function checkStarList(username: string, starcount:number) : Promise<any> {
}

// 변동이 있다면 star목록을 업데이트
export async function fetchStarList(username: string, starcount:number) : Promise<any> {
}

// 추천 결과 받아오기
export async function inference(username: string) : Promise<any> {
  console.log(`${baseURL}/inference/starred/repo/${username}`)
  const res = await fetch(`${baseURL}/inference/starred/repo/${username}`)
	// 404 처리하기
	if (!res.ok) {
    // return ar
		throw new Error('Repo not found')
	}
	const data: Repo[] = await res.json()
  console.log("data받음")
	return data // JSON 데이터
}


function makeBody(body={}) {
  return {
    method: 'POST', // *GET, POST, PUT, DELETE 등
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(body), // body의 데이터 유형은 반드시 "Content-Type" 헤더와 일치해야 함
  } as RequestInit
}