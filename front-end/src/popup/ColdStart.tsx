import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import { Repo, RepoList, inference, coldstart, repoToURL } from '../utils/api'

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
  Pagination,
  PaginationItem
} from '@mui/material'

const ColdStartCards: React.FC<{}> = ({}) => {
  // 뷰 안에서 data를 track 하기 위해서
  const [category_m1, set_category_m1] = useState<Repo[]|null>(null)
  const [category_m2, set_category_m2] = useState<Repo[]|null>(null)
  const [category_m3, set_category_m3] = useState<Repo[]|null>(null)
  const [category_m4, set_category_m4] = useState<Repo[]|null>(null)
  const [category_m5, set_category_m5] = useState<Repo[]|null>(null)
  const [page_num, set_page_num] = useState<number|0>(0)

  // API 호출해주기
  useEffect(()=> {
    console.log("useEffect 나타남22")
    coldstart()
      .then((data)=> {
        console.log(data)
        set_category_m1(data.category_m1)
        set_category_m2(data.category_m2)
        set_category_m3(data.category_m3)
        set_category_m4(data.category_m4)
        set_category_m5(data.category_m5)
      })
      .catch(err => console.log(err))
  }, []) // 끝에 배열 -> @param deps — If present, effect will only activate if the values in the list change.

  if (!category_m1){
    return <div onClick={()=>{
    }}>no cold start data received...</div>
  }

  return(
    <div> 
      <h1> ColdStart! </h1>
    {
      category_m1.map((repo, index) => (
        <Card onClick={()=>{
          window.open(repoToURL(repo));
        }} >
        <CardContent>
          <Typography variant="subtitle1">{repo.repo_name}</Typography>
          <Typography variant="body2">{"🦚" + repo.category.category_L + ">" + repo.category.category_M + ">" + repo.category.category_S}</Typography>
          <Typography variant="body2">{"⭐️ " + repo.stars}</Typography>
        </CardContent>
        </Card>
      ))
    }
    <Pagination count={6} page={page_num}/>
    </div>
  )
}
export default ColdStartCards