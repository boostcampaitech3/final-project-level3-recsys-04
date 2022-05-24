import React, {useEffect} from 'react'
import {inference} from '../utils/api'
import ReactDOM from 'react-dom'
import RepoCard from '../popup/RepoCard'

var myBody=document.createElement("h1");
myBody.innerText="마음에 들조의 추천"

// 넣을 곳
var find = document.querySelector(".d-block.Link--secondary.no-underline.f6.mb-3")
find.insertAdjacentElement('afterend', myBody)

const App: React.FC<{}> = () => {
  return (
    <div>
      <RepoCard username='jonyejin'></RepoCard>
    </div>
  )
}
ReactDOM.render(<App />, find)