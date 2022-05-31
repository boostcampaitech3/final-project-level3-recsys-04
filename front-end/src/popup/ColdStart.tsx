import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import { Repo, RepoList, inference, coldstart } from '../utils/api'

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from '@mui/material'

const ColdStartCards: React.FC<{}> = ({}) => {
  // 뷰 안에서 data를 track 하기 위해서
  const [repoData, setRepoData] = useState<Repo[]|null>(null)
  
  // API 호출해주기
  useEffect(()=> {
    coldstart()
      .then((data)=> {
        console.log(data)
        setRepoData(data)
      })
      .catch(err => console.log(err))
  }, []) // 끝에 배열 -> @param deps — If present, effect will only activate if the values in the list change.

  if (!repoData){
    return <div onClick={()=>{
    }}>no cold start data received...</div>
  }

  return(
    <div> {repoData.map((repo, index) => (
        <Card onClick={()=>{
          window.open(repo.url);
        }} >
        <CardContent>
          <Typography variant="h5">{repo.name}</Typography>
          <Typography variant="h5">{repo.description}</Typography>
          <Typography variant="h5">{repo.languages}</Typography>
          <Typography variant="h5">{repo.stars}</Typography>
        </CardContent>
        </Card>
        ))}
    </div>
  )
}
export default ColdStartCards