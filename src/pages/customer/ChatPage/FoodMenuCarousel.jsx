import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ProductCard from './ProductCard'
import { useState } from 'react'

export default function FoodMenuCarousel({ products, onSelect }) {
  // Carousel logic: hiển thị 1 trên mobile, 2-3 trên desktop
  const [page, setPage] = useState(0)
  const itemsPerPage = window.innerWidth < 600 ? 1 : 3
  const maxPage = Math.ceil(products.length / itemsPerPage) - 1

  const handlePrev = () => setPage(p => Math.max(0, p - 1))
  const handleNext = () => setPage(p => Math.min(maxPage, p + 1))

  const visibleProducts = products.slice(page * itemsPerPage, (page + 1) * itemsPerPage)

  return (
    <Box sx={{
      bgcolor: '#fffbe6',
      borderRadius: 4,
      p: 2,
      boxShadow: 3,
      mb: 2,
      maxWidth: 900,
      mx: 'auto'
    }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <Typography variant="h6" fontWeight={700} color="primary">
          Food suggestions for you
        </Typography>
        {/* Cá nhân hóa */}
        <Chip label="Vegetarian" color="success" sx={{ fontWeight: 500 }} />
        <Chip label="Low carb" color="info" sx={{ fontWeight: 500 }} />
      </Stack>
      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={handlePrev}
          disabled={page === 0}
          sx={{
            position: 'absolute', left: -40, top: '50%', transform: 'translateY(-50%)',
            bgcolor: 'white', boxShadow: 2, zIndex: 2, display: { xs: 'none', sm: 'flex' }
          }}
        >
          <ArrowBackIosIcon />
        </IconButton>
        <Grid container spacing={2} sx={{ overflowX: 'auto', flexWrap: 'nowrap' }}>
          {visibleProducts.map((product, idx) => (
            <Grid item xs={12} sm={6} md={4} key={product.id || idx} sx={{ minWidth: 260 }}>
              <ProductCard
                product={product}
                showActions
                onAddToCart={() => onSelect(product)}
                onToggleFavorite={() => {}}
                isFavorited={false}
                variant="featured"
              />
            </Grid>
          ))}
        </Grid>
        <IconButton
          onClick={handleNext}
          disabled={page === maxPage}
          sx={{
            position: 'absolute', right: -40, top: '50%', transform: 'translateY(-50%)',
            bgcolor: 'white', boxShadow: 2, zIndex: 2, display: { xs: 'none', sm: 'flex' }
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
      <Stack direction="row" justifyContent="center" mt={2} spacing={2}>
        <Button variant="contained" color="primary" sx={{ borderRadius: 3 }}>
          View all dishes
        </Button>
      </Stack>
    </Box>
  )
}
