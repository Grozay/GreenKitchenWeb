import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import theme from '~/theme'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import Typography from '@mui/material/Typography'
import CartItem from './CartItem/CartItem'
import CartSummary from '../CartSummary/CartSummary'
import { useSelector } from 'react-redux'

const ListItemCart = ( { cartItems, updateQuantity, removeItem, totalNutrition, calculateItemNutrition }) => {
  const navigate = useNavigate()
  const totalPrice = useSelector(state => state.order.totalPrice)
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
              Giỏ mua hàng
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Cart Items */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ px: 2 }}>
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                  calculateItemNutrition={calculateItemNutrition}
                />
              ))}
            </Box>
          </Grid>

          {/* Cart Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ px: 2, position: 'sticky', top: `calc(${theme.fitbowl.appBarHeight} + 20px)` }}>
              <CartSummary
                totalPrice={totalPrice}
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
