import { Box } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import ShoppingCart from '@mui/icons-material/ShoppingCart'
import theme from '~/theme'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '~/redux/order/orderSlice'
import Grid from '@mui/material/Grid'


const CardMenu = ({ item, typeBasedIndex }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleNavigateToDetail = (slug) => {
    navigate(`/menu/${slug}`)
  }

  const handleAddToCart = (e) => {
    e.stopPropagation() // Prevent navigation when clicking add to cart
    const cartItem = {
      id: item.id,
      title: item.title,
      description: item.description,
      image: item.image,
      price: item.price,
      totalPrice: item.price,
      quantity: 1,
      isCustom: false,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
      slug: item.slug,
      mealItem: {
        menu: [item]
      }
    }

    dispatch(addToCart(cartItem))
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
              {item.calories} CALORIES
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
                {item.calories} CALORIES
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
              {itemFilter.title}
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
              {itemFilter.price} $
            </Typography>
            <IconButton
              onClick={handleAddToCart}
              sx={{
                color: theme.palette.primary.secondary,
                '&:hover': {
                  bgcolor: theme.palette.primary.secondary,
                  color: 'white'
                }
              }}
            >
              <ShoppingCart fontSize="medium" />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </>
  )
}

export default CardMenu