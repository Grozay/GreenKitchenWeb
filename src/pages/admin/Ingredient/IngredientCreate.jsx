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
import { createIngredientsAPI } from '~/apis'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const typeOptions = [
  { value: 'PROTEIN', label: 'Protein' },
  { value: 'CARBS', label: 'Carbs' },
  { value: 'SIDE', label: 'Side' },
  { value: 'SAUCE', label: 'Sauce' }
]

const IngredientCreate = () => {
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    defaultValues: {
      title: '',
      description: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      image: '',
      price: '',
      stock: '',
      type: 'PROTEIN'
    }
  })
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'image' && value && value.length > 0 && value[0] instanceof File) {
          formData.append('imageFile', value[0])
        } else if (key !== 'image') {
          formData.append(key, value)
        }
      })
      await createIngredientsAPI(formData)
      toast.success('Ingredient created successfully!')
      reset()
      setImagePreview(null)
      navigate('/management/ingredients/list')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create ingredient')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
        <Typography variant="h4" mb={3} align="center" fontWeight={700}>
          Create New Ingredient
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
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
              <TextField
                select
                label="Type"
                fullWidth
                defaultValue="PROTEIN"
                {...register('type', { required: 'Type is required' })}
                error={!!errors.type}
                helperText={errors.type?.message}
                variant="outlined"
              >
                {typeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={12}>
              <Controller
                name="image"
                control={control}
                rules={{ required: 'Image is required' }}
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
                {loading ? 'Creating...' : 'Create Ingredient'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  )
}

export default IngredientCreate
