const baseURL = 'https://34.64.94.140:3001'
export interface Repo {
  repo_name: string,
  login: string
  stars: number,
  category: {
    category_L: string,
    category_M: string,
    category_S: string
  }
  // description: string,
  // url: string  
}
export interface RepoList {
  repoList: Repo[]
}

export interface Infos {
  username: string
  repoId: number
}

// 최초 repository init시
export async function initUser(username: string) : Promise<any> {
  console.log(`${baseURL}/init/${username}`)
  const res = await fetch(`${baseURL}/init/${username}`)
  // 404 처리하기
  if (!res.ok) {
    // return ar
    throw new Error('Inituser 실패')
  }
  const data = await res.json()
  return null // JSON 데이터
}

// coldstart(설치시)
export async function coldstart() : Promise<any> {
  console.log(`${baseURL}/coldstart`)
  const res = await fetch(`${baseURL}/coldstart`)
	// 404 처리하기
	if (!res.ok) {
    // return ar
		throw new Error('Repo not found')
	}
	const data = await res.json()
  console.log("data받음")
	return data // JSON 데이터
  }

// 레포지토리를 구경할 때
export async function clickedRepo(username: string, repoId:number) : Promise<any> {
  console.log(`${baseURL}/clicked/repo/${username}/${repoId}`)
  const res = await fetch(`${baseURL}/clicked/repo/${username}/${repoId}`)
	// 404 처리하기
	if (!res.ok) {
    // return ar
		throw new Error('Repo not found')
	}
  const data = await res.json()
	return null // JSON 데이터
}

// github repo에 star을 한다
export async function starClick(username: string, repoId:string) : Promise<any> {
  console.log(`${baseURL}/update/starred/repo/${username}/${repoId}`)

  const res = await fetch(`${baseURL}/update/starred/repo/${username}/${repoId}`)
	// 404 처리하기
	if (!res.ok) {
    // return ar
		throw new Error('Repo not found')
	}
  const data = await res.json()
	return null // JSON 데이터
}

// star 목록의 변동을 확인
export async function checkStarList(username: string, starcount:number) : Promise<any> {
}

// 변동이 있다면 star목록을 업데이트
export async function fetchStarList(username: string, starcount:number) : Promise<any> {
}

// 추천 결과 받아오기
export async function inference(username: string, repoId: number) : Promise<any> {
  console.log(`${baseURL}/inference/starred/repo/${username}/${repoId}`)
  const res = await fetch(`${baseURL}/inference/starred/repo/${username}/${repoId}`)
	// 404 처리하기
	if (!res.ok) {
    // return ar
		throw new Error('Repo not found')
	}
	const data: Repo[] = await res.json()
  console.log("data받음")
	return data // JSON 데이터
}

export function repoToURL(repo: Repo){
  return "https://github.com/" + repo.login + "/" + repo.repo_name 
}