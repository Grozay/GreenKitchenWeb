import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

const VideoTop = () => {
  const navigate = useNavigate()
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        height: '90vh',
        minHeight: 400,
        color: 'white',
        overflow: 'hidden'
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: 1,
          left: 0,
          top: 0
        }}
        src="https://res.cloudinary.com/quyendev/video/upload/v1752563345/H%E1%BB%8CC_N%E1%BA%A4U_%C4%82N_EAT_CLEAN_SALAD_GI%C3%80U_N%C4%82NG_L%C6%AF%E1%BB%A2NG_CHO_NG%C6%AF%E1%BB%9CI_T%E1%BA%ACP_YOGA_-_Emma_Pham_Kitchen_1080p_h264_mpwvgs.mp4"
      />
      <Box
        sx={{
          position: 'absolute',
          width: '100vw',
          height: '100vh',
          bgcolor: 'rgba(0,0,0,0.6)',
          zIndex: 2,
          left: 0,
          top: 0
        }}
      />
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: '1rem', sm: '1.5rem', md: '2rem' },
            mb: { xs: 2, md: 4 },
            opacity: 0.9,
            position: 'relative'
          }}
        >
          GREEN KITCHEN EXPERIENCE
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '1.5rem', sm: '2.5rem', md: '3.5rem' },
            fontWeight: 'bold',
            mb: { xs: 2, md: 4 },
            position: 'relative'
          }}
        >
          Your healthy food soulmate
        </Typography>
      </Container>
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: 16, md: 32 },
          right: { xs: 16, md: 32 },
          zIndex: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          sx={{
            fontWeight: 'bold',
            borderRadius: 10,
            px: 3,
            py: 1,
            textTransform: 'none'
          }}
          onClick={() => navigate('/menu')}
        >
          Go to Menu
        </Button>
        <Typography
          sx={{
            fontSize: { xs: '0.9rem', md: '1.1rem' },
            opacity: 0.85,
            ml: 2
          }}
        >
          Discover our healthy meal packages!
        </Typography>
      </Box>
    </Box>
  )
}

export default VideoTop
