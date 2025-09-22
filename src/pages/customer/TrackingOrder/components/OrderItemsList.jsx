import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import { useTheme } from '@mui/material/styles'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

const OrderItemsList = ({ order }) => {
  const theme = useTheme()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  if (!order || !order.orderItems) {
    return (
      <Card elevation={3}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" color="text.secondary" textAlign="center">
            No food information
          </Typography>
        </CardContent>
      </Card>
    )
  }

  const items = order.orderItems

  if (!items || items.length === 0) {
    return (
      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <RestaurantIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No food information
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card elevation={3} sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.secondary,
              width: 48,
              height: 48,
              mr: 2
            }}
          >
            <ShoppingCartIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              Food List
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {items.length} dishes
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Items List */}
        <Box>
          {items.map((item, index) => (
            <Box key={item.id || item.title}>
              <Box
                display="flex"
                alignItems="center"
                py={2}
                sx={{
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    borderRadius: 2,
                    px: 1
                  }
                }}
              >
                {/* Item Image */}
                <Avatar
                  src={item.image}
                  alt={item.title}
                  sx={{
                    width: 60,
                    height: 60,
                    mr: 2,
                    border: '2px solid #e0e0e0'
                  }}
                >
                  <RestaurantIcon />
                </Avatar>

                {/* Item Details */}
                <Box flex={1}>
                  <Typography
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                      mb: 0.5
                    }}
                  >
                    {item.title || 'Dish'}
                  </Typography>

                  {item.description && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {item.description}
                    </Typography>
                  )}

                  <Box display="flex" alignItems="center" gap={2}>
                    <Chip
                      label={`Qty: ${item.quantity}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {formatCurrency(item.unitPrice)} x {item.quantity}
                    </Typography>
                  </Box>
                </Box>

                {/* Item Total */}
                <Box textAlign="right">
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      color: theme.palette.primary.main
                    }}
                  >
                    {formatCurrency(item.totalPrice)}
                  </Typography>
                </Box>
              </Box>

              {index < items.length - 1 && (
                <Divider sx={{ my: 1, opacity: 0.5 }} />
              )}
            </Box>
          ))}
        </Box>

        {/* Order Summary */}
        <Box mt={3}>
          <Divider sx={{ mb: 2 }} />
          
          {/* Price Breakdown */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Payment details:
            </Typography>
            
            {/* Subtotal */}
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" color="text.secondary">
                Subtotal:
              </Typography>
              <Typography variant="body2">
                {formatCurrency(order.subtotal)}
              </Typography>
            </Box>

            {/* Shipping Fee */}
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" color="text.secondary">
                Shipping fee:
              </Typography>
              <Typography variant="body2">
                {order.shippingFee > 0 ? formatCurrency(order.shippingFee) : 'Free'}
              </Typography>
            </Box>

            {/* Membership Discount */}
            {order.membershipDiscount > 0 && (
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="text.secondary">
                  Membership discount:
                </Typography>
                <Typography variant="body2" color="success.main">
                  -{formatCurrency(order.membershipDiscount)}
                </Typography>
              </Box>
            )}

            {/* Coupon Discount */}
            {order.couponDiscount > 0 && (
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="text.secondary">
                  Coupon discount:
                </Typography>
                <Typography variant="body2" color="success.main">
                  -{formatCurrency(order.couponDiscount)}
                </Typography>
              </Box>
            )}

            {/* Point Earn */}
            {order.pointEarn > 0 && (
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="text.secondary">
                  Points earned:
                </Typography>
                <Typography variant="body2" color="warning.main" fontWeight="bold">
                  +{order.pointEarn} points
                </Typography>
              </Box>
            )}
          </Box>

          {/* Total Amount */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              p: 2,
              backgroundColor: theme.palette.primary.main + '10',
              borderRadius: 2,
              border: `1px solid ${theme.palette.primary.main}30`
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Total:
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main
              }}
            >
              {formatCurrency(order.totalAmount)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default OrderItemsList
