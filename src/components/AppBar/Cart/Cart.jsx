import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import theme from '~/theme'
import Badge from '@mui/material/Badge'
import { styled } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  fetchCart,
  removeFromCart,
  selectCurrentCart
} from '~/redux/cart/cartSlice'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import Divider from '@mui/material/Divider'
import ConfirmModal from '~/components/Modals/ComfirmModal/ComfirmModal'
import useTranslate from '~/hooks/useTranslate'
import { selectCurrentLanguage } from '~/redux/translations/translationsSlice'

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.primary.secondary,
    color: theme.palette.primary.contrastText
  }
}))

// Component nhỏ cho từng item để gọi useTranslate ở top level
const CartItem = ({ item, currentLang, onItemClick, onRemoveItem }) => {
  const translatedItemTitle = useTranslate(item.title || '', currentLang)
  const translatedQuantity = useTranslate('Quantity:', currentLang)
  const translatedVND = useTranslate('VND', currentLang)

  return (
    <MenuItem
      key={item.menuMealId || item.customMealId}
      onClick={onItemClick}
      sx={{
        px: 2,
        py: 1.5,
        display: 'block',
        '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
        minHeight: 'auto',
        cursor: 'pointer'
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', position: 'relative' }}>
        {/* Remove button */}
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation()
            onRemoveItem(item.menuMealId || item.customMealId || item.id)
          }}
          sx={{
            position: 'absolute',
            top: -8,
            right: -8,
            backgroundColor: 'rgba(0,0,0,0.1)',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.2)' },
            width: 24,
            height: 24,
            zIndex: 1
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Avatar
          src={item.image}
          alt={translatedItemTitle}
          sx={{ width: 60, height: 60, borderRadius: 1, flexShrink: 0 }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{
            fontWeight: 500,
            mb: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {translatedItemTitle}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
            {item.totalPrice.toLocaleString()} {translatedVND}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {translatedQuantity}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {item.quantity}
            </Typography>
          </Box>
        </Box>
      </Box>
    </MenuItem>
  )
}

const Cart = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [itemToRemove, setItemToRemove] = useState(null)
  const customerId = useSelector(state => state.customer.currentCustomer?.id ?? null)
  // const customerId = 1

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentLang = useSelector(selectCurrentLanguage)

  // Redux selectors
  const currentCart = useSelector(selectCurrentCart)

  useEffect(() => {
    if (customerId) {
      dispatch(fetchCart(customerId))
    }
  }, [customerId, dispatch])

  // Lấy các giá trị từ currentCart
  const totalItems = currentCart?.totalItems || 0
  const cartItems = currentCart?.cartItems || []
  const totalAmount = currentCart?.totalAmount || 0

  const lastFetchRef = useRef(0)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
    const now = Date.now()
    if (customerId && now - lastFetchRef.current > 3000) {
      lastFetchRef.current = now
      dispatch(fetchCart(customerId))
    }
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleViewCart = () => {
    setAnchorEl(null)
    navigate('/cart')
  }

  const handleItemClick = () => {
    setAnchorEl(null)
    navigate('/cart')
  }

  const handleRemoveItem = (cartItemId) => {
    setItemToRemove(cartItemId)
    setConfirmDialogOpen(true)
  }

  const handleConfirmRemove = async () => {
    if (itemToRemove) {
      await dispatch(removeFromCart({ customerId, itemId: itemToRemove }))
    }
    if (customerId) {
      await dispatch(fetchCart(customerId))
    }
    setConfirmDialogOpen(false)
    setItemToRemove(null)
  }

  const handleCancelRemove = () => {
    setConfirmDialogOpen(false)
    setItemToRemove(null)
  }

  // Dịch tự động cho các chuỗi
  const translatedCart = useTranslate('Cart', currentLang)
  const translatedViewCart = useTranslate('VIEW CART', currentLang)
  const translatedEmptyCart = useTranslate('Your cart is empty', currentLang)
  const translatedProducts = useTranslate('PRODUCTS', currentLang)
  const translatedTotal = useTranslate('TOTAL:', currentLang)
  const translatedCheckout = useTranslate('CHECKOUT', currentLang)
  const translatedVND = useTranslate('VND', currentLang)

  // Dịch cho ConfirmModal
  const translatedConfirmTitle = useTranslate('Confirm Remove Item', currentLang)
  const translatedConfirmDescription = useTranslate('Are you sure you want to remove this item from the cart?', currentLang)
  const translatedRemoveBtn = useTranslate('Remove', currentLang)

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title={translatedCart}>
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={anchorEl ? 'cart-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={anchorEl ? 'true' : undefined}
          >
            <StyledBadge badgeContent={totalItems} color="secondary">
              <ShoppingCartIcon sx={{ color: theme.palette.primary.main }} />
            </StyledBadge>
          </IconButton>
        </Tooltip>
      </Box>

      <Menu
        anchorEl={anchorEl}
        id="cart-menu"
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              width: 320,
              maxHeight: 490,
              borderRadius: 3,
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0
              }
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Header */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 1,
          borderBottom: '1px solid #e0e0e0'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {totalItems} {translatedProducts}
          </Typography>
          <Button
            variant="text"
            onClick={handleViewCart}
            sx={{
              color: theme.palette.primary.main,
              fontSize: '0.875rem',
              fontWeight: 500
            }}
          >
            {translatedViewCart}
          </Button>
        </Box>

        {/* Cart Items */}
        {totalItems === 0 ? (
          <Box sx={{ px: 2, py: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {translatedEmptyCart}
            </Typography>
          </Box>
        ) : (
          <Box sx={{
            maxHeight: 240,
            overflowY: 'auto',
            overflowX: 'hidden',
            '&::-webkit-scrollbar': {
              width: '6px'
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(0,0,0,0.1)',
              borderRadius: '3px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: '3px',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.5)'
              }
            }
          }}>
            {cartItems.map((item) => (
              <CartItem
                key={item.menuMealId || item.customMealId}
                item={item}
                currentLang={currentLang}
                onItemClick={handleItemClick}
                onRemoveItem={handleRemoveItem}
              />
            ))}
          </Box>
        )}

        <Divider />

        {/* Total */}
        {totalItems > 0 && (
          <Box sx={{
            px: 2,
            py: 1.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {translatedTotal}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {totalAmount.toLocaleString()} {translatedVND}
            </Typography>
          </Box>
        )}

        {/* Checkout Button */}
        {totalItems > 0 && (
          <Box sx={{ px: 2, pb: 2 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleViewCart}
              sx={{
                backgroundColor: theme.palette.primary.secondary,
                borderRadius: 3,
                color: 'white',
                py: 1.5,
                fontSize: '0.875rem',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark
                }
              }}
            >
              {translatedCheckout}
            </Button>
          </Box>
        )}
      </Menu>

      {/* Confirmation Dialog */}
      <ConfirmModal
        open={confirmDialogOpen}
        onClose={handleCancelRemove}
        onConfirm={handleConfirmRemove}
        title={translatedConfirmTitle}
        description={translatedConfirmDescription}
        btnName={translatedRemoveBtn}
      />
    </>
  )
}

export default Cart