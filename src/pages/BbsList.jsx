import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { Paper, Table, TableHead, TableRow, TableCell, 
         TableBody, Stack, Typography, Pagination, Divider,
         Box, Chip, Button, CircularProgress } from '@mui/material';
import SearchBar from '../components/SearchBar';
import { fetchBbsList } from '../api/bbs';
import useDebounce from '../hooks/useDebounce';

const PAGE_SIZE = 10;

const BbsList = () => {
  const nav = useNavigate();

  const [ keyword, setKeyword] = useState("");
  const debounceKeyword = useDebounce(keyword, 500);
  const [ page, setPage ] = useState(1);
  const [ rows, setRows ] = useState([]);
  const [ totalPages, setTotalPages ] = useState(1);
  const [ loading, setLoading ] = useState(true);
  const [ err, setErr ] = useState('');
  
  //검색이 되면 페이지가 초기화 됨
  useEffect(()=>{
    setPage(1);
  }, [keyword]);
  
  useEffect(()=>{ setPage(1)}, [keyword])

  useEffect(()=> {
    let cancelled = false;
    async function load(){
      try{
         setLoading(true);
         const { data } = await fetchBbsList({
            page: page -1,
            size: PAGE_SIZE,
            keyword: debounceKeyword.trim()
         });
         if(cancelled) return;

         const listData = Array.isArray(data) ? data : (data?.content ?? []);
         setRows(listData);

         const tpage = Math.max(1, data?.totalPages ?? 1);
         setTotalPages(tpage);

         //에러처리 (만약 현재 페이지가 tpage를 초과 할때 처리)
         if( page > tpage) {
            setPage(tpage);
         }

      }catch(e){
         console.error(e);
         setErr("목록을 불러오는데 실패했습니다.");
      }finally{
         if(!cancelled) setLoading(false);
      }
    }
    load();
    return ()=> { cancelled = true }
  }, [page, debounceKeyword]);

  return (
    <Stack spacing={2}>
       <Typography variant='h5'>MY BBS 목록보기</Typography>
       <SearchBar value={keyword} onChange={setKeyword} />
       { loading ? (
          <Stack alignItems='center' justifyContent='center' sx={{ py : 6 }}>
             <CircularProgress />
          </Stack>  
       ) : err ? (
          <Stack alignItems="center" sx={{ py: 4}}>
            <Typography color="error">{err}</Typography>
          </Stack>  
       ) : (
       <Paper variant='outlined'>
          <Table size='medium'>
            <TableHead>
              <TableRow>
                <TableCell align='center' width={80}>번호</TableCell>
                <TableCell align='center'>제목</TableCell>
                <TableCell align='center' width={120}>작성자</TableCell>
                <TableCell align='center' width={120}>조회수</TableCell>
                <TableCell align='center' width={180}>작성일</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            { rows.map((r) => (    
               <TableRow key={r.id} hover sx={{ cursor:'pointer'}} onClick={()=> nav(`/view/${r.id}`)}>
                  <TableCell align='center'>{r.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems:'center', gap: 1}}>
                       <Typography variant='body2' noWrap>{r.title}</Typography>
                       {(r.hit ?? 0) > 700 && (<Chip 
                                           size="small" 
                                           label="HOT" 
                                           sx={{
                                             fontSize:'0.6rem',
                                             fontWeight:'bold',
                                             backgroundColor:'error.main',
                                             color:"white"
                                           }}/>)}
                    </Box>
                  </TableCell>
                  <TableCell align='center'>{r.writer}</TableCell>  
                  <TableCell align='center'>{r.hit}</TableCell> 
                  <TableCell align='center'>
                    {new Date(r.wdate).toLocaleString('ko-KR', {
                       year: 'numeric',
                       month: 'numeric',
                       day: 'numeric'
                    })}
                  </TableCell> 
               </TableRow>
              ))  
            }

            </TableBody>
          </Table>
       </Paper>
         )}
       <Divider />
       <Stack direction='row' justifyContent='flex-end' alignItems='center'>
          <Button component={Link} to="/write" variant="contained">글쓰기</Button>
       </Stack>
       <Stack direction='row' justifyContent='center'>
          <Pagination 
             page={page}
             count={totalPages}
             onChange={(_, p) => setPage(p)}
             color="primary"
             size="medium"
             showFirstButton
             showLastButton
          /> 
       </Stack>

    </Stack>  
  )
}

export default BbsList