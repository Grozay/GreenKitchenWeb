import { Box } from '@mui/material'
import ProductCard from './ProductCard'

export default function ProductList({ products, cardHeight = 220 }) {
  // Xử lý cardHeight có thể là object responsive hoặc number
  const getCardHeight = () => {
    if (typeof cardHeight === 'object') {
      return cardHeight
    }
    return cardHeight
  }

  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0
    }}>
      {products.map((product, idx) => (
        <Box
          key={product.id || idx}
          sx={{
            width: '100%',
            height: '100%',
            flex: 1,
            display: 'flex',
            minWidth: 0,
            minHeight: 0
          }}
        >
          <ProductCard
            product={product}
            showActions
            variant="default"
            onAddToCart={() => {}}
            onToggleFavorite={() => {}}
            isFavorited={false}
          />
        </Box>
      ))}
    </Box>
  )
}
