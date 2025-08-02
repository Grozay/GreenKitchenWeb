import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const CartEmpty = () => {
  const navigate = useNavigate()

  const handleBackToMenu = () => {
    navigate('/menu')
  }
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      borderRadius: 5,
      mx: 2,
      p: 4
    }}>
      <Box sx={{
        bgcolor: 'white',
        borderRadius: '50%',
        p: 3,
        mb: 3
      }}>
        <Typography variant="h1" sx={{ fontSize: '4rem', opacity: 0.3 }}>
          🛒
        </Typography>
      </Box>
      <Typography variant="h4" gutterBottom color="text.primary" sx={{ fontWeight: 600 }}>
        Giỏ hàng của bạn đang trống
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '400px' }}>
        Có vẻ như bạn chưa thêm món ăn ngon nào vào giỏ hàng. Hãy bắt đầu khám phá thực đơn của chúng tôi!
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button
          variant="contained"
          onClick={handleBackToMenu}
          sx={{
            borderRadius: 5,
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            textTransform: 'none'
          }}
        >
          Xem Thực Đơn
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/calo-calculator')}
          sx={{
            borderRadius: 5,
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            textTransform: 'none'
          }}
        >
          Tính Calo
        </Button>
      </Box>
    </Box>
  )
}

export default CartEmpty
