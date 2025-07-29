import { useLocation, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import AppBar from '~/components/AppBar/AppBar'
import theme from '~/theme'
import Footer from '~/components/Footer/Footer'
import Grid from '@mui/material/Grid'
import InfoMenu from './InfoMenu/InfoMenu'
import ListSuggestMenu from './ListSuggestMenu/ListSuggestMenu'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Button from '@mui/material/Button'
import { menuSuggest } from '~/apis/mockData'

const SuggestMenuLayout = () => {
  const { search } = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(search)
  const gender = params.get('gender')
  const age = params.get('age')
  const weight = params.get('weight')
  const height = params.get('height')
  const exerciseLevel = params.get('exerciseLevel')
  const goal = params.get('goal')
  const allergies = params.get('allergies')

  const handleBackInfoPage = () => {
    navigate(`/calo-calculator?gender=${gender}&age=${age}&weight=${weight}&height=${height}&exerciseLevel=${exerciseLevel}&goal=${goal}&allergies=${allergies}`)
  }
  return (
    <Box>
      <AppBar />
      <Box sx={{ mt: theme.fitbowl.appBarHeight }}>
        <Box sx={{ mx: 2 }}>

          <Box sx={{ pt: 2, pb: 1, ml: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => handleBackInfoPage()}
              sx={{ borderRadius: 5, color: theme.palette.text.primary }}
              aria-label="Back to Builder"
            >
              Back to Builder
            </Button>
          </Box>

          <Grid container spacing={2} >
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Box sx={{
                p: 2,
                position: 'sticky',
                top: theme.fitbowl.appBarHeight,
                left: 0,
                right: 0,
                zIndex: 20,
                width: '100%',
                marginTop: 'auto'
              }}>
                <InfoMenu totalCalories={1300} totalProtein={20} totalCarbs={30} totalFat={8} />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 8 }}>
              <Box sx={{ p: 2 }}>
                <ListSuggestMenu items={menuSuggest} />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Footer />
    </Box>
  )
}

export default SuggestMenuLayout