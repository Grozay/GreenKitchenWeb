import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import dayjs from 'dayjs'
import { useState } from 'react'

const DeliveryInfoForm = ({ 
  deliveryInfo, 
  setDeliveryInfo, 
  errors, 
  customerDetails 
}) => {
  const [showCustomForm, setShowCustomForm] = useState(false)
  
  const handleChange = (field) => (event) => {
    setDeliveryInfo(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const handleDateChange = (newDate) => {
    if (newDate && deliveryInfo.deliveryTime) {
      // Keep the time, update the date
      const currentTime = dayjs(deliveryInfo.deliveryTime)
      const newDateTime = newDate
        .hour(currentTime.hour())
        .minute(currentTime.minute())
      
      setDeliveryInfo(prev => ({
        ...prev,
        deliveryTime: newDateTime
      }))
    } else if (newDate) {
      // Set default time to current time + 30 minutes if no time set
      const defaultTime = dayjs().add(30, 'minute')
      const newDateTime = newDate
        .hour(defaultTime.hour())
        .minute(defaultTime.minute())
      
      setDeliveryInfo(prev => ({
        ...prev,
        deliveryTime: newDateTime
      }))
    }
  }

  const handleTimeChange = (newTime) => {
    if (newTime && deliveryInfo.deliveryTime) {
      // Keep the date, update the time
      const currentDate = dayjs(deliveryInfo.deliveryTime)
      const newDateTime = currentDate
        .hour(newTime.hour())
        .minute(newTime.minute())
      
      setDeliveryInfo(prev => ({
        ...prev,
        deliveryTime: newDateTime
      }))
    } else if (newTime) {
      // Set default date to today if no date set
      const defaultDate = dayjs()
      const newDateTime = defaultDate
        .hour(newTime.hour())
        .minute(newTime.minute())
      
      setDeliveryInfo(prev => ({
        ...prev,
        deliveryTime: newDateTime
      }))
    }
  }

  // Check if customer has default address and deliveryInfo is filled
  const defaultAddress = customerDetails?.addresses?.find(addr => addr.isDefault === true)
  const hasDefaultAddressData = defaultAddress && 
    deliveryInfo.recipientName && 
    deliveryInfo.street && 
    deliveryInfo.ward && 
    deliveryInfo.district && 
    deliveryInfo.city

  const handleDifferentAddress = () => {
    setShowCustomForm(true)
    // Clear address fields but keep name and phone
    setDeliveryInfo(prev => ({
      ...prev,
      street: '',
      ward: '',
      district: '',
      city: ''
    }))
  }

  const handleUseDefaultAddress = () => {
    setShowCustomForm(false)
    // Restore default address
    if (defaultAddress) {
      setDeliveryInfo(prev => ({
        ...prev,
        recipientName: defaultAddress.recipientName || customerDetails.fullName || '',
        recipientPhone: defaultAddress.recipientPhone || customerDetails.phone || '',
        street: defaultAddress.street || '',
        ward: defaultAddress.ward || '',
        district: defaultAddress.district || '',
        city: defaultAddress.city || ''
      }))
    }
  }

  return (
    <Box sx={{
      bgcolor: 'white',
      borderRadius: 5,
      border: '1px solid #e0e0e0',
      overflow: 'hidden',
      mb: 3
    }}>
      {/* Header */}
      <Box sx={{
        bgcolor: '#f8f9fa',
        px: 3,
        py: 2,
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c2c2c' }}>
          THÔNG TIN GIAO HÀNG
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        {/* Display default address info or form */}
        {hasDefaultAddressData && !showCustomForm ? (
          <>
            {/* Default Address Display */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: '#2c2c2c' }}>
                Thông tin giao hàng
              </Typography>
              
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c2c2c', mb: 1 }}>
                    {deliveryInfo.recipientName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    {deliveryInfo.recipientPhone}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {deliveryInfo.street}, {deliveryInfo.ward}, {deliveryInfo.district}, {deliveryInfo.city}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: '#4C082A', 
                    fontWeight: 500,
                    display: 'block',
                    mt: 1
                  }}>
                    ✓ Địa chỉ mặc định
                  </Typography>
                </CardContent>
              </Card>
              
              <Button 
                variant="outlined" 
                onClick={handleDifferentAddress}
                sx={{ 
                  color: '#4C082A', 
                  borderColor: '#4C082A',
                  '&:hover': {
                    bgcolor: 'rgba(76, 8, 42, 0.1)',
                    borderColor: '#4C082A'
                  }
                }}
              >
                Different Address
              </Button>
            </Box>
          </>
        ) : (
          <>
            {/* Custom Address Form */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: '#2c2c2c' }}>
                Thông tin người nhận
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Họ và tên người nhận"
                  value={deliveryInfo.recipientName || ''}
                  onChange={handleChange('recipientName')}
                  error={!!errors.recipientName}
                  helperText={errors.recipientName}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  value={deliveryInfo.recipientPhone || ''}
                  onChange={handleChange('recipientPhone')}
                  error={!!errors.recipientPhone}
                  helperText={errors.recipientPhone}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Box>
              
              {defaultAddress && (
                <Button 
                  variant="text" 
                  onClick={handleUseDefaultAddress}
                  sx={{ 
                    color: '#4C082A',
                    p: 0,
                    fontSize: '0.875rem',
                    textTransform: 'none',
                    mb: 2,
                    '&:hover': {
                      bgcolor: 'transparent',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  ← Use Default Address
                </Button>
              )}
            </Box>

            {/* Địa chỉ giao hàng */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: '#2c2c2c' }}>
                Địa chỉ giao hàng
              </Typography>
              
              <TextField
                fullWidth
                label="Địa chỉ cụ thể (Số nhà, tên đường)"
                value={deliveryInfo.street || ''}
                onChange={handleChange('street')}
                error={!!errors.street}
                helperText={errors.street}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Phường/Xã"
                  value={deliveryInfo.ward || ''}
                  onChange={handleChange('ward')}
                  error={!!errors.ward}
                  helperText={errors.ward}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="Quận/Huyện"
                  value={deliveryInfo.district || ''}
                  onChange={handleChange('district')}
                  error={!!errors.district}
                  helperText={errors.district}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Box>
              
              <TextField
                fullWidth
                label="Tỉnh/Thành phố"
                value={deliveryInfo.city || ''}
                onChange={handleChange('city')}
                error={!!errors.city}
                helperText={errors.city}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Box>
          </>
        )}

        {/* Thời gian giao hàng */}
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: '#2c2c2c' }}>
            Thời gian giao hàng mong muốn
          </Typography>
          
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <DatePicker
                label="Chọn ngày"
                value={deliveryInfo.deliveryTime}
                onChange={handleDateChange}
                minDate={dayjs()}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
                slotProps={{
                  textField: {
                    error: !!errors.deliveryTime,
                    helperText: errors.deliveryTime
                  }
                }}
              />
              <TimePicker
                label="Chọn giờ"
                value={deliveryInfo.deliveryTime}
                onChange={handleTimeChange}
                minTime={dayjs().isSame(deliveryInfo.deliveryTime, 'day') ? dayjs().add(30, 'minute') : undefined}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
                slotProps={{
                  textField: {
                    error: !!errors.deliveryTime && !deliveryInfo.deliveryTime,
                    helperText: !!errors.deliveryTime && !deliveryInfo.deliveryTime ? errors.deliveryTime : ''
                  }
                }}
              />
            </Box>
          </LocalizationProvider>
        </Box>
      </Box>
    </Box>
  )
}

export default DeliveryInfoForm
