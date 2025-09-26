import { useForm, Controller } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Modal from '@mui/material/Modal'
import { createMenuMealAPI, getDetailMenuMealAPI } from '~/apis'
import { toast } from 'react-toastify'
import { useNavigate, useSearchParams } from 'react-router-dom' // Thêm để lấy query params
import { useState, useCallback, useEffect } from 'react'
import Cropper from 'react-easy-crop'
import getCroppedImg from '~/utils/getCroppedImg' // Đảm bảo file này tồn tại

const typeOptions = [
  { value: 'BALANCE', label: 'Balance' },
  { value: 'HIGH', label: 'High Protein' },
  { value: 'LOW', label: 'Low Calorie' },
  { value: 'VEGETARIAN', label: 'Vegetarian' }
]

const MenuMealCreate = () => {
  const [searchParams] = useSearchParams()
  const cloneSlug = searchParams.get('clone') // Lấy slug từ query

  const { handleSubmit, control, formState: { errors }, reset, setValue } = useForm({
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
      type: 'BALANCE'
    }
  })
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [imageSrc, setImageSrc] = useState(null)
  const navigate = useNavigate()

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const img = new Image()
      img.onload = () => {
        if (img.width === 600 && img.height === 600) {
          // Revoke URL cũ nếu có
          if (imagePreview) URL.revokeObjectURL(imagePreview)
          // Ảnh đúng kích thước, set trực tiếp
          setImagePreview(URL.createObjectURL(file))
          setValue('image', [file])
        } else {
          // Ảnh không đúng, mở modal crop
          setImageSrc(URL.createObjectURL(file))
          setCropModalOpen(true)
        }
      }
      img.src = URL.createObjectURL(file)
    }
  }

  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, 600, 600) // Truyền 600x600
      // Revoke URL cũ
      if (imagePreview) URL.revokeObjectURL(imagePreview)
      const previewUrl = URL.createObjectURL(croppedImage)
      setImagePreview(previewUrl)
      // Chuyển blob thành file để set vào form
      const file = new File([croppedImage], 'cropped-image.png', { type: 'image/png' })
      setValue('image', [file])
      setCropModalOpen(false)
      // Revoke imageSrc
      if (imageSrc) URL.revokeObjectURL(imageSrc)
      setImageSrc(null)
    } catch {
      toast.error('Failed to crop image')
    }
  }

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

      // Nếu không có ảnh và đang clone, thêm thông báo
      if (!data.image || data.image.length === 0) {
        if (cloneSlug) {
          toast.warning('Please upload an image for the cloned meal')
          setLoading(false)
          return
        }
      }

      await createMenuMealAPI(formData)
      toast.success('Meal created successfully!')
      reset()
      setImagePreview(null)
      navigate('/management/menu-meals/list')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create meal')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (cloneSlug) {
      // Fetch dữ liệu meal để clone
      const fetchCloneData = async () => {
        try {
          const data = await getDetailMenuMealAPI(cloneSlug)
          // Reset toàn bộ form với dữ liệu mới
          reset({
            title: data.title || '',
            description: data.description || '',
            calories: data.calories || '',
            protein: data.protein || '',
            carbs: data.carbs || '',
            fat: data.fat || '',
            price: data.price || '',
            stock: data.stock || '',
            type: data.type || 'BALANCE',
            image: '' // Reset image field
          })
          // Không copy ảnh khi clone, để user upload ảnh mới
          setImagePreview(null)
          setValue('image', '')
          toast.info('Data cloned successfully! You can edit before creating.')
        } catch {
          toast.error('Failed to clone data')
        }
      }
      fetchCloneData()
    }
  }, [cloneSlug, reset, setValue])

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
        <Typography variant="h4" mb={3} align="center" fontWeight={700}>
          {cloneSlug ? 'Clone Meal' : 'Create New Meal'} {/* Thay đổi title nếu clone */}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Grid container spacing={2}>
            <Grid size={12}>
              <Controller
                name="title"
                control={control}
                rules={{ required: 'Title is required' }}
                render={({ field }) => (
                  <TextField
                    label="Title"
                    fullWidth
                    {...field}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={12}>
              <Controller
                name="description"
                control={control}
                rules={{ required: 'Description is required' }}
                render={({ field }) => (
                  <TextField
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                    {...field}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="calories"
                control={control}
                rules={{ required: 'Calories is required', min: 0 }}
                render={({ field }) => (
                  <TextField
                    label="Calories"
                    type="number"
                    fullWidth
                    InputProps={{ endAdornment: <InputAdornment position="end">kcal</InputAdornment> }}
                    {...field}
                    error={!!errors.calories}
                    helperText={errors.calories?.message}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="protein"
                control={control}
                rules={{ required: 'Protein is required', min: 0 }}
                render={({ field }) => (
                  <TextField
                    label="Protein"
                    type="number"
                    fullWidth
                    InputProps={{ endAdornment: <InputAdornment position="end">g</InputAdornment> }}
                    {...field}
                    error={!!errors.protein}
                    helperText={errors.protein?.message}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="carbs"
                control={control}
                rules={{ required: 'Carbs is required', min: 0 }}
                render={({ field }) => (
                  <TextField
                    label="Carbs"
                    type="number"
                    fullWidth
                    InputProps={{ endAdornment: <InputAdornment position="end">g</InputAdornment> }}
                    {...field}
                    error={!!errors.carbs}
                    helperText={errors.carbs?.message}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="fat"
                control={control}
                rules={{ required: 'Fat is required', min: 0 }}
                render={({ field }) => (
                  <TextField
                    label="Fat"
                    type="number"
                    fullWidth
                    InputProps={{ endAdornment: <InputAdornment position="end">g</InputAdornment> }}
                    {...field}
                    error={!!errors.fat}
                    helperText={errors.fat?.message}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="price"
                control={control}
                rules={{ required: 'Price is required', min: 0 }}
                render={({ field }) => (
                  <TextField
                    label="Price"
                    type="number"
                    fullWidth
                    InputProps={{ endAdornment: <InputAdornment position="end">VNĐ</InputAdornment> }}
                    {...field}
                    error={!!errors.price}
                    helperText={errors.price?.message}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="stock"
                control={control}
                rules={{ required: 'Stock is required', min: 0 }}
                render={({ field }) => (
                  <TextField
                    label="Stock"
                    type="number"
                    fullWidth
                    {...field}
                    error={!!errors.stock}
                    helperText={errors.stock?.message}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                )}
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
                    InputLabelProps={{
                      shrink: true
                    }}
                  >
                    {typeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid size={12}>
              <Controller
                name="image"
                control={control}
                rules={{ required: cloneSlug ? false : 'Image is required' }}
                render={() => (
                  <>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      sx={{ mb: 1, textTransform: 'none' }}
                    >
                      {imagePreview ? 'Change Image' : (cloneSlug ? 'Upload Image (Required)' : 'Upload Image')}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageChange} // Thay đổi để kiểm tra kích thước
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
                {loading ? 'Creating...' : (cloneSlug ? 'Create Cloned Meal' : 'Create Meal')}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Modal Crop */}
      <Modal open={cropModalOpen} onClose={() => setCropModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" mb={2}>Crop Image to 600x600</Typography>
          <Box sx={{ position: 'relative', height: 300, width: '100%' }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1} // 1:1 để đảm bảo vuông
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={() => setCropModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCropSave} variant="contained">Save Crop</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

export default MenuMealCreate
