import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import FoodCard from '~/components/FoodCard/FoodCard'

const SelectedFood = ({ allSelectedItems, title }) => {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ px: 1 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {allSelectedItems.map((item) => (
            <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={`${item.id}-${item.type}`}>
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

export default SelectedFood