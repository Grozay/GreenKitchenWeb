import React, { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

// Icons - import từng cái
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import PeopleIcon from '@mui/icons-material/People'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CodeIcon from '@mui/icons-material/Code'
import PercentIcon from '@mui/icons-material/Percent'
import DiscountIcon from '@mui/icons-material/Discount'

const CouponManagement = ({ onShowSnackbar }) => {
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Form state
  const [couponForm, setCouponForm] = useState({
    code: '',
    title: '',
    description: '',
    discountType: 'percentage', // percentage, fixed
    discountValue: '',
    minOrderAmount: '',
    maxDiscount: '',
    usageLimit: '',
    validFrom: '',
    validTo: '',
    isActive: true
  })

  // Coupon data sẽ được load từ API
  const [couponStats, setCouponStats] = useState({
    totalCoupons: 0,
    activeCoupons: 0,
    totalUsage: 0,
    totalDiscount: 0,
    averageUsage: 0
  })
  
  const [coupons, setCoupons] = useState([])

  const handleCreateCoupon = async () => {
    if (!couponForm.code || !couponForm.title || !couponForm.discountValue) {
      onShowSnackbar('Please fill in all required information', 'warning')
      return
    }

    setIsLoading(true)
    
    try {
      // TODO: Gọi API tạo coupon thực tế
      // const response = await createCouponAPI(couponForm)
      
      onShowSnackbar('Coupon created successfully!', 'success')
      setOpenCreateDialog(false)
      resetForm()
      
    } catch (error) {
      onShowSnackbar('Error occurred while creating coupon', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditCoupon = async () => {
    if (!couponForm.code || !couponForm.title || !couponForm.discountValue) {
      onShowSnackbar('Please fill in all required information', 'warning')
      return
    }

    setIsLoading(true)
    
    try {
      // TODO: Gọi API cập nhật coupon thực tế
      // const response = await updateCouponAPI(selectedCoupon.id, couponForm)
      
      onShowSnackbar('Coupon updated successfully!', 'success')
      setOpenEditDialog(false)
      resetForm()
      
    } catch (error) {
      onShowSnackbar('Error occurred while updating coupon', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCoupon = async (couponId) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        // TODO: Gọi API xóa coupon thực tế
        // await deleteCouponAPI(couponId)
        
        onShowSnackbar('Coupon deleted successfully!', 'success')
        
      } catch (error) {
        onShowSnackbar('Error occurred while deleting coupon', 'error')
      }
    }
  }

  const handleEditClick = (coupon) => {
    setSelectedCoupon(coupon)
    setCouponForm({
      code: coupon.code,
      title: coupon.title,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscount: coupon.maxDiscount,
      usageLimit: coupon.usageLimit,
      validFrom: coupon.validFrom,
      validTo: coupon.validTo,
      isActive: coupon.isActive
    })
    setOpenEditDialog(true)
  }

  const resetForm = () => {
    setCouponForm({
      code: '',
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderAmount: '',
      maxDiscount: '',
      usageLimit: '',
      validFrom: '',
      validTo: '',
      isActive: true
    })
  }

  const getDiscountTypeText = (type) => {
    return type === 'percentage' ? 'Percentage' : 'Fixed Amount'
  }

  const getDiscountTypeIcon = (type) => {
    return type === 'percentage' ? <PercentIcon /> : <AttachMoneyIcon />
  }

  const getStatusColor = (isActive) => {
    return isActive ? 'success' : 'error'
  }

  const getStatusText = (isActive) => {
    return isActive ? 'Active' : 'Inactive'
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Coupon Statistics */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: '#f8f9fa' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalOfferIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {couponStats.totalCoupons}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Coupons
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: '#f8f9fa' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ fontSize: 32, mr: 2, color: 'success.main' }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {couponStats.activeCoupons}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Coupons
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: '#f8f9fa' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon sx={{ fontSize: 32, mr: 2, color: 'warning.main' }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {couponStats.totalUsage.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Usage Count
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: '#f8f9fa' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoneyIcon sx={{ fontSize: 32, mr: 2, color: 'info.main' }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(couponStats.totalDiscount)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Discount
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions */}
      <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Coupon Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreateDialog(true)}
            sx={{ bgcolor: 'primary.main' }}
          >
            Create New Coupon
          </Button>
        </Box>
      </Paper>

      {/* Coupons Table */}
      <Paper sx={{ flex: 1 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Coupon Code</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Discount Type</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Value</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Usage</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CodeIcon color="primary" />
                      <Typography variant="body2" sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
                        {coupon.code}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {coupon.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {coupon.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getDiscountTypeIcon(coupon.discountType)}
                      <Typography variant="body2">
                        {getDiscountTypeText(coupon.discountType)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {coupon.discountType === 'percentage' 
                        ? `${coupon.discountValue}%` 
                        : formatCurrency(coupon.discountValue)
                      }
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {coupon.usedCount}/{coupon.usageLimit}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {((coupon.usedCount / coupon.usageLimit) * 100).toFixed(1)}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={getStatusText(coupon.isActive)} 
                      color={getStatusColor(coupon.isActive)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton size="small" color="info">
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleEditClick(coupon)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteCoupon(coupon.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create Coupon Dialog */}
      <Dialog 
        open={openCreateDialog} 
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AddIcon color="primary" />
          Create New Coupon
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Coupon Code *"
                value={couponForm.code}
                onChange={(e) => setCouponForm(prev => ({ ...prev, code: e.target.value }))}
                placeholder="e.g. WELCOME20"
                helperText="Unique coupon code, cannot be duplicated"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Coupon Name *"
                value={couponForm.title}
                onChange={(e) => setCouponForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Welcome new customers"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={couponForm.description}
                onChange={(e) => setCouponForm(prev => ({ ...prev, description: e.target.value }))}
                multiline
                rows={2}
                placeholder="Description chi tiết về coupon"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Discount Type *</InputLabel>
                <Select
                  value={couponForm.discountType}
                  onChange={(e) => setCouponForm(prev => ({ ...prev, discountType: e.target.value }))}
                  label="Discount Type *"
                >
                  <MenuItem value="percentage">Percentage (%)</MenuItem>
                  <MenuItem value="fixed">Fixed Amount (VND)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Discount Value *"
                value={couponForm.discountValue}
                onChange={(e) => setCouponForm(prev => ({ ...prev, discountValue: e.target.value }))}
                placeholder={couponForm.discountType === 'percentage' ? '20' : '50000'}
                helperText={couponForm.discountType === 'percentage' ? 'Enter percentage (0-100)' : 'Enter amount (VND)'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Minimum Order Amount"
                value={couponForm.minOrderAmount}
                onChange={(e) => setCouponForm(prev => ({ ...prev, minOrderAmount: e.target.value }))}
                placeholder="200000"
                helperText="Minimum amount to apply coupon (VND)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Maximum Discount"
                value={couponForm.maxDiscount}
                onChange={(e) => setCouponForm(prev => ({ ...prev, maxDiscount: e.target.value }))}
                placeholder="100000"
                helperText="Maximum Discount cho mỗi đơn hàng (VNĐ)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Usage Limit"
                value={couponForm.usageLimit}
                onChange={(e) => setCouponForm(prev => ({ ...prev, usageLimit: e.target.value }))}
                placeholder="500"
                helperText="Maximum usage count for the coupon"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={couponForm.isActive}
                    onChange={(e) => setCouponForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                }
                label="Activate Now"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={couponForm.validFrom}
                onChange={(e) => setCouponForm(prev => ({ ...prev, validFrom: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={couponForm.validTo}
                onChange={(e) => setCouponForm(prev => ({ ...prev, validTo: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateCoupon}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <AddIcon />}
          >
            {isLoading ? 'Creating...' : 'Create Coupon'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Coupon Dialog */}
      <Dialog 
        open={openEditDialog} 
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EditIcon color="primary" />
          Edit Coupon
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Coupon Code *"
                value={couponForm.code}
                onChange={(e) => setCouponForm(prev => ({ ...prev, code: e.target.value }))}
                placeholder="e.g. WELCOME20"
                helperText="Unique coupon code, cannot be duplicated"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Coupon Name *"
                value={couponForm.title}
                onChange={(e) => setCouponForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Welcome new customers"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={couponForm.description}
                onChange={(e) => setCouponForm(prev => ({ ...prev, description: e.target.value }))}
                multiline
                rows={2}
                placeholder="Description chi tiết về coupon"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Discount Type *</InputLabel>
                <Select
                  value={couponForm.discountType}
                  onChange={(e) => setCouponForm(prev => ({ ...prev, discountType: e.target.value }))}
                  label="Discount Type *"
                >
                  <MenuItem value="percentage">Percentage (%)</MenuItem>
                  <MenuItem value="fixed">Fixed Amount (VND)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Discount Value *"
                value={couponForm.discountValue}
                onChange={(e) => setCouponForm(prev => ({ ...prev, discountValue: e.target.value }))}
                placeholder={couponForm.discountType === 'percentage' ? '20' : '50000'}
                helperText={couponForm.discountType === 'percentage' ? 'Enter percentage (0-100)' : 'Enter amount (VND)'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Minimum Order Amount"
                value={couponForm.minOrderAmount}
                onChange={(e) => setCouponForm(prev => ({ ...prev, minOrderAmount: e.target.value }))}
                placeholder="200000"
                helperText="Minimum amount to apply coupon (VND)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Maximum Discount"
                value={couponForm.maxDiscount}
                onChange={(e) => setCouponForm(prev => ({ ...prev, maxDiscount: e.target.value }))}
                placeholder="100000"
                helperText="Maximum Discount cho mỗi đơn hàng (VNĐ)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Usage Limit"
                value={couponForm.usageLimit}
                onChange={(e) => setCouponForm(prev => ({ ...prev, usageLimit: e.target.value }))}
                placeholder="500"
                helperText="Maximum usage count for the coupon"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={couponForm.isActive}
                    onChange={(e) => setCouponForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                }
                label="Kích hoạt"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={couponForm.validFrom}
                onChange={(e) => setCouponForm(prev => ({ ...prev, validFrom: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={couponForm.validTo}
                onChange={(e) => setCouponForm(prev => ({ ...prev, validTo: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleEditCoupon}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <EditIcon />}
          >
            {isLoading ? 'Updating...' : 'Update Coupon'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CouponManagement
