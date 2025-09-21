import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
// import CardMedia from '@mui/material/CardMedia'
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
// import CardContent from '@mui/material/CardContent'
import AppBar from '~/components/AppBar/AppBar'
import { toast } from 'react-toastify'
import { createCartItem, fetchCart } from '~/redux/cart/cartSlice'
import useTranslate from '~/hooks/useTranslate'
import { selectCurrentLanguage } from '~/redux/translations/translationsSlice'
import RelatedMealItem from '~/pages/customer/Menu/MenuDetail/RelatedMeal/RelatedMealItem'
import Skeleton from '@mui/material/Skeleton'
import { useTranslation } from 'react-i18next'

const MenuDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [menuMeal, setMenuMeal] = useState(null)
  const [mealPackages, setMealPackages] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)

  const customerId = useSelector(state => state.auth?.customerId ?? null)
  const currentLang = useSelector(selectCurrentLanguage)
  const { t } = useTranslation()

  const translatedTitle = useTranslate(menuMeal?.title || '', currentLang)
  const translatedDescription = useTranslate(menuMeal?.description || '', currentLang)
  const translatedNotFound = useTranslate('Meal package not found!', currentLang)
  const translatedBackToMenu = useTranslate('Back to menu list', currentLang)
  const translatedPrice = useTranslate('Price', currentLang)
  const translatedVnd = useTranslate('VND', currentLang)
  const translatedNutritionalInfo = useTranslate('Nutritional Information', currentLang)
  const translatedCalories = t('nutrition.calories')
  const translatedProtein = t('nutrition.protein')
  const translatedCarbs = t('nutrition.carbs')
  const translatedFat = t('nutrition.fat')
  const translatedQuantity = useTranslate('Quantity', currentLang)
  const translatedAdding = useTranslate('Adding...', currentLang)
  const translatedAddToCart = useTranslate('Add to Cart', currentLang)
  const translatedReviewsComments = useTranslate('Reviews & Comments', currentLang)
  const translatedWriteReview = useTranslate('Write a Review', currentLang)
  const translatedYourRating = useTranslate('Your Rating', currentLang)
  const translatedSubmitReview = useTranslate('Submit Review', currentLang)
  const translatedCustomerReviews = useTranslate('Customer Reviews', currentLang)
  const translatedNoReviews = useTranslate('No reviews yet. Be the first to review this dish!', currentLang)
  const translatedYouMightLike = useTranslate('You might also like', currentLang)
  const translatedAddedToCart = useTranslate('Added to cart!', currentLang)
  const translatedReviewSubmitted = useTranslate('Review submitted successfully!', currentLang)
  const translatedFailedToAddToCart = useTranslate('Failed to add to cart', currentLang) // Thêm cho toast

  const handleAddToCart = async () => {
    if (!menuMeal || addingToCart) return

    try {
      setAddingToCart(true)

      const requestData = {
        isCustom: false,
        menuMealId: menuMeal.id,
        quantity: quantity,
        unitPrice: menuMeal.price,
        totalPrice: menuMeal.price * quantity,
        title: menuMeal.title,
        description: menuMeal.description,
        image: menuMeal.image,
        itemType: 'MENU_MEAL',
        calories: menuMeal.calories,
        protein: menuMeal.protein,
        carbs: menuMeal.carbs,
        fat: menuMeal.fat
      }

      await dispatch(createCartItem({ customerId, itemData: requestData }))

      if (customerId) {
        await dispatch(fetchCart(customerId))
      }

      setSnackbarOpen(true)
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error(translatedFailedToAddToCart)
    } finally {
      setAddingToCart(false)
    }
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
      } catch {
        // console.error('Error fetching data:', error)
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
          {/* Skeleton for back button */}
          <Skeleton variant="rectangular" width={200} height={40} sx={{ mb: 4, borderRadius: 5 }} />

          <Grid container spacing={12}>
            <Grid size={{ xs: 12, md: 6 }}>
              {/* Skeleton for image */}
              <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: '12px' }} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              {/* Skeleton for title */}
              <Skeleton variant="text" width="80%" height={60} sx={{ mb: 3 }} />
              <Skeleton variant="rectangular" width={96} height={4} sx={{ mb: 4 }} />

              {/* Skeleton for description */}
              <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="70%" height={20} sx={{ mb: 4 }} />

              {/* Skeleton for price */}
              <Skeleton variant="text" width={150} height={30} sx={{ mb: 4 }} />

              {/* Skeleton for nutritional info */}
              <Skeleton variant="text" width={200} height={25} sx={{ mb: 2 }} />
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 2 }} />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 2 }} />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 2 }} />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 2 }} />
                </Grid>
              </Grid>

              {/* Skeleton for quantity */}
              <Skeleton variant="text" width={100} height={20} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" width={200} height={40} sx={{ mb: 4, borderRadius: 2 }} />

              {/* Skeleton for add to cart button */}
              <Skeleton variant="rectangular" width={200} height={50} sx={{ borderRadius: '8px' }} />
            </Grid>
          </Grid>

          {/* Skeleton for reviews section */}
          <Box sx={{ mt: 8 }}>
            <Skeleton variant="text" width={250} height={30} sx={{ mb: 4 }} />
            <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2, mb: 6 }} />
            <Skeleton variant="text" width={200} height={25} sx={{ mb: 3 }} />
            <Skeleton variant="rectangular" width="100%" height={100} sx={{ borderRadius: 2, mb: 3 }} />
            <Skeleton variant="rectangular" width="100%" height={100} sx={{ borderRadius: 2, mb: 3 }} />
          </Box>

          {/* Skeleton for related meals */}
          <Box sx={{ mt: 8 }}>
            <Skeleton variant="text" width={200} height={30} sx={{ mb: 4 }} />
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: '12px', mb: 2 }} />
                <Skeleton variant="text" width="80%" height={25} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="40%" height={20} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: '12px', mb: 2 }} />
                <Skeleton variant="text" width="80%" height={25} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="40%" height={20} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: '12px', mb: 2 }} />
                <Skeleton variant="text" width="80%" height={25} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="40%" height={20} />
              </Grid>
            </Grid>
          </Box>
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
            {translatedNotFound}
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 4, mx: 'auto', display: 'block', bgcolor: theme.palette.primary.main, color: 'white' }}
            onClick={() => navigate('/menu')}
          >
            {translatedBackToMenu}
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
            borderRadius: 5,
            '&:hover': { bgcolor: theme.palette.primary.main, color: 'white' }
          }}
          onClick={() => navigate('/menu')}
        >
          {translatedBackToMenu}
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
              {translatedTitle}
            </Typography>
            <Box sx={{ width: '6rem', height: '0.4rem', bgcolor: theme.palette.primary.secondary, mb: 4 }} />

            <Typography variant="body1" sx={{ mb: 4, color: theme.palette.text.textSub, fontSize: { xs: '1rem', md: '1.15rem' } }}>
              {translatedDescription}
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 800, color: theme.palette.text.primary, mb: 4 }}>
              {translatedPrice}: {menuMeal.price.toLocaleString()} {translatedVnd}
            </Typography>

            {/* Nutritional Information */}
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 2 }}>
              {translatedNutritionalInfo}
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: theme.palette.primary.card, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.secondary }}>
                    {Math.round(menuMeal.calories)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {translatedCalories}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: theme.palette.primary.card, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.secondary }}>
                    {Math.round(menuMeal.protein)}g
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {translatedProtein}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: theme.palette.primary.card, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.secondary }}>
                    {Math.round(menuMeal.carbs)}g
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {translatedCarbs}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: theme.palette.primary.card, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.secondary }}>
                    {Math.round(menuMeal.fat)}g
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {translatedFat}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Typography variant="body1" sx={{ mr: 2, color: theme.palette.text.primary }}>
                {translatedQuantity}:
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

            {/* Add to cart button - Cập nhật */}
            <Button
              variant="contained"
              startIcon={<ShoppingCart />}
              disabled={addingToCart} // Disable khi đang add to cart
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
                },
                '&:disabled': {
                  bgcolor: theme.palette.grey[400]
                }
              }}
              onClick={handleAddToCart}
            >
              {addingToCart ? translatedAdding : translatedAddToCart}
            </Button>
          </Grid>
        </Grid>

        {/* Reviews & Comments */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 4 }}>
            {translatedReviewsComments}
          </Typography>

          {/* Add review form */}
          <Box sx={{ mb: 6, p: 3, bgcolor: theme.palette.primary.card, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.primary }}>
              {translatedWriteReview}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1, color: theme.palette.text.primary }}>
              {translatedYourRating}:
            </Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              precision={0.5}
              sx={{ mb: 2 }}
            />
            <TextareaAutosize
              minRows={4}
              placeholder={translatedWriteReview}
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
              {translatedSubmitReview}
            </Button>
          </Box>

          {/* List of reviews */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 3 }}>
              {translatedCustomerReviews} ({menuMeal.reviews?.length || 0}):
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
                {translatedNoReviews}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Related meals */}
        {relatedMeals.length > 0 && (
          <Box sx={{ mt: 8 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 4 }}>
              {translatedYouMightLike}
            </Typography>
            <Grid container spacing={3}>
              {relatedMeals.map((item) => (
                <RelatedMealItem key={item.id} item={item} />
              ))}
            </Grid>
          </Box>
        )}
      </Box>

      {/* Notification - Cập nhật message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {comment ? translatedReviewSubmitted : `${translatedAddedToCart} ${quantity} ${translatedTitle}!`}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default MenuDetail