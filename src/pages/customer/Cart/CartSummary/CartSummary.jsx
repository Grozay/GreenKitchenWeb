import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'

const CartSummary = ({ totalPrice, navigate }) => {
  // const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(0)

  const subtotal = totalPrice || 0
  const shippingCost = 0
  const finalTotal = subtotal - appliedDiscount + shippingCost

  // const handleApplyDiscount = () => {
  //   if (discountCode === 'GREENKITCHEN10') {
  //     setAppliedDiscount(subtotal * 0.1)
  //   } else {
  //     setAppliedDiscount(0)
  //   }
  // }

  return (
    <Box sx={{
      bgcolor: 'white',
      borderRadius: 5,
      border: '1px solid #e0e0e0',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Box sx={{
        bgcolor: '#f8f9fa',
        px: 3,
        py: 2,
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c2c2c' }}>
          TÓM TẮT
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        {/* Ước tính vận chuyển và thuế */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: '#2c2c2c' }}>
            Ước tính vận chuyển và thuế
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Tổng tiền
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {subtotal.toLocaleString()} $
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Vận chuyển (Phí giao hàng)
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#4caf50' }}>
              {shippingCost === 0 ? 'Miễn phí' : `${shippingCost.toLocaleString()} $`}
            </Typography>
          </Box>

          {appliedDiscount > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Giảm giá
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#f44336' }}>
                -{appliedDiscount.toLocaleString()} $
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Tổng đơn đặt hàng */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700}}>
              Tổng đơn đặt hàng
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#2c2c2c' }}>
              {finalTotal.toLocaleString()} $
            </Typography>
          </Box>
        </Box>


        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate('/checkout')}
          sx={{
            bgcolor: '#2c2c2c',
            color: 'white',
            py: 2,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            '&:hover': {
              bgcolor: '#1a1a1a'
            }
          }}
        >
          TIẾN HÀNH THANH TOÁN
          <Box component="span" sx={{ ml: 'auto' }}>
            →
          </Box>
        </Button>

        {/* <Button
          variant="text"
          fullWidth
          sx={{
            mt: 2,
            color: '#4caf50',
            textTransform: 'none',
            fontSize: '0.9rem',
            textDecoration: 'underline'
          }}
        >
          Thanh toán với nhiều địa chỉ
        </Button> */}
      </Box>
    </Box>
  )
}

export default CartSummary