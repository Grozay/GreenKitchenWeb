import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Rating from '@mui/material/Rating'
import theme from '~/theme'
import { useTranslation } from 'react-i18next'

const Testimonials = () => {
  const { t } = useTranslation()

  const testimonials = [
    {
      name: t('home.testimonials.customers.customer1.name'),
      avatar: 'G',
      testimonial: t('home.testimonials.customers.customer1.testimonial')
    },
    {
      name: t('home.testimonials.customers.customer2.name'),
      avatar: 'N', 
      testimonial: t('home.testimonials.customers.customer2.testimonial')
    },
    {
      name: t('home.testimonials.customers.customer3.name'),
      avatar: 'T',
      testimonial: t('home.testimonials.customers.customer3.testimonial')
    }
  ]

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
          {t('home.testimonials.title')}
        </Typography>

        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid key={index} size={{ xs: 12, md: 4 }}>
              <Card sx={{ p: 3, height: '100%', borderRadius: 5, boxShadow: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.secondary }}>
                    {testimonial.avatar}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {testimonial.name}
                    </Typography>
                    <Rating value={5} size="small" readOnly />
                  </Box>
                </Box>
                <Typography sx={{ color: theme.palette.text.textSub }}>
                  {testimonial.testimonial}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default Testimonials
