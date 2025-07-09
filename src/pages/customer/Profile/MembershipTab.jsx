import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import { useState, useEffect } from 'react'

export default function MembershipTab() {
  const [membershipData, setMembershipData] = useState(null)

  // Mock API call
  useEffect(() => {
    const fetchMembershipData = async () => {
      // Simulate API call
      const mockData = {
        currentTier: 'gold',
        totalSpent: 3200000, // 3.2M VND
        pointsEarned: 1500,
        pointsUsed: 500,
        pointsAvailable: 1000,
        yearlySpending: 3200000,
        nextTierRequirement: 5000000
      }
      setMembershipData(mockData)
    }

    fetchMembershipData()
  }, [])

  const membershipTiers = [
    {
      tier: 'silver',
      name: 'Silver',
      minSpending: 0,
      maxSpending: 2000000,
      color: '#C0C0C0',
      gradient: 'linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 100%)',
      benefits: [
        'Quà tặng sinh nhật đặc biệt',
        'Tích điểm thưởng từ mỗi đơn hàng',
        'Thông báo ưu đãi sớm'
      ]
    },
    {
      tier: 'gold',
      name: 'Gold',
      minSpending: 2000000,
      maxSpending: 5000000,
      color: '#FFD700',
      gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      benefits: [
        'Tất cả quyền lợi Silver',
        'Giảm 5% cho mỗi đơn hàng',
        'Miễn phí giao hàng',
        'Hỗ trợ khách hàng ưu tiên'
      ]
    },
    {
      tier: 'platinum',
      name: 'Platinum',
      minSpending: 5000000,
      maxSpending: Infinity,
      color: '#E5E4E2',
      gradient: 'linear-gradient(135deg, #E5E4E2 0%, #BCC6CC 100%)',
      benefits: [
        'Tất cả quyền lợi Gold',
        'Giảm 10% cho mỗi đơn hàng',
        'Quà tặng VIP định kỳ',
        'Dịch vụ cá nhân hóa',
        'Ưu tiên đặt hàng sản phẩm mới'
      ]
    }
  ]

  const getCurrentTierInfo = () => {
    if (!membershipData) return membershipTiers[0]
    return membershipTiers.find(tier => tier.tier === membershipData.currentTier)
  }

  const getProgressToNextTier = () => {
    if (!membershipData) return 0
    const currentTier = getCurrentTierInfo()
    const nextTier = membershipTiers.find(tier => tier.minSpending > membershipData.yearlySpending)
    
    if (!nextTier) return 100 // Already at highest tier
    
    const progress = ((membershipData.yearlySpending - currentTier.minSpending) /
                     (nextTier.minSpending - currentTier.minSpending)) * 100
    return Math.min(progress, 100)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  if (!membershipData) {
    return <Box>Loading...</Box>
  }

  const currentTierInfo = getCurrentTierInfo()
  const nextTier = membershipTiers.find(tier => tier.minSpending > membershipData.yearlySpending)

  return (
    <Box sx={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Current Membership Card */}
      <Card sx={{
        mb: 3,
        borderRadius: 3,
        background: currentTierInfo.gradient,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
      }}>
        <CardContent sx={{ p: { xs: 2, md: 3 }, position: 'relative', zIndex: 1 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{
                  fontWeight: 700,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  mr: 2
                }}>
                  {currentTierInfo.name}
                </Typography>
                <Chip
                  label="Thành viên hiện tại"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              </Box>

              <Typography variant="body1" sx={{
                mb: 1,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}>
                Tổng chi tiêu năm nay
              </Typography>
              <Typography variant="h4" sx={{
                fontWeight: 700,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}>
                {formatCurrency(membershipData.yearlySpending)}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                  Điểm khả dụng
                </Typography>
                <Typography variant="h5" sx={{
                  fontWeight: 700,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}>
                  {membershipData.pointsAvailable.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  điểm
                </Typography>
                
                {/* Points Action Buttons */}
                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexDirection: { xs: 'column', md: 'row' } }}>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.5)',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    Chi tiết
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.3)'
                      }
                    }}
                  >
                    Sử dụng điểm
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Progress to next tier */}
          {nextTier && (
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Tiến độ lên hạng {nextTier.name}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {formatCurrency(membershipData.yearlySpending)} / {formatCurrency(nextTier.minSpending)}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={getProgressToNextTier()}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'white',
                    borderRadius: 4
                  }
                }}
              />
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                Còn {formatCurrency(nextTier.minSpending - membershipData.yearlySpending)} để lên hạng {nextTier.name}
              </Typography>
            </Box>
          )}
        </CardContent>

        {/* Decorative elements */}
        <Box sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 150,
          height: 150,
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.1)',
          zIndex: 0
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 100,
          height: 100,
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.1)',
          zIndex: 0
        }} />
      </Card>

      <Grid container spacing={3}>
        {/* Points Summary */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2e7d32' }}>
                Thông tin điểm thưởng
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={6}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#4caf50' }}>
                      {membershipData.pointsEarned.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Điểm tích lũy
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={6}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff9800' }}>
                      {membershipData.pointsUsed.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Điểm đã dùng
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                1 điểm = 1,000 VND khi thanh toán
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Current Benefits */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2e7d32' }}>
                Quyền lợi hiện tại
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {currentTierInfo.benefits.map((benefit, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: currentTierInfo.color
                    }} />
                    <Typography variant="body2">
                      {benefit}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* All Membership Tiers */}
        <Grid size={12}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2e7d32' }}>
                Chính sách thành viên
              </Typography>
              
              <Grid container spacing={2}>
                {membershipTiers.map((tier) => (
                  <Grid key={tier.tier} size={{ xs: 12, md: 4 }}>
                    <Card sx={{
                      borderRadius: 2,
                      border: membershipData.currentTier === tier.tier ? `3px solid ${tier.color}` : '1px solid #e0e0e0',
                      position: 'relative',
                      overflow: 'hidden',
                      height: '220px', // Fixed height for equal heights
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <Box sx={{
                        background: tier.gradient,
                        height: 60,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Typography variant="h6" sx={{
                          color: 'white',
                          fontWeight: 700,
                          textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                        }}>
                          {tier.name}
                        </Typography>
                        {membershipData.currentTier === tier.tier && (
                          <Chip
                            label="Hiện tại"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              backgroundColor: 'rgba(255,255,255,0.2)',
                              color: 'white',
                              fontSize: '0.6rem'
                            }}
                          />
                        )}
                      </Box>
                      
                      <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, color: tier.color }}>
                          {tier.maxSpending === Infinity
                            ? `Từ ${formatCurrency(tier.minSpending)}+`
                            : `${formatCurrency(tier.minSpending)} - ${formatCurrency(tier.maxSpending)}`
                          }
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
                          {tier.benefits.map((benefit, index) => (
                            <Typography key={index} variant="body2" sx={{ fontSize: '0.75rem' }}>
                              • {benefit}
                            </Typography>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
