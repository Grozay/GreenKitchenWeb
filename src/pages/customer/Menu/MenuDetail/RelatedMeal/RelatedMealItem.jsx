import { useSelector } from 'react-redux'
import { selectCurrentLanguage } from '~/redux/translations/translationsSlice'
import useTranslate from '~/hooks/useTranslate'
import { Card, CardMedia, CardContent, Typography, Grid } from '@mui/material'
import theme from '~/theme'
import { useNavigate } from 'react-router-dom'

const RelatedMealItem = ({ item }) => {
  const navigate = useNavigate()
  const currentLang = useSelector(selectCurrentLanguage)
  const translatedTitle = useTranslate(item.title, currentLang)
  const translatedDescription = useTranslate(item.description, currentLang)
  const translatedVnd = useTranslate('VND', currentLang)

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