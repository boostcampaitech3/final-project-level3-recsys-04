import React, {useEffect} from 'react'
import {inference} from '../utils/api'
import ReactDOM from 'react-dom'
import RepoCard from '../popup/RepoCard'


let text = "aaaa"
// TODO: 
chrome.runtime.sendMessage("pkopcldfjjedembijjkdkpfifnfmkljf", text)

// 넣을 곳
var find = document.querySelector(".d-block.Link--secondary.no-underline.f6.mb-3") // 클래스들
if (find != null){
  var myBody=document.createElement("h1");
  myBody.innerText="마음에 들조의 추천"
  find.insertAdjacentElement('afterend', myBody)
}

var unstar = document.querySelector(".rounded-left-2.border-right-0.btn-sm.btn.BtnGroup-item")
unstar.addEventListener('click', function(){
  console.log("스타 해제!")
})
var details = document.querySelector(".details-reset.details-overlay.BtnGroup-parent.js-user-list-menu.d-inline-block.position-relative")
details.addEventListener('click', function(){
  console.log("디테일 클릭!")
})

// 주의! star랑 unstar랑 코드 다름.
var star = document.querySelector(".js-toggler-target.rounded-left-2.btn-sm.btn.BtnGroup-item")
star.addEventListener('click', function(){
  console.log("스타 클릭!")
})  // 이거 코드는 정상 동작 하고 있음.

var details = document.querySelector(".details-reset.details-overlay.BtnGroup-parent.js-user-list-menu.d-inline-block.position-relative")
details.addEventListener('click', function(){
  console.log("디테일 클릭!")
}) // 얘 역시 코드는 정상 동작 하고 있음.



const App: React.FC<{}> = () => {
  return (
    <div>
      <RepoCard username='jonyejin'></RepoCard>
    </div>
  )
}
ReactDOM.render(<App />, find)