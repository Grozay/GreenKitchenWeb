import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import StarIcon from '@mui/icons-material/Star'

const CustomerCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  transition: 'all 0.2s ease-in-out',
  width: '100%',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.main
  },
  '&.selected': {
    backgroundColor: theme.palette.primary.light,
    borderColor: theme.palette.primary.main
  }
}))

const CustomerInfo = ({ customer, onRemove, showRemove = false }) => {
  const getGenderColor = (gender) => {
    switch (gender?.toLowerCase()) {
    case 'male':
      return 'primary'
    case 'female':
      return 'secondary'
    default:
      return 'default'
    }
  }

  const getGenderLabel = (gender) => {
    switch (gender?.toLowerCase()) {
    case 'male':
      return 'Nam'
    case 'female':
      return 'Nữ'
    default:
      return 'Chưa xác định'
    }
  }

  return (
    <CustomerCard>
      {/* Red Star Icon */}
      <StarIcon
        sx={{
          color: 'error.main',
          mr: 1.5,
          fontSize: 16,
          flexShrink: 0
        }}
      />

      <Avatar
        src={customer.avatar}
        alt={customer.fullName}
        sx={{
          width: 40,
          height: 40,
          mr: 2,
          bgcolor: customer.avatar ? 'transparent' : 'primary.main',
          flexShrink: 0
        }}
      >
        {!customer.avatar && customer.fullName?.charAt(0)?.toUpperCase()}
      </Avatar>

      <Box sx={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' }, // Mobile/tablet: column, Desktop: row
        alignItems: { xs: 'flex-start', md: 'center' }, // Mobile/tablet: start, Desktop: center
        gap: { xs: 0.5, md: 2 } // Mobile/tablet: nhỏ, Desktop: lớn
      }}>
        {/* Customer Name */}
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            flexShrink: 0,
            minWidth: { xs: 'auto', md: 150 }
          }}
        >
          {customer.fullName || 'Chưa có tên'}
        </Typography>

        {/* Gender Chip */}
        <Chip
          label={getGenderLabel(customer.gender)}
          size="small"
          color={getGenderColor(customer.gender)}
          variant="outlined"
          sx={{
            height: 20,
            fontSize: '0.7rem',
            flexShrink: 0,
            minWidth: { xs: 'auto', md: 60 }
          }}
        />

        {/* Contact Info */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 0.5, md: 2 },
          flex: 1,
          minWidth: 0
        }}>
          {customer.email && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: '0.7rem',
                flexShrink: 0,
                minWidth: { xs: 'auto', md: 180 },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              📧 {customer.email}
            </Typography>
          )}
          {customer.phone && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: '0.7rem',
                flexShrink: 0,
                minWidth: { xs: 'auto', md: 120 },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              📱 {customer.phone}
            </Typography>
          )}
        </Box>
      </Box>

      {showRemove && onRemove && (
        <IconButton
          size="small"
          onClick={() => onRemove(customer.id)}
          sx={{
            ml: 1,
            color: 'error.main',
            flexShrink: 0,
            '&:hover': {
              backgroundColor: 'error.light',
              color: 'error.contrastText'
            }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </CustomerCard>
  )
}

export default CustomerInfo
