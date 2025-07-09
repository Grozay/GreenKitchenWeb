import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import CardMenu from '~/components/FoodCard/CardMenu'
const MenuList = ({ pkg }) => {
  return (
    <Box>
      <Grid container spacing={2}>
        {pkg.map((item, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <CardMenu item={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default MenuList