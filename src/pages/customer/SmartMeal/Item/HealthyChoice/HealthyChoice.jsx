import { Box, Typography } from '@mui/material'
import theme from '~/theme'
import { useSelector } from 'react-redux'
import { selectCurrentMeal } from '~/redux/meal/mealSlice'
import EmptyBowl from './EmptyBowl/EmptyBowl'
import ListCardChoice from './ListCardChoice/ListCardChoice'
import InfoDetail from './InfoDetail/InfoDetail'

const HealthyChoice = ({ itemHealthy }) => {
  const selectedItems = useSelector(selectCurrentMeal)

  const translatedYourHealthyBowl = 'Your Healthy Bowl'
  const translatedBuildYourPerfect = 'Build your perfect healthy bowl - mix, match, and track nutrition in every bite!'
  const translatedProtein = '1. Protein'
  const translatedCarbs = '2. Carbs'
  const translatedSide = '3. Side'
  const translatedSauce = '4. Sauce'

  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.palette.primary.card,
      borderRadius: 5,
      p: 3,
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5
      }}>
        <Typography variant="h5" sx={{
          fontWeight: 'bold',
          color: theme.palette.text.primary,
          display: 'inline-block',
          width: 'fit-content'
        }}>
          {translatedYourHealthyBowl}
        </Typography>
        <Box sx={{ width: '4rem', height: '0.2rem', bgcolor: theme.palette.primary.secondary }} />
        <Typography variant="body1" sx={{
          color: theme.palette.text.primary,
          mb: 1,
          textAlign: 'center'
        }}>
          {translatedBuildYourPerfect}
        </Typography>
      </Box>

      {selectedItems.protein.length === 0 &&
        selectedItems.carbs.length === 0 &&
        selectedItems.side.length === 0 &&
        selectedItems.sauce.length === 0 ? (
          <EmptyBowl />
        ) : (
          <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            overflowY: 'auto',
            pr: 1,
            '&::-webkit-scrollbar': {
              width: '6px'
            },
            '&::-webkit-scrollbar-track': {
              background: theme.palette.grey[200],
              borderRadius: '4px'
            },
            '&::-webkit-scrollbar-thumb': {
              background: theme.palette.primary.text,
              borderRadius: '4px'
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: theme.palette.primary.dark
            }
          }}>
            {selectedItems.protein.length > 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'medium', color: theme.palette.text.primary }}>{translatedProtein}</Typography>
                <Box>
                  <ListCardChoice cards={selectedItems.protein} />
                </Box>
              </Box>
            )}
            {selectedItems.carbs.length > 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'medium' }}>{translatedCarbs}</Typography>
                <ListCardChoice cards={selectedItems.carbs} />
              </Box>
            )}
            {selectedItems.side.length > 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'medium' }}>{translatedSide}</Typography>
                <ListCardChoice cards={selectedItems.side} />
              </Box>
            )}
            {selectedItems.sauce.length > 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'medium' }}>{translatedSauce}</Typography>
                <ListCardChoice cards={selectedItems.sauce} />
              </Box>
            )}
          </Box>
        )}
      {selectedItems.protein.length === 0 &&
        selectedItems.carbs.length === 0 &&
        selectedItems.side.length === 0 &&
        selectedItems.sauce.length === 0 ? (
          <Box></Box>
        ) : (
          <InfoDetail itemHealthy={itemHealthy} />
        )}
    </Box>
  )
}

export default HealthyChoice