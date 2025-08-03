import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { useSelector } from 'react-redux'
import { selectCartItems } from '../../../../redux/order/orderSlice'

const OrderSummary = ({ 
  subtotal, 
  shippingFee, 
  membershipDiscount, 
  couponDiscount, 
  totalAmount,
  orderItems 
}) => {
  const cartItems = useSelector(selectCartItems)

  // Nếu không có orderItems từ props, lấy từ redux cart
  const items = orderItems || cartItems

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price || 0)
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
          TÓM TẮT ĐỐN HÀNG
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        {/* Danh sách món ăn */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: '#2c2c2c' }}>
            Món ăn đã chọn ({items.length} món)
          </Typography>
          
          {items.map((item, index) => (
            <Box key={index} sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 1,
              borderBottom: index < items.length - 1 ? '1px solid #f0f0f0' : 'none'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  component="img"
                  src={item.mealItem?.image || item.image}
                  alt={item.mealItem?.name || item.title || item.name}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    objectFit: 'cover'
                  }}
                />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#2c2c2c' }}>
                    {item.mealItem?.name || item.title || item.name}
                    {item.isCustom && <span style={{ color: '#666', fontSize: '0.8em' }}> (Custom)</span>}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    Số lượng: {item.quantity || 1}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#4C082A' }}>
                {formatPrice(item.totalPrice || (item.basePrice || item.price || 0) * (item.quantity || 1))}
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Tính toán giá */}
        <Box sx={{ space: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Tạm tính:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {formatPrice(subtotal)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Phí vận chuyển:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {shippingFee > 0 ? formatPrice(shippingFee) : 'Miễn phí'}
            </Typography>
          </Box>

          {membershipDiscount > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#00B389' }}>
                Giảm giá thành viên:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#00B389' }}>
                -{formatPrice(membershipDiscount)}
              </Typography>
            </Box>
          )}

          {couponDiscount > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#00B389' }}>
                Giảm giá coupon:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#00B389' }}>
                -{formatPrice(couponDiscount)}
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c2c2c' }}>
              Tổng cộng:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#4C082A' }}>
              {formatPrice(totalAmount)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default OrderSummary
