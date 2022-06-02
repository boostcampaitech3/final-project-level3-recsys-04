import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import { Repo, RepoList, inference, coldstart, repoToURL, Infos } from '../utils/api'

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from '@mui/material'

// WIP: Container와 Card?
const RepoCard: React.FC<{
  username: string
}> = ({ username }) => {
  // 뷰 안에서 data를 track 하기 위해서
  const [repoData, setRepoData] = useState<Repo[]|[]>([])

  // API 호출해주기
  useEffect(()=> {
    console.log("useEffect 나타남")
    inference(username, 12345)
    .then((data)=>{
      return data.candidate_repos
    })
    .then((data)=> {
      console.log("========")
      console.log(data)
      setRepoData(data)
    })
    .catch(err => console.log(err))
  }, []) // 끝에 배열 -> @param deps — If present, effect will only activate if the values in the list change.

  if (!repoData){
    return <div onClick={()=>{
      window.open("http://github.com");
    }}>no data...</div>
  }

  return(
    <div> {repoData.map((repo, index) => (
        <div>
        <Card variant="outlined" onClick={()=>{ window.open(repoToURL(repo)); }} >
          <CardContent>
            <Typography variant="h6">{repo.repo_name}</Typography>
            <Typography variant="body2">{"🦚" + repo.category.category_L + ">" + repo.category.category_M + ">" + repo.category.category_S}</Typography>
            <Typography variant="body2">{"⭐️ " + repo.stars}</Typography>
          </CardContent>
        </Card>
        <p>&nbsp;</p>
      </div>
        ))}
    </div>
  )
}

export default RepoCard