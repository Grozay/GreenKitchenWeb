import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { useSelector } from 'react-redux'
import { selectTotalAmount } from '~/redux/cart/cartSlice' // Import từ cart slice
import theme from '~/theme'

const CartSummary = ({ totalNutrition, itemCount, navigate }) => {
  // Lấy totalAmount từ Redux cart slice thay vì prop
  const totalPrice = useSelector(selectTotalAmount)

  const handleCheckout = () => {
    navigate('/checkout')
  }

  return (
    <Box sx={{
      bgcolor: 'background.paper',
      borderRadius: 3,
      p: 3,
      mb: 2,
      boxShadow: 1
    }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        TÓM TẮT
      </Typography>
      {/* Item Count */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Số lượng sản phẩm ({itemCount})
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {totalPrice?.toFixed(2) || '0.00'} $
        </Typography>
      </Box>

      {/* Nutrition Summary */}
      {totalNutrition && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Tổng hợp dinh dưỡng
          </Typography>

          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Năng lượng</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {Math.round(totalNutrition.calories)} kcal
              </Typography>
            </Box>
            <Divider sx={{ my: 0.5 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
              <Typography variant="body2" color="text.secondary">Đạm</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {Math.round(totalNutrition.protein)} g
              </Typography>
            </Box>
            <Divider sx={{ my: 0.5 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
              <Typography variant="body2" color="text.secondary">Carb</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {Math.round(totalNutrition.carbs)} g
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
              <Typography variant="body2" color="text.secondary">Béo</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {Math.round(totalNutrition.fat)} g
              </Typography>
            </Box>
          </Box>
        </>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Total */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Tổng cộng
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {totalPrice?.toFixed(2) || '0.00'} $
        </Typography>
      </Box>

      {/* Checkout Button */}
      <Button
        fullWidth
        variant="contained"
        onClick={handleCheckout}
        disabled={!itemCount || itemCount === 0}
        sx={{
          backgroundColor: theme.palette.primary.secondary,
          borderRadius: 3,
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 600,
          '&:hover': {
            backgroundColor: theme.palette.primary.main
          },
          '&:disabled': {
            backgroundColor: theme.palette.grey[300]
          }
        }}
      >
        TIẾN HÀNH THANH TOÁN
      </Button>
    </Box>
  )
}

export default CartSummary