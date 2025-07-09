import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Link } from 'react-router-dom'
import Footer from '~/components/Footer/Footer'

const NotFound = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box>
      <Container
        maxWidth="md"
        sx={{
          mt: 8,
          mb: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 64px - 60px)',
          textAlign: 'center',
          padding: 3
        }}
      >
        <Grid container spacing={4} alignItems="center" justifyContent="center" direction={isMobile ? 'column' : 'row'}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
              alt="404 animation"
              sx={{
                width: '100%',
                maxWidth: '400px',
                height: 'auto',
                borderRadius: 2
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: isMobile ? 'center' : 'left' }}>
            <Typography variant="h1" component="h1" sx={{
              fontSize: isMobile ? '6rem' : '8rem',
              fontWeight: 700,
              color: 'primary.main',
              mb: 2
            }}>
              404
            </Typography>
            <Typography variant="h4" component="h2" gutterBottom>
              Oops! Page not found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              The page you are looking for might have been removed, renamed, or is temporarily unavailable.
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/"
              sx={{ mt: 2 }}
            >
              Back to Homepage
            </Button>
          </Grid>

        </Grid>
      </Container>

      <Footer />
    </Box>
  )
}

export default NotFound
