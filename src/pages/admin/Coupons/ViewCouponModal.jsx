import { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import { getAllUsersAPI, getCustomerCouponsByCouponIdAPI } from '~/apis'
import { toast } from 'react-toastify'

const ViewCouponModal = ({ open, onClose, couponId, allCoupons }) => {
  const [assignedCustomers, setAssignedCustomers] = useState([])
  const [loadingAssignedCustomers, setLoadingAssignedCustomers] = useState(false)

  // Load customers when view modal opens for specific customer coupons
  useEffect(() => {
    if (open && couponId) {
      const coupon = allCoupons.find(c => c.id === couponId)
      if (coupon?.applicability === 'SPECIFIC_CUSTOMER') {
        loadAssignedCustomers(couponId)
      }
    }
  }, [open, couponId, allCoupons])

  const loadAssignedCustomers = async (couponId) => {
    setLoadingAssignedCustomers(true)
    try {
      // Get customer IDs for this coupon
      const customerIdsResponse = await getCustomerCouponsByCouponIdAPI(couponId)

      // Get all customers to match with customer IDs
      const allCustomers = await getAllUsersAPI()

      // Filter customers that are assigned to this coupon
      const assignedCustomerIds = customerIdsResponse.customerIds || []
      const assigned = allCustomers.filter(customer => assignedCustomerIds.includes(customer.id))

      setAssignedCustomers(assigned)
    } catch {
      toast.error('Failed to load assigned customers')
      setAssignedCustomers([])
    } finally {
      setLoadingAssignedCustomers(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
    case 'ACTIVE': return 'success'
    case 'INACTIVE': return 'warning'
    case 'EXPIRED': return 'error'
    default: return 'default'
    }
  }

  const handleClose = () => {
    onClose()
    setAssignedCustomers([])
    setLoadingAssignedCustomers(false)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Coupon Details
      </DialogTitle>
      <DialogContent>
        {couponId && (() => {
          const coupon = allCoupons.find(c => c.id === couponId)
          if (!coupon) return <Typography>Coupon not found</Typography>

          return (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Code</Typography>
                  <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                    {coupon.code}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                  <Typography variant="h6">{coupon.name}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                  <Typography>{coupon.description || 'No description'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Type</Typography>
                  <Chip
                    label={coupon.type === 'PERCENTAGE' ? 'Percentage Discount' : 'Fixed Amount Discount'}
                    size="small"
                    color={coupon.type === 'PERCENTAGE' ? 'primary' : 'secondary'}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Discount Value</Typography>
                  <Typography variant="h6">
                    {coupon.type === 'PERCENTAGE' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                  </Typography>
                </Grid>
                {coupon.type === 'PERCENTAGE' && coupon.maxDiscount && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">Max Discount</Typography>
                    <Typography>${coupon.maxDiscount}</Typography>
                  </Grid>
                )}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Points Required</Typography>
                  <Typography>{coupon.pointsRequired}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Valid Until</Typography>
                  <Typography>{new Date(coupon.validUntil).toLocaleString()}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Chip
                    label={coupon.status}
                    size="small"
                    color={getStatusColor(coupon.status)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Applicability</Typography>
                  <Chip
                    label={coupon.applicability === 'GENERAL' ? 'General (All Customers)' : 'Specific Customers'}
                    size="small"
                    color={coupon.applicability === 'GENERAL' ? 'success' : 'info'}
                  />
                </Grid>
                {coupon.exchangeLimit && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">Exchange Limit</Typography>
                    <Typography>{coupon.exchangeLimit}</Typography>
                  </Grid>
                )}
              </Grid>

              {/* Customer List for Specific Customer Coupons */}
              {coupon.applicability === 'SPECIFIC_CUSTOMER' && (
                <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Assigned Customers ({assignedCustomers.length})
                  </Typography>
                  {loadingAssignedCustomers ? (
                    <Typography variant="body2" color="text.secondary">
                      Loading assigned customers...
                    </Typography>
                  ) : assignedCustomers.length > 0 ? (
                    <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                      <Grid container spacing={2}>
                        {assignedCustomers.map(customer => (
                          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={customer.id}>
                            <Box sx={{
                              p: 2,
                              border: 1,
                              borderColor: 'divider',
                              borderRadius: 1,
                              bgcolor: 'background.paper'
                            }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                {customer.fullName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {customer.email || customer.phone || 'No contact info'}
                              </Typography>
                              {customer.gender && (
                                <Typography variant="body2" color="text.secondary">
                                  Gender: {customer.gender}
                                </Typography>
                              )}
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No customers assigned to this coupon
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          )
        })()}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewCouponModal
