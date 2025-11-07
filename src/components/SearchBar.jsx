import React from 'react'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

const SearchBar = ({ value, onChange, placeholder = '제목/내용/작성자 검색' }) => {
  return (
    <TextField 
       fullWidth 
       size="small"
       value={value}
       onChange={(e)=> onChange(e.target.value)}
       placeholder={placeholder}
       InputProps={{
          startAdornment: (
            <InputAdornment position="start">
                <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position='end'>
              <IconButton onClick={()=> onChange('')} 
                          edge="end"
                          size="small">x</IconButton>
            </InputAdornment>
          ) : null
       }}
    />
  )
}

export default SearchBar