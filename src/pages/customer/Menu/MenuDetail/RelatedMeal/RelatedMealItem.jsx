
import { Card, CardMedia, CardContent, Typography, Grid, Box } from '@mui/material'
import theme from '~/theme'
import { useNavigate } from 'react-router-dom'

const RelatedMealItem = ({ item, currentCalories }) => {
  const navigate = useNavigate()
  const translatedTitle = item.title
  const translatedDescription = item.description
  const translatedVnd = 'VND'
  const translatedCalories = 'Calories'

  // Tính độ chênh lệch calo
  const calorieDiff = Math.abs(item.calories - (currentCalories || 0))
  const isSimilarCalorie = calorieDiff <= 50 // Gần nhau nếu chênh lệch <= 50 calo

  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderRadius: '12px',
          overflow: 'hidden',
          transition: 'transform 0.3s ease-in-out',
          backgroundColor: theme.palette.primary.card,
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
          }
        }}
        onClick={() => navigate(`/menu/${item.slug}`)}
      >
        <CardMedia
          component="img"
          height="200"
          image={item.image}
          alt={item.title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ p: 2, flexGrow: 1 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, mb: 1, color: theme.palette.text.primary }}
          >
            {translatedTitle}
          </Typography>

          {/* Hiển thị calo với badge nếu tương tự */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500
              }}
            >
              {translatedCalories}: {Math.round(item.calories)}
            </Typography>
            {isSimilarCalorie && (
              <Box
                sx={{
                  bgcolor: theme.palette.success.main,
                  color: 'white',
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  fontSize: '0.7rem',
                  fontWeight: 600
                }}
              >
                Similar
              </Box>
            )}
          </Box>

          <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.textSub }}>
            {translatedDescription}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, color: theme.palette.primary.secondary }}>
            {item.price.toLocaleString()} {translatedVnd}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default RelatedMealItem