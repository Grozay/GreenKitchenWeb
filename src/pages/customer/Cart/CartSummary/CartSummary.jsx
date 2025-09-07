import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { useSelector } from 'react-redux'
import { selectCurrentCart } from '~/redux/cart/cartSlice'
import theme from '~/theme'
import { useTranslation } from 'react-i18next'

const CartSummary = ({ totalNutrition, itemCount, navigate }) => {
  const currentCart = useSelector(selectCurrentCart)
  const totalPrice = currentCart?.totalAmount || 0
  const { t } = useTranslation()

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
        {t('cart.summaryTitle')}
      </Typography>
      {/* Item Count */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {t('cart.itemCount')} ({itemCount})
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {totalPrice?.toFixed(2) || '0.00'} VNĐ
        </Typography>
      </Box>

      {/* Nutrition Summary */}
      {totalNutrition && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            {t('cart.totalNutrition')}
          </Typography>

          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">{t('cart.energy')}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {Math.round(totalNutrition.calories)} kcal
              </Typography>
            </Box>
            <Divider sx={{ my: 0.5 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
              <Typography variant="body2" color="text.secondary">{t('cart.protein')}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {Math.round(totalNutrition.protein)} g
              </Typography>
            </Box>
            <Divider sx={{ my: 0.5 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
              <Typography variant="body2" color="text.secondary">{t('cart.carbs')}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {Math.round(totalNutrition.carbs)} g
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
              <Typography variant="body2" color="text.secondary">{t('cart.fat')}</Typography>
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
          {t('cart.total')}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {totalPrice?.toFixed(2) || '0.00'} VNĐ
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
        {t('cart.checkout')}
      </Button>
    </Box>
  )
}

export default CartSummary