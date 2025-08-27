import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Container from '@mui/material/Container'
import CircularProgress from '@mui/material/CircularProgress'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getOrderByCodeAPI, updateOrderStatusAPI } from '~/apis'
import { Button } from '@mui/material'
import { ORDER_STATUS } from '~/utils/constants'
import { toast } from 'react-toastify'
import { useConfirm } from 'material-ui-confirm'
import { formatDateToMinute } from '~/utils/formatter'


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
export default function OrderDetails() {
  const { orderCode } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [statusUpdating, setStatusUpdating] = useState(false)
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
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}><CircularProgress /></Box>
  }
  if (!order) {
    return <Typography color="error">Order not found</Typography>
  }
  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" gutterBottom>ORDER #{order.orderCode || order.code}</Typography>
      <Divider sx={{ mb: 2 }} />
      {/* Status hint notification box */}
      <Box sx={{ mb: 1, p: 2, borderRadius: 2, bgcolor: '#fff3e0', boxShadow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {order.status === ORDER_STATUS.PENDING && (
          <Typography color={getStatusColor(order.status)} sx={{ fontWeight: 600, fontSize: 16 }}>Customer just placed the order. Please call to confirm with the customer.</Typography>
        )}
        {order.status === ORDER_STATUS.CONFIRMED && (
          <Typography color={getStatusColor(order.status)} sx={{ fontWeight: 600, fontSize: 16 }}>Order confirmed. Prepare the meal and get ready for delivery.</Typography>
        )}
        {order.status === ORDER_STATUS.PREPARING && (
          <Typography color={getStatusColor(order.status)} sx={{ fontWeight: 600, fontSize: 16 }}>Meal is being prepared. Please check kitchen progress.</Typography>
        )}
        {order.status === ORDER_STATUS.SHIPPING && (
          <Typography color={getStatusColor(order.status)} sx={{ fontWeight: 600, fontSize: 16 }}>Order is out for delivery. Track the delivery status.</Typography>
        )}
        {order.status === ORDER_STATUS.DELIVERED && (
          <Typography color={getStatusColor(order.status)} sx={{ fontWeight: 600, fontSize: 16 }}>Order delivered successfully. Thank you for your purchase!</Typography>
        )}
      </Box>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Box sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: '#f3e5f5' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                mb: 2
              }}
            >
              <Typography variant="h5" gutterBottom>ORDER PROCESSING</Typography>
              {currentStep < statusSteps.length - 1 && (
                <Box>
                  <Button
                    onClick={handleUpdateStatus}
                    disabled={statusUpdating}
                    variant="contained"
                    color="primary"
                  >
                    {statusUpdating ? 'Updating...' : `SET ${statusSteps[currentStep + 1]}`}
                  </Button>
                </Box>
              )}
            </Box>


            {/* Status Stepper */}
            <Box sx={{ width: '100%', maxWidth: 700, mx: 'auto', mb: 2 }}>
              <Stepper activeStep={currentStep} alternativeLabel>
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
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Typography sx={{ fontWeight: 600 }}>{step}</Typography>
                          {time && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                              {formatDateToMinute(time)}
                            </Typography>
                          )}
                        </Box>
                      </StepLabel>
                    </Step>
                  )
                })}
              </Stepper>
            </Box>
          </Box>

          {/** Order Information */}
          <Grid size={12} sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: '#f5f5f5' }}>
            <Typography variant="h6" gutterBottom>Order Information</Typography>
            <Typography><strong>Customer ID:</strong> {order.customerId || order.customer?.id}</Typography>
            <Typography><strong>Recipient:</strong> {order.recipientName}</Typography>
            <Typography><strong>Phone:</strong> {order.recipientPhone}</Typography>
            <Typography><strong>Address:</strong> {[order.street, order.ward, order.district, order.city].filter(Boolean).join(', ')}</Typography>
            <Typography><strong>Delivery Time:</strong> {order.deliveryTime ? new Date(order.deliveryTime).toLocaleString() : ''}</Typography>
            <Typography><strong>Created At:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</Typography>
          </Grid>
          <Grid size={12} sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: '#e3f2fd' }}>
            <Typography variant="h6" gutterBottom>Payment Information</Typography>
            <Typography><strong>Payment Method:</strong> {order.paymentMethod}</Typography>
            <Typography><strong>Payment Status:</strong> <Chip variant='outlined' label={order.paymentStatus} color={order.paymentStatus === 'COMPLETED' ? 'success' : 'warning'} /></Typography>
          </Grid>
          <Grid size={12} sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: '#fffde7' }}>
            <Typography variant="h6" gutterBottom>Pricing Information</Typography>
            <Typography><strong>Subtotal:</strong> {order.subtotal?.toLocaleString() || 0}₫</Typography>
            <Typography><strong>Shipping Fee:</strong> {order.shippingFee?.toLocaleString() || 0}₫</Typography>
            <Typography><strong>Membership Discount:</strong> {order.membershipDiscount?.toLocaleString() || 0}₫</Typography>
            <Typography><strong>Coupon Discount:</strong> {order.couponDiscount?.toLocaleString() || 0}₫</Typography>
            <Typography><strong>Total Amount:</strong> <strong>{order.totalAmount?.toLocaleString()}₫</strong></Typography>
            <Typography><strong>Point Earn:</strong> {order.pointEarn}</Typography>
            {order.notes && <Typography><strong>Notes:</strong> {order.notes}</Typography>}
          </Grid>
        </Grid>
        {/* Right Column: Items & Status */}
        <Grid size={12}>
          <Typography variant="h6" gutterBottom>Order Items</Typography>
          <Box sx={{ mb: 2 }}>
            {order.orderItems && order.orderItems.length > 0 ? order.orderItems.map((item, idx) => (
              <Box key={idx} sx={{ mb: 2, display: 'flex', alignItems: 'center', bgcolor: '#f9fbe7', p: 1, borderRadius: 2 }}>
                {item.image && (
                  <Box sx={{ width: 64, height: 64, mr: 2 }}>
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                  </Box>
                )}
                <Box>
                  <Typography variant="subtitle1"><strong>{item.title}</strong> x {item.quantity} ({item.unitPrice?.toLocaleString()}₫)</Typography>
                  <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                  {item.notes && <Typography variant="body2" color="text.secondary">Ghi chú: {item.notes}</Typography>}
                </Box>
              </Box>
            )) : <Typography color="text.secondary">No items</Typography>}
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}