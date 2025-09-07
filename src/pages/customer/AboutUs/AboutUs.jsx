import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import AppBar from '~/components/AppBar/AppBar'
import Footer from '~/components/Footer/Footer'
import theme from '~/theme'
import { useSelector } from 'react-redux'
import { selectCurrentLanguage } from '~/redux/translations/translationsSlice'
import useTranslate from '~/hooks/useTranslate'

const AboutUs = () => {
  useEffect(() => {
    AOS.init({ once: true, duration: 800 })
  }, [])

  const currentLang = useSelector(selectCurrentLanguage)

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
            {useTranslate('OUR STORY', currentLang)}
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
            {useTranslate('At Fitbowl, every healthy meal is a love letter to your future self.', currentLang)}
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
            {useTranslate('We’re your partner in wellness, crafting personalized, AI-driven meals that nourish your body and soul, tailored to your unique needs and tastes.', currentLang)}
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
              {useTranslate('OUR MISSION', currentLang)}
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
              {useTranslate('We help you build a healthy relationship with food.', currentLang)}
            </Typography>
            <Typography variant="body1" sx={{ color: '#fff', lineHeight: 1.8 }}>
              {useTranslate('Using advanced AI, Fitbowl creates fresh, nutritionally balanced, and flavorful meals tailored to your dietary needs and preferences. We aim to inspire a deeper connection between you and your food, empowering you to make conscious choices that fuel your body and nurture your soul.', currentLang)}
            </Typography>
            <Typography variant="body1" sx={{ color: '#fff', lineHeight: 1.8, mt: 2 }}>
              {useTranslate('Our vision is a world where everyone embraces the power of personalized nutrition, transforming lives one delicious bowl at a time.', currentLang)}
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
            {useTranslate('OUR VALUES', currentLang)}
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
                    'url(https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2070&auto=format&fit=crop)',
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
                    {useTranslate('Food Made with Love', currentLang)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#fff' }}>
                    {useTranslate('Every meal is crafted with care, from our kitchen to your table, spreading love through every bite.', currentLang)}
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
                    'url(https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=2070&auto=format&fit=crop)',
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
                    {useTranslate('You-nique Experience', currentLang)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#fff' }}>
                    {useTranslate('Our AI listens to your needs, creating personalized meal plans that feel like they were made just for you.', currentLang)}
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
                    'url(https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=2070&auto=format&fit=crop)',
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
                    {useTranslate('Lasting Relationships', currentLang)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#fff' }}>
                    {useTranslate('We build lifelong connections with our customers, staff, and partners, fostering a community of wellness.', currentLang)}
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
                    'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop)',
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
                    {useTranslate('Tasteful Communication', currentLang)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#fff' }}>
                    {useTranslate('We make nutrition fun and engaging, communicating in a playful yet informative way to inspire healthy choices.', currentLang)}
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
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
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
                  {useTranslate('OUR TECHNIQUE', currentLang)}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, color: theme.colorSchemes.light.palette.primary.secondary }}
                >
                  {useTranslate('Sous-vide, Sou-good!', currentLang)}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: theme.colorSchemes.light.palette.text.textSub, lineHeight: 1.8 }}
                >
                  {useTranslate('Our sous-vide technique gently cooks your meals in a precise water bath, retaining 90% of the nutrients and flavors. Each bite is tender, juicy, and bursting with natural goodness—no more bland, dry meals.', currentLang)}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: theme.colorSchemes.light.palette.text.textSub, lineHeight: 1.8 }}
                >
                  {useTranslate('We use minimal oil, less sugar, and no artificial additives, letting the true flavors of fresh ingredients shine through.', currentLang)}
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
            {useTranslate('Our Philosophy to Healthy Eating', currentLang)}
          </Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }} data-aos="zoom-in">
              <Box sx={{ p: 3, borderRadius: '10px', height: '100%' }}>
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2070&auto=format&fit=crop"
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px', mb: 2 }}
                  alt="Protein bowl"
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: theme.colorSchemes.light.palette.text.primary, mb: 2 }}
                >
                  {useTranslate('Protein Powerhouse', currentLang)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: theme.colorSchemes.light.palette.text.textSub }}
                >
                  {useTranslate('Our AI-curated bowls pack a protein punch, fueling your energy and supporting muscle growth for a stronger you.', currentLang)}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} data-aos="zoom-in" data-aos-delay="100">
              <Box sx={{ p: 3, borderRadius: '10px', height: '100%' }}>
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=2070&auto=format&fit=crop"
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px', mb: 2 }}
                  alt="Carb bowl"
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: theme.colorSchemes.light.palette.text.primary, mb: 2 }}
                >
                  {useTranslate('Carbs Done Right', currentLang)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: theme.colorSchemes.light.palette.text.textSub }}
                >
                  {useTranslate('We choose the right carbs to keep you energized all day, without the crash, using AI to balance your meals perfectly.', currentLang)}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} data-aos="zoom-in" data-aos-delay="200">
              <Box sx={{ p: 3, borderRadius: '10px', height: '100%' }}>
                <img
                  src="https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=2070&auto=format&fit=crop"
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px', mb: 2 }}
                  alt="Veggie bowl"
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: theme.colorSchemes.light.palette.text.primary, mb: 2 }}
                >
                  {useTranslate('Veggie Wonderland', currentLang)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: theme.colorSchemes.light.palette.text.textSub }}
                >
                  {useTranslate('Our veggie-packed bowls boost digestion and heart health, crafted with AI to maximize flavor and nutrition.', currentLang)}
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