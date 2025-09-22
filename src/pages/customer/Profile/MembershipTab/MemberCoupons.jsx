import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
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
        Your Coupons
      </Typography>
      {customerCoupons && customerCoupons.length > 0 ? (
        <Grid container spacing={2} sx={{ p: 2 }}>
          {customerCoupons.map((customerCoupon) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={customerCoupon.id}>
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
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ mb: 1.5 }}>
                    <Typography variant="subtitle1" sx={{
                      fontWeight: 'bold',
                      color: customerCoupon.status === 'AVAILABLE' ? '#4caf50' : '#ff9800',
                      fontSize: '1rem'
                    }}>
                      🎫 {customerCoupon.couponName || 'Coupon'}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'left', mb: 1.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                      <strong>Code:</strong> {customerCoupon.couponCode}
                    </Typography>
                    {customerCoupon.couponDescription && (
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                        <strong>Description:</strong> {customerCoupon.couponDescription}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                      <strong>Discount:</strong>{' '}
                      {customerCoupon.couponType === 'PERCENTAGE'
                        ? `${customerCoupon.couponDiscountValue}%`
                        : `${customerCoupon.couponDiscountValue?.toLocaleString()} VNĐ`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                      <strong>Exchange Date:</strong> {new Date(customerCoupon.exchangedAt).toLocaleDateString('vi-VN')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                      <strong>Expiry Date:</strong> {new Date(customerCoupon.expiresAt).toLocaleDateString('vi-VN')}
                    </Typography>
                    {customerCoupon.usedAt && (
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                        <strong>Usage Date:</strong> {new Date(customerCoupon.usedAt).toLocaleDateString('vi-VN')}
                      </Typography>
                    )}
                    {customerCoupon.orderId && (
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                        <strong>Order:</strong> #{customerCoupon.orderId}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ textAlign: 'center', mt: 1.5 }}>
                    {customerCoupon.status === 'AVAILABLE' ? (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        sx={{ borderRadius: 2, px: 2, fontWeight: 'bold', fontSize: '0.875rem' }}
                        onClick={() => {
                          // TODO: Implement use coupon functionality
                          alert('Coupon usage functionality will be implemented in orders')
                        }}
                      >
                        Use Now
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        disabled
                        size="small"
                        sx={{ borderRadius: 2, px: 2, fontSize: '0.875rem' }}
                      >
                        {customerCoupon.status === 'USED' ? 'Used' : 'Expired'}
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
            You don&apos;t have any coupons yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.875rem' }}>
            Exchange points for coupons to get benefits!
          </Typography>
        </Box>
      )}
    </Grid>
  )
}
