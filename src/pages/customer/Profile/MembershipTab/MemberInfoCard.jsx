import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import LoyaltyOutlinedIcon from '@mui/icons-material/LoyaltyOutlined'
import HistoryIcon from '@mui/icons-material/History'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import LinearProgress from '@mui/material/LinearProgress'

export default function MemberInfoCard({ membership, tierColor, tierProgress, setHistoryModalOpen, handleOpenCouponModal }) {
  return (
    <Card sx={{
      background: `linear-gradient(135deg, ${tierColor[membership?.currentTier] || '#1976d2'} 0%, ${tierColor[membership?.currentTier] || '#1976d2'}CC 100%)`,
      borderRadius: 3,
      boxShadow: `0 4px 16px ${tierColor[membership?.currentTier] || '#1976d2'}40`
    }}>
      <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        {/* Dòng 1: Tên + Hạng + 2 Buttons tất cả trong 1 hàng */}
        <Grid container spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
              <LoyaltyOutlinedIcon sx={{ fontSize: '2rem', color: 'white', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
              <Typography variant="h5" sx={{
                fontWeight: 800,
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                letterSpacing: '0.5px'
              }}>
                HẠNG THÀNH VIÊN
              </Typography>
            </Box>
            <Typography variant="h4" sx={{
              fontWeight: 900,
              color: 'white',
              textShadow: '0 3px 6px rgba(0,0,0,0.4)',
              fontSize: { xs: '1.5rem', sm: '2rem' },
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {membership?.currentTier === 'ENERGY' && '🌱 ENERGY'}
              {membership?.currentTier === 'VITALITY' && '⚡ VITALITY'}
              {membership?.currentTier === 'RADIANCE' && '👑 RADIANCE'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 3, md: 3 }}>
            <Button
              variant="contained"
              startIcon={<HistoryIcon />}
              onClick={() => setHistoryModalOpen(true)}
              fullWidth
              size="medium"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: 'white',
                fontWeight: 700,
                borderRadius: 3,
                py: 1.5,
                border: '2px solid rgba(255,255,255,0.2)',
                fontSize: '0.9rem',
                textTransform: 'none',
                letterSpacing: '0.5px',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  border: '2px solid rgba(255,255,255,0.4)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Lịch sử điểm
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 3, md: 3 }}>
            <Button
              variant="contained"
              startIcon={<CardGiftcardIcon />}
              onClick={handleOpenCouponModal}
              fullWidth
              size="medium"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: 'white',
                fontWeight: 700,
                borderRadius: 3,
                py: 1.5,
                border: '2px solid rgba(255,255,255,0.2)',
                fontSize: '0.9rem',
                textTransform: 'none',
                letterSpacing: '0.5px',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  border: '2px solid rgba(255,255,255,0.4)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Đổi coupon
            </Button>
          </Grid>
        </Grid>
        {/* Dòng 2: 3 thẻ thông tin (Điểm + Chi tiêu + Progress) */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: 2,
              p: 2,
              textAlign: 'center',
              height: '100%'
            }}>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 1, fontWeight: 'bold', color: 'white' }}>
                Điểm Khả Dụng:
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
                {membership?.availablePoints?.toLocaleString() || '0'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 'bold', color: 'white' }}>
                điểm
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: 2,
              p: 2,
              textAlign: 'center',
              height: '100%'
            }}>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 1, fontWeight: 'bold', color: 'white' }}>
                Tổng chi tiêu:
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
                {membership?.totalSpentLast6Months?.toLocaleString() || '0'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 'bold', color: 'white' }}>
                VNĐ
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {tierProgress?.nextTier ? (
              <Box sx={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: 3,
                p: 2,
                border: '1px solid rgba(255,255,255,0.2)',
                height: '100%'
              }}>
                <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 'bold', textAlign: 'center', color: 'white', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  🎯 Tiến độ lên {tierProgress.nextTier}
                </Typography>
                <Box sx={{ position: 'relative', mb: 1.5 }}>
                  <LinearProgress
                    variant="determinate"
                    value={tierProgress.progressToNextTier}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: 'rgba(255,255,255,0.3)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#FFD700',
                        borderRadius: 5,
                        boxShadow: '0 2px 6px rgba(255, 215, 0, 0.3)'
                      }
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: tierProgress?.progressToNextTier > 50 ? '#000' : '#fff',
                      fontWeight: 'bold',
                      fontSize: '0.875rem'
                    }}
                  >
                    {Math.round(tierProgress?.progressToNextTier || 0)}%
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.875rem', color: 'white' }}>
                    Còn cần: <strong style={{ color: '#FFD700' }}>{tierProgress?.spentToNextTier?.toLocaleString() || '0'} VNĐ</strong>
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: 3,
                p: 2,
                border: '2px solid #FFD700',
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <Box sx={{ position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.3), transparent)', animation: 'shimmer 3s infinite', '@keyframes shimmer': { '0%': { left: '-100%' }, '100%': { left: '100%' } } }} />
                <Box sx={{ position: 'relative', textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#FFD700', textShadow: '0 2px 4px rgba(0,0,0,0.3)', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    👑 HẠNG TỐI ĐA
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                    ✨ RADIANCE ✨
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white', opacity: 0.9, fontSize: '0.875rem' }}>
                    Chi tiêu: <strong>{membership?.totalSpentLast6Months?.toLocaleString() || '0'} VNĐ</strong>
                  </Typography>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
