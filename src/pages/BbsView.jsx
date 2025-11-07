import React, { useEffect, useState } from 'react'
import { 
  Paper, Stack, Typography, CircularProgress,
  Divider, Box, Button } from '@mui/material'
import { useParams, useNavigate, Link } from 'react-router-dom'  
import { getBbs } from '../api/bbs'

const BbsView = () => {
  const { id } = useParams();
  const nav = useNavigate();

  const [item, setItem] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const [ err, setErr ] = useState('');
  
  useEffect(()=>{
    let cancelled = false;
    const load = async () => {
      try{
        setLoading(true)
        const { data } = await getBbs(id);
        if(cancelled) return;
        setItem(data);
    }catch(e){
        console.error(e);
        const msg = e?.response?.data?.message || '게시글이 없거나 오류입니다.'
        setErr(msg);
    }finally{
      if(!cancelled) setLoading(false);
    }
  }
    load();
    return ()=>{ cancelled = true } 
  },[id]);

  if(loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py : 8}}>
        <CircularProgress />
      </Stack>
    )
  }

  if(err) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py : 8}}>
         <Typography color='error'>{err}</Typography>
         <Button variant='contained' onClick={()=>nav(-1)} sx={{ mt: 2}}>
            뒤로가기
         </Button>
      </Stack>
    )
  }

  if(!item) return null;

  return (
    <Stack spacing={2}>
       <Paper variant='outlined' sx={{ p: 2}}>
         <Typography variant='h5'>{item.title}</Typography>
         <Typography variant='body2' color="text.secondary" sx={{mt: .5}}>
             #{item.id} • {item.writer} • 조회 {item.hit} • {new Date(item.wdate).toLocaleString('ko-KR')} 
         </Typography>        
         <Divider sx={{ my: 2}} />
         <Box sx={{ '& img' : { maxWidth: '100%'}}}>
            {item.content}
         </Box>
       </Paper>
       <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end'}}>
          <Button component={Link} to="/" variant='outlined'>목록</Button>
          <Button component={Link} to="/" variant='outlined'>수정</Button>
          <Button component={Link} to="/" color="error" variant='outlined'>삭제</Button>
       </Box>
    </Stack>  
  )
}

export default BbsView