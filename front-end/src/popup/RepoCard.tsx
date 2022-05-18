import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from '@mui/material'
import { Repo } from '../utils/api'

// WIP: Container와 Card?
// const RepoCardContainer: React.FC<{
//   repo: Repo
// }> = ({ repo }) => {
//   return (
//     <Box mx={'4px'} my={'16px'}>
//     <Card>
//       <CardContent>{children}</CardContent>
//       <CardActions>
//         {onDelete && (
//           <Button color="secondary" onClick={onDelete}>
//             <Typography className="weatherCard-body">Delete</Typography>
//           </Button>
//         )}
//       </CardActions>
//     </Card>
//   </Box>
//   )
// }