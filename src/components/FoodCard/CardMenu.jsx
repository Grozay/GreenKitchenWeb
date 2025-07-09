import { Box } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import ShoppingCart from '@mui/icons-material/ShoppingCart'
import theme from '~/theme'
import { useNavigate } from 'react-router-dom'
const CardMenu = ({ item }) => {
  const navigate = useNavigate()
  const handleNavigateToDetail = (slug) => {
    navigate(`/menu/${slug}`)
  }
  return (
    <>
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
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
          }
        }}
      >
        <CardMedia
          component="img"
          height="220"
          image={item.image}
          alt={item.alt}
          sx={{ objectFit: 'cover', cursor: 'pointer' }}
          onClick={() => handleNavigateToDetail(item.slug)}
        />
        <CardContent sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 3
        }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: theme.palette.text.primary,
              cursor: 'pointer'
            }}
            onClick={() => handleNavigateToDetail(item.slug)}
          >
            {item.title}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.textSub }}>
            {item.description}
          </Typography>
          <Box sx={{
            mt: 'auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h6" sx={{
              fontWeight: 800,
              color: theme.palette.text.textSub
            }}>
              {item.price}
            </Typography>
            <IconButton
              sx={{
                color: theme.palette.primary.secondary,
                '&:hover': {
                  bgcolor: theme.palette.primary.secondary,
                  color: 'white'
                }
              }}
            >
              <ShoppingCart fontSize="medium" />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </>
  )
}

export default CardMenu