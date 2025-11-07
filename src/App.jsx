import { useState } from 'react'
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import { AppBar, 
         Toolbar, 
         Typography, 
         Container, 
         Box, 
         Button, 
         CssBaseline,
         ThemeProvider,
         createTheme } from '@mui/material'

import BbsList from './pages/BbsList';
import BbsView from './pages/BbsView';
import BbsWrite from './pages/BbsWrite';

const theme = createTheme({
    typography : {
       fontFamily: "NotoSans KR, Roboto, sans-serif"
    }
});

function App() {
   const nav = useNavigate();

  return (
     <ThemeProvider theme={theme}>
       <CssBaseline />
       <AppBar position='sticky'>
         
         <Container>
            <Toolbar disableGutters>
               <Typography 
                   variant='h5' 
                   sx={{ flexGrow: 1, cursor: 'pointer'}}
                   onClick={()=>nav("/")}    
               >My BBS</Typography>
               <Box sx={{ display:'flex', gap: 1}}>
                  <Button color="inherit" component={Link} to="/">목록</Button>
                  <Button color="inherit" component={Link} to="/write">글쓰기</Button>
               </Box> 
            </Toolbar>
         </Container>
       </AppBar>
       <Container sx={{ py: 4}} maxWidth="lg">
          <Routes>
            <Route path="/" element={<BbsList />} />
            <Route path="/view/:id" element={<BbsView />} />
            <Route path="/write" element={<BbsWrite />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
       </Container>
     </ThemeProvider>
  )
}

export default App
