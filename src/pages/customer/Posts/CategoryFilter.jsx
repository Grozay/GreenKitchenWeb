import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import CategoryIcon from '@mui/icons-material/Category'
import AllInboxIcon from '@mui/icons-material/AllInbox'
import LocalDiningIcon from '@mui/icons-material/LocalDining'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import PsychologyIcon from '@mui/icons-material/Psychology'
import PeopleIcon from '@mui/icons-material/People'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import EventIcon from '@mui/icons-material/Event'
import ArticleIcon from '@mui/icons-material/Article'
import CookieIcon from '@mui/icons-material/Cookie';
import theme from '~/theme'

export default function CategoryFilter({ categories = [], category, setCategory }) {
  const selected = categories.find(c => String(c.id) === String(category))
  const heading = selected ? selected.name : 'Topics'

  const getIconForCategory = (name, active) => {
    const color = active ? '#fff' : 'rgba(0,0,0,0.54)'
    const n = String(name || '').toLowerCase()
    if (n.includes('recipe')) return <CookieIcon sx={{ color }} />
    if (n.includes('nutrition')) return <LocalDiningIcon sx={{ color }} />
    if (n.includes('fitness')) return <FitnessCenterIcon sx={{ color }} />
    if (n.includes('mental')) return <PsychologyIcon sx={{ color }} />
    if (n.includes('community')) return <PeopleIcon sx={{ color }} />
    if (n.includes('promotion')) return <LocalOfferIcon sx={{ color }} />
    if (n.includes('event')) return <EventIcon sx={{ color }} />
    if (n.includes('health') || n.includes('news')) return <ArticleIcon sx={{ color }} />
    if (n === 'all' || n === 'all topics') return <AllInboxIcon sx={{ color }} />
    return <CategoryIcon sx={{ color }} />
  }

  return (
    // entire container is sticky so it stays visible while scrolling
    <Box
      sx={{
        p: 2,
        position: 'sticky',
        top: `calc(${theme.fitbowl.appBarHeight} + 16px)`,
        bgcolor: theme.palette.background.default,
        borderRadius: 1,
        boxShadow: 1,
        zIndex: 2
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>{heading}</Typography>
      <Box sx={{ mb: 2 }}>
        <Divider />
      </Box>
      <Stack direction="column" spacing={1}>
        <Button
          variant="text"
          onClick={() => setCategory('')}
          startIcon={getIconForCategory('All Topics', category === '')}
          sx={{
            justifyContent: 'flex-start',
            textTransform: 'none',
            color: category === '' ? '#fff' : 'inherit',
            fontWeight: category === '' ? 700 : 400,
            bgcolor: category === '' ? theme.palette.primary.secondary : 'transparent',
            '&:hover': { bgcolor: category === '' ? theme.palette.primary.secondary : 'action.hover' }
          }}
        >
          All Topics
        </Button>

        {categories.map(c => (
          <Button
            key={c.id}
            variant="text"
            onClick={() => setCategory(String(c.id))}
            startIcon={getIconForCategory(c.name, String(category) === String(c.id))}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              color: String(category) === String(c.id) ? '#fff' : 'inherit',
              fontWeight: String(category) === String(c.id) ? 700 : 400,
              bgcolor: String(category) === String(c.id) ? theme.palette.primary.secondary : 'transparent',
              '&:hover': { bgcolor: String(category) === String(c.id) ? theme.palette.primary.secondary : 'action.hover' }
            }}
          >
            {c.name}
          </Button>
        ))}
      </Stack>
    </Box>
  )
}
