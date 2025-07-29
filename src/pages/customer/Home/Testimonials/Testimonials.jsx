import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Rating from '@mui/material/Rating'
import theme from '~/theme'

const Testimonials = () => {
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
          What do customers say about Green Kitchen?
        </Typography>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ p: 3, height: '100%', borderRadius: 5, boxShadow: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.secondary }}>
                  G
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Giang Duong
                  </Typography>
                  <Rating value={5} size="small" readOnly />
                </Box>
              </Box>
              <Typography sx={{ color: theme.palette.text.textSub }}>
                Delicious food, menu is divided into high and low calories groups for easy selection.
                Also, each dish has its specific calorie count, suitable for people who want to lose weight.
              </Typography>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ p: 3, height: '100%', borderRadius: 5, boxShadow: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.secondary }}>
                  N
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Nguyễn Chí Quyễn
                  </Typography>
                  <Rating value={5} size="small" readOnly />
                </Box>
              </Box>
              <Typography sx={{ color: theme.palette.text.textSub }}>
                Healthy food is very tasty and nutritious, the price is acceptable.
                Spacious, clean space, attentive service.
              </Typography>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ p: 3, height: '100%', borderRadius: 5, boxShadow: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.secondary }}>
                  T
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Trần Yến Nhi
                  </Typography>
                  <Rating value={5} size="small" readOnly />
                </Box>
              </Box>
              <Typography sx={{ color: theme.palette.text.textSub }}>
                The price is a bit high but the food is delicious. Getting better and better, tasty food and sauce,
                clean packaging that protects the environment. My favorite restaurant!!
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Testimonials
