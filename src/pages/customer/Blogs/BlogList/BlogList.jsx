import { Card, CardContent, CardMedia, Typography, Grid } from '@mui/material'
import { Link } from 'react-router-dom'
const NewsCard = ({ item }) => (
  <Link to='/blogs/1' style={{ textDecoration: 'none' }}>
    <Grid container spacing={2}>
      {item.map((item, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
          <Card sx={{ maxWidth: 350, boxShadow: 'none', backgroundColor: 'transparent' }}>
            <CardMedia
              component="img"
              height="250"
              image={item.image}
              alt={item.title}
              sx={{ objectFit: 'cover', width: '100%' }}
            />
            <CardContent sx={{ padding: 0, mt: 2 }}>
              <Typography
                variant="h6"
                color="error"
                sx={{
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  lineHeight: 1.2,
                  fontFamily: 'Montserrat, sans-serif',
                  color: (theme) => theme.palette.background.main,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                {item.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                {item.date}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.5 }}>
                {item.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Link>
)

export default NewsCard