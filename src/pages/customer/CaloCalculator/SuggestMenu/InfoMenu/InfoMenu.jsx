import { Grid, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import theme from '~/theme'


const InfoMenu = ({ totalCalories, totalProtein, totalCarbs, totalFat }) => {

  const items = [
    { label: 'Calories', value: `${Math.round(totalCalories)}` },
    { label: 'Protein', value: `${Math.round(totalProtein)}g` },
    { label: 'Carbs', value: `${Math.round(totalCarbs)}g` },
    { label: 'Fat', value: `${Math.round(totalFat)}g` }
  ]
  return (
    <Box sx={{
      p: 3,
      bgcolor: 'rgba(0, 0, 0, 0.10)',
      borderRadius: 5

    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Typography variant="h5" gutterBottom color="text.primary" >
          Your result
        </Typography>
        <Typography variant="body2" gutterBottom color="text.primary" sx={{ textAlign: 'center' }}>
          Below are your daily calorie and macronutrient estimates, which serves as a guide to craft your own healthy bowls.
        </Typography>
      </Box>
      <Box>
        <Box sx={{ borderBottom: '1.5px dashed', my: 2 }}></Box>
      </Box>
      <Box>
        <Box>
          <Typography variant="body2" gutterBottom color="text.primary" sx={{ textAlign: 'center', my: 2 }}>Nutrition intake estimates per day</Typography>
        </Box>
        <Grid
          container
          spacing={2}
          sx={{
            textAlign: 'center',
            width: '100%',
            m: 0,
            '& .MuiGrid-item': {
              padding: '0 8px',
              flexBasis: '25%',
              maxWidth: '25%',
              flexGrow: 1
            }
          }}
        >
          {items.map((item, index) => (
            <Grid size={{ xs: 3 }} key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h5" fontWeight="bold" sx={{ fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.2 }}>
                {item.value}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, fontWeight: 400, fontSize: '0.75rem' }}>
                {item.label}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box>
        <Box sx={{ borderBottom: '1.5px dashed', my: 2 }}></Box>
      </Box>
      <Box sx={{
        // backgroundColor: 'rgba(0, 179, 137, 0.3)',
        p: 0.1,
        borderRadius: 3
      }}>
        <Box>
          <Typography variant="body2" gutterBottom color="text.primary" sx={{ textAlign: 'center' }}>We recommend</Typography>
        </Box>
        <Box>
          <Typography variant="h6" gutterBottom color="text.primary" sx={{ textAlign: 'center' }}>3 bowls/day</Typography>
        </Box>
      </Box>
      <Box>
        <Box sx={{ borderBottom: '1.5px dashed', my: 2 }}></Box>
      </Box>
      <Box sx={{
        // backgroundColor: 'rgba(0, 179, 137, 0.3)',
        p: 0.1,
        borderRadius: 3
      }}>
        <Box>
          <Typography variant="body2" gutterBottom color="text.primary" sx={{ textAlign: 'center', my: 2 }}>Nutrition intake estimates per Bowl</Typography>
        </Box>
        <Box>
          <Grid
            container
            spacing={2}
            sx={{
              textAlign: 'center',
              width: '100%',
              p: 2,
              m: 0,
              '& .MuiGrid-item': {
                padding: '0 8px',
                flexBasis: '25%',
                maxWidth: '25%',
                flexGrow: 1
              }
            }}
          >
            {items.map((item, index) => (
              <Grid size={{ xs: 3 }} key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h5" fontWeight="bold" sx={{ fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.2 }}>
                  {item.value}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, fontWeight: 400, fontSize: '0.75rem' }}>
                  {item.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}

export default InfoMenu