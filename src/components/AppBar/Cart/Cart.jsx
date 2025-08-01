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
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectCartItems, selectCartTotalQuantity, selectCartTotalPrice, removeFromCart } from '~/redux/order/orderSlice'
import { Typography, Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    backgroundColor: theme.palette.primary.secondary,
    color: theme.palette.primary.contrastText,
    padding: '0 4px'
  }
}))

const Cart = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [itemToRemove, setItemToRemove] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Redux selectors
  const cartItems = useSelector(selectCartItems)
  const totalQuantity = useSelector(selectCartTotalQuantity)
  const totalPrice = useSelector(selectCartTotalPrice)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
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

  const handleRemoveItem = (cartId) => {
    setItemToRemove(cartId)
    setConfirmDialogOpen(true)
  }

  const handleConfirmRemove = () => {
    if (itemToRemove) {
      dispatch(removeFromCart(itemToRemove))
    }
    setConfirmDialogOpen(false)
    setItemToRemove(null)
  }

  const handleCancelRemove = () => {
    setConfirmDialogOpen(false)
    setItemToRemove(null)
  }

  const getProductTitle = (item) => {
    return item.title || `Menu Item ${item.id}`
  }

  const getProductImage = (item) => {
    if (item.isCustom && item.mealItem) {
      // Get first available image from custom meal items
      const allItems = Object.values(item.mealItem).flat()
      return allItems[0]?.image || 'https://res.cloudinary.com/quyendev/image/upload/v1753600162/lkxear2dns4tpnjzntny.png'
    }
    return item.image || 'https://res.cloudinary.com/quyendev/image/upload/v1753600162/lkxear2dns4tpnjzntny.png'
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Cart">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={anchorEl ? 'cart-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={anchorEl ? 'true' : undefined}
          >
            <StyledBadge badgeContent={totalQuantity}>
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
            {totalQuantity} SẢN PHẨM
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
            VIEW CART
          </Button>
        </Box>

        {/* Cart Items */}
        {cartItems.length === 0 ? (
          <Box sx={{ px: 2, py: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Giỏ hàng của bạn đang trống
            </Typography>
          </Box>
        ) : (
          <Box sx={{
            maxHeight: 240, // Chiều cao hiển thị khoảng 3 items (mỗi item ~80px)
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
              <MenuItem
                key={item.cartId}
                onClick={handleItemClick}
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
                      e.stopPropagation() // Ngăn không cho event bubble up đến MenuItem
                      handleRemoveItem(item.cartId)
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
                    src={getProductImage(item)}
                    alt={getProductTitle(item)}
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
                      {getProductTitle(item)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                      {item.totalPrice.toLocaleString()} $
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Số lượng:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {item.quantity}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Box>
        )}

        <Divider />

        {/* Total */}
        {cartItems.length > 0 && (
          <Box sx={{
            px: 2,
            py: 1.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              TỔNG TIỀN:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {totalPrice.toLocaleString()} $
            </Typography>
          </Box>
        )}

        {/* Checkout Button */}
        {cartItems.length > 0 && (
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
              ĐI ĐẾN THANH TOÁN
            </Button>
          </Box>
        )}
      </Menu>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancelRemove}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 600 }}>
          Xác nhận xóa sản phẩm
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 2 }}>
          <Typography>
            Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
          <Button
            onClick={handleCancelRemove}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmRemove}
            variant="contained"
            color="error"
            sx={{ minWidth: 100 }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Cart