import { Repo, RepoList, initUser, coldstart, clickedRepo } from '../utils/api'

let isLogin = false
let username=""
let starcount=0

/*
호출 타이밍

- 익스텐션 설치 or 업데이트
- 백그라운드 페이지가 이벤트를 기다리는 중이었는데 이벤트 생김
- content script나 다른 extension이 메세지 보냄(Message Passing: `chrome.runtime.sendMessage`)
- 팝업같은 익스텐션의 다른 뷰가 runtime.getBackgroundPage한다.
*/

function wait(ms){
  var start = new Date().getTime();
  var end = start;
  while(end < start + ms) {
    end = new Date().getTime();
 }
}

// 설치시 실행되는 함수
// 로그인 정보 쿠키에 저장해준다.
chrome.runtime.onInstalled.addListener(() => {
  console.log("설치되었다!")
  
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
            
            initUser(username, starcount)
            // message passing: contentScript를 통해서 보내준다.
              // contentScript에 메세지 보내주기
              chrome.tabs.query({active: true, currentWindow: true,}, (tabs) => {
                if (tabs.length > 0) {
                  console.log("첫 INstall 메세지 보냄")

                  chrome.tabs.sendMessage(tabs[0].id, {"coldstart": "true"}, (response)=>{
                    if (chrome.runtime.lastError) {
                      console.log(chrome.runtime.lastError.message)

                      console.log("메세지 전송 도중 에러 발생")

                      
                      chrome.tabs.create({url: "https://github.com"}, (tab)=>{
                        // 다 만들어 질  때까지 기다리기.
                        
                        // 선언
                        var onready = function() {
                          onready = function() {}; // Run once.
                          chrome.tabs.onUpdated.removeListener(listener);
                          // Now the tab is ready!
                            
                          chrome.tabs.query({active: true, currentWindow: true,}, (tabs) => {
                            chrome.tabs.sendMessage(tabs[0].id, {"coldstart": "true"}, ()=>{
                              if (chrome.runtime.lastError) {
                                console.log(chrome.runtime.lastError.message) // A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received
                                console.log("메세지 전송 도중 에러 발생 두번째")
                              } else {
                                console.log("콜드스타트 핸들링 위해 새 탭 만듦")
                              }
                            })
                          })
                        };
                  
                        function listener(tabId, changeInfo) {
                          if (tabId === tab.id && changeInfo.status == 'complete') {
                              onready();
                          }
                        }
                        
                        // 호출
                        chrome.tabs.onUpdated.addListener(listener);
                      })
                    }
                    else {
                      console.log(response)
                    }
                    // clickedRepo(username, "")
                  })
                }
              })
          })
        }
      })
    }
  })
})

function validateGithubView(str){
  const re: RegExp = /https:\/\/github.com\/[\w\W]+\/[\w\W]+/
  return re.test(str)
}


chrome.webNavigation.onCompleted.addListener((details)=>{
  console.log("-navigation-")
  // github view
  if (validateGithubView(details.url)){
    // 깃헙 레포를 구경했다.
    console.log("깃헙 레포 구경함~")

    // contentScript에 메세지 보내주기
    chrome.tabs.query({
        active: true,
        currentWindow: true,
      },
      (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, {"username": username}, (response)=>{
            console.log(response)
            // clickedRepo(username, "")
          })
        }
      }
    )
  }
})
