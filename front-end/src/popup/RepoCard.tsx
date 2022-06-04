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

import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: 'BlinkMacSystemFont',
      textTransform: 'none',
      fontSize: 14,
    },
    subtitle1: {
      fontFamily: 'BlinkMacSystemFont',
      textTransform: 'none',
      fontSize: 18,
      fontWeight: 2000
    }
  },
});

// WIP: Container와 Card?
const RepoCard: React.FC<{username: string
  repoId: number}> = ({ username, repoId }) => {
  // 뷰 안에서 data를 track 하기 위해서
  const [repoData, setRepoData] = useState<Repo[]|[]>([])

  // API 호출해주기
  useEffect(()=> {
    console.log("useEffect 나타남")

    inference(username, repoId)
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
        <ThemeProvider theme={theme}>
          <Card onClick={()=>{ window.open(repoToURL(repo)); }} >
            <CardContent>
              <Typography variant="subtitle1">{repo.repo_name}</Typography>
              <Typography>{"📚" + repo.category.category_L + " > " + repo.category.category_M + " > " + repo.category.category_S}</Typography>
              <Typography variant="body2">{"⭐️ " + repo.stars}</Typography>
              <Typography variant="body2">{"🔎 " + repo.description}</Typography>
            </CardContent>
          </Card>
          </ThemeProvider>
        <p>&nbsp;</p>
      </div>
        ))}
    </div>
  )
}

export default RepoCard