import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import LoyaltyOutlinedIcon from '@mui/icons-material/LoyaltyOutlined'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectCurrentLanguage } from '~/redux/translations/translationsSlice'

const tierColors = {
  ENERGY: '#32CD32',
  VITALITY: '#FF7043',
  RADIANCE: '#FFB300'
}

export default function MembershipSummaryCard({ membership = [], formatVND }) {
  const { t } = useTranslation()
  const currentLang = useSelector(selectCurrentLanguage)
  const color = tierColors[membership?.currentTier] || '#1976d2'
  return (
    <Card sx={{ borderRadius: 2, boxShadow: 2, minHeight: 200 }}>
      {membership == null ? (
        <Box sx={{ p:4, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LoyaltyOutlinedIcon sx={{ fontSize: 24 }} />
            <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '0.3px' }}>{t('profile.overviewTab.membership.title')}</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">{t('profile.overviewTab.membership.noMembershipText')}</Typography>
          <Button variant="outlined" component={Link} size="small" to="/menu">
            {t('profile.overviewTab.membership.orderNow')}
          </Button>
        </Box>
      ) : (
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LoyaltyOutlinedIcon sx={{ color, fontSize: 24 }} />
              <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '0.3px' }}>{t('profile.overviewTab.membership.title')}</Typography>
            </Box>
            <Chip label={membership?.currentTier} sx={{ backgroundColor: color, color: 'white', fontWeight: 'bold' }} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {t('profile.overviewTab.membership.availablePoints')}: <strong>{(membership?.availablePoints || 0).toLocaleString()}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('profile.overviewTab.membership.sixMonthSpend')}: <strong>{formatVND(membership?.totalSpentLast6Months || 0)}</strong>
            </Typography>
          </Box>
          <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Button
              component={Link}
              to="/profile/membership"
              variant="text"
              size="small"
              sx={{ borderColor: 'primary.main', color: 'primary.main' }}
            >
              {t('profile.overviewTab.membership.viewMore')}
            </Button>
          </Box>
        </CardContent>
      )}
    </Card>
  )
}
