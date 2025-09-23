import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import AppBar from '~/components/AppBar/AppBar'
import Footer from '~/components/Footer/Footer'
import theme from '~/theme'

const AboutUs = () => {
  useEffect(() => {
    AOS.init({ once: true, duration: 800 })
  }, [])


  return (
    <Box sx={{ backgroundColor: theme.colorSchemes.light.palette.background.default }}>
      <AppBar />
      <Box sx={{ maxWidth: '1280px', mx: 'auto', py: 6, mt: theme.fitbowl.appBarHeight }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', my: { xs: 20, md: 25 }, px: 2 }} data-aos="fade-up">
          <Typography
            variant="h6"
            sx={{ fontWeight: 500, color: theme.colorSchemes.light.palette.text.textSub, mb: 2 }}
          >
            {'OUR STORY'}
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '4rem' },
              color: theme.colorSchemes.light.palette.text.primary,
              lineHeight: 1.2
            }}
          >
            {'At Fitbowl, every healthy meal is a love letter to your future self.'}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mt: 3,
              maxWidth: '800px',
              mx: 'auto',
              color: theme.colorSchemes.light.palette.text.textSub,
              fontSize: '1.2rem'
            }}
          >
            {'We’re your partner in wellness, crafting personalized, AI-driven meals that nourish your body and soul, tailored to your unique needs and tastes.'}
          </Typography>
        </Box>

        {/* Mission Section (Text over Image) */}
        <Box
          sx={{
            position: 'relative',
            height: { xs: '600px', md: '600px' },
            display: 'flex',
            overflow: 'hidden',
            width: { xs: '100vw', md: '100vw' },
            left: { md: '50%' },
            right: { md: '50%' },
            marginLeft: { md: '-50vw' },
            marginRight: { md: '-50vw' },
            maxWidth: { xs: '100%', md: '100vw' },
            alignItems: 'center',
            justifyContent: 'center'
          }}
          data-aos="fade-up"
        >
          <img
            src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 2,
              filter: 'brightness(0.5)'
            }}
            alt="Fitbowl meal"
          />
          <Box
            sx={{
              position: 'relative',
              zIndex: 3,
              p: { xs: 2, md: 8 },
              borderRadius: '10px',
              maxWidth: { xs: '95vw', sm: '90vw', md: '800px' },
              width: { xs: '95vw', sm: '90vw', md: 'auto' },
              mx: 'auto',
              color: '#fff',
              textAlign: 'center',
              overflowWrap: 'break-word',
              wordBreak: 'break-word'
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, color: '#fff', mb: 3 }}
            >
              {'OUR MISSION'}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 600,
                color: '#fff',
                mb: 3,
                fontSize: { xs: '1.8rem', md: '2.5rem' }
              }}
            >
              {'We help you build a healthy relationship with food.'}
            </Typography>
            <Typography variant="body1" sx={{ color: '#fff', lineHeight: 1.8 }}>
              {'Using advanced AI, Fitbowl creates fresh, nutritionally balanced, and flavorful meals tailored to your dietary needs and preferences. We aim to inspire a deeper connection between you and your food, empowering you to make conscious choices that fuel your body and nurture your soul.'}
            </Typography>
            <Typography variant="body1" sx={{ color: '#fff', lineHeight: 1.8, mt: 2 }}>
              {'Our vision is a world where everyone embraces the power of personalized nutrition, transforming lives one delicious bowl at a time.'}
            </Typography>
          </Box>
        </Box>

        {/* Values Section (Hover Effect) */}
        <Box sx={{ px: { xs: 2, md: 4 }, py: 8, textAlign: 'center' }} data-aos="fade-up">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
              color: theme.colorSchemes.light.palette.text.primary,
              mb: 6
            }}
          >
            {'OUR VALUES'}
          </Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }} data-aos="zoom-in">
              <Box
                sx={{
                  position: 'relative',
                  height: '300px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  '&:hover .valueText': {
                    opacity: 1,
                    backgroundColor: 'rgba(0, 179, 137, 0.8)'
                  }
                }}
              >
                <Box
                  className="valueText"
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
                    opacity: 0,
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: '#fff', mb: 2 }}
                  >
                    {'AI-Powered Nutrition'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#fff' }}>
                    {'Our advanced AI analyzes your unique needs to create perfectly balanced, personalized meal plans that evolve with you.'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }} data-aos="zoom-in" data-aos-delay="100">
              <Box
                sx={{
                  position: 'relative',
                  height: '300px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=2070&auto=format&fit=crop)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  '&:hover .valueText': {
                    opacity: 1,
                    backgroundColor: 'rgba(0, 179, 137, 0.8)'
                  }
                }}
              >
                <Box
                  className="valueText"
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
                    opacity: 0,
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: '#fff', mb: 2 }}
                  >
                    {'Fresh & Sustainable'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#fff' }}>
                    {'We source the freshest, seasonal ingredients and prepare them with care, ensuring every meal nourishes both you and our planet.'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }} data-aos="zoom-in" data-aos-delay="200">
              <Box
                sx={{
                  position: 'relative',
                  height: '300px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=2070&auto=format&fit=crop)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  '&:hover .valueText': {
                    opacity: 1,
                    backgroundColor: 'rgba(0, 179, 137, 0.8)'
                  }
                }}
              >
                <Box
                  className="valueText"
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
                    opacity: 0,
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: '#fff', mb: 2 }}
                  >
                    {'Science-Backed Health'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#fff' }}>
                    {'Every recipe is crafted by nutrition experts and validated by scientific research, ensuring optimal health benefits in every bowl.'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }} data-aos="zoom-in" data-aos-delay="300">
              <Box
                sx={{
                  position: 'relative',
                  height: '300px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070&auto=format&fit=crop)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  '&:hover .valueText': {
                    opacity: 1,
                    backgroundColor: 'rgba(0, 179, 137, 0.8)'
                  }
                }}
              >
                <Box
                  className="valueText"
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
                    opacity: 0,
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: '#fff', mb: 2 }}
                  >
                    {'Inclusive Wellness'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#fff' }}>
                    {'Healthy eating should be for everyone. We make nutrition accessible, affordable, and enjoyable for all lifestyles and dietary needs.'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Technique Section */}
        <Box sx={{ px: { xs: 2, md: 4 }, py: 8 }} data-aos="fade-up">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }} data-aos="fade-right">
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2070&auto=format&fit=crop"
                style={{ width: '100%', height: 'auto', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                alt="Sous-vide cooking"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} data-aos="fade-left">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 600, color: theme.colorSchemes.light.palette.text.primary }}
                >
                  {'OUR TECHNIQUE'}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, color: theme.colorSchemes.light.palette.primary.secondary }}
                >
                  {'Sous-vide, Sou-good!'}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: theme.colorSchemes.light.palette.text.textSub, lineHeight: 1.8 }}
                >
                  {'Our sous-vide technique gently cooks your meals in a precise water bath, retaining 90% of the nutrients and flavors. Each bite is tender, juicy, and bursting with natural goodness—no more bland, dry meals.'}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: theme.colorSchemes.light.palette.text.textSub, lineHeight: 1.8 }}
                >
                  {'We use minimal oil, less sugar, and no artificial additives, letting the true flavors of fresh ingredients shine through.'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Philosophy Section */}
        <Box sx={{ px: { xs: 2, md: 4 }, py: 8, textAlign: 'center' }} data-aos="fade-up">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
              color: theme.colorSchemes.light.palette.text.primary,
              mb: 6
            }}
          >
            {'Our Philosophy to Healthy Eating'}
          </Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }} data-aos="zoom-in">
              <Box sx={{ p: 3, borderRadius: '10px', height: '100%' }}>
                <img
                  src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=2070&auto=format&fit=crop"
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px', mb: 2 }}
                  alt="Protein bowl"
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: theme.colorSchemes.light.palette.text.primary, mb: 2 }}
                >
                  {'Protein Powerhouse'}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: theme.colorSchemes.light.palette.text.textSub }}
                >
                  {'Our AI-curated bowls pack a protein punch, fueling your energy and supporting muscle growth for a stronger you.'}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} data-aos="zoom-in" data-aos-delay="100">
              <Box sx={{ p: 3, borderRadius: '10px', height: '100%' }}>
                <img
                  src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2070&auto=format&fit=crop"
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px', mb: 2 }}
                  alt="Carb bowl"
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: theme.colorSchemes.light.palette.text.primary, mb: 2 }}
                >
                  {'Carbs Done Right'}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: theme.colorSchemes.light.palette.text.textSub }}
                >
                  {'We choose the right carbs to keep you energized all day, without the crash, using AI to balance your meals perfectly.'}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} data-aos="zoom-in" data-aos-delay="200">
              <Box sx={{ p: 3, borderRadius: '10px', height: '100%' }}>
                <img
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop"
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px', mb: 2 }}
                  alt="Veggie bowl"
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: theme.colorSchemes.light.palette.text.primary, mb: 2 }}
                >
                  {'Veggie Wonderland'}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: theme.colorSchemes.light.palette.text.textSub }}
                >
                  {'Our veggie-packed bowls boost digestion and heart health, crafted with AI to maximize flavor and nutrition.'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Footer/>
    </Box>
  )
}

export default AboutUs