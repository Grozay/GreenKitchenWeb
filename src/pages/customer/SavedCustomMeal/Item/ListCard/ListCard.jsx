import { Grid } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import theme from '~/theme'
import FoodCard from '~/components/FoodCard/FoodCard'
import Skeleton from '@mui/material/Skeleton'

const ListCard = ({ title, index, cards, loading }) => {
  const skeletonArray = Array.from({ length: 4 })

  return (
    <Box sx={{ mb: { xs: 3, md: 6 } }}>
      <Box sx={{
        my: { xs: 2, md: 3 },
        px: { xs: 1, sm: 2 }
      }}>
        <Typography
          variant="h5"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
          }}
        >
          <Box sx={{
            borderRadius: '50% !important',
            border: '1px solid ' + theme.colorSchemes.light.palette.text.primary,
            width: { xs: 20, sm: 24 },
            height: { xs: 20, sm: 24 },
            minWidth: { xs: 20, sm: 24 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 1.2, sm: 1.7 },
            fontWeight: 900,
            color: 'white',
            backgroundColor: theme.colorSchemes.light.palette.text.primary
          }}>
            {index}
          </Box>
          {title}
        </Typography>
      </Box>
      <Grid
        container
        spacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{
          mt: { xs: 1, md: 2 },
          px: { xs: 0.5, sm: 1 }
        }}
      >
        {loading || !cards
          ? skeletonArray.map((_, idx) => (
            <Grid size={{ xs: 6, sm: 6, md: 4, lg: 3 }} key={idx}>
              <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 5 }} />
            </Grid>
          ))
          : cards?.slice().reverse().map((card, idx) => (
            <Grid size={{ xs: 6, sm: 6, md: 4, lg: 3 }} key={idx}>
              <FoodCard card={card} />
            </Grid>
          ))}
      </Grid>
    </Box>
  )
}

export default ListCard