import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import Grid from '@mui/material/Grid'
import { toast } from 'react-toastify'
import { getDetailMenuMealAPI } from '~/apis'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LocalDiningIcon from '@mui/icons-material/LocalDining'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import StorageIcon from '@mui/icons-material/Storage'
import CategoryIcon from '@mui/icons-material/Category'
import SkeletonLoadingAdminDetail from '~/components/Loading/SkeletonLoadingAdminDetail'

export default function MenuMealDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [meal, setMeal] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        setLoading(true)
        const data = await getDetailMenuMealAPI(slug)
        setMeal(data)
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to fetch meal details')
        navigate('/management/menu-meals/list')
      } finally {
        setLoading(false)
      }
    }
    fetchMeal()
  }, [slug, navigate])

  if (loading) {
    return (
      <SkeletonLoadingAdminDetail />
    )
  }

  if (!meal) return null

  return (
    <Box sx={{ p: 4, maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)} // Sửa thành navigate(-1)
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Meal Details
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {/* Basic Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{ width: 100, height: 100, mr: 3 }}
            alt={meal.title}
            src={meal.image}
            variant="rounded"
          >
            <LocalDiningIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {meal.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {meal.description}
            </Typography>
            <Chip
              label={meal.type}
              color={
                meal.type === 'BALANCE'
                  ? 'primary'
                  : meal.type === 'HIGH'
                    ? 'success'
                    : meal.type === 'LOW'
                      ? 'warning'
                      : 'default'
              }
              variant="outlined"
              size="small"
              sx={{ mt: 1, textTransform: 'capitalize' }}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={3}>
          {/* Nutrition Info */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Nutrition Facts
              </Typography>
              <DetailItem
                icon={<LocalDiningIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                label="Calories"
                value={meal.calories + ' kcal'}
              />
              <DetailItem
                icon={<LocalDiningIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                label="Protein"
                value={meal.protein + ' g'}
              />
              <DetailItem
                icon={<LocalDiningIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                label="Carbs"
                value={meal.carbs + ' g'}
              />
              <DetailItem
                icon={<LocalDiningIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                label="Fat"
                value={meal.fat + ' g'}
              />
            </Paper>
          </Grid>

          {/* Price & Stock */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Price & Stock
              </Typography>
              <DetailItem
                icon={<AttachMoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                label="Price"
                value={meal.price?.toLocaleString() + ' ₫'}
              />
              <DetailItem
                icon={<StorageIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                label="Stock"
                value={meal.stock}
              />
              <DetailItem
                icon={<CategoryIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                label="Type"
                value={meal.type}
              />
            </Paper>
          </Grid>

          {/* Description */}
          <Grid size={{ xs: 12 }}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Description
              </Typography>
              <Typography variant="body1">{meal.description}</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

// Hiển thị từng dòng thông tin
const DetailItem = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    {icon}
    <Box>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
        {value}
      </Typography>
    </Box>
  </Box>
)
