import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import './popup.css'
import { Repo, inference } from '../utils/api'
import RepoCard from './RepoCard'

const App: React.FC<{}> = () => {
  
  return (
    <div>
      <RepoCard username='jonyejin'></RepoCard>
    </div>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)
