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
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import StarsIcon from '@mui/icons-material/Stars'

export default function CouponModal({ open, onClose, couponsLoading, exchangeableCoupons, membership, exchangeLoading, handleExchangeCoupon }) {
  const getDiscountDisplay = (type, value) => {
    if (type === 'PERCENTAGE') {
      return `${value}%`
    }
    return `${value?.toLocaleString()} VNĐ`
  }

  const getCouponGradient = (index) => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    ]
    return gradients[index % gradients.length]
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          maxHeight: '70vh'
        }
      }}
    >
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #FF7043 0%, #FF5722 100%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 1.5,
        px: 2,
        borderRadius: '12px 12px 0 0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CardGiftcardIcon sx={{ fontSize: '1.4rem' }} />
          <Box>
            <Typography variant="h6" sx={{
              fontWeight: 700,
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              fontSize: '1.1rem',
              letterSpacing: '0.5px'
            }}>
              🎁 ĐỔI COUPON
            </Typography>
            <Typography variant="caption" sx={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '0.875rem',
              mt: 0.25
            }}>
              Đổi điểm lấy ưu đãi hấp dẫn
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'white',
            backgroundColor: 'rgba(255,255,255,0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.2)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.3s ease',
            p: 0.5
          }}
        >
          <CloseIcon sx={{ fontSize: '1.2rem' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {couponsLoading ? (
          <Box sx={{
            textAlign: 'center',
            py: 6,
            px: 3,
            background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
            borderRadius: '0 0 12px 12px'
          }}>
            <CircularProgress size={50} sx={{ color: '#FF7043', mb: 1.5 }} />
            <Typography variant="h6" sx={{
              fontWeight: 600,
              color: '#666',
              fontSize: '1rem'
            }}>
              Đang tải danh sách coupon...
            </Typography>
            <Typography variant="body2" sx={{
              color: '#888',
              fontSize: '0.875rem',
              mt: 0.5
            }}>
              Vui lòng đợi trong giây lát
            </Typography>
          </Box>
        ) : exchangeableCoupons.length > 0 ? (
          <Box sx={{
            p: 1.5,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderRadius: '0 0 12px 12px'
          }}>
            <Grid container spacing={1.5}>
              {exchangeableCoupons.map((coupon, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={coupon.id}>
                  <Card sx={{
                    height: '100%',
                    borderRadius: 2,
                    background: getCouponGradient(index),
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      '& .coupon-overlay': {
                        opacity: 0.1
                      }
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                      borderRadius: '8px'
                    }
                  }}>
                    <Box className="coupon-overlay" sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                      opacity: 0.05,
                      transition: 'opacity 0.3s ease'
                    }} />

                    <CardContent sx={{
                      p: 1.5,
                      position: 'relative',
                      zIndex: 1,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <Box sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                          <LocalOfferIcon sx={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)' }} />
                          <Typography variant="h6" sx={{
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            letterSpacing: '0.3px'
                          }}>
                            {coupon.name}
                          </Typography>
                        </Box>

                        {coupon.description && (
                          <Typography variant="body2" sx={{
                            opacity: 0.9,
                            fontSize: '0.875rem',
                            mb: 0.5,
                            lineHeight: 1.3
                          }}>
                            {coupon.description}
                          </Typography>
                        )}
                      </Box>

                      <Box sx={{ flex: 1, mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                          <Typography variant="caption" sx={{
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            opacity: 0.9
                          }}>
                            Mã:
                          </Typography>
                          <Chip
                            label={coupon.code}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(255,255,255,0.2)',
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.875rem',
                              border: '1px solid rgba(255,255,255,0.3)',
                              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                              height: '20px'
                            }}
                          />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                          <Typography variant="caption" sx={{
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            opacity: 0.9
                          }}>
                            Giảm:
                          </Typography>
                          <Typography variant="h6" sx={{
                            fontWeight: 800,
                            fontSize: '1rem',
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                          }}>
                            {getDiscountDisplay(coupon.type, coupon.discountValue)}
                          </Typography>
                        </Box>

                        {coupon.minimumOrderValue && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                            <ShoppingCartIcon sx={{ fontSize: '0.8rem', opacity: 0.8 }} />
                            <Typography variant="caption" sx={{
                              fontSize: '0.875rem',
                              opacity: 0.8
                            }}>
                              Tối thiểu: {coupon.minimumOrderValue?.toLocaleString()} VNĐ
                            </Typography>
                          </Box>
                        )}

                        {coupon.maximumDiscountAmount && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                            <Typography variant="caption" sx={{
                              fontSize: '0.875rem',
                              opacity: 0.8
                            }}>
                              Giảm tối đa: {coupon.maximumDiscountAmount?.toLocaleString()} VNĐ
                            </Typography>
                          </Box>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: '0.8rem', opacity: 0.8 }} />
                          <Typography variant="caption" sx={{
                            fontSize: '0.875rem',
                            opacity: 0.8
                          }}>
                            HSD: {new Date(coupon.validUntil).toLocaleDateString('vi-VN')}
                          </Typography>
                        </Box>

                        {coupon.exchangeLimit && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="caption" sx={{
                              fontSize: '0.875rem',
                              opacity: 0.8
                            }}>
                              Còn: {coupon.exchangeLimit - coupon.exchangeCount} coupon
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      <Box sx={{ mt: 'auto' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <StarsIcon sx={{ fontSize: '1rem', color: '#FFD700' }} />
                            <Typography variant="h6" sx={{
                              fontWeight: 800,
                              fontSize: '0.95rem',
                              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }}>
                              {coupon.pointsRequired}
                            </Typography>
                            <Typography variant="caption" sx={{
                              fontWeight: 600,
                              opacity: 0.9,
                              fontSize: '0.875rem'
                            }}>
                              điểm
                            </Typography>
                          </Box>
                        </Box>

                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => handleExchangeCoupon(coupon.id)}
                          disabled={
                            (membership?.availablePoints || 0) < coupon.pointsRequired ||
                            exchangeLoading === coupon.id
                          }
                          sx={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            fontWeight: 600,
                            borderRadius: 1.5,
                            py: 0.75,
                            border: '1px solid rgba(255,255,255,0.3)',
                            fontSize: '0.875rem',
                            textTransform: 'none',
                            letterSpacing: '0.3px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            '&:hover': {
                              backgroundColor: 'rgba(255,255,255,0.3)',
                              border: '1px solid rgba(255,255,255,0.5)',
                              transform: 'translateY(-1px)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                            },
                            '&:disabled': {
                              backgroundColor: 'rgba(255,255,255,0.1)',
                              color: 'rgba(255,255,255,0.5)',
                              border: '1px solid rgba(255,255,255,0.2)'
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {exchangeLoading === coupon.id ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <CircularProgress size={16} color="inherit" />
                              <Typography variant="caption">Đang xử lý...</Typography>
                            </Box>
                          ) : (membership?.availablePoints || 0) >= coupon.pointsRequired ? (
                            '🎁 Đổi ngay'
                          ) : (
                            '❌ Không đủ điểm'
                          )}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Box sx={{
            textAlign: 'center',
            py: 6,
            px: 3,
            background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
            borderRadius: '0 0 12px 12px'
          }}>
            <Box sx={{
              fontSize: '3rem',
              mb: 1.5,
              opacity: 0.6,
              animation: 'bounce 2s infinite'
            }}>
              🎁
            </Box>
            <Typography variant="h6" sx={{
              fontWeight: 600,
              color: '#666',
              mb: 0.5,
              fontSize: '1rem'
            }}>
              Không có coupon nào có thể đổi
            </Typography>
            <Typography variant="body2" sx={{
              color: '#888',
              fontSize: '0.875rem',
              maxWidth: '450px',
              mx: 'auto',
              lineHeight: 1.4
            }}>
              {!membership?.availablePoints || membership.availablePoints === 0
                ? 'Bạn chưa có điểm để đổi coupon. Hãy mua sắm để tích lũy điểm thưởng nhé! 🛒'
                : 'Hiện tại chưa có coupon phù hợp với hạng thành viên và số điểm của bạn. Hãy tiếp tục tích điểm để mở khóa thêm ưu đãi! ⭐'
              }
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}
