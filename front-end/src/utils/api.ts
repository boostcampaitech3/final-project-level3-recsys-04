const baseURL = 'https://127.0.0.1:3001'
export interface Repo {
  name: string
  // login: string
  // stars: number
}
export interface RepoList {
  repoList: Repo[]
}

let dR1: Repo = {
  name: "Repo Name",
  // login: "Yejin",
  // stars: 0
}
let dR2: Repo = {
  name: "레포 이름22",
  // login: "Yejin",
  // stars: 0
}
let dR3: Repo = {
  name: "레포 이름33",
  // login: "Yejin",
  // stars: 0
}
let dR4: Repo = {
  name: "레포 이름44",
  // login: "Yejin",
  // stars: 0
}
let dR5: Repo = {
  name: "레포 이름55",
  // login: "Yejin",
  // stars: 0
}
let ar: RepoList = {
  repoList: [dR1, dR2, dR3, dR4, dR5]
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