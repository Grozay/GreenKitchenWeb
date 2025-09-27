import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import { getAvatarInfo, getSenderName } from '~/utils/chatUtils'

function MessageBubble({ message, customerName, isOwn }) {
  // Sử dụng utility functions
  const senderName = getSenderName(message.senderRole, customerName)
  const avatarInfo = getAvatarInfo(message.senderRole, 'medium')
  const IconComponent = avatarInfo.IconComponent

  // SYSTEM message (welcome/notify): khác biệt bubble & bỏ avatar
  if (message.senderRole === 'SYSTEM') {
    return (
      <Box sx={{ width: '100%', my: 3, textAlign: 'center' }}>
        <Paper
          elevation={2}
          sx={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
            border: '1px solid #2196f3',
            borderRadius: 3,
            px: 3,
            py: 2,
            maxWidth: 400,
            mx: 'auto'
          }}
        >
          <Chip
            icon={<IconComponent fontSize="small" />}
            label="System"
            color="primary"
            variant="outlined"
            size="small"
            sx={{ mb: 1 }}
          />
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              whiteSpace: 'pre-line',
              lineHeight: 1.6
            }}
          >
            {message.content}
          </Typography>
        </Paper>
      </Box>
    )
  }

  // Bubble cho user/EMP/AI
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'flex-end',
      mb: 2,
      px: 2,
      flexDirection: isOwn ? 'row-reverse' : 'row'
    }}>
      <Avatar sx={{
        width: avatarInfo.width,
        height: avatarInfo.height,
        bgcolor: isOwn ? 'primary.main' : avatarInfo.bgcolor,
        boxShadow: 2
      }}>
        <IconComponent fontSize={avatarInfo.fontSize} />
      </Avatar>

      <Paper
        elevation={3}
        sx={{
          maxWidth: '75%',
          px: 2,
          py: 1.5,
          mx: 1.5,
          position: 'relative',
          bgcolor: isOwn ? 'primary.main' : 'background.paper',
          color: isOwn ? 'primary.contrastText' : 'text.primary',
          borderRadius: 2,
          ...(isOwn ? {
            borderTopRightRadius: 4
          } : {
            borderTopLeftRadius: 4
          })
        }}
      >
        {/* Hiện tên cho tất cả message trừ SYSTEM */}
        {message.senderRole !== 'SYSTEM' && (
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              mb: 0.5,
              color: isOwn ? 'primary.contrastText' : 'text.secondary',
              opacity: 0.8
            }}
          >
            {senderName}
          </Typography>
        )}

        <Typography
          variant="body2"
          sx={{
            lineHeight: 1.5,
            whiteSpace: 'pre-line'
          }}
        >
          {message.content}
        </Typography>

        {message.timestamp && (
          <Typography
            variant="caption"
            sx={{
              mt: 1,
              display: 'block',
              textAlign: isOwn ? 'right' : 'left',
              color: isOwn ? 'primary.contrastText' : 'text.secondary',
              opacity: 0.7
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
