import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

function ProductListPanel({ dishes }) {
  if (!dishes || dishes.length === 0) {
    return <Box sx={{ p: 3, textAlign: 'center', color: 'grey.600' }}>Không có món phù hợp.</Box>
  }
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
      {dishes.map(product => (
        <Card key={product.id} sx={{ maxWidth: 220, mx: 'auto', mb: 2, cursor: 'pointer' }}>
          <CardMedia
            component="img"
            height="120"
            image={product.image}
            alt={product.title}
          />
          <CardContent sx={{ p: 1.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: 15, mb: 1 }}>{product.title}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>{product.description}</Typography>
            <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
              {product.price && product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}

export default ProductListPanel
