/**
 * SearchBar - Search input for filtering conversations
 *
 * Props:
 * - searchTerm: current search term string
 * - onSearchChange: function to handle search term changes
 */

import React, { useCallback, useMemo, memo } from 'react'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

const SearchBar = memo(({ searchTerm, onSearchChange }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Memoized computed values
  const placeholder = useMemo(() => 
    isMobile ? "Tìm kiếm..." : "Tìm theo tên, SĐT hoặc nội dung...",
    [isMobile]
  )

  const searchIconSize = useMemo(() => ({
    fontSize: { xs: 16, sm: 18, md: 20 }
  }), [])

  const clearIconSize = useMemo(() => ({
    fontSize: { xs: 14, sm: 16, md: 18 }
  }), [])

  // Memoized styles
  const textFieldSize = useMemo(() => 
    isMobile ? 'small' : 'medium',
    [isMobile]
  )

  const clearButtonSize = useMemo(() => 
    isSmallMobile ? 'small' : 'medium',
    [isSmallMobile]
  )

  const clearButtonStyles = useMemo(() => ({
    p: { xs: 0.5, sm: 0.75, md: 1 },
    color: 'action.active',
    '&:hover': {
      bgcolor: 'rgba(0,0,0,0.04)'
    }
  }), [])

  const inputStyles = useMemo(() => ({
    bgcolor: 'background.paper',
    borderRadius: { xs: 1.5, sm: 2, md: 2.5 },
    fontSize: { xs: '0.875rem', sm: '0.875rem', md: '1rem' },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'success.light'
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'primary.main'
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'primary.main',
      borderWidth: 2
    }
  }), [])

  const inputProps = useMemo(() => ({
    'aria-label': 'Tìm kiếm hội thoại',
    style: { fontSize: 'inherit' }
  }), [])

  // Optimized event handlers
  const handleChange = useCallback((e) => {
    onSearchChange(e.target.value)
  }, [onSearchChange])

  const handleClear = useCallback(() => {
    onSearchChange('')
  }, [onSearchChange])

  // Memoized start adornment
  const startAdornment = useMemo(() => (
    <InputAdornment position="start">
      <SearchIcon color="action" sx={searchIconSize} />
    </InputAdornment>
  ), [searchIconSize])

  // Memoized end adornment
  const endAdornment = useMemo(() => 
    searchTerm ? (
      <InputAdornment position="end">
        <IconButton
          size={clearButtonSize}
          onClick={handleClear}
          sx={clearButtonStyles}
        >
          <ClearIcon sx={clearIconSize} />
        </IconButton>
      </InputAdornment>
    ) : null,
    [searchTerm, clearButtonSize, handleClear, clearButtonStyles, clearIconSize]
  )

  return (
    <TextField
      fullWidth
      size={textFieldSize}
      value={searchTerm}
      onChange={handleChange}
      placeholder={placeholder}
      InputProps={{
        startAdornment,
        endAdornment,
        sx: inputStyles
      }}
      inputProps={inputProps}
    />
  )
})

SearchBar.displayName = 'SearchBar'

export default SearchBar