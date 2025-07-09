import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Rating from '@mui/material/Rating'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import { ShoppingCart, Add, Remove, ArrowBack } from '@mui/icons-material'
import theme from '~/theme'
import { mealPackages } from '~/apis/mockData'
import CardContent from '@mui/material/CardContent'
import AppBar from '~/components/AppBar/AppBar'

const MenuDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const meal = mealPackages.find((item) => item.slug === slug)
  const [quantity, setQuantity] = useState(1)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const handleAddToCart = () => {
    setSnackbarOpen(true)
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta))
  }

  // Handle comment submission
  const handleCommentSubmit = () => {
    setComment('')
    setRating(0)
    setSnackbarOpen(true)
  }

  if (!meal) {
    return (
      <Box sx={{ bgcolor: theme.palette.background.main, minHeight: '100vh', fontFamily: '"Poppins", sans-serif', py: 6 }}>
        <Box sx={{ maxWidth: '1280px', mx: 'auto', px: 2 }}>
          <Typography variant="h5" color="error" align="center">
            Meal package not found!
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 4, mx: 'auto', display: 'block', bgcolor: theme.palette.primary.secondary, color: 'black' }}
            onClick={() => navigate('/menu')}
          >
            Back to menu list
          </Button>
        </Box>
      </Box>
    )
  }

  // Related meals (random 3 meals)
  const relatedMeals = mealPackages
    .filter((item) => item.slug !== slug)
    .slice(0, 3)

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, color: theme.palette.text.primary, minHeight: '100vh', fontFamily: '"Poppins", sans-serif' }}>
      <AppBar />
      <Box sx={{ maxWidth: '1280px', mx: 'auto', px: 2, py: 6, mt: theme.fitbowl.appBarHeight }}>
        <Button
          startIcon={<ArrowBack />}
          sx={{
            mb: 4,
            color: theme.palette.text.primary,
            '&:hover': { bgcolor: theme.palette.primary.secondary, color: 'white' }
          }}
          onClick={() => navigate('/menu')}
        >
          Back to menu list
        </Button>

        <Grid container spacing={12}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderRadius: '12px',
                overflow: 'hidden'
              }}
            >
              <CardMedia
                component="img"
                height="450"
                image={meal.image}
                alt={meal.alt}
                sx={{ objectFit: 'cover' }}
              />
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 300,
                letterSpacing: '0.1em',
                mb: 3,
                color: theme.palette.text.primary,
                wordBreak: 'break-word'
              }}
            >
              {meal.title}
            </Typography>
            <Box sx={{ width: '6rem', height: '0.4rem', bgcolor: theme.palette.primary.secondary, mb: 4 }} />
            <Typography variant="body1" sx={{ mb: 4, color: theme.palette.text.textSub, fontSize: { xs: '1rem', md: '1.15rem' } }}>
              {meal.description}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: theme.palette.text.primary, mb: 2 }}>
              Price: {meal.price}
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 1 }}>
              Ingredients
            </Typography>
            <Typography variant="body2" sx={{ mb: 4, color: theme.palette.text.textSub }}>
              {meal.ingredients || 'Grilled chicken, fresh greens, quinoa, homemade sauce.'}
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 1 }}>
              Nutritional Information
            </Typography>
            <Typography variant="body2" sx={{ mb: 4, color: theme.palette.text.textSub }}>
              {meal.nutritionalInfo || 'Calories: 500kcal, Protein: 30g, Carbs: 45g, Fat: 20g'}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Typography variant="body1" sx={{ mr: 2, color: theme.palette.text.primary }}>
                Quantity:
              </Typography>
              <IconButton onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                <Remove />
              </IconButton>
              <TextField
                value={quantity}
                type="number"
                inputProps={{ min: 1, style: { textAlign: 'center', color: theme.palette.text.primary } }}
                sx={{
                  width: '60px',
                  mx: 1,
                  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                    '-webkit-appearance': 'none',
                    margin: 0
                  },
                  '& input[type=number]': {
                    '-moz-appearance': 'textfield'
                  }
                }}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
              <IconButton onClick={() => handleQuantityChange(1)}>
                <Add />
              </IconButton>
            </Box>

            {/* Add to cart button */}
            <Button
              variant="contained"
              sx={{
                bgcolor: theme.palette.primary.secondary,
                color: 'white',
                fontWeight: 500,
                textTransform: 'none',
                borderRadius: '8px',
                px: 2.5,
                py: 0.75,
                fontSize: '1rem',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid transparent',
                '&:hover': {
                  bgcolor: theme.palette.background.main,
                  color: theme.palette.text.primary,
                  border: `1px solid ${theme.palette.primary.secondary}`,
                  boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
                  transform: 'scale(1.02)'
                },
                gap: 1
              }}
              onClick={handleAddToCart}
            >
              <ShoppingCart sx={{ color: theme.palette.text.primary }} />
              <Box sx={{ position: 'relative', zIndex: 2, color: theme.palette.text.primary }}>Add to Cart</Box>
            </Button>
          </Grid>
        </Grid>

        {/* Detailed description */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 2 }}>
            About This Dish
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.text.textSub, fontSize: { xs: '1rem', md: '1.15rem' } }}>
            {meal.detailedDescription ||
              'This dish is prepared with fresh ingredients, combining the rich flavor of grilled chicken with the nutritious benefits of quinoa. Each portion is designed to provide balanced nutrition, perfect for a healthy lifestyle.'}
          </Typography>
        </Box>

        {/* Rating and comment */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 2 }}>
            Reviews & Comments
          </Typography>
          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" sx={{ mb: 1, color: theme.palette.text.primary }}>
              Your Rating:
            </Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              precision={0.5}
              sx={{ mb: 2 }}
            />
            <TextareaAutosize
              minRows={4}
              placeholder="Write your comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: `1px solid ${theme.palette.grey[300]}`,
                fontFamily: '"Poppins", sans-serif',
                fontSize: '1rem',
                resize: 'vertical',
                color: theme.palette.text.primary
              }}
            />
            <Button
              variant="contained"
              sx={{
                mt: 2,
                bgcolor: theme.palette.primary.secondary,
                color: 'white',
                '&:hover': { bgcolor: theme.palette.background.main }
              }}
              onClick={handleCommentSubmit}
              disabled={!comment || !rating}
            >
              Submit Comment
            </Button>
          </Box>

          {/* List of comments */}
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 1 }}>
              Customer Comments:
            </Typography>
            {[
              {
                user: 'John Doe',
                rating: 4.5,
                comment: 'The dish is delicious, healthy, and perfect for my diet!'
              },
              {
                user: 'Jane Smith',
                rating: 5,
                comment: 'Soft quinoa, flavorful grilled chicken, definitely worth trying!'
              }
            ].map((item, index) => (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: theme.palette.primary.card,
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                  {item.user}
                </Typography>
                <Rating value={item.rating} readOnly precision={0.5} sx={{ mb: 1 }} />
                <Typography variant="body2" sx={{ color: theme.palette.text.textSub }}>
                  {item.comment}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Related meals */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 4 }}>
            Suggested Related Dishes
          </Typography>
          <Grid container spacing={2}>
            {relatedMeals.map((item, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease-in-out',
                    backgroundColor: theme.palette.primary.card,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="150"
                    image={item.image}
                    alt={item.alt}
                    sx={{ objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => navigate(`/menu/${item.slug}`)}
                  />
                  <CardContent sx={{ p: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, mb: 1, color: theme.palette.text.primary, cursor: 'pointer' }}
                      onClick={() => navigate(`/menu/${item.slug}`)}
                    >
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.textSub }}>
                      {item.description}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: theme.palette.text.textSub }}>
                      {item.price}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {comment ? 'Comment submitted!' : `Added ${quantity} ${meal.title} to cart!`}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default MenuDetail