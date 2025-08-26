import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

export default function CouponModal({ open, onClose, couponsLoading, exchangeableCoupons, membership, exchangeLoading, handleExchangeCoupon }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{
        backgroundColor: theme => theme.palette.primary.main,
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6">🎁 Đổi coupon</Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {couponsLoading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Đang tải danh sách coupon...
            </Typography>
          </Box>
        ) : exchangeableCoupons.length > 0 ? (
          <Grid container spacing={3}>
            {exchangeableCoupons.map((coupon) => (
              <Grid size={{ xs: 12, sm: 6 }} key={coupon.id}>
                <Card sx={{
                  border: '2px solid #1976d2',
                  borderRadius: 2,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 16px rgba(25,118,210,0.3)'
                  }
                }}>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      🎫 {coupon.name}
                    </Typography>

                    {coupon.description && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {coupon.description}
                      </Typography>
                    )}

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Mã coupon: <strong>{coupon.code}</strong>
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Loại giảm giá:
                        {coupon.type === 'PERCENTAGE' && ` ${coupon.discountValue}%`}
                        {coupon.type === 'FIXED_AMOUNT' && ` ${coupon.discountValue?.toLocaleString()} VNĐ`}
                      </Typography>

                      {coupon.minimumOrderValue && (
                        <Typography variant="body2" color="text.secondary">
                          Đơn hàng tối thiểu: {coupon.minimumOrderValue?.toLocaleString()} VNĐ
                        </Typography>
                      )}

                      {coupon.maximumDiscountAmount && (
                        <Typography variant="body2" color="text.secondary">
                          Giảm tối đa: {coupon.maximumDiscountAmount?.toLocaleString()} VNĐ
                        </Typography>
                      )}

                      <Typography variant="body2" color="text.secondary">
                        Hạn sử dụng: {new Date(coupon.validUntil).toLocaleDateString('vi-VN')}
                      </Typography>

                      {coupon.exchangeLimit && (
                        <Typography variant="body2" color="text.secondary">
                          Còn lại: {coupon.exchangeLimit - coupon.exchangeCount} coupon
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Chip
                        label={`${coupon.pointsRequired} điểm`}
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 'bold' }}
                      />
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleExchangeCoupon(coupon.id)}
                        disabled={
                          (membership?.availablePoints || 0) < coupon.pointsRequired ||
                          exchangeLoading === coupon.id
                        }
                        sx={{ ml: 1, minWidth: '120px' }}
                      >
                        {exchangeLoading === coupon.id ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (membership?.availablePoints || 0) >= coupon.pointsRequired ? (
                          'Đổi ngay'
                        ) : (
                          'Không đủ điểm'
                        )}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography sx={{ fontSize: '64px', mb: 2 }}>🎁</Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Không có coupon nào có thể đổi
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {!membership?.availablePoints || membership.availablePoints === 0
                ? 'Bạn chưa có điểm để đổi coupon. Hãy mua sắm để tích điểm nhé!'
                : 'Hiện tại chưa có coupon phù hợp với hạng thành viên và số điểm của bạn.'
              }
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}
