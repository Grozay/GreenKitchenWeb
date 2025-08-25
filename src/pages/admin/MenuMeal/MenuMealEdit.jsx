import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Paper,
  InputAdornment,
  CircularProgress
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { getDetailMenuMealAPI, updateMenuMealAPI, updateMenuMealImageAPI } from '~/apis'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'

const typeOptions = [
  { value: 'BALANCE', label: 'Balance' },
  { value: 'HIGH', label: 'High Protein' },
  { value: 'LOW', label: 'Low Calorie' },
  { value: 'VEGETARIAN', label: 'Vegetarian' }
]

const MenuMealEdit = () => {
  const { slug } = useParams()
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    defaultValues: {
      title: '',
      description: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      price: '',
      stock: '',
      type: '',
      image: ''
    }
  })
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [initialImage, setInitialImage] = useState(null)
  const [mealId, setMealId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMeal = async () => {
      setLoading(true)
      try {
        const meal = await getDetailMenuMealAPI(slug)
        if (meal) {
          reset({
            ...meal,
            type: meal.type || ''
          })
          setInitialImage(meal.image)
          setImagePreview(meal.image)
          setMealId(meal.id)
        } else {
          toast.error('Meal not found')
          navigate('/management/menu-meals/list')
        }
      } catch (error) {
        toast.error('Failed to fetch meal')
        navigate('/management/menu-meals/list')
      } finally {
        setLoading(false)
      }
    }
    fetchMeal()
  }, [slug, reset, navigate])
  const onSubmit = async (data) => {
    setLoading(true)
    try {
      let file = null
      if (data.image && data.image.length > 0 && data.image[0] instanceof File) {
        file = data.image[0]
      }

      const fixedData = {
        ...data,
        title: String(data.title ?? ''),
        description: String(data.description ?? ''),
        calories: String(data.calories ?? ''),
        protein: String(data.protein ?? ''),
        carbs: String(data.carbs ?? ''),
        fat: String(data.fat ?? ''),
        price: String(data.price ?? ''),
        stock: String(data.stock ?? ''),
        type: String(data.type ?? ''),
        slug: slug
      }
      delete fixedData.image // Không gửi trường image

      // Gửi update thông tin (không gửi file)
      await updateMenuMealAPI(mealId, fixedData)

      // Nếu có file ảnh mới, gọi API update ảnh riêng
      if (file) {
        await updateMenuMealImageAPI(mealId, file)
      }

      toast.success('Meal updated successfully!')
      navigate('/management/menu-meals/list')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update meal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
        <Typography variant="h4" mb={3} align="center" fontWeight={700}>
          Edit Meal
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="on">
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                label="Title"
                fullWidth
                {...register('title', { required: 'Title is required' })}
                error={!!errors.title}
                helperText={errors.title?.message}
                variant="outlined"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                {...register('description', { required: 'Description is required' })}
                error={!!errors.description}
                helperText={errors.description?.message}
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Calories"
                type="number"
                fullWidth
                InputProps={{ endAdornment: <InputAdornment position="end">kcal</InputAdornment> }}
                {...register('calories', { required: 'Calories is required', min: 0 })}
                error={!!errors.calories}
                helperText={errors.calories?.message}
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Protein"
                type="number"
                fullWidth
                InputProps={{ endAdornment: <InputAdornment position="end">g</InputAdornment> }}
                {...register('protein', { required: 'Protein is required', min: 0 })}
                error={!!errors.protein}
                helperText={errors.protein?.message}
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Carbs"
                type="number"
                fullWidth
                InputProps={{ endAdornment: <InputAdornment position="end">g</InputAdornment> }}
                {...register('carbs', { required: 'Carbs is required', min: 0 })}
                error={!!errors.carbs}
                helperText={errors.carbs?.message}
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Fat"
                type="number"
                fullWidth
                InputProps={{ endAdornment: <InputAdornment position="end">g</InputAdornment> }}
                {...register('fat', { required: 'Fat is required', min: 0 })}
                error={!!errors.fat}
                helperText={errors.fat?.message}
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Price"
                type="number"
                fullWidth
                InputProps={{ endAdornment: <InputAdornment position="end">VNĐ</InputAdornment> }}
                {...register('price', { required: 'Price is required', min: 0 })}
                error={!!errors.price}
                helperText={errors.price?.message}
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Stock"
                type="number"
                fullWidth
                {...register('stock', { required: 'Stock is required', min: 0 })}
                error={!!errors.stock}
                helperText={errors.stock?.message}
                variant="outlined"
              />
            </Grid>
            <Grid size={12}>
              <Controller
                name="type"
                control={control}
                rules={{ required: 'Type is required' }}
                render={({ field }) => (
                  <TextField
                    select
                    label="Type"
                    fullWidth
                    {...field}
                    error={!!errors.type}
                    helperText={errors.type?.message}
                    variant="outlined"
                  >
                    {typeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid size={12}>
              <Controller
                name="image"
                control={control}
                rules={{ required: !initialImage && 'Image is required' }}
                render={({ field }) => (
                  <>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      sx={{ mb: 1, textTransform: 'none' }}
                    >
                      {imagePreview ? 'Change Image' : 'Upload Image'}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={e => {
                          field.onChange(e.target.files)
                          if (e.target.files && e.target.files[0]) {
                            setImagePreview(URL.createObjectURL(e.target.files[0]))
                          }
                        }}
                      />
                    </Button>
                    {imagePreview && (
                      <Box sx={{ mb: 1, textAlign: 'center' }}>
                        <img src={imagePreview} alt="preview" style={{ width: 160, borderRadius: 12, boxShadow: '0 2px 8px #0001' }} />
                      </Box>
                    )}
                    {errors.image && <Typography color="error" variant="caption">{errors.image.message}</Typography>}
                  </>
                )}
              />
            </Grid>
            <Grid size={12} sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ px: 5, py: 1.5, borderRadius: 2, fontWeight: 600, fontSize: 18 }}
                startIcon={loading && <CircularProgress size={22} color="inherit" />}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  )
}

export default MenuMealEdit
