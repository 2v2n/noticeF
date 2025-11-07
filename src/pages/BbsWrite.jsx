import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Paper, Stack, Typography, Button, Alert, TextField } from '@mui/material'
import WysiwygEditor from '../components/WysiwygEditor'
import { createBbs } from '../api/bbs'

const BbsWrite = () => {
  const nav = useNavigate();

  const [title, setTitle] = useState('');
  const [writer, setWriter] = useState('');
  const [pass, setPass] = useState('');
  const [content, setContent] = useState('');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setErr('');
    if(!title.trim()) return setErr('제목은 필수입니다.');
    if(!writer.trim()) return setErr('작성자는 필수입니다.');
    if(!pass.trim()) return setErr('비밀번호는 필수입니다.');
    if(!content.trim() || content === '<p><br></p>') return setErr('내용은 필수입니다.');

    try{
      setSaving(true);
      const payload = {
        title, 
        writer,
        pass,
        content
      };
      
      const { data } = await createBbs(payload);
   
      if(!data?.id){
         throw new Error("등록중 에러 발생");
      }
    
      nav(`/view/${data.id}`);

    }catch(e){
      setErr('등록 실패');
    }finally{
      setSaving(false);
    }
  }

  return (
    <Stack spacing={2}>
       <Typography variant='h5'>글쓰기</Typography>
       <Paper variant='outlined' 
              component="form"
              onSubmit={handleSubmit} 
              sx={{ p: 4 }}>
          <Stack spacing={2}>
            <TextField 
               label="제목" 
               value={title}  
               onChange={(e)=>setTitle(e.target.value)}
               fullWidth />   
            <Stack direction={{ xs: 'column', sm: 'row'}} spacing={2}>
              <TextField 
                 label="작성자" 
                 value={writer}
                 onChange={(e)=>setWriter(e.target.value)}
                 sx={{ flex: 1}} />
              <TextField 
                 label="비밀번호" 
                 type="password"
                 value={pass}
                 onChange={(e)=>setPass(e.target.value)}
                 sx={{ flex: 1}} />
            </Stack>
          </Stack> 

          {/* Lexical 영역 */}
          <Stack spacing={2} sx={{ mt: 2 }}>
            <WysiwygEditor value={content} onChange={setContent} />
          </Stack>         
          {
            err && <Alert severity='error' sx={{ mt: 2}}>{err}</Alert>
          }
          <Stack 
             direction="row" 
             justifyContent='flex-end'
             spacing={2}
             sx={{ mt: 2}}
           >
             <Button 
                variant="outlined"   
                onClick={() => nav("/")}
                disabled={saving}>
                  취소
             </Button>
             <Button 
                type="submit"
                variant='outlined'
                disabled={saving}>
            { saving ? '등록 중' : '등록'}
            </Button>
          </Stack>
       </Paper> 
    </Stack>  
  )
}

export default BbsWrite