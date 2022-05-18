const baseURL = ''
export interface Repo {
  name: string
  login: string
  stars: number
}

let dummyRepo: [Repo] = [
  {
    name: "Repo Name",
    login: "Yejin",
    stars: 0
  }
]

export async function inference(username: string) : Promise<any> {
  const res = await fetch(`${baseURL}/inference/starred/repo/${username}`)
	// 404 처리하기
	if (!res.ok) {
    return dummyRepo
		// throw new Error('Repo not found')
	}
	const data = await res.json()
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
  }
}