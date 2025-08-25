import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Slide from '@mui/material/Slide'

function ChatContainer({
  children,
  open = true,
  width = { xs: '100vw', sm: 400, md: 450 },
  height = { xs: '100dvh', sm: '85vh', md: 650 },
  marginBottom = 80,
  onEntered,
  onExited
}) {
  return (
    <Box
      sx={{
        position: 'fixed',
        right: { xs: 0, sm: 24, md: 24 },
        bottom: { xs: 0, sm: 24, md: 24 },
        width: width,
        maxWidth: '100vw',
        height: height,
        minWidth: 350,
        marginBottom: { xs: 0, sm: `${marginBottom}px` },
        zIndex: 1300,
        pointerEvents: open ? 'auto' : 'none'
      }}
    >
      <Slide
        direction="up"
        in={open}
        mountOnEnter
        unmountOnExit
        timeout={{
          enter: 400,
          exit: 300
        }}
        easing={{
          enter: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          exit: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
        onEntered={onEntered}
        onExited={onExited}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            minHeight: 0,
            bgcolor: 'background.paper',
            borderRadius: { xs: 0, sm: 3, md: 4 },
            boxShadow: {
              xs: 0,
              sm: '0 8px 32px rgba(0,0,0,0.12)',
              md: '0 16px 48px rgba(0,0,0,0.15)'
            },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: { xs: 'none', sm: '1px solid', md: '1px solid' },
            borderColor: { sm: 'divider', md: 'divider' },
            transform: 'translateZ(0)', // Tối ưu GPU acceleration
            backfaceVisibility: 'hidden' // Tránh flickering
          }}
        >
          {/* Header với gradient nhẹ */}
          <Box
            sx={{
              p: { xs: 2, sm: 2.5 },
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex',
              alignItems: 'center',
              minHeight: { xs: 56, sm: 60 },
              flexShrink: 0,
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '16px', sm: '18px' },
                letterSpacing: '0.3px',
                color: 'primary.contrastText'
              }}
            >
  Chat với Nhân viên GreenKitchen
            </Typography>

          </Box>

          <Divider sx={{ borderColor: 'divider', flexShrink: 0 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
            {children}
          </Box>
        </Box>
      </Slide>
    </Box>
  )
}

export default ChatContainer