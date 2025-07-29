import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import theme from '~/theme'
import CardMenu from '~/components/FoodCard/CardMenu'
import { mealPackages } from '~/apis/mockData'
import _ from 'lodash'

const FeaturedMenu = () => {

  const grouped = _.groupBy(mealPackages.slice(0, 4), 'size')

  return (
    <Box sx={{ py: 8, bgcolor: theme.palette.background.default }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          textAlign="center"
          sx={{
            mb: 6,
            fontWeight: 'bold',
            color: theme.palette.primary.main
          }}
        >
          Green-made bowls
        </Typography>

        <Grid container spacing={4}>
          {Object.values(grouped).flatMap(group =>
            group.map((item, idx) => (
              <Grid size={{ xs: 6, md: 3 }} key={item.id}>
                <CardMenu item={item} sizeIndex={idx} />
              </Grid>
            ))
          )}
        </Grid>

        <Box textAlign="center" sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderColor: theme.palette.primary.secondary,
              color: theme.palette.primary.secondary,
              px: 4,
              py: 1.5,
              fontWeight: 'bold',
              borderRadius: 10,
              '&:focus': {
                borderColor: theme.palette.primary.secondary,
                color: theme.palette.primary.secondary
              },
              '&:hover': {
                bgcolor: theme.palette.primary.secondary,
                color: 'white'
              }
            }}
          >
            View all meal packages
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default FeaturedMenu
