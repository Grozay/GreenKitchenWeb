import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ScheduleIcon from '@mui/icons-material/Schedule'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import Chip from '@mui/material/Chip'
import theme from '~/theme'
import useMediaQuery from '@mui/material/useMediaQuery'
import { getOrderByCodeAPI, fetchCustomMealByIdAPI, getCustomerWeekMealByIdAPI } from '~/apis'
import WeekMealPlan from '~/components/WeekMealPlan/WeekMealPlan'

export default function OrderDetails({ orderCode: propOrderCode }) {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [customMealDetails, setCustomMealDetails] = useState({})
  const [weekMealDetails, setWeekMealDetails] = useState({})

  const code = propOrderCode || orderId

  // Calculate subtotal from order items
  const calculateSubtotal = () => {
    if (!order?.orderItems) return 0
    return order.orderItems.reduce((sum, item) => {
      return sum + (item.totalPrice || (item.unitPrice * item.quantity) || 0)
    }, 0)
  }

  const subtotal = calculateSubtotal()

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!code) return

      try {
        setLoading(true)
        setError(null)
        const orderData = await getOrderByCodeAPI(code)
        setOrder(orderData)

        // Fetch custom meal details if any
        if (orderData.orderItems) {
          const customMealIds = orderData.orderItems
            .filter(item => item.itemType === 'CUSTOM_MEAL' && item.customMealId)
            .map(item => item.customMealId)

          if (customMealIds.length > 0) {
            // Fetch details for all custom meals in the order
            const fetchPromises = customMealIds.map(id =>
              fetchCustomMealByIdAPI(id).catch(() => null) // Handle errors gracefully
            )

            const customMealResults = await Promise.all(fetchPromises)
            const detailsMap = {}
            customMealIds.forEach((id, index) => {
              if (customMealResults[index]) {
                detailsMap[id] = customMealResults[index]
              }
            })
            setCustomMealDetails(detailsMap)
          }
        }
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [code])

  // Fetch week meal details when order is loaded
  useEffect(() => {
    if (order && order.orderItems) {
      const weekMealIds = order.orderItems
        .filter(item => item.itemType === 'WEEK_MEAL' && item.weekMealId)
        .map(item => item.weekMealId)

      const uniqueIds = Array.from(new Set(weekMealIds))
      if (uniqueIds.length > 0) {
        const fetchPromises = uniqueIds.map(id =>
          getCustomerWeekMealByIdAPI(id).catch(() => null)
        )

        Promise.all(fetchPromises).then(results => {
          const detailsMap = {}
          uniqueIds.forEach((id, index) => {
            if (results[index]) {
              detailsMap[id] = results[index]
            }
          })
          setWeekMealDetails(detailsMap)
        })
      }
    }
  }, [order])

  // progress helper removed — UI now shows step dots instead of a progress bar
  // Stepper status config
  const statusSteps = [
    { key: 'PENDING', label: 'Pending', icon: <ScheduleIcon /> },
    { key: 'CONFIRMED', label: 'Confirmed', icon: <CheckCircleIcon /> },
    { key: 'PREPARING', label: 'Preparing', icon: <RestaurantIcon /> },
    { key: 'SHIPPING', label: 'Shipping', icon: <LocalShippingIcon /> },
    { key: 'DELIVERED', label: 'Delivered', icon: <CheckCircleOutlineIcon /> }
  ]
  const currentStep = statusSteps.findIndex(s => s.key === order?.status)

  function formatDateToMinute(date) {
    if (!date) return ''
    const d = new Date(date)
    const pad = n => n.toString().padStart(2, '0')
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  }

  // Map status to timestamp field
  const getStatusTime = (stepKey) => {
    if (stepKey === 'PENDING') return order.createdAt
    if (stepKey === 'CONFIRMED') return order.confirmedAt || order.confirmAt
    if (stepKey === 'PREPARING') return order.preparingAt
    if (stepKey === 'SHIPPING') return order.shippingAt
    if (stepKey === 'DELIVERED') return order.deliveredAt
    return null
  }


  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
        <Button variant="text" onClick={() => navigate('/profile/order-history')}>Go Back</Button>
      </Box>
    )
  }

  if (!order) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Order does not exist</Typography>
        <Button variant="text" onClick={() => navigate('/profile/order-history')}>Go Back</Button>
      </Box>
    )
  }

  return (
    <Box>
      <Button startIcon={<ArrowBackIosIcon fontSize="small" />} variant="text" onClick={() => navigate('/profile/order-history')}>Back to Orders</Button>

      {/* Order Code Header */}
      <Card sx={{ mt: 2, mb: 2, borderRadius: 2 }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>{`Order #${order.orderCode || order.id}`}</Typography>
            <Typography variant="body2" color="text.secondary">{formatDateToMinute(order.createdAt || order.deliveryTime || Date.now())}</Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 700, mb: 1 }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}</Typography>
            <Button variant="outlined" size="small" sx={{ borderColor: '#e0e0e0' }}>Reorder</Button>
          </Box>
        </CardContent>
      </Card>

      {/* Order Status Stepper */}
      <Box sx={{ width: '100%', mx: 'auto', mb: 2, bgcolor: '#fff', borderRadius: 2, boxShadow: 1, p: { xs: 2, sm: 2 } }}>
        <Stepper
          activeStep={currentStep}
          orientation={isSmallScreen ? 'vertical' : 'horizontal'}
          alternativeLabel={!isSmallScreen}
        >
          {statusSteps.map((step, idx) => {
            const isActive = idx === currentStep
            const activeColor = theme.palette.primary.secondary
            return (
              <Step key={step.key} completed={idx < currentStep}>
                <StepLabel icon={isActive ? <span style={{ color: activeColor }}>{step.icon}</span> : <span>{step.icon}</span>}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { sm: 'flex-start', md: 'center' } }}>
                    <Typography
                      sx={{
                        fontWeight: isActive ? 700 : 600,
                        color: isActive ? activeColor : 'text.primary',
                        maxWidth: 120,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: 'block'
                      }}
                      title={step.label}
                    >
                      {step.label}
                    </Typography>
                    {getStatusTime(step.key) && (
                      <Typography variant="caption" sx={{ mt: 0.5, fontWeight: isActive ? 700 : 400, color: isActive ? activeColor : 'text.primary' }}>
                        {formatDateToMinute(getStatusTime(step.key))}
                      </Typography>
                    )}
                  </Box>
                </StepLabel>
              </Step>
            )
          })}
        </Stepper>
      </Box>

      {/* Cancelled banner + reason */}
      {order.status === 'CANCELLED' && (
        <Card sx={{ mb: 2, borderRadius: 2, border: '1px solid', borderColor: 'error.light', bgcolor: '#fff5f5' }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Chip label="ORDER CANCELLED" color="error" variant="filled" sx={{ width: 'fit-content', fontWeight: 700 }} />
              <Typography variant="body2" color="text.secondary">
                {order.notes || order.note || 'No reason provided'}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Order Items */}
      <Card sx={{ mb: 2, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>Product Details</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {order.orderItems?.map((it, i) => {
              const customMealDetail = it.itemType === 'CUSTOM_MEAL' && it.customMealId
                ? customMealDetails[it.customMealId]
                : null

              return (
                <Box key={i}>
                  <Card variant="outlined" sx={{ p: 2, borderRadius: 1, bgcolor: '#fafafa' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar variant="rounded" src={it.image} sx={{ width: 80, height: 60, bgcolor: '#f5f5f5' }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>{it.title}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{it.description}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip label={`${it.quantity}x`} size="small" color="primary" />
                            <Typography variant="body2">
                              × {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(it.unitPrice || 0)}
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: '#4caf50' }}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(it.totalPrice || (it.unitPrice * it.quantity) || 0)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Card>

                  {/* Display ingredients for custom meals */}
                  {customMealDetail && customMealDetail.details && customMealDetail.details.length > 0 && (
                    <Box sx={{ ml: 3, mt: 1, mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                        🥗 Ingredients ({customMealDetail.details.length} items):
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {customMealDetail.details.map((ingredient, ingIdx) => (
                          <Box
                            key={ingIdx}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              p: 1,
                              bgcolor: 'white',
                              borderRadius: 1,
                              border: '1px solid #f0f0f0'
                            }}
                          >
                            {ingredient.image && (
                              <Box
                                component="img"
                                src={ingredient.image}
                                alt={ingredient.title}
                                sx={{
                                  width: 40,
                                  height: 40,
                                  objectFit: 'cover',
                                  borderRadius: 1,
                                  mr: 2,
                                  flexShrink: 0
                                }}
                              />
                            )}
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {ingredient.title}
                                </Typography>
                                <Chip
                                  label={ingredient.type}
                                  size="small"
                                  color="secondary"
                                  variant="outlined"
                                  sx={{ fontSize: '0.65rem', height: '18px' }}
                                />
                              </Box>
                              <Typography variant="caption" color="text.secondary">
                                Quantity: {ingredient.quantity}
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right', minWidth: '120px' }}>
                              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                {ingredient.calories} cal
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                <Typography variant="body2" color="primary.main" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>
                                  Protein: {ingredient.protein}g
                                </Typography>
                                <Typography variant="body2" color="secondary.main" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>
                                  Carbs: {ingredient.carbs}g
                                </Typography>
                                <Typography variant="body2" color="warning.main" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>
                                  Fat: {ingredient.fat}g
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              )
            })}
          </Box>
        </CardContent>
      </Card>

      {/* Week Meal Plan Section */}
      {order.orderItems?.some(item => item.itemType === 'WEEK_MEAL' && item.weekMealId && weekMealDetails[item.weekMealId]) && (
        <Card sx={{ mb: 2, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>Week Meal Plan</Typography>
            {order.orderItems
              .filter(item => item.itemType === 'WEEK_MEAL' && item.weekMealId && weekMealDetails[item.weekMealId])
              .map((item, idx) => (
                <WeekMealPlan key={`${item.weekMealId}-${idx}`} data={weekMealDetails[item.weekMealId]} />
              ))}
          </CardContent>
        </Card>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>Customer Information</Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="body2" color="text.secondary">Full Name</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{order.recipientName || '-'}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="body2" color="text.secondary">Phone Number</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{order.recipientPhone || '-'}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, alignItems: 'flex-start' }}>
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: '30%' }}>Address</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, textAlign: 'right', flex: 1 }}>
                  {`${order.street || ''}${order.ward ? ', ' + order.ward : ''}${order.district ? ', ' + order.district : ''}${order.city ? ', ' + order.city : ''}` || '-'}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, alignItems: 'flex-start' }}>
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: '30%' }}>Note</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, textAlign: 'right', flex: 1 }}>
                  {order.note || '-'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <Card sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>Payment Information</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="body2" color="text.secondary">Number of Items</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{order.orderItems?.length || 0}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              {(order.membershipDiscount > 0 || order.couponDiscount > 0) && (
                <>
                  {order.membershipDiscount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                      <Typography variant="body2" color="text.secondary">Membership Discount</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: 'success.main' }}>
                        -{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.membershipDiscount)}
                      </Typography>
                    </Box>
                  )}
                  {order.couponDiscount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                      <Typography variant="body2" color="text.secondary">Coupon Discount</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: 'success.main' }}>
                        -{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.couponDiscount)}
                      </Typography>
                    </Box>
                  )}
                  <Divider sx={{ my: 1 }} />
                </>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="body2" color="text.secondary">Shipping Fee</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{order.shippingFee ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.shippingFee) : 'Free'}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="subtitle2">Total Amount</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#d32f2f' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
