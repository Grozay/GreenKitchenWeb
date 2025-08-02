import { Box, Typography, Avatar, Paper } from '@mui/material'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import { keyframes } from '@mui/system'

// Animation cho dots nảy lên xuống
const bounce = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-8px);
    opacity: 1;
  }
`

// Animation cho typing indicator xuất hiện
const slideIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`
function TypingIndicator() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: { xs: 1, sm: 1.5 },
        mb: 1.5,
        px: { xs: 2, sm: 2.5 },
        animation: `${slideIn} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)`
      }}
    >
      {/* Avatar */}
      <Avatar
        sx={{
          width: { xs: 32, sm: 36 },
          height: { xs: 32, sm: 36 },
          bgcolor: 'grey.600', // Màu mặc định
          flexShrink: 0,
          boxShadow: 1,
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(1)',
              opacity: 1
            },
            '50%': {
              transform: 'scale(1.05)',
              opacity: 0.8
            },
            '100%': {
              transform: 'scale(1)',
              opacity: 1
            }
          }
        }}
      >
        <SupportAgentIcon fontSize="small" />
      </Avatar>

      {/* Typing Bubble */}
      <Paper
        elevation={2}
        sx={{
          p: { xs: '12px 14px', sm: '14px 16px' },
          bgcolor: 'grey.100',
          borderRadius: 2.5,
          borderTopLeftRadius: 0.5,
          position: 'relative',
          minWidth: 80,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: 3
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: -6,
            width: 0,
            height: 0,
            borderTop: '6px solid',
            borderTopColor: 'grey.100',
            borderRight: '6px solid transparent'
          }
        }}
      >
        {/* Sender name */}
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            fontWeight: 600,
            mb: 1,
            opacity: 0.85,
            fontSize: { xs: '11px', sm: '12px' },
            letterSpacing: '0.3px'
          }}
        >
  Nhân viên GreenKitchen
        </Typography>

        {/* Animated dots */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            py: 0.5
          }}
        >
          {[0, 1, 2].map((index) => (
            <Box
              key={index}
              sx={{
                width: { xs: 6, sm: 8 },
                height: { xs: 6, sm: 8 },
                borderRadius: '50%',
                bgcolor: 'grey.500',
                animation: `${bounce} 1.4s infinite ease-in-out`,
                animationDelay: `${index * 0.16}s`
              }}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  )
}

export default TypingIndicator