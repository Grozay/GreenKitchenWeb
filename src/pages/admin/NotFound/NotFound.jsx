import { Container, Box, Paper, Typography, Button, Stack } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 6
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 96,
                height: 96,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                color: 'common.white'
              }}
            >
              <ErrorOutlineIcon sx={{ fontSize: 44 }} />
            </Box>

            <Box sx={{ flex: 1, textAlign: isMobile ? 'center' : 'left' }}>
              <Typography variant="h3" component="h1" gutterBottom>
                404 — Page not found
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button variant="contained" onClick={() => navigate('/management')}>
                  Go to Dashboard
                </Button>
                <Button variant="outlined" onClick={() => navigate('/management/support')}>
                  Contact Support
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Container>
  )
}

export default NotFound
