import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'

export default function FavoriteProducts({ favoriteProducts = [] }) {
  const hasFavorites = favoriteProducts.length > 0
  return (
    <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
      <CardContent sx={{ p: 2, minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6">Favorite Dishes</Typography>
        <Divider sx={{ my: 1 }} />
        {hasFavorites ? (
          <Box>
            {favoriteProducts.map(product => (
              <Box key={product.id} sx={{ mb: 1 }}>
                <Typography variant="body2">{product.name}</Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Don&apos;t have favorite dishes yet? Add some now!
            </Typography>
            <Button
              component={Link}
              to="/menu-meal"
              variant="outlined"
              size="small"
              sx={{ borderColor: 'primary.main', color: 'primary.main', alignSelf: 'center' }}
            >
              Go to Menu
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
