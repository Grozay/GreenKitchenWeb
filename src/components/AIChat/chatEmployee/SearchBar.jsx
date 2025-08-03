/**
 * SearchBar - Search input for filtering conversations
 *
 * Props:
 * - searchTerm: current search term string
 * - onSearchChange: function to handle search term changes
 */

import React from 'react'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

export default function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <TextField
      fullWidth
      size="small"
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder="Tìm theo tên, SĐT hoặc nội dung..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
        endAdornment: searchTerm && (
          <InputAdornment position="end">
            <ClearIcon
              sx={{ cursor: 'pointer', color: 'action.active' }}
              onClick={() => onSearchChange('')}
              fontSize="small"
            />
          </InputAdornment>
        ),
        sx: {
          bgcolor: 'white',
          borderRadius: 2,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#c8e6c9'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main'
          }
        }
      }}
      inputProps={{
        'aria-label': 'Tìm kiếm hội thoại'
      }}
    />
  )
}