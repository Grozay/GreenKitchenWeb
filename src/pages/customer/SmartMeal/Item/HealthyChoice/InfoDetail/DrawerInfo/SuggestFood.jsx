import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import FastfoodIcon from '@mui/icons-material/Fastfood'
import FoodCard from '~/components/FoodCard/FoodCard'
import theme from '~/theme'

const SuggestFood = ({ suggestedMeals }) => {
  const translatedText = 'Need to balance your meal? Try adding these:'

  return (
    <>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
        <FastfoodIcon sx={{ color: theme.palette.primary.secondary }} />
        <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
          {translatedText}
        </Typography>
      </Box>
      <Box sx={{ px: 1 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {suggestedMeals.map((item, index) => (
            <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={index}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <FoodCard card={item} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  )
}

export default SuggestFood