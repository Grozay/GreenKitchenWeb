import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import theme from '~/theme'

const EmptyBowl = () => {
  const translatedText = 'Choose ingredients to calculate calories'

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Box component="img" src='https://res.cloudinary.com/dbq8itp9r/image/upload/v1758395761/9056738_bowl_icon_whq5pv.png' alt="empty bowl" sx={{ width: 180, opacity: 0.2, mb: 2 }} />
      <Typography sx={{ color: theme.colorSchemes.light.palette.text.primary, fontWeight: 500, textAlign: 'center' }}>
        {translatedText}
      </Typography>
    </Box>
  )
}

export default EmptyBowl