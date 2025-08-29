import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import CircularProgress from '@mui/material/CircularProgress'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Avatar from '@mui/material/Avatar'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getOrderByCodeAPI, updateOrderStatusAPI } from '~/apis'
import { Button } from '@mui/material'
import { ORDER_STATUS } from '~/utils/constants'
import { toast } from 'react-toastify'
import { useConfirm } from 'material-ui-confirm'
import { formatDateToMinute } from '~/utils/formatter'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import PersonIcon from '@mui/icons-material/Person'
import PaymentIcon from '@mui/icons-material/Payment'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useNavigate } from 'react-router-dom'


function getStatusColor(status) {
  switch (status) {
  case ORDER_STATUS.PENDING: return 'warning'
  case ORDER_STATUS.CONFIRMED: return 'info'
  case ORDER_STATUS.PREPARING: return 'primary'
  case ORDER_STATUS.SHIPPING: return 'secondary'
  case ORDER_STATUS.DELIVERED: return 'success'
  default: return 'default'
  }
}

function getStatusIcon(status) {
  switch (status) {
  case ORDER_STATUS.PENDING: return '⏳'
  case ORDER_STATUS.CONFIRMED: return '✅'
  case ORDER_STATUS.PREPARING: return '👨‍🍳'
  case ORDER_STATUS.SHIPPING: return '🚚'
  case ORDER_STATUS.DELIVERED: return '🎉'
  default: return '❓'
  }
}

