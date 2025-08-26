import { useState } from 'react'
import Box from '@mui/material/Box'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Drawer from '@mui/material/Drawer'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CategoryIcon from '@mui/icons-material/Category'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'

export default function FilterMobile({ categories = [], category, setCategory, query, setQuery }) {
  const [value, setValue] = useState(0)
  const [open, setOpen] = useState(null) // 'categories' | 'search' | null

  const handleOpenCategories = () => setOpen('categories')
  const handleOpenSearch = () => setOpen('search')
  const handleClose = () => setOpen(null)

  return (
    <>
      <Drawer
        anchor="bottom"
        open={open !== null}
        onClose={handleClose}
        slotProps={{ sx: { borderTopLeftRadius: 8, borderTopRightRadius: 8, p: 2 } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle1">
            {open === 'categories' ? 'Categories' : 'Search'}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {open === 'categories' && (
          <>
            <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
              <Chip
                label="All"
                clickable
                color={!category ? 'primary' : 'default'}
                onClick={() => { setCategory(''); handleClose() }}
              />
              {categories.map((c) => (
                <Chip
                  key={c.id}
                  label={c.name}
                  clickable
                  color={String(c.id) === String(category) ? 'primary' : 'default'}
                  onClick={() => { setCategory(String(c.id)); handleClose() }}
                />
              ))}
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button fullWidth variant="outlined" onClick={() => { setCategory(''); handleClose() }}>Clear</Button>
              <Button fullWidth variant="contained" onClick={handleClose}>Done</Button>
            </Box>
          </>
        )}

        {open === 'search' && (
          <Modal
            open={open === 'search'}
            onClose={handleClose}
            aria-labelledby="mobile-search-modal"
            aria-describedby="mobile-search-input"
          >
            <Box sx={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', outline: 0 }}>
              <Box sx={{
                width: '92%',
                maxWidth: 540,
                bgcolor: 'rgba(255,255,255,0.75)',
                p: 3,
                borderRadius: 2,
                boxShadow: 24,
                backdropFilter: 'blur(6px)'
              }}>
                <TextField
                  fullWidth
                  placeholder="Type to search posts ..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  variant="standard"
                  sx={{ textAlign: 'center', fontSize: '1.05rem' }}
                />
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button fullWidth variant="outlined" onClick={() => { setQuery(''); handleClose() }}>All Posts</Button>
                  <Button fullWidth variant="contained" onClick={handleClose}>Done</Button>
                </Box>
              </Box>
            </Box>
          </Modal>
        )}
      </Drawer>

      <Box sx={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: (theme) => theme.zIndex.drawer + 1, display: { xs: 'block', md: 'none' } }}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
        >
          <BottomNavigationAction label="Categories" icon={<CategoryIcon />} onClick={handleOpenCategories} />
          <Divider orientation="vertical" flexItem />
          <BottomNavigationAction label="Search" icon={<SearchIcon />} onClick={handleOpenSearch} />
        </BottomNavigation>
      </Box>
    </>
  )
}

