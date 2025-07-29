import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Grid from '@mui/material/Grid'
import theme from '~/theme'

const ItemSuggestMenu = ({ item, index, totalCalories, totalProtein, totalCarbs, totalFat }) => {

  const items = [
    { label: 'Calories', value: `${Math.round(totalCalories)}` },
    { label: 'Protein', value: `${Math.round(totalProtein)}g` },
    { label: 'Carbs', value: `${Math.round(totalCarbs)}g` },
    { label: 'Fat', value: `${Math.round(totalFat)}g` }
  ]
  return (
    <Box>
      <Box sx={{
        bgcolor: 'white',
        borderRadius: 5,
        p: 2
      }}>
        <Box >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h8" gutterBottom color="text.primary" >
              BOWL {index + 1}
            </Typography>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #4C082A',
              borderRadius: '50px',
              px: 2,
              py: 0.5,
              color: '#4C082A',
              fontSize: '0.9rem'
            }}>
              {item.calories} CALORIES
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
            <AvatarGroup
              max={5}
              sx={{
                '& .MuiAvatar-root': {
                  width: { xs: '65px', sm: '60px', md: '50px' },
                  height: { xs: '65px', sm: '60px', md: '50px' }
                },
                my: 1,
                justifyContent: 'center'
              }}
            >
              {item.image.map((image, index) => (
                <Avatar key={index} alt="Remy Sharp" src={image} />
              ))}
            </AvatarGroup>
          </Box>

          <Box>
            <Typography variant="body2" gutterBottom color="text.primary"
              sx={{
                textAlign: 'center',
                my: 2,
                height: '60px',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
              {item.description}
            </Typography>
          </Box>

          <Box sx={{ borderBottom: '1.5px dashed', my: 2 }}></Box>
          <Box>
            <Box>
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
                    <Typography variant="h7" fontWeight="bold" sx={{ fontSize: '1rem', fontWeight: 500, lineHeight: 1.2 }}>
                      {item.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 400, fontSize: '0.75rem' }}>
                      {item.label}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>

        </Box>
      </Box>
    </Box>
  )
}

export default ItemSuggestMenu
