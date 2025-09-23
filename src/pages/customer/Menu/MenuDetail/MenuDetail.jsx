import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Rating from '@mui/material/Rating'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import { ShoppingCart, Add, Remove, ArrowBack, Edit } from '@mui/icons-material'
import theme from '~/theme'
import {
  getDetailMenuMealAPI,
  getMenuMealAPI,
  createMenuMealReviewAPI,
  updateMenuMealReviewAPI,
  fetchCustomerDetails // Import trực tiếp từ APIs
} from '~/apis'
import AppBar from '~/components/AppBar/AppBar'
import { toast } from 'react-toastify'
import { createCartItem, fetchCart } from '~/redux/cart/cartSlice'
import RelatedMealItem from '~/pages/customer/Menu/MenuDetail/RelatedMeal/RelatedMealItem'
import Skeleton from '@mui/material/Skeleton'
import { selectCurrentCustomer } from '~/redux/user/customerSlice'
import Avatar from '@mui/material/Avatar'
// Xóa import này vì không cần Redux action
// import { fetchCustomerDetails } from '~/redux/user/customerActions'

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

  // Thêm states cho reviews
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [editingReview, setEditingReview] = useState(null)
  const [totalReviews, setTotalReviews] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)

  // Thêm state để kiểm tra user đã mua sản phẩm này chưa
  const [hasPurchased, setHasPurchased] = useState(false)
  const [checkingPurchase, setCheckingPurchase] = useState(false)

  const currentCustomer = useSelector(selectCurrentCustomer)
  const customerId = currentCustomer?.id || null


  // Fetch reviews function
  const fetchReviews = async () => {
    if (!menuMeal?.id) return

    try {
      setReviewsLoading(true)
      const response = await getDetailMenuMealAPI(slug)
      if (response.reviews) {
        // Sắp xếp reviews: review của user hiện tại LUÔN lên đầu
        const sortedReviews = response.reviews.sort((a, b) => {
          // Nếu có customerId, ưu tiên tuyệt đối review của user hiện tại
          if (customerId) {
            if (a.customer?.id === customerId && b.customer?.id !== customerId) return -1
            if (b.customer?.id === customerId && a.customer?.id !== customerId) return 1
          }
          // Với các review khác, sắp xếp theo thời gian tạo (mới nhất trước)
          return new Date(b.createdAt) - new Date(a.createdAt)
        })

        setReviews(sortedReviews)
        setTotalReviews(sortedReviews.length)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      toast.error('Failed to load reviews')
    } finally {
      setReviewsLoading(false)
    }
  }

  // Function để kiểm tra user đã mua sản phẩm này chưa
  const checkUserPurchase = async () => {
    if (!customerId || !menuMeal?.title || !currentCustomer?.email) return

    try {
      setCheckingPurchase(true)
      // Gọi API trực tiếp để lấy thông tin customer bao gồm orders
      const customerData = await fetchCustomerDetails(currentCustomer.email)

      // Kiểm tra xem có order nào chứa item với title trùng với menuMeal.title không
      const hasBoughtThisItem = customerData.orders?.some(order =>
        order.orderItems?.some(item => item.title === menuMeal.title)
      )

      setHasPurchased(hasBoughtThisItem || false)
    } catch (error) {
      console.error('Error checking purchase:', error)
      setHasPurchased(false)
    } finally {
      setCheckingPurchase(false)
    }
  }

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

      setQuantity(1)

      setSnackbarOpen(true)
    } catch (error) {
      toast.error('Failed to add to cart')
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

  const handleCommentSubmit = async () => {
    if (!customerId) {
      toast.error('Please login to write a review')
      return
    }

    // Kiểm tra user đã mua sản phẩm chưa
    if (!hasPurchased) {
      toast.error('You must purchase this item to write a review')
      return
    }

    if (!rating || !comment.trim()) {
      toast.error('Please provide both rating and comment')
      return
    }

    try {
      setSubmittingReview(true)

      const reviewData = {
        menuMealId: menuMeal.id,
        customerId: customerId,
        rating: rating,
        comment: comment.trim()
      }

      if (editingReview) {
        await updateMenuMealReviewAPI(editingReview.id, {
          menuMealId: menuMeal.id,
          customerId: customerId,
          rating: editingReview.rating,
          comment: comment.trim()
        })
        toast.success('Review updated successfully!')
        setEditingReview(null)
      } else {
        await createMenuMealReviewAPI(reviewData)
        toast.success('Review submitted successfully!')
      }

      setComment('')
      setRating(0)
      await fetchReviews()

    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Failed to submit review. Please try again.')
    } finally {
      setSubmittingReview(false)
    }
  }

  const handleEditReview = (review) => {
    setEditingReview(review)
    // Không cho phép sửa rating, chỉ set lại rating cũ
    setRating(review.rating)
    setComment(review.comment)
    document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingReview(null)
    setRating(0)
    setComment('')
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [detailData, listData] = await Promise.all([
          getDetailMenuMealAPI(slug),
          getMenuMealAPI()
        ])
        setMenuMeal(detailData)
        setMealPackages(listData)

        // Set reviews từ API detail với sắp xếp ưu tiên user hiện tại
        if (detailData.reviews) {
          const sortedReviews = detailData.reviews.sort((a, b) => {
            // Ưu tiên tuyệt đối review của user hiện tại
            if (customerId) {
              if (a.customer?.id === customerId && b.customer?.id !== customerId) return -1
              if (b.customer?.id === customerId && a.customer?.id !== customerId) return 1
            }
            // Sắp xếp theo thời gian tạo (mới nhất trước)
            return new Date(b.createdAt) - new Date(a.createdAt)
          })

          setReviews(sortedReviews)
          setTotalReviews(sortedReviews.length)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug, customerId])

  // Kiểm tra purchase khi component mount hoặc user/menuMeal thay đổi
  useEffect(() => {
    if (customerId && menuMeal?.title && currentCustomer?.email) {
      checkUserPurchase()
    }
  }, [customerId, menuMeal?.title, currentCustomer?.email])

  // Loading state với skeleton đầy đủ
  if (loading) {
    return (
      <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh', fontFamily: '"Poppins", sans-serif' }}>
        <AppBar />
        <Box sx={{ maxWidth: '1280px', mx: 'auto', px: 2, py: 6, mt: theme.fitbowl.appBarHeight }}>
          {/* Back button skeleton */}
          <Skeleton variant="rectangular" width={200} height={40} sx={{ mb: 4, borderRadius: 5 }} />

          {/* Main content grid */}
          <Grid container spacing={12}>
            {/* Image skeleton */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: '12px' }} />
            </Grid>

            {/* Content skeleton */}
            <Grid size={{ xs: 12, md: 6 }}>
              {/* Title */}
              <Skeleton variant="text" width="80%" height={60} sx={{ mb: 2 }} />
              {/* Divider */}
              <Skeleton variant="rectangular" width={100} height={6} sx={{ mb: 4, borderRadius: 1 }} />
              {/* Description */}
              <Skeleton variant="text" width="100%" height={25} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="90%" height={25} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="70%" height={25} sx={{ mb: 4 }} />
              {/* Price */}
              <Skeleton variant="text" width="40%" height={35} sx={{ mb: 4 }} />

              {/* Nutritional info title */}
              <Skeleton variant="text" width="50%" height={30} sx={{ mb: 2 }} />
              {/* Nutrition cards */}
              <Grid container spacing={2} sx={{ mb: 4 }}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <Grid size={{ xs: 6, sm: 3 }} key={index}>
                    <Skeleton variant="rectangular" width="100%" height={80} sx={{ borderRadius: 2 }} />
                  </Grid>
                ))}
              </Grid>

              {/* Quantity selector */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Skeleton variant="text" width={80} height={25} sx={{ mr: 2 }} />
                <Skeleton variant="circular" width={40} height={40} sx={{ mr: 1 }} />
                <Skeleton variant="rectangular" width={60} height={40} sx={{ mx: 1, borderRadius: 1 }} />
                <Skeleton variant="circular" width={40} height={40} sx={{ ml: 1 }} />
              </Box>

              {/* Add to cart button */}
              <Skeleton variant="rectangular" width={180} height={50} sx={{ borderRadius: '8px' }} />
            </Grid>
          </Grid>

          {/* Reviews section skeleton */}
          <Box sx={{ mt: 8 }}>
            <Skeleton variant="text" width="30%" height={40} sx={{ mb: 4 }} />

            {/* Review form skeleton */}
            <Box sx={{ mb: 6, p: 3, bgcolor: theme.palette.primary.card, borderRadius: 2 }}>
              <Skeleton variant="text" width="25%" height={30} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="15%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" width={120} height={24} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={100} sx={{ mb: 2, borderRadius: 1 }} />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 1 }} />
              </Box>
            </Box>

            {/* Reviews list skeleton */}
            <Skeleton variant="text" width="40%" height={30} sx={{ mb: 3 }} />
            {Array.from({ length: 3 }).map((_, index) => (
              <Box key={index} sx={{ mb: 3, p: 3, bgcolor: theme.palette.primary.card, borderRadius: '8px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Skeleton variant="text" width="20%" height={25} />
                  <Skeleton variant="text" width="15%" height={20} />
                </Box>
                <Skeleton variant="rectangular" width={120} height={20} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="80%" height={20} />
              </Box>
            ))}
          </Box>

          {/* Related meals skeleton */}
          <Box sx={{ mt: 8 }}>
            <Skeleton variant="text" width="30%" height={40} sx={{ mb: 4 }} />
            <Grid container spacing={3}>
              {Array.from({ length: 3 }).map((_, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2, mb: 2 }} />
                  <Skeleton variant="text" width="90%" height={25} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="70%" height={20} />
                </Grid>
              ))}
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
            Meal package not found!
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 4, mx: 'auto', display: 'block', bgcolor: theme.palette.primary.main, color: 'white' }}
            onClick={() => navigate('/menu')}
          >
            Back to menu list
          </Button>
        </Box>
      </Box>
    )
  }

  // Tính rating trung bình
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  const relatedMeals = mealPackages
    .filter((item) => item.slug !== slug)
    .slice(0, 3)

  // Thêm biến kiểm tra user đã review chưa
  const userHasReviewed = reviews.some(review => review.customer?.id === customerId)

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
              {menuMeal?.title || ''}
            </Typography>
            <Box sx={{ width: '6rem', height: '0.4rem', bgcolor: theme.palette.primary.secondary, mb: 4 }} />

            <Typography variant="body1" sx={{ mb: 4, color: theme.palette.text.textSub, fontSize: { xs: '1rem', md: '1.15rem' } }}>
              {menuMeal?.description || ''}
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 800, color: theme.palette.text.primary, mb: 4 }}>
              Price: {menuMeal.price.toLocaleString()} VND
            </Typography>

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

            <Button
              variant="contained"
              startIcon={<ShoppingCart />}
              disabled={addingToCart}
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
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </Button>
          </Grid>
        </Grid>


        {/* Reviews & Comments */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 2 }}>
            Reviews & Comments
          </Typography>
          {/* Hiển thị rating trung bình chỉ khi có review */}
          {reviews.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.secondary, mr: 1 }}>
                {averageRating ? `${averageRating}/5` : 'No reviews yet. Be the first to review this dish!'}
              </Typography>
              {averageRating && (
                <Rating value={Number(averageRating)} precision={0.1} readOnly size="medium" />
              )}
              <Typography variant="body2" sx={{ ml: 2, color: theme.palette.text.secondary }}>
                ({totalReviews} rating)
              </Typography>
            </Box>
          )}

          {/* Review form - chỉ hiển thị khi đã login VÀ đã mua sản phẩm */}
          {customerId ? (
            userHasReviewed ? (
              // Nếu đã review, hiển thị form luôn
              <Box id="review-form" sx={{ mb: 6, p: 3, bgcolor: theme.palette.primary.card, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.primary }}>
                  {editingReview ? 'Update Review' : 'Write a Review'}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1, color: theme.palette.text.primary }}>
                  Your Rating:
                </Typography>
                <Rating
                  value={rating}
                  onChange={(event, newValue) => setRating(newValue)}
                  precision={0.5}
                  sx={{ mb: 2 }}
                  disabled={editingReview}  // Disable khi edit
                />
                {editingReview && (
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mb: 2, display: 'block' }}>
                    Rating cannot be changed when editing review
                  </Typography>
                )}
                <TextareaAutosize
                  minRows={4}
                  placeholder={editingReview ? 'Update your comment...' : 'Write a Review'}
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
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: theme.palette.primary.secondary,
                      color: 'white',
                      '&:hover': { bgcolor: theme.palette.primary.main }
                    }}
                    onClick={handleCommentSubmit}
                    disabled={!comment.trim() || !rating || submittingReview}
                  >
                    {submittingReview
                      ? (editingReview ? 'Updating...' : 'Submitting...')
                      : (editingReview ? 'Update Review' : 'Submit Review')
                    }
                  </Button>
                  {editingReview && (
                    <Button
                      variant="outlined"
                      onClick={handleCancelEdit}
                      sx={{ color: theme.palette.text.primary }}
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
              </Box>
            ) : checkingPurchase ? (
              // Loading state khi đang kiểm tra purchase
              <Box sx={{ mb: 6, p: 3, bgcolor: theme.palette.primary.card, borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                  Checking purchase history...
                </Typography>
              </Box>
            ) : hasPurchased ? (
              // Form review khi đã mua
              <Box id="review-form" sx={{ mb: 6, p: 3, bgcolor: theme.palette.primary.card, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.primary }}>
                  {editingReview ? 'Update Review' : 'Write a Review'}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1, color: theme.palette.text.primary }}>
                  Your Rating:
                </Typography>
                <Rating
                  value={rating}
                  onChange={(event, newValue) => setRating(newValue)}
                  precision={0.5}
                  sx={{ mb: 2 }}
                  disabled={editingReview}
                />
                {editingReview && (
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mb: 2, display: 'block' }}>
                    Rating cannot be changed when editing review
                  </Typography>
                )}
                <TextareaAutosize
                  minRows={4}
                  placeholder={editingReview ? 'Update your comment...' : 'Write a Review'}
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
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: theme.palette.primary.secondary,
                      color: 'white',
                      '&:hover': { bgcolor: theme.palette.primary.main }
                    }}
                    onClick={handleCommentSubmit}
                    disabled={!comment.trim() || (!editingReview && !rating) || submittingReview}
                  >
                    {submittingReview
                      ? (editingReview ? 'Updating...' : 'Submitting...')
                      : (editingReview ? 'Update Review' : 'Submit Review')
                    }
                  </Button>
                  {editingReview && (
                    <Button
                      variant="outlined"
                      onClick={handleCancelEdit}
                      sx={{ color: theme.palette.text.primary }}
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
              </Box>
            ) : (
              // Thông báo khi user chưa mua sản phẩm
              <Box sx={{ mb: 6, p: 3, bgcolor: theme.palette.grey[100], borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                  Purchase this item first to leave a review
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: theme.palette.primary.secondary,
                    color: 'white',
                    '&:hover': { bgcolor: theme.palette.primary.main }
                  }}
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                >
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </Button>
              </Box>
            )
          ) : (
            // Thông báo khi user chưa đăng nhập
            <Box sx={{ mb: 6, p: 3, bgcolor: theme.palette.grey[100], borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                Please login to write a review
              </Typography>
            </Box>
          )}

          {/* Reviews list */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 3 }}>
              Customer Reviews
            </Typography>

            {reviewsLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Box key={index} sx={{ mb: 3, p: 3, bgcolor: theme.palette.primary.card, borderRadius: '8px' }}>
                  <Skeleton variant="text" width="30%" height={25} sx={{ mb: 1 }} />
                  <Skeleton variant="rectangular" width={120} height={20} sx={{ mb: 2 }} />
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="80%" height={20} />
                </Box>
              ))
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <Box
                  key={review.id}
                  sx={{
                    mb: 3,
                    p: 3,
                    bgcolor: review.customer?.id === customerId
                      ? theme.palette.primary.main + '15' // Highlight cho review của user
                      : theme.palette.primary.card,
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: review.customer?.id === customerId
                      ? `2px solid ${theme.palette.primary.secondary}`
                      : 'none'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={review.customer?.avatar}  // Thêm src để hiển thị ảnh avatar nếu có
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: review.customer?.id === customerId
                            ? theme.palette.primary.secondary
                            : theme.palette.grey[500],
                          fontSize: '1rem',
                          fontWeight: 600
                        }}
                      >
                        {review.customerName?.charAt(0)?.toUpperCase() || 'U'}
                      </Avatar>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                            {review.customerName}
                          </Typography>
                          {review.customer?.id === customerId && (
                            <Typography
                              variant="caption"
                              sx={{
                                bgcolor: theme.palette.primary.secondary,
                                color: 'white',
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                fontSize: '0.7rem',
                                fontWeight: 600
                              }}
                            >
                              Your review
                            </Typography>
                          )}
                        </Box>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                          {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                        </Typography>
                      </Box>
                    </Box>
                    {customerId === review.customer?.id && (
                      <IconButton
                        size="small"
                        onClick={() => handleEditReview(review)}
                        sx={{ color: theme.palette.primary.secondary }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                  <Rating value={review.rating} readOnly precision={0.5} sx={{ mb: 2, ml: 7 }} />
                  <Typography variant="body2" sx={{ color: theme.palette.text.textSub, ml: 7 }}>
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
                <RelatedMealItem key={item.id} item={item} />
              ))}
            </Grid>
          </Box>
        )}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {`Added to cart! ${quantity} ${menuMeal?.title || ''}!`}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default MenuDetail