export default function OrderDetails() {
  const { orderCode } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [statusUpdating, setStatusUpdating] = useState(false)
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const navigate = useNavigate()

  // Order status steps
  const statusSteps = [
    ORDER_STATUS.PENDING,
    ORDER_STATUS.CONFIRMED,
    ORDER_STATUS.PREPARING,
    ORDER_STATUS.SHIPPING,
    ORDER_STATUS.DELIVERED
  ]

  const currentStep = statusSteps.indexOf(order?.status)
  const confirm = useConfirm()

  useEffect(() => {
    setLoading(true)
    getOrderByCodeAPI(orderCode)
      .then(data => {
        setOrder(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [orderCode])

  const handleUpdateStatus = async () => {
    if (!order) return
    const nextStep = statusSteps[currentStep + 1]
    if (!nextStep) return

    const { confirmed } = await confirm({
      title: 'Confirm Order Status Update',
      description: `Are you sure you want to update the order status to ${nextStep}?`,
      confirmationText: 'Yes, Update',
      cancellationText: 'No, Cancel'
    })
    if (!confirmed) return

    setStatusUpdating(true)
    toast.promise(updateOrderStatusAPI({ id: order.id, status: nextStep }), {
      pending: 'Updating order status...',
      success: 'Order status updated!',
      error: 'Failed to update order status'
    }).then((result) => {
      if (!result) return
      // Prepare new timestamp field
      const now = new Date().toISOString()
      let updatedFields = { status: nextStep }
      if (nextStep === ORDER_STATUS.CONFIRMED) updatedFields.confirmedAt = now
      if (nextStep === ORDER_STATUS.PREPARING) updatedFields.preparingAt = now
      if (nextStep === ORDER_STATUS.SHIPPING) updatedFields.shippingAt = now
      if (nextStep === ORDER_STATUS.DELIVERED) updatedFields.deliveredAt = now
      if (nextStep === ORDER_STATUS.CANCELED) updatedFields.canceledAt = now
      setOrder({ ...order, ...updatedFields })
      setStatusUpdating(false)
    })
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (!order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" color="error" align="center">
          Order not found
        </Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 1 }}>
      {/* Back Button */}
      <Box sx={{ mb: 1 }}>
        <Button
          variant="text"
          onClick={() => navigate('/management/orders')}
          sx={{ minWidth: 'auto', px: 1 }}
        >
          ← Back to Orders
        </Button>
      </Box>

      {/* Compact Header */}
      <Card elevation={2} sx={{ mb: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                <ShoppingCartIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  ORDER #{order.orderCode || order.code}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={`${getStatusIcon(order.status)} ${order.status}`}
                color={getStatusColor(order.status)}
                sx={{ color: 'white', fontWeight: 'bold' }}
              />
              {currentStep < statusSteps.length - 1 && (
                <Button
                  onClick={handleUpdateStatus}
                  disabled={statusUpdating}
                  variant="contained"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                  }}
                >
                  {statusUpdating ? 'Updating...' : `SET ${statusSteps[currentStep + 1]}`}
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Status Progress - Compact */}
      <Card elevation={1} sx={{ mb: 2 }}>
        <CardContent sx={{ py: 1 }}>
          <Stepper
            activeStep={currentStep}
            alternativeLabel={!isSmallScreen}
            orientation={isSmallScreen ? 'vertical' : 'horizontal'}
            sx={{ py: 1 }}
          >
            {statusSteps.map((step, idx) => {
              let time = null
              if (step === ORDER_STATUS.PENDING && order.createdAt) time = order.createdAt
              if (step === ORDER_STATUS.CONFIRMED && (order.confirmedAt || order.confirmAt)) time = order.confirmedAt || order.confirmAt
              if (step === ORDER_STATUS.PREPARING && order.preparingAt) time = order.preparingAt
              if (step === ORDER_STATUS.SHIPPING && order.shippingAt) time = order.shippingAt
              if (step === ORDER_STATUS.DELIVERED && order.deliveredAt) time = order.deliveredAt
              return (
                <Step key={step} completed={idx < currentStep}>
                  <StepLabel>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {getStatusIcon(step)} {step}
                    </Typography>
                    {time && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        {formatDateToMinute(time)}
                      </Typography>
                    )}
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </CardContent>
      </Card>

      {/* Order Items - Compact */}
      <Card elevation={1} sx={{ mb: 2 }}>
        <CardHeader
          title={`Order Items (${order.orderItems?.length || 0})`}
          avatar={<ShoppingCartIcon color="primary" />}
          sx={{ py: 1 }}
        />
        <CardContent sx={{ py: 1 }}>
          {order.orderItems && order.orderItems.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {order.orderItems.map((item, idx) => (
                <Box key={idx} sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  {item.image && (
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.title}
                      sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1, flexShrink: 0 }}
                    />
                  )}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {item.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip label={`${item.quantity}x`} size="small" color="primary" />
                        <Typography variant="body2">
                          × {item.unitPrice?.toLocaleString()}₫
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {(item.quantity * item.unitPrice)?.toLocaleString()}₫
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
              No items in this order
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Customer & Payment Info - Combined */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={1}>
            <CardHeader
              title="Customer & Delivery"
              avatar={<PersonIcon color="primary" />}
              sx={{ py: 1 }}
            />
            <CardContent sx={{ py: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Recipient:</Typography>
                  <Typography variant="body2">{order.recipientName || 'N/A'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Phone:</Typography>
                  <Typography variant="body2">{order.recipientPhone || 'N/A'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Address:</Typography>
                  <Typography variant="body2" sx={{ textAlign: 'right', maxWidth: '60%' }}>
                    {[order.street, order.ward, order.district, order.city].filter(Boolean).join(', ') || 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Delivery Time:</Typography>
                  <Typography variant="body2">
                    {order.deliveryTime ? new Date(order.deliveryTime).toLocaleString() : 'Not specified'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={1}>
            <CardHeader
              title="Payment & Pricing"
              avatar={<PaymentIcon color="primary" />}
              sx={{ py: 1 }}
            />
            <CardContent sx={{ py: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Method:</Typography>
                  <Typography variant="body2">{order.paymentMethod || 'N/A'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Status:</Typography>
                  <Chip
                    label={order.paymentStatus || 'PENDING'}
                    size="small"
                    color={order.paymentStatus === 'COMPLETED' ? 'success' : 'warning'}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Subtotal:</Typography>
                  <Typography variant="body2">{order.subtotal?.toLocaleString() || 0}₫</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Shipping:</Typography>
                  <Typography variant="body2">{order.shippingFee?.toLocaleString() || 0}₫</Typography>
                </Box>
                {(order.membershipDiscount > 0 || order.couponDiscount > 0) && (
                  <>
                    {order.membershipDiscount > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Member Discount:</Typography>
                        <Typography variant="body2" color="success.main">-{order.membershipDiscount?.toLocaleString()}₫</Typography>
                      </Box>
                    )}
                    {order.couponDiscount > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Coupon Discount:</Typography>
                        <Typography variant="body2" color="success.main">-{order.couponDiscount?.toLocaleString()}₫</Typography>
                      </Box>
                    )}
                  </>
                )}
                <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 1, mt: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total:</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {order.totalAmount?.toLocaleString()}₫
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right' }}>
                    Points: {order.pointEarn}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Order Notes */}
      {order.notes && (
        <Card elevation={1} sx={{ mt: 2 }}>
          <CardContent sx={{ py: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Order Notes:</Typography>
            <Typography variant="body2" color="text.secondary">{order.notes}</Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  )
}