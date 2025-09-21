import { useTranslation } from 'react-i18next'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'

export default function TierCards({ tierInfo, membership, selectedTier, handleTierClick, displayTier }) {
  const { t } = useTranslation()

  return (
    <Grid size={12} sx={{
      backgroundColor: '#ffffff',
      margin: '0 auto',
      borderRadius: 2,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      p: 2
    }}>
      <Typography variant="h5" gutterBottom sx={{
        fontWeight: 'bold',
        m: 2,
        textAlign: 'center'
      }}>
        🏆 {membership ? t('profile.membershipTab.membershipTiers') : t('profile.membershipTab.membershipTiersPromo')}
      </Typography>
      <Grid container spacing={1.5}>
        {tierInfo.map((tier) => {
          const isCurrentTier = tier.name === membership?.currentTier
          const isSelectedTier = selectedTier && selectedTier.name === tier.name
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={tier.name}>
              <Card
                onClick={membership ? () => handleTierClick(tier) : undefined}
                sx={{
                  height: '100%',
                  position: 'relative',
                  backgroundColor: tier.bgColor,
                  border: isSelectedTier
                    ? `3px solid ${tier.color}`
                    : '1px solid #e0e0e0',
                  borderRadius: 3,
                  boxShadow: isSelectedTier
                    ? `0 8px 32px ${tier.color}40`
                    : isCurrentTier
                      ? `0 6px 24px ${tier.color}30`
                      : '0 4px 16px rgba(0,0,0,0.1)',
                  transform: isSelectedTier
                    ? 'scale(1.05)'
                    : isCurrentTier
                      ? 'scale(1.02)'
                      : 'scale(1)',
                  transition: 'all 0.3s ease-in-out',
                  cursor: membership ? 'pointer' : 'default',
                  '&:hover': {
                    transform: isSelectedTier
                      ? 'scale(1.05)'
                      : membership ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: `0 8px 24px ${tier.color}40`
                  }
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 }, height: '100%' }}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: tier.color, mb: 1 }}>
                      {tier.displayName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '0.875rem' } }}>
                      {tier.maxSpent
                        ? `${t('profile.membershipTab.spendingRange')}: ${tier.minSpent.toLocaleString()} - ${tier.maxSpent.toLocaleString()} VNĐ`
                        : `${t('profile.membershipTab.spendingFrom')}: ${tier.minSpent.toLocaleString()} VNĐ ${t('profile.membershipTab.orMore')}`
                      }
                    </Typography>
                  </Box>
                  {!membership && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: tier.color, mb: 1 }}>
                        🎁 {t('profile.membershipTab.mainBenefits')}:
                      </Typography>
                      {tier.benefits.map((benefit, index) => (
                        <Typography key={index} variant="body2" sx={{ fontSize: '0.875rem', mb: 0.5, color: 'text.secondary' }}>
                          • {benefit}
                        </Typography>
                      ))}
                    </Box>
                  )}
                  {isCurrentTier && (
                    <Chip
                      label={t('profile.membershipTab.currentTier')}
                      sx={{ width: '100%', margin: '0 auto', backgroundColor: tier.color, color: 'white', fontWeight: 'bold', fontSize: '0.875rem', zIndex: 1 }}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>
      {displayTier && membership && (
        <Card sx={{ borderRadius: 3, border: `2px solid ${displayTier.color}`, backgroundColor: displayTier.bgColor, mt: 3 }}>
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: displayTier.color }}>
                🎁 {t('profile.membershipTab.benefitsForTier', { tier: displayTier.displayName })}
                {displayTier.name === membership?.currentTier && (
                  <Chip
                    label={t('profile.membershipTab.currentTier')}
                    sx={{ ml: 2, backgroundColor: displayTier.color, color: 'white', fontSize: '0.875rem' }}
                  />
                )}
              </Typography>
            </Box>
            <Box>
              <Box sx={{ pl: 2 }}>
                {displayTier.benefits.map((benefit, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5, p: 1, borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.3)', border: `1px solid ${displayTier.color}30` }}>
                    <Typography sx={{ color: displayTier.color, fontWeight: 'bold', minWidth: '24px', mr: 1 }}>
                      {index + 1}.
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: '500' }}>
                      {benefit}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Grid>
  )
}
