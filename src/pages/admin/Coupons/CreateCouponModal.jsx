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
import CustomerList from '~/pages/admin/Coupons/CustomerList'
import Chip from '@mui/material/Chip'
import dayjs from 'dayjs'
import { createCouponAPI, getAllUsersAPI, updateCouponAPI, getCouponByIdAPI } from '~/apis'
import { toast } from 'react-toastify'

export default function CreateCouponModal({ open, onClose, onSuccess, isUpdate = false, couponId = null }) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    type: 'PERCENTAGE',
    discountValue: '',
    maxDiscount: '',
    pointsRequired: 0, // Default to 0
    validUntil: dayjs().add(30, 'day'), // Default 30 days from now
    exchangeLimit: '',
    status: 'ACTIVE',
    couponType: 'GENERAL', // GENERAL or SPECIFIC_CUSTOMER
    specificCustomers: [] // Array of selected customer IDs
  })

  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingCustomers, setLoadingCustomers] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [customerSearchTerm, setCustomerSearchTerm] = useState('')

  // Load customers only when SPECIFIC_CUSTOMER is selected and not in update mode
  useEffect(() => {
    if (formData.couponType === 'SPECIFIC_CUSTOMER' && !isUpdate) {
      loadCustomers()
    } else {
      // Clear customers list when switching back to GENERAL or in update mode
      setCustomers([])
      setFormData(prev => ({
        ...prev,
        specificCustomers: []
      }))
    }
  }, [formData.couponType, isUpdate])

  // Fetch coupon data when in update mode
  const fetchCouponData = useCallback(async () => {
    if (!isUpdate || !couponId) return

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
        pointsRequired: coupon.pointsRequired || 0,
        validUntil: coupon.validUntil ? dayjs(coupon.validUntil) : dayjs().add(30, 'day'),
        exchangeLimit: coupon.exchangeLimit || '',
        status: coupon.status || 'ACTIVE',
        couponType: coupon.applicability || 'GENERAL', // Set couponType from applicability
        specificCustomers: [] // Will be loaded separately if needed
      })
    } catch {
      toast.error('Failed to load coupon data')
      onClose()
    } finally {
      setFetchLoading(false)
    }
  }, [isUpdate, couponId, onClose])

  useEffect(() => {
    if (open && isUpdate && couponId) {
      fetchCouponData()
    }
  }, [open, isUpdate, couponId, fetchCouponData])

  const loadCustomers = async () => {
    setLoadingCustomers(true)
    try {
      const response = await getAllUsersAPI()
      setCustomers(response)
    } catch {
      toast.error('Failed to load customers')
    } finally {
      setLoadingCustomers(false)
    }
  }

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

  const handleCustomerSelect = (customer) => {
    const isSelected = formData.specificCustomers.includes(customer.id)
    if (isSelected) {
      // Remove customer
      handleInputChange('specificCustomers',
        formData.specificCustomers.filter(id => id !== customer.id))
    } else {
      // Add customer
      handleInputChange('specificCustomers',
        [...formData.specificCustomers, customer.id])
    }
  }

  const handleCustomerRemove = (customerId) => {
    handleInputChange('specificCustomers',
      formData.specificCustomers.filter(id => id !== customerId))
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

    // Points required validation
    if (formData.pointsRequired < 0) {
      newErrors.pointsRequired = 'Points required must be 0 or greater'
    }

    if (!formData.validUntil) {
      newErrors.validUntil = 'Valid until date is required'
    } else if (formData.validUntil.isBefore(dayjs())) {
      newErrors.validUntil = 'Valid until date must be in the future'
    }

    // Exchange limit validation - only validate when updating
    if (isUpdate && formData.exchangeLimit && formData.exchangeLimit < 0) {
      newErrors.exchangeLimit = 'Exchange limit must be 0 or greater'
    }

    if (formData.maxDiscount && formData.maxDiscount < 0) {
      newErrors.maxDiscount = 'Max discount must be 0 or greater'
    }

    // Validate specific customers if coupon type is SPECIFIC_CUSTOMER
    if (formData.couponType === 'SPECIFIC_CUSTOMER') {
      if (!formData.specificCustomers || formData.specificCustomers.length === 0) {
        newErrors.specificCustomers = 'At least one customer must be selected for specific customer coupons'
      }
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
        code: formData.code.toUpperCase(),
        name: formData.name,
        description: formData.description,
        type: formData.type,
        discountValue: parseFloat(formData.discountValue),
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
        pointsRequired: parseFloat(formData.pointsRequired),
        validUntil: formData.validUntil.toISOString(),
        exchangeLimit: formData.exchangeLimit ? parseInt(formData.exchangeLimit) : null,
        status: formData.status,
        // Map couponType to applicability for backend (only for create)
        ...(isUpdate ? {} : { applicability: formData.couponType }),
        // Include customer IDs if specific customer coupon and not update
        ...(isUpdate ? {} : { customerIds: formData.couponType === 'SPECIFIC_CUSTOMER' ? formData.specificCustomers : null })
      }

      if (isUpdate) {
        await updateCouponAPI(couponId, submitData)
        toast.success('Coupon updated successfully!')
      } else {
        // Create coupon first
        await createCouponAPI(submitData)
        
        // Note: Customer coupons are automatically created by backend when applicability is SPECIFIC_CUSTOMER
        // No need to call createBulkCustomerCouponsAPI separately
        toast.success('Coupon created successfully!')
      }

      onSuccess()
      handleClose()
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${isUpdate ? 'update' : 'create'} coupon`)
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
      pointsRequired: 0, // Reset to default 0
      validUntil: dayjs().add(30, 'day'),
      exchangeLimit: '',
      status: 'ACTIVE',
      couponType: 'GENERAL',
      specificCustomers: []
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
        aria-labelledby="create-coupon-modal-title"
        aria-describedby="create-coupon-modal-description"
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
            id="create-coupon-modal-title"
            variant="h5"
            component="h2"
            fontWeight="bold"
            sx={{ mb: 3 }}
          >
            {isUpdate ? 'Update Coupon' : 'Create New Coupon'}
          </Typography>

          <Box
            id="create-coupon-modal-description"
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

              {/* Coupon Type Selection - Move to top */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Coupon Type</InputLabel>
                  <Select
                    value={formData.couponType}
                    label="Coupon Type"
                    onChange={(e) => handleInputChange('couponType', e.target.value)}
                  >
                    <MenuItem value="GENERAL">General (All Customers)</MenuItem>
                    <MenuItem value="SPECIFIC_CUSTOMER">Specific Customers Only</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Customer Selection - Only show if SPECIFIC_CUSTOMER and not update */}
              {formData.couponType === 'SPECIFIC_CUSTOMER' && !isUpdate && (
                <Grid size={{ xs: 12 }} sx={{ width: '100%' }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Chọn khách hàng cụ thể ({formData.specificCustomers.length} đã chọn)
                  </Typography>

                  {/* Customer Search Field */}
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Tìm kiếm khách hàng theo tên, email hoặc số điện thoại..."
                    value={customerSearchTerm}
                    onChange={(e) => setCustomerSearchTerm(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  {/* Customer List - Only show when search term exists */}
                  {customerSearchTerm.trim() && (
                    <Box sx={{
                      maxHeight: 300,
                      overflow: 'auto',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      p: 1,
                      width: '100%'
                    }}>
                      <CustomerList
                        customers={customers}
                        loading={loadingCustomers}
                        onCustomerSelect={handleCustomerSelect}
                        onCustomerRemove={handleCustomerRemove}
                        showRemove={false}
                        emptyMessage="Không có khách hàng nào"
                        searchTerm={customerSearchTerm}
                      />
                    </Box>
                  )}

                  {/* Show message when no search term */}
                  {!customerSearchTerm.trim() && (
                    <Box sx={{
                      textAlign: 'center',
                      p: 3,
                      border: '1px dashed',
                      borderColor: 'divider',
                      borderRadius: 1,
                      backgroundColor: 'action.hover'
                    }}>
                      <Typography variant="body2" color="text.secondary">
                        Nhập từ khóa tìm kiếm để hiển thị danh sách khách hàng
                      </Typography>
                    </Box>
                  )}

                  {formData.specificCustomers.length > 0 && (
                    <Box sx={{ mt: 2, width: '100%' }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Đã chọn ({formData.specificCustomers.length}):
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, width: '100%' }}>
                        {formData.specificCustomers.map(customerId => {
                          const customer = customers.find(c => c.id === customerId)
                          return customer ? (
                            <Chip
                              key={customer.id}
                              label={`${customer.fullName} (${customer.email || customer.phone || 'No contact'})`}
                              onDelete={() => handleCustomerRemove(customer.id)}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ maxWidth: '100%' }}
                            />
                          ) : null
                        })}
                      </Box>
                    </Box>
                  )}

                  {errors.specificCustomers && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                      {errors.specificCustomers}
                    </Typography>
                  )}
                </Grid>
              )}

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth error={!!errors.type}>
                  <InputLabel>Discount Type</InputLabel>
                  <Select
                    value={formData.type}
                    label="Discount Type"
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
                  helperText={errors.pointsRequired || 'Points required to exchange this coupon (0 or greater)'}
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
                  format="DD/MM/YYYY HH:mm"
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
                  disabled={!isUpdate} // Only enabled when updating
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
                    {isUpdate && <MenuItem value="EXPIRED">Expired</MenuItem>}
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
                {loading ? (isUpdate ? 'Updating...' : 'Creating...') : (isUpdate ? 'Update Coupon' : 'Create Coupon')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </LocalizationProvider>
  )
}
