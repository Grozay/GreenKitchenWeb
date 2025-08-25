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
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

export default function OrderDetails({ customerDetails, orderCode: propOrderCode }) {
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
            <Typography variant="body2" color="text.secondary">{new Date(order.createdAt || order.deliveryTime || Date.now()).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 700, mb: 1 }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}</Typography>
            <Button variant="outlined" size="small" sx={{ borderColor: '#e0e0e0' }}>Mua lại</Button>
          </Box>
        </CardContent>
      </Card>

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

      {/* Order Status Progress */}
      <Card sx={{ mb: 2, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 600 }}>Trạng thái đơn hàng</Typography>

          {/* Progress Bar */}
          <Box sx={{ mb: 3 }}>
            <LinearProgress
              variant="determinate"
              value={((['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED'].indexOf(order.status) + 1) / 4) * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'primary.main',
                  borderRadius: 4,
                  transition: 'width 0.8s ease'
                }
              }}
            />
          </Box>

          {/* Status Steps */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
            {[
              { status: 'PENDING', label: 'Đặt hàng', icon: ScheduleIcon, color: '#ff9800' },
              { status: 'CONFIRMED', label: 'Xác nhận', icon: CheckCircleIcon, color: '#2196f3' },
              { status: 'SHIPPING', label: 'Đang giao', icon: LocalShippingIcon, color: '#ff5722' },
              { status: 'DELIVERED', label: 'Đã giao', icon: CheckCircleOutlineIcon, color: '#4caf50' }
            ].map((step, idx) => {
              const isActive = ['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED'].indexOf(order.status) >= idx
              const IconComponent = step.icon

              return (
                <Box key={step.status} sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                  position: 'relative'
                }}>
                  {/* Icon Circle */}
                  <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isActive ? step.color : '#e0e0e0',
                    color: 'white',
                    mb: 2,
                    transition: 'all 0.3s ease',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: isActive ? `0 4px 12px ${step.color}40` : '0 2px 4px rgba(0,0,0,0.1)',
                    border: '3px solid white'
                  }}>
                    <IconComponent sx={{ fontSize: 24 }} />
                  </Box>

                  {/* Label */}
                  <Typography variant="body2" sx={{
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? step.color : 'text.secondary',
                    textAlign: 'center',
                    fontSize: '0.875rem'
                  }}>
                    {step.label}
                  </Typography>

                  {/* Date */}
                  {isActive && (
                    <Typography variant="caption" color="text.secondary" sx={{
                      textAlign: 'center',
                      fontSize: '0.75rem',
                      mt: 0.5
                    }}>
                      {new Date(order.createdAt || order.deliveryTime || Date.now()).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </Typography>
                  )}
                </Box>
              )
            })}
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
