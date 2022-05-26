import { Repo, RepoList, initUser, coldstart } from '../utils/api'

let isLogin = false
let username=""
let starcount=0

// install시 호출된다.
// chrome.runtime.onInstalled.addListener(() => {
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
      // TODO: starcount 못받겠음
      initUser(username, starcount)
    })
  }
})
  