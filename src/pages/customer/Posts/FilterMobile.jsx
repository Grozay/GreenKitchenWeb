import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import theme from '~/theme'

export default function FilterMobile({ categories = [], category, setCategory }) {
  const selectedCategory = categories.find(c => String(c.id) === String(category))
  return (
    <Box sx={{
      position: 'sticky',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      boxShadow: 0,
      borderRadius: 0,
      display: { xs: 'block', md: 'none' }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, textAlign: 'left', color: 'text.primary', mr: 2 }}>
          Choose Topic:
        </Typography>
        {selectedCategory && (
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: theme.palette.primary.secondary, borderRadius: 2, px: 2, py: 0.5, fontWeight: 700 }}>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 700, mr: 1 }}>{selectedCategory.name}</Typography>
            <IconButton size="small" onClick={() => setCategory('')} sx={{ p: 0.5 }}>
              <CloseIcon fontSize="small" sx={{ color: 'white' }} />
            </IconButton>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1
        }}>
        {categories.map((c) => (
          <Button
            key={c.id}
            variant="outlined"
            onClick={() => setCategory(String(c.id))}
            sx={{
              height: 32,
              width: 140,
              fontWeight: String(c.id) === String(category) ? 700 : 400,
              color: String(c.id) === String(category) ? 'primary.main' : 'text.primary',
              borderRadius: 1,
              px: 2,
              py: 1,
              boxShadow: 0
            }}
          >
            {c.name}
          </Button>
        ))}
      </Box>
    </Box>
  )
}

