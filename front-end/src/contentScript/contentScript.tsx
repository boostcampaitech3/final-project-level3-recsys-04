import React, {useEffect} from 'react'
import {inference} from '../utils/api'
import ReactDOM from 'react-dom'
import RepoCard from '../popup/RepoCard'

var find = null

chrome.runtime.onMessage.addListener((msg, sender, sendResponse)=>{
  console.log("메세지 받음!")
  console.log(msg)
  sendResponse({"repoid": ""})
  return true
})

// 깃헙 레포마다 넣기
// 깃헙 레포이다 -> 추천해주기, TODO: Language로 끝나는 경우 보이지 않음
find = document.querySelector(".list-style-none.d-flex.flex-wrap.mb-n2") // 클래스들
if (find != null){
  var myBody=document.createElement("h1");
  myBody.innerText="마음에 들조의 추천"
  find.insertAdjacentElement('beforebegin', myBody)
  const App: React.FC<{}> = () => {
    return (
      <div>
        <RepoCard username='jonyejin'></RepoCard>
      </div>
    )
  }
  ReactDOM.render(<App />, find)
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