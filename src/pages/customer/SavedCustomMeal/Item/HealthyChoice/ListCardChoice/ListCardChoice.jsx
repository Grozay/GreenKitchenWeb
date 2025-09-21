import { Box, Grid } from '@mui/material'
import FoodCard from '~/components/FoodCard/FoodCard'

const ListCardChoice = ({ cards }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Grid
        container
        spacing={{ xs: 1.5, sm: 2, md: 3 }}
      >
        {cards.map((card) => (
          <Grid
            size={{ xs: 12, sm: 8, md: 6, lg: 5 }}
            key={card.id}
          >
            <FoodCard card={card} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default ListCardChoice