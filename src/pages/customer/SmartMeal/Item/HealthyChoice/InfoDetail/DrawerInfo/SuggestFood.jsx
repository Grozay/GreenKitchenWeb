import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import FastfoodIcon from '@mui/icons-material/Fastfood'
import FoodCard from '~/components/FoodCard/FoodCard'
import theme from '~/theme'
import useTranslate from '~/hooks/useTranslate'
import { useSelector } from 'react-redux'
import { selectCurrentLanguage } from '~/redux/translations/translationsSlice'

const SuggestFood = ({ suggestedMeals }) => {
  const currentLang = useSelector(selectCurrentLanguage)
  const translatedText = useTranslate('Need to balance your meal? Try adding these:', currentLang)

  return (
    <>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <FastfoodIcon sx={{ color: theme.palette.primary.secondary }} />
        <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
          {translatedText}
        </Typography>
      </Box>
      <Grid container spacing={2} sx={{ mx: 2, my: 2 }}>
        {suggestedMeals.map((item, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 2 }} key={index}>
            <FoodCard card={item} />
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default SuggestFood