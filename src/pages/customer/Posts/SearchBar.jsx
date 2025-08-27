import Box from '@mui/material/Box'
import theme from '~/theme'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'
// no navigate needed here

export default function SearchBar({ query, setQuery, isSearching }) {

  const handleClear = () => setQuery('')

  return (
    <Box>
      <Typography
        variant="h1"
        align="center"
        sx={{
          fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
          fontWeight: 300,
          letterSpacing: '0.06em',
          mb: 1,
          color: theme.palette.text.primary
        }}
      >
        Green <span style={{ fontWeight: 800, color: theme.palette.primary.secondary }}>ARTICLES</span>
      </Typography>
      <Box sx={{ width: '5rem', height: '0.36rem', bgcolor: theme.palette.primary.secondary, mx: 'auto', mb: 3 }} />
      <Typography variant="body1" align="center" sx={{ maxWidth: '48rem', mx: 'auto', mb: 4, fontSize: { xs: '0.95rem', md: '1.05rem' }, color: theme.palette.text.textSub }}>
        Read helpful articles, recipes and tips from our community.
      </Typography>

      <Box sx={{ position: 'relative', width: { xs: '100%', sm: '70%', md: '50%' }, mx: 'auto' }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search articles, recipes, topics..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); e.stopPropagation()
            }
          }}
          sx={{ width: '100%', pb: isSearching ? 0 : 4 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: query ? (
                <InputAdornment position="end">
                  <IconButton size="small" aria-label="clear search" onClick={handleClear}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : undefined
            }
          }}
        />

        {/* show searching indicator when parent sets isSearching */}
        {isSearching ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 2, gap: 1 }}>
            <CircularProgress size={16} thickness={4} />
            <Typography variant="body2" sx={{ color: theme.palette.text.textSub }}>Searching...</Typography>
          </Box>
        ) : null}
      </Box>
    </Box>
  )
}