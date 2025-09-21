import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectCurrentLanguage } from '~/redux/translations/translationsSlice'

export default function CouponsSummaryCard({ availableCoupons }) {
  const { t } = useTranslation()
  const currentLang = useSelector(selectCurrentLanguage)
  
  return (
    <Card sx={{ borderRadius: 2, boxShadow: 2, minHeight: 495, display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CardGiftcardIcon color="primary" sx={{ fontSize: 22 }} />
            <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '0.3px' }}>{t('profile.overviewTab.coupons.title')}</Typography>
          </Box>
          <Button component={Link} to="/profile/membership" variant="text" size="small" sx={{ borderColor: 'primary.main', color: 'primary.main' }}>
            {t('profile.overviewTab.coupons.viewMore')}
          </Button>
        </Box>
        {availableCoupons.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {availableCoupons.map(c => (
              <Box key={c.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>🎫 {c.couponName || t('profile.overviewTab.coupons.defaultName')}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('profile.overviewTab.coupons.expiresAt')}: {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString(currentLang === 'vi' ? 'vi-VN' : 'en-US') : '—'}
                  </Typography>
                </Box>
                <Chip
                  label={c.couponType === 'PERCENTAGE' ? `${c.couponDiscountValue}%` : `${(c.couponDiscountValue || 0).toLocaleString()}đ`}
                  color="success"
                  size="small"
                  variant="outlined"
                />
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">{t('profile.overviewTab.coupons.noCoupons')}</Typography>
        )}
      </CardContent>
    </Card>
  )
}
