import { useState, useEffect, useCallback } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { updateCouponAPI, getCouponByIdAPI } from '~/apis'
import { toast } from 'react-toastify'

export default function UpdateCouponModal({ open, onClose, onSuccess, couponId }) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    type: 'PERCENTAGE',
    discountValue: '',
    maxDiscount: '',
    pointsRequired: '',
    validUntil: null,
    exchangeLimit: '',
    status: 'ACTIVE'
  })

  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const fetchCouponData = useCallback(async () => {
    setFetchLoading(true)
    try {
      const coupon = await getCouponByIdAPI(couponId)
      setFormData({
        code: coupon.code || '',
        name: coupon.name || '',
        description: coupon.description || '',
        type: coupon.type || 'PERCENTAGE',
        discountValue: coupon.discountValue || '',
        maxDiscount: coupon.maxDiscount || '',
        pointsRequired: coupon.pointsRequired || '',
        validUntil: coupon.validUntil ? dayjs(coupon.validUntil) : null,
        exchangeLimit: coupon.exchangeLimit || '',
        status: coupon.status || 'ACTIVE'
      })
    } catch {
      toast.error('Failed to load coupon data')
      onClose()
    } finally {
      setFetchLoading(false)
    }
  }, [couponId, onClose])

  useEffect(() => {
    if (open && couponId) {
      fetchCouponData()
    }
  }, [open, couponId, fetchCouponData])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.code.trim()) {
      newErrors.code = 'Coupon code is required'
    } else if (formData.code.length < 3) {
      newErrors.code = 'Coupon code must be at least 3 characters'
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Coupon name is required'
    }

    if (!formData.discountValue || formData.discountValue <= 0) {
      newErrors.discountValue = 'Discount value must be greater than 0'
    } else if (formData.type === 'PERCENTAGE' && formData.discountValue > 100) {
      newErrors.discountValue = 'Percentage discount cannot exceed 100%'
    }

    if (!formData.pointsRequired || formData.pointsRequired < 0) {
      newErrors.pointsRequired = 'Points required must be 0 or greater'
    }

    if (!formData.validUntil) {
      newErrors.validUntil = 'Valid until date is required'
    } else if (formData.validUntil.isBefore(dayjs())) {
      newErrors.validUntil = 'Valid until date must be in the future'
    }

    if (formData.exchangeLimit && formData.exchangeLimit < 0) {
      newErrors.exchangeLimit = 'Exchange limit must be 0 or greater'
    }

    if (formData.maxDiscount && formData.maxDiscount < 0) {
      newErrors.maxDiscount = 'Max discount must be 0 or greater'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const submitData = {
        ...formData,
        code: formData.code.toUpperCase(),
        discountValue: parseFloat(formData.discountValue),
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
        pointsRequired: parseFloat(formData.pointsRequired),
        validUntil: formData.validUntil.toISOString(),
        exchangeLimit: formData.exchangeLimit ? parseInt(formData.exchangeLimit) : null
      }

      await updateCouponAPI(couponId, submitData)
      toast.success('Coupon updated successfully!')
      onSuccess()
      handleClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update coupon')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      type: 'PERCENTAGE',
      discountValue: '',
      maxDiscount: '',
      pointsRequired: '',
      validUntil: null,
      exchangeLimit: '',
      status: 'ACTIVE'
    })
    setErrors({})
    onClose()
  }

  if (fetchLoading) {
    return (
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: '80%', md: 800 },
            maxHeight: '90vh',
            overflow: 'auto',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            textAlign: 'center'
          }}
        >
          <Typography>Loading coupon data...</Typography>
        </Box>
      </Modal>
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="update-coupon-modal-title"
        aria-describedby="update-coupon-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: '80%', md: 800 },
            maxHeight: '90vh',
            overflow: 'auto',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4
          }}
        >
          <Typography
            id="update-coupon-modal-title"
            variant="h5"
            component="h2"
            fontWeight="bold"
            sx={{ mb: 3 }}
          >
            Update Coupon
          </Typography>

          <Box
            id="update-coupon-modal-description"
            component="form"
            sx={{ mt: 2 }}
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Coupon Code"
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  error={!!errors.code}
                  helperText={errors.code}
                  placeholder="e.g., SAVE10, WELCOME2024"
                  slotProps={{
                    htmlInput: { style: { textTransform: 'uppercase' } },
                    inputLabel: { shrink: true }
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Coupon Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  placeholder="e.g., 10% Off First Order"
                  slotProps={{
                    inputLabel: { shrink: true }
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Description (Optional)"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  multiline
                  rows={2}
                  placeholder="Brief description of the coupon"
                  slotProps={{
                    inputLabel: { shrink: true }
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth error={!!errors.type}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={formData.type}
                    label="Type"
                    onChange={(e) => handleInputChange('type', e.target.value)}
                  >
                    <MenuItem value="PERCENTAGE">Percentage Discount</MenuItem>
                    <MenuItem value="FIXED_AMOUNT">Fixed Amount Discount</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={`Discount Value ${formData.type === 'PERCENTAGE' ? '(%)' : '($)'}`}
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => handleInputChange('discountValue', e.target.value)}
                  error={!!errors.discountValue}
                  helperText={errors.discountValue}
                  slotProps={{
                    htmlInput: { min: 0, step: formData.type === 'PERCENTAGE' ? 1 : 0.01 },
                    inputLabel: { shrink: true }
                  }}
                />
              </Grid>

              {formData.type === 'PERCENTAGE' && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Max Discount ($)"
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => handleInputChange('maxDiscount', e.target.value)}
                    error={!!errors.maxDiscount}
                    helperText={errors.maxDiscount || 'Maximum discount amount (optional)'}
                    slotProps={{
                      htmlInput: { min: 0, step: 0.01 },
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>
              )}

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Points Required"
                  type="number"
                  value={formData.pointsRequired}
                  onChange={(e) => handleInputChange('pointsRequired', e.target.value)}
                  error={!!errors.pointsRequired}
                  helperText={errors.pointsRequired}
                  slotProps={{
                    htmlInput: { min: 0, step: 1 },
                    inputLabel: { shrink: true }
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <DateTimePicker
                  label="Valid Until"
                  value={formData.validUntil}
                  onChange={(newValue) => handleInputChange('validUntil', newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.validUntil,
                      helperText: errors.validUntil,
                      slotProps: {
                        htmlInput: {},
                        inputLabel: { shrink: true }
                      }
                    }
                  }}
                  minDateTime={dayjs()}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Exchange Limit (Optional)"
                  type="number"
                  value={formData.exchangeLimit}
                  onChange={(e) => handleInputChange('exchangeLimit', e.target.value)}
                  error={!!errors.exchangeLimit}
                  helperText={errors.exchangeLimit || 'Maximum number of exchanges (leave empty for unlimited)'}
                  slotProps={{
                    htmlInput: { min: 0, step: 1 },
                    inputLabel: { shrink: true }
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    <MenuItem value="ACTIVE">Active</MenuItem>
                    <MenuItem value="INACTIVE">Inactive</MenuItem>
                    <MenuItem value="EXPIRED">Expired</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
              <Button onClick={handleClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={loading}
                sx={{ minWidth: 100 }}
              >
                {loading ? 'Updating...' : 'Update Coupon'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </LocalizationProvider>
  )
}
