import React, {useEffect} from 'react'
import {inference} from '../utils/api'
import ReactDOM from 'react-dom'
import RepoCard from '../popup/RepoCard'

var myBody=document.createElement("h1");
myBody.innerText="마음에 들조의 추천"

const a = () => {
  return ( <div>
    <RepoCard username='jonyejin'></RepoCard>
  </div>)
}

// 넣을 곳
var find = document.querySelector(".d-block.Link--secondary.no-underline.f6.mb-3")
find.insertAdjacentElement('afterend', myBody)
// TODO: find.insertAdjacentElement('afterend', a())

const App: React.FC<{}> = () => {
  return (
    <div>
      <RepoCard username='jonyejin'></RepoCard>
    </div>
  )
}
const element = React.createElement("h1", { children: "Hello, World" })
ReactDOM.render(<App />, find)