import AppBar from '~/components/AppBar/AppBar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining'
import CorporateFareIcon from '@mui/icons-material/CorporateFare'
import Footer from '~/components/Footer/Footer'
import Testimonials from './Testimonials/Testimonials'
import FeaturedMenu from './FeaturedMenu/FeaturedMenu'
import BowlSection from './BowlSection/BowlSection'
import theme from '~/theme'
import { useNavigate } from 'react-router-dom'
import VideoTop from './VideoTop/VideoTop'
import { useTranslation } from 'react-i18next'
const HomeLayout = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <Box>
      <AppBar />
      {/* Hero Section */}
      <Box
        sx={{
          mt: theme.fitbowl.appBarHeight,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.secondary} 100%)`,
          color: 'white',
          textAlign: 'center',
          overflow: 'hidden'
        }}
      >
        <VideoTop/>
      </Box>

      {/* Services Section */}
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
            {t('home.servicesTitle')}
          </Typography>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  borderRadius: 5,
                  p: 3,
                  border: `2px solid ${theme.palette.primary.secondary}`,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <RestaurantIcon
                  sx={{
                    fontSize: 60,
                    color: theme.palette.primary.secondary,
                    mb: 2
                  }}
                />
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {t('home.services.dineIn.title')}
                </Typography>
                <Typography sx={{ mb: 3, color: theme.palette.text.textSub }}>
                  {t('home.services.dineIn.description')}
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: theme.palette.primary.secondary,
                    color: theme.palette.primary.secondary,
                    borderRadius: 10,
                    '&:hover': {
                      bgcolor: theme.palette.primary.secondary,
                      color: 'white'
                    }
                  }}
                >
                  {t('home.services.dineIn.button')}
                </Button>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  borderRadius: 5,
                  p: 3,
                  border: `2px solid ${theme.palette.primary.secondary}`,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <DeliveryDiningIcon
                  sx={{
                    fontSize: 60,
                    color: theme.palette.primary.secondary,
                    mb: 2
                  }}
                />
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {t('home.services.delivery.title')}
                </Typography>
                <Typography sx={{ mb: 3, color: theme.palette.text.textSub }}>
                  {t('home.services.delivery.description')}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/menu')}
                  sx={{
                    borderColor: theme.palette.primary.secondary,
                    color: theme.palette.primary.secondary,
                    borderRadius: 10,
                    '&:hover': {
                      bgcolor: theme.palette.primary.secondary,
                      color: 'white'
                    }
                  }}
                >
                  {t('home.services.delivery.button')}
                </Button>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  borderRadius: 5,
                  p: 3,
                  border: `2px solid ${theme.palette.primary.secondary}`,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <CorporateFareIcon
                  sx={{
                    fontSize: 60,
                    color: theme.palette.primary.secondary,
                    mb: 2
                  }}
                />
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {t('home.services.catering.title')}
                </Typography>
                <Typography sx={{ mb: 3, color: theme.palette.text.textSub }}>
                  {t('home.services.catering.description')}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/about-us')}
                  sx={{
                    borderColor: theme.palette.primary.secondary,
                    color: theme.palette.primary.secondary,
                    borderRadius: 10,
                    '&:hover': {
                      bgcolor: theme.palette.primary.secondary,
                      color: 'white'
                    }
                  }}
                >
                  {t('home.services.catering.button')}
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Build Your Bowl Section */}
      <BowlSection />

      {/* Featured Menu Section */}
      <FeaturedMenu />

      {/* Call to Action Section */}
      <Box
        sx={{
          py: 8,
          bgcolor: theme.palette.primary.main,
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              fontWeight: 'bold'
            }}
          >
            {t('home.cta.title')}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              opacity: 0.9
            }}
          >
            {t('home.cta.subtitle')}
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/smart-meal-planner')}
            sx={{
              bgcolor: theme.palette.primary.secondary,
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold'
              , '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
                color: theme.palette.primary.main
              },
              borderRadius: 10
            }}
          >
            {t('home.cta.button')}
          </Button>
        </Container>
      </Box>

      {/* About Section */}
      <Box sx={{ py: 8, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="overline"
                sx={{
                  color: theme.palette.primary.secondary,
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}
              >
                {t('home.mission.label')}
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  mb: 3,
                  fontWeight: 'bold',
                  color: theme.palette.primary.main
                }}
              >
                {t('home.mission.title')}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  fontSize: '1.1rem',
                  lineHeight: 1.7,
                  color: theme.palette.text.textSub
                }}
              >
                {t('home.mission.description')}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  fontStyle: 'italic',
                  color: theme.palette.primary.main
                }}
              >
                {t('home.mission.quote')}
              </Typography>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/about-us')}
                sx={{
                  borderColor: theme.palette.primary.secondary,
                  color: theme.palette.primary.secondary,
                  px: 4,
                  py: 1.5,
                  fontWeight: 'bold',
                  borderRadius: 10,
                  '&:hover': {
                    bgcolor: theme.palette.primary.secondary,
                    color: 'white'
                  }
                }}
              >
                {t('home.mission.button')}
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=2070&auto=format&fit=crop"
                alt="About Green Kitchen"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Testimonials />

      <Footer />
    </Box>
  )
}
export default HomeLayout