import { Box } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import ShoppingCart from '@mui/icons-material/ShoppingCart'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import theme from '~/theme'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createCartItem, fetchCart } from '~/redux/cart/cartSlice'
import Grid from '@mui/material/Grid'
import { useState } from 'react'
import { toast } from 'react-toastify'
// import useTranslate from '~/hooks/useTranslate'
import {
  selectCurrentCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart
} from '~/redux/cart/cartSlice'
import ConfirmModal from '~/components/Modals/ComfirmModal/ComfirmModal'

const CardMenu = ({ item, typeBasedIndex }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [addingToCart, setAddingToCart] = useState(false)
  const customerId = useSelector(state => state.customer.currentCustomer?.id ?? null)
  const currentCart = useSelector(selectCurrentCart)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [itemToRemove, setItemToRemove] = useState(null)


  // const translatedTitle = useTranslate(item.title, currentLang)
  // // const translatedDescription = useTranslate(item.description, currentLang)
  // const translatedProtein = t('nutrition.protein')
  // const translatedCarbs = t('nutrition.carbs')
  // const translatedFat = t('nutrition.fat')
  // const translatedCalories = t('nutrition.calories')
  // const translatedVnd = useTranslate('VNĐ', currentLang)
  // const translatedOutOfStock = useTranslate('This item is out of stock', currentLang)
  // const translatedAddedToCart = useTranslate('Added to cart successfully!', currentLang)
  // const translatedFailedToAddToCart = useTranslate('Failed to add to cart', currentLang)

  const handleNavigateToDetail = (slug) => {
    navigate(`/menu/${slug}`)
  }

  const handleAddToCart = async (e) => {
    e.stopPropagation()

    if (addingToCart) return

    // Kiểm tra hết hàng
    if (item.stock === 0) {
      toast.error('This item is out of stock')
      return
    }

    try {
      setAddingToCart(true)

      // Tạo request data theo format API
      const requestData = {
        isCustom: false,
        menuMealId: item.id,
        quantity: 1,
        unitPrice: item.price,
        totalPrice: item.price * 1,
        title: item.title,
        description: item.description,
        image: item.image,
        itemType: 'MENU_MEAL',
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat
      }

      // Gọi redux thunk để add vào cart
      await dispatch(createCartItem({ customerId, itemData: requestData }))
      if (customerId) {
        await dispatch(fetchCart(customerId))
      }
      toast.success('Added to cart successfully!')
    } catch {
      toast.error('Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  const getSizeShort = (type) => {
    switch (type) {
    case 'HIGH': return 'H'
    case 'LOW': return 'L'
    case 'BALANCE': return 'B'
    case 'VEGETARIAN': return 'V'
    default: return ''
    }
  }

  const items = [
    { label: 'Protein', value: `${Math.round(item.protein)}` },
    { label: 'Carbs', value: `${Math.round(item.carbs)}` },
    { label: 'Fat', value: `${Math.round(item.fat)}` }
  ]

  const itemFilter = {
    ...item,
    typeShort: getSizeShort(item.type)
  }

  const label = `${itemFilter.typeShort}${typeBasedIndex || 1}`

  // Tìm cartItem dựa trên menuMealId
  const cartItem = currentCart?.cartItems?.find(cartItem => cartItem.menuMeal?.id === item.id) || null

  // Hàm tăng quantity
  const handleIncrease = async () => {
    if (!cartItem) return
    try {
      await dispatch(increaseQuantity({ customerId, itemId: cartItem.id }))
      if (customerId) {
        await dispatch(fetchCart(customerId))
      }
    } catch {
      toast.error('Failed to add to cart')
    }
  }

  // Hàm giảm quantity (chỉ giảm nếu quantity > 1, nếu =1 thì hiện modal hỏi)
  const handleDecrease = async () => {
    if (!cartItem) return
    if (cartItem.quantity > 1) {
      try {
        await dispatch(decreaseQuantity({ customerId, itemId: cartItem.id }))
        if (customerId) {
          await dispatch(fetchCart(customerId))
        }
      } catch {
        toast.error('Failed to add to cart')
      }
    } else {
      setItemToRemove(cartItem.id)
      setConfirmDialogOpen(true)
    }
  }

  const handleConfirmRemove = async () => {
    if (itemToRemove) {
      try {
        await dispatch(removeFromCart({ customerId, itemId: itemToRemove }))
        if (customerId) {
          await dispatch(fetchCart(customerId))
        }
      } catch {
        toast.error('Failed to add to cart')
      }
    }
    setConfirmDialogOpen(false)
    setItemToRemove(null)
  }

  const handleCancelRemove = () => {
    setConfirmDialogOpen(false)
    setItemToRemove(null)
  }

  // const translatedConfirmTitle = useTranslate('Confirm Remove Item', currentLang)
  // const translatedConfirmDescription = useTranslate('Are you sure you want to remove this item from the cart?', currentLang)
  // const translatedRemoveBtn = useTranslate('Remove', currentLang)

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderRadius: 5,
          overflow: 'hidden',
          transition: 'transform 0.3s ease-in-out',
          backgroundColor: theme.palette.primary.card,
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
          }
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Box
            component="img"
            src={itemFilter.image}
            alt={itemFilter.alt}
            sx={{ objectFit: 'cover', cursor: 'pointer', p: 2, width: '100%', borderRadius: '50%' }}
            onClick={() => handleNavigateToDetail(itemFilter.slug)}
          />
          <Typography variant='h6' sx={{
            fontWeight: 500,
            position: 'absolute',
            height: '40px',
            width: '40px',
            display: { xs: 'flex', md: 'none' },
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '0.9rem',
            borderRadius: '50%',
            top: 10,
            left: 20,
            color: theme.palette.text.primary,
            bgcolor: theme.palette.primary.secondary,
            cursor: 'pointer'
          }} onClick={() => handleNavigateToDetail(itemFilter.slug)}>
            {label}
          </Typography>
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              position: 'absolute',
              bottom: 15,
              left: 0,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              border: '1.5px solid #4C082A',
              borderRadius: '50px',
              fontWeight: 600,
              px: 2,
              py: 0.2,
              color: '#4C082A',
              fontSize: '0.9rem',
              background: 'white'
            }}>
              {item.calories} Calories
            </Box>
          </Box>
        </Box>
        <CardContent sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant='h5' sx={{
              fontWeight: 700,
              mb: 1,
              color: theme.palette.text.primary,
              cursor: 'pointer'
            }} onClick={() => handleNavigateToDetail(itemFilter.slug)}>
              {label}
            </Typography>
            <Box>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid #4C082A',
                borderRadius: '50px',
                fontWeight: 600,
                px: 2,
                py: 0.5,
                color: '#4C082A',
                fontSize: '0.9rem'
              }}>
                {item.calories} Calories
              </Box>
            </Box>
          </Box>
          <Box>
            <Typography
              variant="body2"
              sx={{
                my: 1,
                height: '40px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                whiteSpace: 'normal'
              }}
            >
              {item.title}
            </Typography>
          </Box>
          <Box sx={{ borderBottom: '1.5px dashed' }}></Box>
          <Box sx={{ my: 1 }}>
            <Box>
              <Box>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    justifyItems: 'center',
                    width: '100%',
                    m: 0,
                    '& .MuiGrid-item': {
                      padding: '0 8px',
                      flexBasis: '25%',
                      maxWidth: '25%',
                      flexGrow: 1
                    }
                  }}
                >
                  {items.map((item, index) => (
                    <Grid size={{ xs: 3 }} key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography variant="h7" fontWeight="bold" sx={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.2 }}>
                        {item.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 400, fontSize: '0.75rem' }}>
                        {item.label}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </Box>
          <Box sx={{
            mt: 'auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h6" sx={{
              fontWeight: 800,
              color: theme.palette.text.textSub
            }}>
              {Math.round(itemFilter.price).toLocaleString('en-US')} VND
            </Typography>
            {cartItem ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  onClick={handleDecrease}
                  sx={{
                    color: theme.palette.primary.secondary,
                    '&:hover': {
                      bgcolor: theme.palette.primary.secondary,
                      color: 'white'
                    }
                  }}
                >
                  <RemoveIcon fontSize="medium" />
                </IconButton>
                <Typography variant="body1" sx={{ mx: 1, fontWeight: 600 }}>
                  {cartItem.quantity}
                </Typography>
                <IconButton
                  onClick={handleIncrease}
                  sx={{
                    color: theme.palette.primary.secondary,
                    '&:hover': {
                      bgcolor: theme.palette.primary.secondary,
                      color: 'white'
                    }
                  }}
                >
                  <AddIcon fontSize="medium" />
                </IconButton>
              </Box>
            ) : (
              <IconButton
                onClick={handleAddToCart}
                disabled={addingToCart}
                sx={{
                  color: theme.palette.primary.secondary,
                  '&:hover': {
                    bgcolor: theme.palette.primary.secondary,
                    color: 'white'
                  },
                  '&:disabled': {
                    color: theme.palette.grey[400]
                  }
                }}
              >
                <ShoppingCart fontSize="medium" />
              </IconButton>
            )}
          </Box>
        </CardContent>
      </Card>
      <ConfirmModal
        open={confirmDialogOpen}
        onClose={handleCancelRemove}
        onConfirm={handleConfirmRemove}
        title="Confirm Remove Item"
        description="Are you sure you want to remove this item from the cart?"
        btnName="Remove"
      />
    </>
  )
}

export default CardMenu