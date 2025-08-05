import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import theme from '~/theme'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import Typography from '@mui/material/Typography'
import CartItem from './CartItem/CartItem'
import CartSummary from '../CartSummary/CartSummary'

const ListItemCart = ({
  cartItems,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  totalNutrition,
  calculateItemNutrition
}) => {
  const navigate = useNavigate()

  return (
    <Box>
      <Box>
        {/* Cart Header */}
        <Box sx={{
          borderRadius: 3,
          mx: 2,
          mb: 3,
          overflow: 'hidden'
        }}>
          <Box sx={{
            color: theme.palette.primary.main,
            px: 3,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <ShoppingCartIcon />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Giỏ mua hàng ({cartItems?.length || 0} sản phẩm)
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Cart Items */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ px: 2 }}>
              {cartItems?.length > 0 ? (
                cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onIncreaseQuantity={increaseQuantity} // Pass hàm tăng
                    onDecreaseQuantity={decreaseQuantity} // Pass hàm giảm
                    onRemove={removeItem}
                    calculateItemNutrition={calculateItemNutrition}
                  />
                ))
              ) : (
                <Box sx={{
                  textAlign: 'center',
                  py: 8,
                  color: 'text.secondary'
                }}>
                  <ShoppingCartIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                  <Typography variant="h6">
                    Giỏ hàng của bạn đang trống
                  </Typography>
                  <Typography variant="body2">
                    Hãy thêm sản phẩm vào giỏ hàng để tiếp tục
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Cart Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ px: 2, position: 'sticky', top: `calc(${theme.fitbowl.appBarHeight} + 20px)` }}>
              <CartSummary
                totalNutrition={totalNutrition}
                itemCount={cartItems?.length || 0}
                navigate={navigate}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default ListItemCart
