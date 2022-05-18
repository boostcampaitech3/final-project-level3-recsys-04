import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import { Repo, inference } from '../utils/api'

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
  const [repoData, setRepoData] = useState<Repo|null>(null)
  
  // API 호출해주기
  useEffect(()=> {
    inference(username)
      .then((data)=> {
        setRepoData(data)
      })
      .catch(err => console.log(err))
  }, [username])

  if (!repoData){
    return <div>no data...</div>
  }

  return(
  <Card>
    <CardContent>
      <Typography variant="h5">{repoData.login}</Typography>
    </CardContent>
  </Card>
  )
}

export default RepoCard