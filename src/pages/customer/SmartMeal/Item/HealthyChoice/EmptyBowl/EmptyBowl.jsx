import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import theme from '~/theme'

const EmptyBowl = () => {
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Box component="img" src='https://res.cloudinary.com/quyendev/image/upload/v1750996461/icons8-vegetables-bag-100_1_qocndf.png' alt="empty bowl" sx={{ width: 180, opacity: 0.2, mb: 2 }} />
      <Typography sx={{ color: theme.colorSchemes.light.palette.text.primary, fontWeight: 500, textAlign: 'center' }}>
        Choose ingredients to calculate calories
      </Typography>
    </Box>
  )
}

export default EmptyBowl