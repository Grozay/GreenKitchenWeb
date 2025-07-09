import { useState, useEffect } from 'react'
import ChatBox from '~/components/AppBar/AIChat/ChatBox'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import theme from '~/theme'
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  GitHub
} from '@mui/icons-material'

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <Box
      component="footer"
      sx={{
        background: theme.palette.primary.secondary,
        color: 'white',
        borderTop: '1px solid',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        animation: isVisible
          ? 'slideUp 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)'
          : 'none',
        '@keyframes slideUp': {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      }}
    >
      {/* Social Media */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 2, md: 5 },
          py: 3,
          borderBottom: '1px solid',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }}
      >
        <Typography
          variant="body1"
          sx={{
            display: { xs: 'none', md: 'block' },
            fontWeight: 500,
            letterSpacing: '0.5px'
          }}
        >
          Kết nối với Green Kitchen trên mạng xã hội:
        </Typography>
        <Box>
          {[
            { icon: <Facebook />, link: '#' },
            { icon: <Twitter />, link: '#' },
            { icon: <Instagram />, link: '#' },
            { icon: <LinkedIn />, link: '#' },
            { icon: <GitHub />, link: '#' }
          ].map((item, index) => (
            <Link
              key={index}
              href={item.link}
              color="inherit"
              sx={{
                mx: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#81c784',
                  transform: 'translateY(-3px) scale(1.1)'
                }
              }}
            >
              {item.icon}
            </Link>
          ))}
        </Box>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={{ xs: 3, md: 5 }}>
          {/* Green Kitchen Info */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: theme.palette.primary.text,
                fontWeight: 600,
                letterSpacing: '1px'
              }}
            >
              Green Kitchen
            </Typography>
            <Typography
              variant="body2"
              sx={{
                opacity: 0.8,
                lineHeight: 1.6,
                fontSize: '0.9rem'
              }}
            >
              Ứng dụng tư vấn thực phẩm lành mạnh, giúp bạn sống khỏe mỗi ngày
              bằng lựa chọn dinh dưỡng thông minh.
            </Typography>

            {/* App Store Buttons */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                mt: 3,
                justifyContent: { xs: 'center', md: 'flex-start' }
              }}
            >
              <Link
                href="https://apps.apple.com/app/apple-store/id375380948"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: 'inline-block', mr: 2 }}
              >
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="Tải từ App Store"
                  style={{
                    height: '45px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                />
              </Link>

              <Link
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: 'inline-block' }}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Tải từ Google Play"
                  style={{
                    height: '45px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                />
              </Link>
            </Box>
          </Grid>

          {/* Tính năng */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: theme.palette.primary.text,
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              Tính năng
            </Typography>
            {[
              'AI Tư vấn',
              'Tìm món ăn',
              'Lịch sử hỏi đáp',
              'Thông tin thực phẩm'
            ].map((item, index) => (
              <Link
                key={index}
                href="#"
                variant="body2"
                display="block"
                color="inherit"
                sx={{
                  mb: 1.5,
                  opacity: 0.8,
                  transition: 'all 0.2s',
                  '&:hover': {
                    color: theme.palette.primary.text,
                    transform: 'translateX(5px)'
                  }
                }}
              >
                {item}
              </Link>
            ))}
          </Grid>
          <ChatBox />

          {/* Hữu ích */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: theme.palette.primary.text,
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              Hữu ích
            </Typography>
            {['Về chúng tôi', 'Liên hệ', 'Chính sách', 'Hỗ trợ'].map(
              (item, index) => (
                <Link
                  key={index}
                  href="#"
                  variant="body2"
                  display="block"
                  color="inherit"
                  sx={{
                    mb: 1.5,
                    opacity: 0.8,
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: theme.palette.primary.text,
                      transform: 'translateX(5px)'
                    }
                  }}
                >
                  {item}
                </Link>
              )
            )}
          </Grid>

          {/* Liên hệ */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: theme.palette.primary.text,
                fontWeight: 600
              }}
            >
              Liên hệ
            </Typography>
            <Box component="address" sx={{ opacity: 0.8, lineHeight: 1.8 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                TP.HCM, Việt Nam
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Email:{' '}
                <Link href="mailto:support@greenkitchen.vn" color="inherit">
                  support@greenkitchen.vn
                </Link>
              </Typography>
              <Typography variant="body2">
                Phone:{' '}
                <Link href="tel:+84123456789" color="inherit">
                  +84 123 456 789
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Copyright */}
      <Box
        sx={{
          py: 2,
          backgroundColor: 'rgba(27, 94, 32, 0.3)',
          textAlign: 'center',
          borderTop: '1px solid',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.primary.text,
            fontSize: '0.875rem'
          }}
        >
          © {new Date().getFullYear()} Green Kitchen. All rights reserved.
        </Typography>
      </Box>
    </Box>
  )
}

export default Footer
