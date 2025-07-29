import { Box, Typography, Grid, Button, IconButton, Avatar, AvatarGroup } from '@mui/material'
import AppBar from '~/components/AppBar/AppBar'
import Footer from '~/components/Footer/Footer'
import theme from '~/theme'
import { itemCart } from '~/apis/mockData'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteIcon from '@mui/icons-material/Delete'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Cart = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState(itemCart)

  const handleBackToMenu = () => {
    navigate('/menu')
  }

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      setCartItems(cartItems.filter(item => item.id !== itemId))
    } else {
      setCartItems(cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ))
    }
  }

  const removeItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId))
  }

  const calculateItemNutrition = (item) => {
    const mealItem = item.mealItem
    let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0

    Object.values(mealItem).forEach(category => {
      if (Array.isArray(category)) {
        category.forEach(food => {
          totalCalories += food.calories
          totalProtein += food.protein
          totalCarbs += food.carbs
          totalFat += food.fat
        })
      }
    })

    return {
      calories: totalCalories * item.quantity,
      protein: totalProtein * item.quantity,
      carbs: totalCarbs * item.quantity,
      fat: totalFat * item.quantity
    }
  }

  const calculateTotalNutrition = () => {
    let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0, totalPrice = 0

    cartItems.forEach(item => {
      const nutrition = calculateItemNutrition(item)
      totalCalories += nutrition.calories
      totalProtein += nutrition.protein
      totalCarbs += nutrition.carbs
      totalFat += nutrition.fat
      totalPrice += item.totalPrice * item.quantity
    })

    return { totalCalories, totalProtein, totalCarbs, totalFat, totalPrice }
  }

  const clearAllItems = () => {
    setCartItems([])
  }

  const CartSummary = ({ totalCalories, totalProtein, totalCarbs, totalFat, totalPrice }) => {
    const nutritionItems = [
      { label: 'Calories', value: `${Math.round(totalCalories)}` },
      { label: 'Protein', value: `${Math.round(totalProtein)}g` },
      { label: 'Carbs', value: `${Math.round(totalCarbs)}g` },
      { label: 'Fat', value: `${Math.round(totalFat)}g` }
    ]

    return (
      <Box sx={{
        p: 3,
        bgcolor: 'rgba(0, 0, 0, 0.10)',
        borderRadius: 5
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" color="text.primary">
            Cart Summary
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={clearAllItems}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              fontSize: '0.8rem',
              borderColor: 'error.main',
              color: 'error.main',
              '&:hover': {
                borderColor: 'error.dark',
                bgcolor: 'error.light'
              }
            }}
          >
            Clear All
          </Button>
        </Box>

        {/* Cart Items List */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.primary" sx={{ mb: 1, fontWeight: 500 }}>
            Items in Cart:
          </Typography>
          {cartItems.map((item) => {
            const itemNutrition = calculateItemNutrition(item)
            return (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  py: 1,
                  px: 2,
                  mb: 1,
                  bgcolor: 'white',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'grey.200'
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight="500" color="text.primary">
                    Bowl #{item.id} (x{item.quantity})
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {Math.round(itemNutrition.calories)} cal
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" fontWeight="bold" color="primary.main">
                    ${(item.totalPrice * item.quantity).toLocaleString()}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => removeItem(item.id)}
                    sx={{
                      color: 'error.main',
                      '&:hover': { bgcolor: 'error.light' }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            )
          })}
        </Box>

        <Box sx={{ borderBottom: '1.5px dashed', my: 2 }}></Box>

        <Box>
          <Typography variant="body2" gutterBottom color="text.primary" sx={{ textAlign: 'center', my: 2 }}>
            Total Nutrition
          </Typography>
        </Box>

        <Grid
          container
          spacing={2}
          sx={{
            textAlign: 'center',
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
          {nutritionItems.map((item, index) => (
            <Grid size={{ xs: 3 }} key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h5" fontWeight="bold" sx={{ fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.2 }}>
                {item.value}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, fontWeight: 400, fontSize: '0.75rem' }}>
                {item.label}
              </Typography>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ borderBottom: '1.5px dashed', my: 2 }}></Box>

        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            ${totalPrice.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Price ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
          </Typography>
        </Box>

        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 2,
            borderRadius: 5,
            py: 1.5,
            fontSize: '1.1rem',
            textTransform: 'none'
          }}
        >
          Proceed to Checkout
        </Button>

        <Button
          fullWidth
          variant="outlined"
          onClick={handleBackToMenu}
          sx={{
            mt: 1,
            borderRadius: 5,
            py: 1,
            fontSize: '1rem',
            textTransform: 'none'
          }}
        >
          Continue Shopping
        </Button>
      </Box>
    )
  }

  const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
    const nutrition = calculateItemNutrition(item)
    const nutritionItems = [
      { label: 'Calories', value: `${Math.round(nutrition.calories)}` },
      { label: 'Protein', value: `${Math.round(nutrition.protein)}g` },
      { label: 'Carbs', value: `${Math.round(nutrition.carbs)}g` },
      { label: 'Fat', value: `${Math.round(nutrition.fat)}g` }
    ]

    // Get all food items for display
    const allFoodItems = []
    Object.values(item.mealItem).forEach(category => {
      if (Array.isArray(category)) {
        allFoodItems.push(...category)
      }
    })

    return (
      <Box sx={{
        bgcolor: 'white',
        borderRadius: 5,
        p: 3,
        mb: 2,
        border: '1px solid',
        borderColor: 'grey.200',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderColor: 'primary.light'
        }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
              Custom Bowl #{item.id}
            </Typography>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #4C082A',
              borderRadius: '50px',
              px: 2,
              py: 0.5,
              color: '#4C082A',
              fontSize: '0.8rem',
              mt: 1,
              width: 'fit-content'
            }}>
              {Math.round(nutrition.calories / item.quantity)} CALORIES PER BOWL
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mb: 0.5 }}>
              ${(item.totalPrice * item.quantity).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ${item.totalPrice} each
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
          <AvatarGroup
            max={5}
            sx={{
              '& .MuiAvatar-root': {
                width: { xs: '65px', sm: '60px', md: '50px' },
                height: { xs: '65px', sm: '60px', md: '50px' },
                border: '2px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              },
              my: 1,
              justifyContent: 'center'
            }}
          >
            {allFoodItems.map((food, index) => (
              <Avatar key={index} alt={food.title} src={food.image} />
            ))}
          </AvatarGroup>
        </Box>

        <Box>
          <Typography variant="body2" gutterBottom color="text.primary"
            sx={{
              textAlign: 'center',
              my: 2,
              minHeight: '40px',
              fontWeight: 500
            }}>
            {allFoodItems.map(food => food.title).join(', ')}
          </Typography>
        </Box>

        <Box sx={{ borderBottom: '1.5px dashed', my: 2 }}></Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.primary" sx={{ textAlign: 'center', mb: 1, fontWeight: 500 }}>
            Nutrition per serving (x{item.quantity})
          </Typography>
        </Box>

        <Grid
          container
          spacing={2}
          sx={{
            textAlign: 'center',
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
          {nutritionItems.map((nutritionItem, index) => (
            <Grid size={{ xs: 3 }} key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h7" fontWeight="bold" sx={{ fontSize: '1rem', fontWeight: 500, lineHeight: 1.2 }}>
                {nutritionItem.value}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 400, fontSize: '0.75rem' }}>
                {nutritionItem.label}
              </Typography>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ borderBottom: '1.5px dashed', my: 2 }}></Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              Quantity:
            </Typography>
            <IconButton
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              size="small"
              sx={{
                bgcolor: 'grey.100',
                '&:hover': { bgcolor: 'grey.200' },
                border: '1px solid',
                borderColor: 'grey.300'
              }}
            >
              <RemoveIcon />
            </IconButton>
            <Typography variant="h6" sx={{ mx: 2, minWidth: '30px', textAlign: 'center', fontWeight: 600 }}>
              {item.quantity}
            </Typography>
            <IconButton
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              size="small"
              sx={{
                bgcolor: 'primary.light',
                color: 'white',
                '&:hover': { bgcolor: 'primary.main' },
                border: '1px solid',
                borderColor: 'primary.main'
              }}
            >
              <AddIcon />
            </IconButton>
          </Box>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => onRemove(item.id)}
            startIcon={<DeleteIcon />}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              '&:hover': {
                bgcolor: 'error.light'
              }
            }}
          >
            Remove
          </Button>
        </Box>
      </Box>
    )
  }

  const totalNutrition = calculateTotalNutrition()

  return (
    <Box>
      <AppBar />
      <Box sx={{ mt: theme.fitbowl.appBarHeight }}>
        <Box sx={{ mx: 2 }}>
          <Box sx={{ pt: 2, pb: 1, ml: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToMenu}
              sx={{ borderRadius: 5, color: theme.palette.text.primary }}
              aria-label="Back to Menu"
            >
              Back to Menu
            </Button>
          </Box>

          {cartItems.length === 0 ? (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
              textAlign: 'center',
              bgcolor: 'rgba(0, 0, 0, 0.05)',
              borderRadius: 5,
              mx: 2,
              p: 4
            }}>
              <Box sx={{
                bgcolor: 'white',
                borderRadius: '50%',
                p: 3,
                mb: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}>
                <Typography variant="h1" sx={{ fontSize: '4rem', opacity: 0.3 }}>
                  🛒
                </Typography>
              </Box>
              <Typography variant="h4" gutterBottom color="text.primary" sx={{ fontWeight: 600 }}>
                Your cart is empty
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '400px' }}>
                Looks like you haven&apos;t added any delicious bowls to your cart yet. Start building your perfect meal!
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
                  Browse Menu
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
                  Get Suggestions
                </Button>
              </Box>
            </Box>
          ) : (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{
                  p: 2,
                  position: 'sticky',
                  top: theme.fitbowl.appBarHeight,
                  left: 0,
                  right: 0,
                  zIndex: 20,
                  width: '100%',
                  marginTop: 'auto'
                }}>
                  <CartSummary {...totalNutrition} />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 8 }}>
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h4" color="text.primary" sx={{ fontWeight: 600 }}>
                      Your Cart
                    </Typography>
                    <Box sx={{
                      bgcolor: 'primary.light',
                      color: 'white',
                      px: 2,
                      py: 0.5,
                      borderRadius: 3,
                      fontSize: '0.9rem',
                      fontWeight: 500
                    }}>
                      {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                    </Box>
                  </Box>
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>
      <Footer />
    </Box>
  )
}

export default Cart
