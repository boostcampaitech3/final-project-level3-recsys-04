import { Repo, RepoList, initUser, coldstart, clickedRepo } from '../utils/api'

let isLogin = false
let username=""
let starcount=0

chrome.runtime.onMessage.addListener((msg, sender, sendResponse)=>{
  // TODO
})


/*
호출 타이밍

- 익스텐션 설치 or 업데이트
- 백그라운드 페이지가 이벤트를 기다리는 중이었는데 이벤트 생김
- content script나 다른 extension이 메세지 보냄(Message Passing: `chrome.runtime.sendMessage`)
- 팝업같은 익스텐션의 다른 뷰가 runtime.getBackgroundPage한다.
*/
chrome.storage.sync.get(["isLogin, username"], (res)=> {
  isLogin = res.isLogin ?? false
  username = res.username ?? ""
  
  if (!isLogin) {
    chrome.cookies.get({
      url: "https://github.com",
      name: "logged_in",
    }, function(x){
      console.log("로그인 여부 확인하기")
      console.log(x.value)

      if (x.value == "yes"){
        isLogin = true
      } else {
        isLogin = false
      }

      // API 호출해주기
      if (isLogin){
        chrome.cookies.get({
          url: "https://github.com",
          name: "dotcom_user",
        }, function(x){
          username = x.value
          // 저장하기
          chrome.storage.sync.set({"isLogin": true, "username": username})
          
          // TODO: starcount 못받겠음
          initUser(username, starcount)
          
          // message passing: contentScript를 통해서 
        })
      }
    })
  }
})

function validateGithubView(str){
  const re: RegExp = /https:\/\/github.com\/[\w\W]+\/[\w\W]+/
  return re.test(str)
}


chrome.webNavigation.onBeforeNavigate.addListener((details)=>{
  console.log("-========")
  // github view
  if (validateGithubView(details.url)){
    // 깃헙 레포를 구경했다.
    console.log("깃헙 레포 구경함~")
    clickedRepo(username, "")
  }
})