import { useState, useEffect } from 'react'
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
import { getDetailMenuMealAPI, getMenuMealAPI } from '~/apis'
import CardContent from '@mui/material/CardContent'
import AppBar from '~/components/AppBar/AppBar'

const MenuDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [menuMeal, setMenuMeal] = useState(null)
  const [mealPackages, setMealPackages] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch detail và danh sách meals song song
        const [detailData, listData] = await Promise.all([
          getDetailMenuMealAPI(slug),
          getMenuMealAPI()
        ])
        setMenuMeal(detailData)
        setMealPackages(listData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug])

  if (loading) {
    return (
      <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh', fontFamily: '"Poppins", sans-serif' }}>
        <AppBar />
        <Box sx={{ maxWidth: '1280px', mx: 'auto', px: 2, py: 6, mt: theme.fitbowl.appBarHeight }}>
          <Typography variant="h5" align="center">
            Loading...
          </Typography>
        </Box>
      </Box>
    )
  }

  if (!menuMeal) {
    return (
      <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh', fontFamily: '"Poppins", sans-serif' }}>
        <AppBar />
        <Box sx={{ maxWidth: '1280px', mx: 'auto', px: 2, py: 6, mt: theme.fitbowl.appBarHeight }}>
          <Typography variant="h5" color="error" align="center">
            Meal package not found!
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 4, mx: 'auto', display: 'block', bgcolor: theme.palette.primary.secondary, color: 'white' }}
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
              <Box
                component="img"
                height="400"
                width="100%"
                src={menuMeal.image}
                alt={menuMeal.title}
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
              {menuMeal.title}
            </Typography>
            <Box sx={{ width: '6rem', height: '0.4rem', bgcolor: theme.palette.primary.secondary, mb: 4 }} />

            <Typography variant="body1" sx={{ mb: 4, color: theme.palette.text.textSub, fontSize: { xs: '1rem', md: '1.15rem' } }}>
              {menuMeal.description}
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 800, color: theme.palette.text.primary, mb: 4 }}>
              Price: {menuMeal.price.toLocaleString()} VND
            </Typography>

            {/* Nutritional Information */}
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 2 }}>
              Nutritional Information
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: theme.palette.primary.card, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.secondary }}>
                    {Math.round(menuMeal.calories)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Calories
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: theme.palette.primary.card, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.secondary }}>
                    {Math.round(menuMeal.protein)}g
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Protein
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: theme.palette.primary.card, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.secondary }}>
                    {Math.round(menuMeal.carbs)}g
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Carbs
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: theme.palette.primary.card, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.secondary }}>
                    {Math.round(menuMeal.fat)}g
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fat
                  </Typography>
                </Box>
              </Grid>
            </Grid>

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
              startIcon={<ShoppingCart />}
              sx={{
                bgcolor: theme.palette.primary.secondary,
                color: 'white',
                fontWeight: 500,
                textTransform: 'none',
                borderRadius: '8px',
                px: 3,
                py: 1.5,
                fontSize: '1rem',
                '&:hover': {
                  bgcolor: theme.palette.primary.main,
                  transform: 'scale(1.02)'
                }
              }}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </Grid>
        </Grid>

        {/* Reviews & Comments */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 4 }}>
            Reviews & Comments
          </Typography>

          {/* Add review form */}
          <Box sx={{ mb: 6, p: 3, bgcolor: theme.palette.primary.card, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.primary }}>
              Write a Review
            </Typography>
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
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.background.default
              }}
            />
            <Button
              variant="contained"
              sx={{
                mt: 2,
                bgcolor: theme.palette.primary.secondary,
                color: 'white',
                '&:hover': { bgcolor: theme.palette.primary.main }
              }}
              onClick={handleCommentSubmit}
              disabled={!comment || !rating}
            >
              Submit Review
            </Button>
          </Box>

          {/* List of reviews */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 3 }}>
              Customer Reviews ({menuMeal.reviews?.length || 0}):
            </Typography>
            {menuMeal.reviews && menuMeal.reviews.length > 0 ? (
              menuMeal.reviews.map((review) => (
                <Box
                  key={review.id}
                  sx={{
                    mb: 3,
                    p: 3,
                    bgcolor: theme.palette.primary.card,
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                      {review.customerName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </Typography>
                  </Box>
                  <Rating value={review.rating} readOnly precision={0.5} sx={{ mb: 2 }} />
                  <Typography variant="body2" sx={{ color: theme.palette.text.textSub }}>
                    {review.comment}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontStyle: 'italic' }}>
                No reviews yet. Be the first to review this dish!
              </Typography>
            )}
          </Box>
        </Box>

        {/* Related meals */}
        {relatedMeals.length > 0 && (
          <Box sx={{ mt: 8 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 4 }}>
              You might also like
            </Typography>
            <Grid container spacing={3}>
              {relatedMeals.map((item) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
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
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                      }
                    }}
                    onClick={() => navigate(`/menu/${item.slug}`)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={item.image}
                      alt={item.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ p: 2, flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, mb: 1, color: theme.palette.text.primary }}
                      >
                        {item.title}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.textSub }}>
                        {item.description}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: theme.palette.primary.secondary }}>
                        {item.price.toLocaleString()} VND
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>

      {/* Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {comment ? 'Review submitted successfully!' : `Added ${quantity} ${menuMeal.title} to cart!`}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default MenuDetail