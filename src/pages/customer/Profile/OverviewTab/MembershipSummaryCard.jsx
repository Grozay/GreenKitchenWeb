import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import LoyaltyOutlinedIcon from '@mui/icons-material/LoyaltyOutlined'

const tierColors = {
  ENERGY: '#32CD32',
  VITALITY: '#FF7043',
  RADIANCE: '#FFB300'
}

export default function MembershipSummaryCard({ membership = [], formatVND }) {
  const color = tierColors[membership?.currentTier] || '#1976d2'
  return (
    <Card sx={{ borderRadius: 2, boxShadow: 2, minHeight: 200 }}>
      {membership == null ? (
        <Box sx={{ p:4, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LoyaltyOutlinedIcon sx={{ fontSize: 24 }} />
            <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '0.3px' }}>Membership Info</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">Don&apos;t have membership info yet? Want to get more benefits?</Typography>
          <Button variant="outlined" component={Link} size="small" to="/menu">
            Order Now!
          </Button>
        </Box>
      ) : (
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LoyaltyOutlinedIcon sx={{ color, fontSize: 24 }} />
              <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '0.3px' }}>Membership Info</Typography>
            </Box>
            <Chip label={membership?.currentTier} sx={{ backgroundColor: color, color: 'white', fontWeight: 'bold' }} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Available Points: <strong>{(membership?.availablePoints || 0).toLocaleString()}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              6-Month Spending: <strong>{formatVND(membership?.totalSpentLast6Months || 0)}</strong>
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
              View More
            </Button>
          </Box>
        </CardContent>
      )}
    </Card>
  )
}
