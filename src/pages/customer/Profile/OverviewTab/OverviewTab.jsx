
import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import { toast } from 'react-toastify'
import { createCustomerReferenceAPI } from '~/apis'

export default function OverviewTab({ customerDetails, setCustomerDetails }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    vegetarianType: '',
    canEatEggs: false,
    canEatDairy: false,
    note: '',
    favoriteProteins: [],
    favoriteCarbs: [],
    favoriteVegetables: [],
    allergies: [],
    customProtein: '',
    customCarb: '',
    customVegetable: '',
    customAllergy: ''
  })

  // Options for food preferences
  const proteinOptions = [
    'Thịt bò', 'Thịt gà', 'Thịt heo', 'Cá hồi', 'Cá thu', 'Tôm', 'Cua', 'Mực',
    'Đậu phụ', 'Tempeh', 'Đậu đen', 'Đậu xanh', 'Trứng gà', 'Trứng vịt'
  ]

  const carbOptions = [
    'Cơm trắng', 'Cơm gạo lức', 'Cơm tím', 'Khoai lang', 'Khoai tây', 'Bí đỏ',
    'Bún', 'Phở', 'Mì ý', 'Yến mạch', 'Quinoa', 'Bánh mì nguyên cám'
  ]

  const vegetableOptions = [
    'Salad xanh', 'Cà rót', 'Bông cải xanh', 'Bông cải trắng', 'Rau muống',
    'Rau cải', 'Cà chua', 'Dưa chuột', 'Ớt chuông', 'Nấm', 'Giá đỗ', 'Cần tây'
  ]

  const allergyOptions = [
    'Đậu phộng', 'Hạt điều', 'Tôm cua', 'Sữa', 'Trứng', 'Gluten',
    'Đậu nành', 'Hạt mè', 'Cá', 'Shellfish'
  ]

  const vegetarianTypes = [
    { value: 'NEVER', label: 'Ăn mặn' },
    { value: 'VEGAN', label: 'Ăn thuần chay' },
    { value: 'LUNAR_VEGAN', label: 'Ăn chay 2 ngày rằm mỗi tháng' }
  ]

  // Handle checkbox changes
  const handleCheckboxChange = (category, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }))
  }

  // Handle custom input changes
  const handleCustomInputChange = (category, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: value
    }))
  }

  // Add custom item to list
  const addCustomItem = (category, customField) => {
    const customValue = formData[customField].trim()
    if (customValue && !formData[category].includes(customValue)) {
      setFormData(prev => ({
        ...prev,
        [category]: [...prev[category], customValue],
        [customField]: ''
      }))
    }
  }

  // Remove item from list
  const removeItem = (category, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item !== value)
    }))
  }

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true)

      // Prepare data for API
      const referenceData = {
        customer: {
          id: customerDetails.id
        },
        vegetarianType: formData.vegetarianType || 'NEVER',
        canEatEggs: formData.canEatEggs,
        canEatDairy: formData.canEatDairy,
        note: formData.note,
        favoriteProteins: formData.favoriteProteins.map(name => ({ proteinName: name })),
        favoriteCarbs: formData.favoriteCarbs.map(name => ({ carbName: name })),
        favoriteVegetables: formData.favoriteVegetables.map(name => ({ vegetableName: name })),
        allergies: formData.allergies.map(name => ({ allergyName: name }))
      }

      const createdReference = await createCustomerReferenceAPI(referenceData)

      // Update customer details with new reference
      setCustomerDetails(prev => ({
        ...prev,
        customerReference: createdReference
      }))

      toast.success('Đã lưu thông tin sở thích thành công!')
    } catch {
      toast.error('Có lỗi xảy ra khi lưu thông tin!')
    } finally {
      setLoading(false)
    }
  }
  if (loading) {
    return <CircularProgress />
  }
  // Nếu đã có customerReference, hiển thị thông tin gọn gàng theo chiều ngang
  if (customerDetails?.customerReference) {
    const reference = customerDetails.customerReference

    // Helper để lấy label chế độ ăn
    const vegetarianLabel =
      vegetarianTypes.find(v => v.value === reference.vegetarianType)?.label || 'Không xác định'

    // Helper để lấy danh sách tên từ mảng object
    const getNames = (arr, key) =>
      Array.isArray(arr) && arr.length > 0
        ? arr.map(item => item[key]).join(', ')
        : 'Chưa có thông tin'

    return (
      <Box sx={{
        p: { xs: 2, sm: 3, md: 4 },
        maxWidth: '900px',
        mx: 'auto'
      }}>
        <Box sx={{
          textAlign: 'center',
          mb: 4,
          p: 3,
          backgroundColor: 'primary.main',
          borderRadius: 2,
          color: 'white'
        }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            🌟 Hồ sơ ẩm thực của bạn
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Thông tin sở thích và chế độ ăn uống đã được lưu
          </Typography>
        </Box>

        <Box sx={{
          backgroundColor: 'white',
          borderRadius: 2,
          p: { xs: 2, sm: 3 },
          boxShadow: 1
        }}>
          {/* Chế độ ăn uống */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
            <Typography sx={{ fontWeight: 'bold', minWidth: 140 }}>🥗 Chế độ ăn uống:</Typography>
            <Typography sx={{ ml: 1 }}>{vegetarianLabel}</Typography>
            {(reference.canEatEggs || reference.canEatDairy) && (
              <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                {reference.canEatEggs && (
                  <Chip label="Ăn được trứng" color="success" size="small" icon={<span>🥚</span>} />
                )}
                {reference.canEatDairy && (
                  <Chip label="Ăn được sữa" color="success" size="small" icon={<span>🥛</span>} />
                )}
              </Box>
            )}
          </Box>

          {/* Ghi chú */}
          {reference.note && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
              <Typography sx={{ fontWeight: 'bold', minWidth: 140 }}>💭 Ghi chú:</Typography>
              <Typography sx={{ ml: 1 }}>{reference.note}</Typography>
            </Box>
          )}

          {/* Dị ứng thực phẩm */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
            <Typography sx={{ fontWeight: 'bold', minWidth: 140, color: 'error.main' }}>
              ⚠️ Dị ứng thực phẩm:
            </Typography>
            <Typography sx={{ ml: 1 }}>
              {getNames(reference.allergies, 'allergyName') === 'Chưa có thông tin'
                ? <span style={{ color: '#43a047', fontWeight: 500 }}>Không có dị ứng nào</span>
                : getNames(reference.allergies, 'allergyName')}
            </Typography>
          </Box>

          {/* Protein yêu thích */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
            <Typography sx={{ fontWeight: 'bold', minWidth: 140 }}>🥩 Protein yêu thích:</Typography>
            <Typography sx={{ ml: 1 }}>
              {getNames(reference.favoriteProteins, 'proteinName')}
            </Typography>
          </Box>

          {/* Carbs yêu thích */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
            <Typography sx={{ fontWeight: 'bold', minWidth: 140 }}>🍚 Carbs yêu thích:</Typography>
            <Typography sx={{ ml: 1 }}>
              {getNames(reference.favoriteCarbs, 'carbName')}
            </Typography>
          </Box>

          {/* Rau củ yêu thích */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
            <Typography sx={{ fontWeight: 'bold', minWidth: 140 }}>🥬 Rau củ yêu thích:</Typography>
            <Typography sx={{ ml: 1 }}>
              {getNames(reference.favoriteVegetables, 'vegetableName')}
            </Typography>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ 
        backgroundColor: 'primary.main',
        color: 'white',
        mb: 4 
      }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            🌟 Chào mừng {customerDetails?.fullName}!
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Hãy chia sẻ với chúng tôi về sở thích ẩm thực của bạn để chúng tôi có thể đề xuất những món ăn phù hợp nhất!
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            📝 Thông tin sở thích ẩm thực
          </Typography>

          <Grid container spacing={4}>
            {/* Vegetarian Type */}
            <Grid size={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ fontWeight: 'bold', mb: 1 }}>
                  🥗 Chế độ ăn của bạn
                </FormLabel>
                <RadioGroup
                  value={formData.vegetarianType}
                  onChange={(e) => setFormData(prev => ({ ...prev, vegetarianType: e.target.value }))}
                >
                  {vegetarianTypes.map((type) => (
                    <FormControlLabel
                      key={type.value}
                      value={type.value}
                      control={<Radio />}
                      label={type.label}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Eggs and Dairy */}
            <Grid size={12}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.canEatEggs}
                      onChange={(e) => setFormData(prev => ({ ...prev, canEatEggs: e.target.checked }))}
                    />
                  }
                  label="🥚 Tôi có thể ăn trứng"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.canEatDairy}
                      onChange={(e) => setFormData(prev => ({ ...prev, canEatDairy: e.target.checked }))}
                    />
                  }
                  label="🥛 Tôi có thể ăn sữa và chế phẩm từ sữa"
                />
              </FormGroup>
            </Grid>

            {/* Note */}
            <Grid size={12}>
              <TextField
                fullWidth
                label="Ghi chú thêm"
                multiline
                rows={3}
                value={formData.note}
                onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                placeholder="Ví dụ: Không ăn cay, thích món nhạt..."
              />
            </Grid>

            {/* Favorite Proteins */}
            <Grid size={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                🥩 Protein yêu thích
              </Typography>
              <FormGroup sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                {proteinOptions.map((protein) => (
                  <FormControlLabel
                    key={protein}
                    control={
                      <Checkbox
                        checked={formData.favoriteProteins.includes(protein)}
                        onChange={() => handleCheckboxChange('favoriteProteins', protein)}
                      />
                    }
                    label={protein}
                    sx={{ minWidth: '200px' }}
                  />
                ))}
              </FormGroup>
              <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  size="small"
                  label="Protein khác"
                  value={formData.customProtein}
                  onChange={(e) => handleCustomInputChange('customProtein', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomItem('favoriteProteins', 'customProtein')}
                />
                <Button 
                  variant="outlined" 
                  onClick={() => addCustomItem('favoriteProteins', 'customProtein')}
                >
                  Thêm
                </Button>
              </Box>
              {formData.favoriteProteins.length > 0 && (
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.favoriteProteins.map((protein, index) => (
                    <Chip
                      key={index}
                      label={protein}
                      onDelete={() => removeItem('favoriteProteins', protein)}
                      color="secondary"
                    />
                  ))}
                </Box>
              )}
            </Grid>

            <Divider />

            {/* Favorite Carbs */}
            <Grid size={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                🍚 Carbs yêu thích
              </Typography>
              <FormGroup sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                {carbOptions.map((carb) => (
                  <FormControlLabel
                    key={carb}
                    control={
                      <Checkbox
                        checked={formData.favoriteCarbs.includes(carb)}
                        onChange={() => handleCheckboxChange('favoriteCarbs', carb)}
                      />
                    }
                    label={carb}
                    sx={{ minWidth: '200px' }}
                  />
                ))}
              </FormGroup>
              <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  size="small"
                  label="Carb khác"
                  value={formData.customCarb}
                  onChange={(e) => handleCustomInputChange('customCarb', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomItem('favoriteCarbs', 'customCarb')}
                />
                <Button 
                  variant="outlined" 
                  onClick={() => addCustomItem('favoriteCarbs', 'customCarb')}
                >
                  Thêm
                </Button>
              </Box>
              {formData.favoriteCarbs.length > 0 && (
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.favoriteCarbs.map((carb, index) => (
                    <Chip
                      key={index}
                      label={carb}
                      onDelete={() => removeItem('favoriteCarbs', carb)}
                      color="info"
                    />
                  ))}
                </Box>
              )}
            </Grid>

            <Divider />

            {/* Favorite Vegetables */}
            <Grid size={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                🥬 Rau củ yêu thích
              </Typography>
              <FormGroup sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                {vegetableOptions.map((vegetable) => (
                  <FormControlLabel
                    key={vegetable}
                    control={
                      <Checkbox
                        checked={formData.favoriteVegetables.includes(vegetable)}
                        onChange={() => handleCheckboxChange('favoriteVegetables', vegetable)}
                      />
                    }
                    label={vegetable}
                    sx={{ minWidth: '200px' }}
                  />
                ))}
              </FormGroup>
              <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  size="small"
                  label="Rau củ khác"
                  value={formData.customVegetable}
                  onChange={(e) => handleCustomInputChange('customVegetable', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomItem('favoriteVegetables', 'customVegetable')}
                />
                <Button 
                  variant="outlined" 
                  onClick={() => addCustomItem('favoriteVegetables', 'customVegetable')}
                >
                  Thêm
                </Button>
              </Box>
              {formData.favoriteVegetables.length > 0 && (
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.favoriteVegetables.map((vegetable, index) => (
                    <Chip
                      key={index}
                      label={vegetable}
                      onDelete={() => removeItem('favoriteVegetables', vegetable)}
                      color="success"
                    />
                  ))}
                </Box>
              )}
            </Grid>

            <Divider />

            {/* Allergies */}
            <Grid size={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'error.main' }}>
                ⚠️ Dị ứng thực phẩm
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Vui lòng chọn các thực phẩm mà bạn bị dị ứng để chúng tôi có thể đề xuất món ăn phù hợp.
              </Alert>
              <FormGroup sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                {allergyOptions.map((allergy) => (
                  <FormControlLabel
                    key={allergy}
                    control={
                      <Checkbox
                        checked={formData.allergies.includes(allergy)}
                        onChange={() => handleCheckboxChange('allergies', allergy)}
                      />
                    }
                    label={allergy}
                    sx={{ minWidth: '200px' }}
                  />
                ))}
              </FormGroup>
              <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  size="small"
                  label="Dị ứng khác"
                  value={formData.customAllergy}
                  onChange={(e) => handleCustomInputChange('customAllergy', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomItem('allergies', 'customAllergy')}
                />
                <Button 
                  variant="outlined" 
                  onClick={() => addCustomItem('allergies', 'customAllergy')}
                >
                  Thêm
                </Button>
              </Box>
              {formData.allergies.length > 0 && (
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.allergies.map((allergy, index) => (
                    <Chip
                      key={index}
                      label={allergy}
                      onDelete={() => removeItem('allergies', allergy)}
                      color="error"
                    />
                  ))}
                </Box>
              )}
            </Grid>

            {/* Submit Button */}
            <Grid size={12}>
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                      Đang lưu...
                    </>
                  ) : (
                    '💾 Lưu thông tin sở thích'
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}
