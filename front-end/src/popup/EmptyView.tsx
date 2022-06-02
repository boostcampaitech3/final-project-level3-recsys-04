import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import { Repo, RepoList, inference, coldstart, repoToURL, initUser , clickedRepo} from '../utils/api'

const EmptyView: React.FC<{}> = ({}) => {
  // API 호출해주기
  useEffect(()=> {
    console.log("useEffect 나타남33")
    clickedRepo("yejin", 12345)
      .then((data)=> {
        console.log("와ㅠㅠㅠ")
      })
      .catch(err => console.log(err))
  }, []) // 끝에 배열 -> @param deps — If present, effect will only activate if the values in the list change.

  return(
    <div></div>
  )
}
export default EmptyView