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
import LinearProgress from '@mui/material/LinearProgress'
import ScheduleIcon from '@mui/icons-material/Schedule'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import theme from '~/theme'
import useMediaQuery from '@mui/material/useMediaQuery'

export default function OrderDetails({ customerDetails, orderCode: propOrderCode }) {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)

  const code = propOrderCode || orderId

  useEffect(() => {
    if (!customerDetails) return
    const all = customerDetails.orders || []
    const found = all.find(o => o.orderCode === code || String(o.id) === String(code))
    setOrder(found || null)
  }, [customerDetails, code])

  // progress helper removed — UI now shows step dots instead of a progress bar
  // Stepper status config
  const statusSteps = [
    { key: 'PENDING', label: 'Chờ xác nhận', icon: <ScheduleIcon /> },
    { key: 'CONFIRMED', label: 'Đã xác nhận', icon: <CheckCircleIcon /> },
    { key: 'PREPARING', label: 'Đang chuẩn bị', icon: <RestaurantIcon /> },
    { key: 'SHIPPING', label: 'Đang giao hàng', icon: <LocalShippingIcon /> },
    { key: 'DELIVERED', label: 'Đã giao hàng', icon: <CheckCircleOutlineIcon /> }
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


  if (!order) return (
    // If customerDetails is not yet loaded, show a spinner
    !customerDetails ? (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    ) : (
      <Box sx={{ p: 3 }}>
        <Typography>Order not found</Typography>
        <Button variant="text" onClick={() => navigate('/profile/order-history')}>Back</Button>
      </Box>
    )
  )

  return (
    <Box>
      <Button startIcon={<ArrowBackIosIcon fontSize="small" />} variant="text" onClick={() => navigate('/profile/order-history')}>Back to Orders</Button>

      {/* Order Code Header */}
      <Card sx={{ mt: 2, mb: 2, borderRadius: 2 }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>{`Đơn hàng #${order.orderCode || order.id}`}</Typography>
            <Typography variant="body2" color="text.secondary">{formatDateToMinute(order.createdAt || order.deliveryTime || Date.now())}</Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 700, mb: 1 }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}</Typography>
            <Button variant="outlined" size="small" sx={{ borderColor: '#e0e0e0' }}>Mua lại</Button>
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

      {/* Order Items */}
      <Card sx={{ mb: 2, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>Chi tiết sản phẩm</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {order.orderItems?.map((it, i) => (
              <Card key={i} variant="outlined" sx={{ p: 2, borderRadius: 1, bgcolor: '#fafafa' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar variant="rounded" src={it.image} sx={{ width: 80, height: 60, bgcolor: '#f5f5f5' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>{it.title}</Typography>
                    <Typography variant="body2" color="text.secondary">Số lượng: {it.quantity}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#4caf50' }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(it.totalPrice || (it.unitPrice * it.quantity) || 0)}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>Thông tin khách hàng</Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="body2" color="text.secondary">Họ và tên</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{order.recipientName || '-'}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="body2" color="text.secondary">Số điện thoại</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{order.recipientPhone || '-'}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, alignItems: 'flex-start' }}>
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: '30%' }}>Địa chỉ</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, textAlign: 'right', flex: 1 }}>
                  {`${order.street || ''}${order.ward ? ', ' + order.ward : ''}${order.district ? ', ' + order.district : ''}${order.city ? ', ' + order.city : ''}` || '-'}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, alignItems: 'flex-start' }}>
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: '30%' }}>Ghi chú</Typography>
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
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>Thông tin thanh toán</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="body2" color="text.secondary">Số lượng sản phẩm</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{order.orderItems?.length || 0}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="body2" color="text.secondary">Tổng tiền hàng</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.subTotal || order.totalAmount || 0)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="body2" color="text.secondary">Giảm giá</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'success.main' }}>{order.discount ? '-' + new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.discount) : '-'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="body2" color="text.secondary">Phí vận chuyển</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{order.shippingFee ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.shippingFee) : 'Miễn phí'}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="subtitle2">Tổng số tiền</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#d32f2f' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
