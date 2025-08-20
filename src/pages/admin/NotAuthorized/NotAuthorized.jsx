
import { Box, Container, Paper, Typography, Button, Stack } from '@mui/material'
import BlockIcon from '@mui/icons-material/Block'
import { useNavigate } from 'react-router-dom'

export default function NotAuthorized() {
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
        <Paper elevation={3} sx={{ p: 4, width: '100%' }} aria-live="polite">
          <Stack direction="row" spacing={3} alignItems="center">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 96,
                height: 96,
                borderRadius: '50%',
                bgcolor: 'error.main',
                color: 'common.white'
              }}
            >
              <BlockIcon sx={{ fontSize: 44 }} />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                403 — Not Authorized
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ pb: 2 }}>
                You don’t have permission to view this page. If you believe this is an error,
                contact your administrator or use the support link below.
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
