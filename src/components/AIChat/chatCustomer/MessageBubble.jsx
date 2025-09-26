import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Paper from '@mui/material/Paper'
import { getAvatarInfo, getSenderName } from '~/utils/chatUtils'

function MessageBubble({ message, customerName, isOwn }) {
  // Sử dụng utility functions
  const senderName = getSenderName(message.senderRole, customerName)
  const avatarInfo = getAvatarInfo(message.senderRole, 'medium')
  const IconComponent = avatarInfo.IconComponent

  // SYSTEM message (welcome/notify): khác biệt bubble & bỏ avatar
  if (message.senderRole === 'SYSTEM') {
    return (
      <Box sx={{ width: '100%', my: 2, textAlign: 'center' }}>
        <Paper elevation={0}
          sx={{
            p: { xs: 2, sm: 2.5 },
            bgcolor: '#e8f5e9',
            borderRadius: 2.5,
            mx: 'auto',
            display: 'inline-block',
            maxWidth: { xs: '96%', sm: 400 }
          }}
        >
          <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 700, mb: 1 }}>
            <IconComponent fontSize="small" />
            System
          </Typography>
          <Typography variant="body2" sx={{ fontSize: { xs: 15, sm: 16 }, color: 'text.secondary', whiteSpace: 'pre-line' }}>
            {message.content}
          </Typography>
        </Paper>
      </Box>
    )
  }

  // Bubble cho user/EMP/AI
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: isOwn ? 'row-reverse' : 'row',
        mb: 1.5,
        px: { xs: 1, sm: 2 }
      }}
    >
      <Avatar
        sx={{
          width: avatarInfo.width,
          height: avatarInfo.height,
          bgcolor: isOwn ? 'primary.main' : avatarInfo.bgcolor,
          color: avatarInfo.color,
          boxShadow: 1
        }}
      >
        <IconComponent fontSize={avatarInfo.fontSize} />
      </Avatar>
      <Paper
        elevation={2}
        sx={{
          p: { xs: 1.2, sm: 1.4 },
          bgcolor: isOwn ? 'primary.main' : 'grey.100',
          color: isOwn ? 'primary.contrastText' : 'text.primary',
          borderRadius: 2.5,
          borderTopLeftRadius: isOwn ? 3 : 0.5,
          borderTopRightRadius: isOwn ? 0.5 : 3,
          maxWidth: { xs: '80%', sm: '65%' },
          ml: isOwn ? 0 : 1.3,
          mr: isOwn ? 1.3 : 0,
          wordBreak: 'break-word',
          whiteSpace: 'pre-line',
          position: 'relative'
        }}
      >
        {/* Hiện tên cho tất cả message trừ SYSTEM */}
        {message.senderRole !== 'SYSTEM' && (
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              mb: 0.5,
              opacity: 0.85,
              fontSize: { xs: '11px', sm: '12px' },
              letterSpacing: '0.2px'
            }}
          >
            {senderName}
          </Typography>
        )}

        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: 15, sm: 16 },
            lineHeight: 1.55,
            fontWeight: 400
          }}
        >
          {message.content}
        </Typography>
        {message.timestamp && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 0.5,
              opacity: 0.65,
              fontSize: { xs: '10px', sm: '11px' },
              textAlign: isOwn ? 'right' : 'left'
            }}
          >
            {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
              hour: '2-digit', minute: '2-digit'
            })}
          </Typography>
        )}
      </Paper>
    </Box>
  )
}

export default MessageBubble
