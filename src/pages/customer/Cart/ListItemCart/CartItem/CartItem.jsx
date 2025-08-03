import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import Grid from '@mui/material/Grid'

const CartItem = ({ item, onUpdateQuantity, onRemove, calculateItemNutrition }) => {
  const nutrition = calculateItemNutrition(item)

  const allFoodItems = []
  Object.values(item.mealItem).forEach(category => {
    if (Array.isArray(category)) {
      allFoodItems.push(...category)
    }
  })

  const getProductTitle = () => {
    if (item.isCustom) {
      return item.title || `Custom Bowl ${item.cartId}`
    } else {
      const menuItem = allFoodItems[0]
      return menuItem?.title || item.title || `Menu Item ${item.cartId}`
    }
  }

  const items = [
    { label: 'Calories', value: `${Math.round(nutrition.calories)}` },
    { label: 'Protein', value: `${Math.round(nutrition.protein)}` },
    { label: 'Carbs', value: `${Math.round(nutrition.carbs)}` },
    { label: 'Fat', value: `${Math.round(nutrition.fat)}` }
  ]

  const mainProduct = allFoodItems[0] || {}

  return (
    <Box sx={{
      bgcolor: 'white',
      borderRadius: 5,
      border: '1px solid #e0e0e0',
      mb: 2,
      overflow: 'hidden'
    }}>
      <Box sx={{
        p: { xs: 2, md: 3 }
      }}>
        <Box sx={{
          display: 'flex',
          gap: { xs: 2, md: 5 },
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          {/* Product Image */}
          <Box sx={{
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: { xs: 'center', sm: 'flex-start' }
          }}>
            <Avatar
              src={mainProduct.image || 'https://res.cloudinary.com/quyendev/image/upload/v1753600162/lkxear2dns4tpnjzntny.png'}
              alt={mainProduct.title || `Món ăn ${item.cartId}`}
              sx={{
                width: { xs: 100, md: 120 },
                height: { xs: 100, md: 120 },
                borderRadius: '50%'
              }}
            />
          </Box>

          {/* Product Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' } }}>
              <Box>
                <Typography variant="h6" sx={{
                  fontWeight: 600,
                  mb: 1,
                  color: '#2c2c2c',
                  fontSize: { xs: '1rem', md: '1.25rem' }
                }}>
                  {getProductTitle()}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                  <Typography variant="h6" sx={{
                    fontWeight: 700,
                    color: '#2c2c2c',
                    fontSize: { xs: '1.1rem', md: '1.25rem' }
                  }}>
                    {(item.totalPrice * item.quantity).toLocaleString()} $
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{
                    textDecoration: 'line-through',
                    fontSize: { xs: '0.8rem', md: '0.875rem' }
                  }}>
                    {(item.totalPrice * item.quantity * 1.2).toLocaleString()} $
                  </Typography>
                </Box>
              </Box>
              {/* Quantity and Actions */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    onClick={() => onUpdateQuantity(item.cartId, item.quantity - 1)}
                    size="small"
                    sx={{
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      width: 32,
                      height: 32,
                      '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>

                  <Typography variant="h6" sx={{
                    mx: 2,
                    minWidth: '30px',
                    textAlign: 'center',
                    fontWeight: 600,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    px: 2,
                    py: 0.5
                  }}>
                    {item.quantity}
                  </Typography>

                  <IconButton
                    onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
                    size="small"
                    sx={{
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      width: 32,
                      height: 32,
                      '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Box sx={{ ml: { xs: 0, sm: 4 }, mb: { xs: 2, sm: 0 } }}>
                  <IconButton
                    onClick={() => onRemove(item.cartId)}
                    size="small"
                    sx={{
                      color: '#666',
                      '&:hover': { color: '#f44336', bgcolor: '#ffebee' }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Box>


            {/* Additional Info */}
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
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default CartItem