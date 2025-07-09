import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import FoodCard from '~/components/FoodCard/FoodCard'

const SelectedFood = ({ allSelectedItems, title }) => {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
          {title}
        </Typography>
      </Box>
      <Grid container spacing={2} sx={{ mx: 2, my: 2 }}>
        {allSelectedItems.map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 2 }} key={`${item.id}-${item.type}`}>
            <FoodCard card={item} />
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default SelectedFood