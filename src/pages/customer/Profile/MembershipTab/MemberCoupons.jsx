import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

export default function MemberCoupons({ membership, customerCoupons }) {
  return (
    <Grid size={12} sx={{
      width: '100%',
      textAlign: 'center',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      borderRadius: 2,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{
        fontWeight: 'bold',
        textAlign: 'center',
        m: 2
      }}>
        Ưu đãi của bạn
      </Typography>
      {customerCoupons && customerCoupons.length > 0 ? (
        <Grid container spacing={2} sx={{ p: 2 }}>
          {customerCoupons.map((customerCoupon) => (
            <Grid size={{ xs: 12, sm: 6, md: 6 }} key={customerCoupon.id}>
              <Card sx={{
                border: customerCoupon.status === 'AVAILABLE' ? '2px solid #4caf50' : '2px solid #ff9800',
                borderRadius: 3,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: customerCoupon.status === 'AVAILABLE'
                    ? '0 8px 24px rgba(76,175,80,0.3)'
                    : '0 8px 24px rgba(255,152,0,0.3)'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{
                      fontWeight: 'bold',
                      color: customerCoupon.status === 'AVAILABLE' ? '#4caf50' : '#ff9800'
                    }}>
                      🎫 {customerCoupon.couponName || 'Coupon'}
                    </Typography>
                    <Chip
                      label={customerCoupon.status === 'AVAILABLE' ? 'Có thể dùng' :
                        customerCoupon.status === 'USED' ? 'Đã sử dụng' : 'Hết hạn'}
                      color={customerCoupon.status === 'AVAILABLE' ? 'success' :
                        customerCoupon.status === 'USED' ? 'warning' : 'error'}
                      sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
                    />
                  </Box>
                  <Box sx={{ textAlign: 'left', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Mã:</strong> {customerCoupon.couponCode}
                    </Typography>
                    {customerCoupon.couponDescription && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Mô tả:</strong> {customerCoupon.couponDescription}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Giảm:</strong>{' '}
                      {customerCoupon.couponType === 'PERCENTAGE'
                        ? `${customerCoupon.couponDiscountValue}%`
                        : `${customerCoupon.couponDiscountValue?.toLocaleString()} VNĐ`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Ngày đổi:</strong> {new Date(customerCoupon.exchangedAt).toLocaleDateString('vi-VN')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Hạn sử dụng:</strong> {new Date(customerCoupon.expiresAt).toLocaleDateString('vi-VN')}
                    </Typography>
                    {customerCoupon.usedAt && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Ngày sử dụng:</strong> {new Date(customerCoupon.usedAt).toLocaleDateString('vi-VN')}
                      </Typography>
                    )}
                    {customerCoupon.orderId && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Đơn hàng:</strong> #{customerCoupon.orderId}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    {customerCoupon.status === 'AVAILABLE' ? (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        sx={{ borderRadius: 2, px: 3, fontWeight: 'bold' }}
                        onClick={() => {
                          // TODO: Implement use coupon functionality
                          alert('Chức năng sử dụng coupon sẽ được triển khai trong đơn hàng')
                        }}
                      >
                        Sử dụng ngay
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        disabled
                        size="small"
                        sx={{ borderRadius: 2, px: 3 }}
                      >
                        {customerCoupon.status === 'USED' ? 'Đã sử dụng' : 'Hết hạn'}
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Typography sx={{ fontSize: '80px' }}>🎁</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Bạn đang chưa có ưu đãi nào
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Hãy đổi điểm lấy coupon để nhận ưu đãi nhé!
          </Typography>
        </Box>
      )}
    </Grid>
  )
}
