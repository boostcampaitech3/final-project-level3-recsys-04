import React, {useEffect} from 'react'
import {inference} from '../utils/api'
import ReactDOM from 'react-dom'
import RepoCard from '../popup/RepoCard'

var find = null
var username = null

// 깃헙 레포이면 background에서 메세지를 받는다. 
// 밑에 코드와 합치지 못하는 이유는 합치면 정상 작동하지 않기 때문.
// repoid를 돌려줘서 background에서 view repo API 호출 할 수 있도록 해준다.

// coldstart이면 메세지 받는다.
// WIP: 메세지 안옴... 경고 뜬다.
chrome.runtime.onMessage.addListener((msg, sender, sendResponse)=>{
  console.log("메세지 받음!")
  console.log(msg)
  if ("coldstart" in msg){
    // Render Coldstart view in main github page
    var coldStartView = document.createElement("div");
    var coldStartPlace = document.querySelector(".d-block.Link--secondary.no-underline.f6.mb-3")
    coldStartPlace.insertAdjacentElement('afterend', coldStartView)

    const App: React.FC<{}> = () => {
      return (
        <div>
          <RepoCard username='jonyejin'></RepoCard>
        </div>
      )
    }
    ReactDOM.render(<App />, coldStartView)
    sendResponse({"":""}) // null로 했더니 문제 생겨서 바꿈.
    return true
  }
  if ("username" in msg){ // 추천을 해줘야 함
    var repoidtag = document.querySelector('meta[name="octolytics-dimension-repository_id"]')  as HTMLMetaElement
    sendResponse({"repoid": repoidtag.content})
    return true
  }
})

// 깃헙 레포이다 -> 추천해주기
// 현재는 tag가 있으면 깃헙 레포인 것 처럼 동작한다.
find = document.querySelector(".BorderGrid.BorderGrid--spacious") // 클래스들, 컨텐츠들이 묶여있는 가장 상위 클래스임
if (find != null){
  // chrome.storage.sync.get(["username"], (res)=> {
  //   username = res.username ?? null
    // if (username != null){
      var myBody = document.createElement("div");
      find.insertBefore(myBody, null)
      var Recommendation: React.FC<{}> = () => {
        return (
          <div>
            <h2>마음에 들조의 추천</h2>
            <div>
              <RepoCard username={username}></RepoCard>
            </div>
          </div>
        )
      }
      ReactDOM.render(<Recommendation />, myBody)
    // }
  // })
}


var unstar = document.querySelector(".rounded-left-2.border-right-0.btn-sm.btn.BtnGroup-item")
if (unstar!= null){
  unstar.addEventListener('click', function(){
    console.log("스타 해제!")
  })
}
var details = document.querySelector(".details-reset.details-overlay.BtnGroup-parent.js-user-list-menu.d-inline-block.position-relative")
if (details != null){
  details.addEventListener('click', function(){
    console.log("디테일 클릭!")
  })
}

// 주의! star랑 unstar랑 코드 다름.
var star = document.querySelector(".js-toggler-target.rounded-left-2.btn-sm.btn.BtnGroup-item")
if (star!=null){
  star.addEventListener('click', function(){
    console.log("스타 클릭!")
  })  // 이거 코드는 정상 동작 하고 있음.
}

var details = document.querySelector(".details-reset.details-overlay.BtnGroup-parent.js-user-list-menu.d-inline-block.position-relative")
if (details != null){
  details.addEventListener('click', function(){
    console.log("디테일 클릭!")
  }) // 얘 역시 코드는 정상 동작 하고 있음.
}
