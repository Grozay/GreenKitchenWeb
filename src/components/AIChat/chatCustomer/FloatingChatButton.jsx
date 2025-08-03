import { Fab } from '@mui/material'
import ChatIcon from '@mui/icons-material/Chat'

function FloatingChatButton({ onClick, show = true }) {
  return (
    <Fab
      color="primary"
      size="large"
      sx={{
        position: 'fixed',
        bottom: { xs: 20, sm: 24, md: 32 },
        right: { xs: 20, sm: 24, md: 32 },
        zIndex: 1400, // Cao hơn ChatContainer để không bị che
        width: { xs: 56, sm: 64 },
        height: { xs: 56, sm: 64 },
        opacity: show ? 1 : 0,
        transform: show ? 'scale(1) translateZ(0)' : 'scale(0.8) translateZ(0)',
        transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        pointerEvents: show ? 'auto' : 'none',
        boxShadow: '0 4px 20px rgba(25, 118, 210, 0.4)',
        backfaceVisibility: 'hidden',
        '&:hover': {
          transform: show ? 'scale(1.15) translateZ(0)' : 'scale(0.8) translateZ(0)',
          boxShadow: '0 8px 32px rgba(25, 118, 210, 0.5)'
        },
        '&:active': {
          transform: show ? 'scale(0.95) translateZ(0)' : 'scale(0.8) translateZ(0)',
          transition: 'all 0.1s ease'
        }
      }}
      onClick={onClick}
    >
      <ChatIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
    </Fab>
  )
}

export default FloatingChatButton