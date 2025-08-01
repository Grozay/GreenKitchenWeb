import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import theme from '~/theme'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'

const BowlSection = () => {
  const navigate = useNavigate()

  const content = {
    protein: {
      step: 1,
      title: 'Protein',
      description: 'Choose your favorite protein to start building your bowl.',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2070&auto=format&fit=crop'
    },
    carbs: {
      step: 2,
      title: 'Carbs',
      description: 'Choose your favorite carbs to complete your bowl.',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=2070&auto=format&fit=crop'
    },
    side: {
      step: 3,
      title: 'Side',
      description: 'Choose your favorite side to enrich your bowl.',
      image: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=2070&auto=format&fit=crop'
    },
    sauce: {
      step: 4,
      title: 'Sauce',
      description: 'Choose your favorite sauce to perfect your bowl.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop'
    }
  }

  return (
    <Box sx={{ py: 8, bgcolor: 'white' }}>
      <Container maxWidth="lg">
        <Box textAlign="center" sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              fontWeight: 'bold',
              color: theme.palette.primary.main
            }}
          >
            Build your own healthy bowl
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: theme.palette.primary.secondary,
              fontWeight: 'bold'
            }}
          >
            & CONTROL THE CALORIES YOU CONSUME
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Box
              sx={{
                position: 'relative',
                height: '450px',
                borderRadius: '10px',
                overflow: 'hidden',
                backgroundImage:
                  `url(${content.protein.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                cursor: 'pointer',
                '&:hover .overlay': {
                  background: 'rgba(103, 212, 187)'
                },
                '&:hover .stepText': {
                  opacity: 0
                },
                '&:hover .descText': {
                  opacity: 1
                }
              }}
            >
              <Box
                className="overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 3,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0) 100%)',
                  transition: 'background 0.3s ease-in-out'
                }}
              >
                <Typography
                  className="stepText"
                  sx={{
                    position: 'absolute',
                    top: 20,
                    left: 30,
                    fontWeight: 600,
                    color: '#fff',
                    fontSize: '0.8rem',
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                >
                  STEP {content.protein.step}
                </Typography>
                <Typography
                  className="stepText"
                  sx={{
                    position: 'absolute',
                    top: 40,
                    left: 30,
                    fontSize: '2rem',
                    fontWeight: 600,
                    color: '#fff',
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                >
                  {content.protein.title}
                </Typography>
                <Box
                  className="descText"
                  sx={{
                    opacity: 0,
                    position: 'absolute',
                    top: 30,
                    left: 10,
                    mx: 2,
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>
                    Food Made with Love
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#fff' }}>
                    {content.protein.description}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Box
              sx={{
                position: 'relative',
                height: '450px',
                borderRadius: '10px',
                overflow: 'hidden',
                backgroundImage:
                  `url(${content.carbs.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                cursor: 'pointer',
                '&:hover .overlay': {
                  background: 'rgba(103, 212, 187)'
                },
                '&:hover .stepText': {
                  opacity: 0
                },
                '&:hover .descText': {
                  opacity: 1
                }
              }}
            >
              <Box
                className="overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 3,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0) 100%)',
                  transition: 'background 0.3s ease-in-out'
                }}
              >
                <Typography
                  className="stepText"
                  sx={{
                    position: 'absolute',
                    top: 20,
                    left: 30,
                    fontWeight: 600,
                    color: '#fff',
                    fontSize: '0.8rem',
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                >
                  STEP {content.carbs.step}
                </Typography>
                <Typography
                  className="stepText"
                  sx={{
                    position: 'absolute',
                    top: 40,
                    left: 30,
                    fontSize: '2rem',
                    fontWeight: 600,
                    color: '#fff',
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                >
                  {content.carbs.title}
                </Typography>
                <Box
                  className="descText"
                  sx={{
                    opacity: 0,
                    position: 'absolute',
                    top: 30,
                    left: 10,
                    mx: 2,
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>
                    Food Made with Love
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#fff' }}>
                    {content.carbs.description}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Box
              sx={{
                position: 'relative',
                height: '450px',
                borderRadius: '10px',
                overflow: 'hidden',
                backgroundImage:
                  `url(${content.side.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                cursor: 'pointer',
                '&:hover .overlay': {
                  background: 'rgba(103, 212, 187)'
                },
                '&:hover .stepText': {
                  opacity: 0
                },
                '&:hover .descText': {
                  opacity: 1
                }
              }}
            >
              <Box
                className="overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 3,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0) 100%)',
                  transition: 'background 0.3s ease-in-out'
                }}
              >
                <Typography
                  className="stepText"
                  sx={{
                    position: 'absolute',
                    top: 20,
                    left: 30,
                    fontWeight: 600,
                    color: '#fff',
                    fontSize: '0.8rem',
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                >
                  STEP {content.side.step}
                </Typography>
                <Typography
                  className="stepText"
                  sx={{
                    position: 'absolute',
                    top: 40,
                    left: 30,
                    fontSize: '2rem',
                    fontWeight: 600,
                    color: '#fff',
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                >
                  {content.side.title}
                </Typography>
                <Box
                  className="descText"
                  sx={{
                    opacity: 0,
                    position: 'absolute',
                    top: 30,
                    left: 10,
                    mx: 2,
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>
                    Food Made with Love
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#fff' }}>
                    {content.side.description}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Box
              sx={{
                position: 'relative',
                height: '450px',
                borderRadius: '10px',
                overflow: 'hidden',
                backgroundImage:
                  `url(${content.sauce.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                cursor: 'pointer',
                '&:hover .overlay': {
                  background: 'rgba(103, 212, 187)'
                },
                '&:hover .stepText': {
                  opacity: 0
                },
                '&:hover .descText': {
                  opacity: 1
                }
              }}
            >
              <Box
                className="overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 3,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0) 100%)',
                  transition: 'background 0.3s ease-in-out'
                }}
              >
                <Typography
                  className="stepText"
                  sx={{
                    position: 'absolute',
                    top: 20,
                    left: 30,
                    fontWeight: 600,
                    color: '#fff',
                    fontSize: '0.8rem',
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                >
                  STEP {content.sauce.step}
                </Typography>
                <Typography
                  className="stepText"
                  sx={{
                    position: 'absolute',
                    top: 40,
                    left: 30,
                    fontSize: '2rem',
                    fontWeight: 600,
                    color: '#fff',
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                >
                  {content.sauce.title}
                </Typography>
                <Box
                  className="descText"
                  sx={{
                    opacity: 0,
                    position: 'absolute',
                    top: 30,
                    left: 10,
                    mx: 2,
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>
                    Food Made with Love
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#fff' }}>
                    {content.sauce.description}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box textAlign="center" sx={{ mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/smart-meal-planner')}
            sx={{
              bgcolor: theme.palette.primary.secondary,
              px: 4,
              py: 1.5,
              borderRadius: 8,
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}
          >
            Calculate Calories Now
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default BowlSection