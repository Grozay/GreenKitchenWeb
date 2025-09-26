import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Divider from '@mui/material/Divider'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import SpaIcon from '@mui/icons-material/Spa'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import AssistantIcon from '@mui/icons-material/Assistant'
import LanguageSelect from '../AppBar/LanguageSelect/LanguageSelect'

function TopAppBar() {
  return (
    <Box sx={{
      width: '100%',
      bgcolor: (theme) => theme.palette.background.main,
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: 13,
      minHeight: 32,
      display: { xs: 'none', sm: 'none', md: 'flex' }
    }}>
      {/* Running text */}
      <Box sx={{ flex: 1, color: (theme) => theme.palette.primary.main, overflow: 'hidden', whiteSpace: 'nowrap', mr: 2, position: 'relative', height: 24 }}>
        <Box
          component="span"
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            display: 'inline-block',
            whiteSpace: 'nowrap',
            willChange: 'transform',
            animation: 'marqueeLinear 14s linear infinite'
          }}
        >
          <AssistantIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} /> Modern Healthy Life With GREEN AI Assistant<MoreHorizIcon sx={{ verticalAlign: 'middle', mx: 2, opacity: 0.5 }} />
          <LocalShippingIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} /> Free Shipping - For Order 200k <MoreHorizIcon sx={{ verticalAlign: 'middle', mx: 2, opacity: 0.5 }} />
          <RestaurantMenuIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} /> Custom Your Own Meal <MoreHorizIcon sx={{ verticalAlign: 'middle', mx: 2, opacity: 0.5 }} />
          <SpaIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} /> Healthy & Fresh Everyday <MoreHorizIcon sx={{ verticalAlign: 'middle', mx: 2, opacity: 0.5 }} />
          <AssistantIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} /> Modern Healthy Life With GREEN AI Assistant<MoreHorizIcon sx={{ verticalAlign: 'middle', mx: 2, opacity: 0.5 }} />
          <LocalShippingIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} /> Free Shipping - For Order 200k <MoreHorizIcon sx={{ verticalAlign: 'middle', mx: 2, opacity: 0.5 }} />
          <RestaurantMenuIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} /> Custom Your Own Meal <MoreHorizIcon sx={{ verticalAlign: 'middle', mx: 2, opacity: 0.5 }} />
          <SpaIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} /> Healthy & Fresh Everyday <MoreHorizIcon sx={{ verticalAlign: 'middle', mx: 2, opacity: 0.5 }} />
          <AssistantIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} /> Modern Healthy Life With GREEN AI Assistant<MoreHorizIcon sx={{ verticalAlign: 'middle', mx: 2, opacity: 0.5 }} />
        </Box>
        <style>{`
          @keyframes marqueeLinear {
            0% { transform: translateX(0); }
            100% { transform: translateX(-20%); }
          }
        `}</style>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
        <Divider orientation="vertical" flexItem sx={{ bgcolor: (theme) => theme.palette.primary.main }} />
        <Link href="/store-location" underline="hover" color="#fff" sx={{ fontWeight: 500, color: (theme) => theme.palette.primary.main, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <LocalShippingIcon sx={{ fontSize: 18, mr: 0.5 }} /> Store Location
        </Link>
        <Divider orientation="vertical" flexItem sx={{ bgcolor: (theme) => theme.palette.primary.main }} />
        <Link href="/tracking-order" underline="hover" color="#fff" sx={{ fontWeight: 500, color: (theme) => theme.palette.primary.main, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <RestaurantMenuIcon sx={{ fontSize: 18, mr: 0.5 }} /> Tracking Order
        </Link>
        <Divider orientation="vertical" flexItem sx={{ bgcolor: (theme) => theme.palette.primary.main }} />
        <Link href="/contact-support" underline="hover" color="#fff" sx={{ fontWeight: 500, color: (theme) => theme.palette.primary.main, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <AssistantIcon sx={{ fontSize: 18, mr: 0.5 }} /> Contact & Support
        </Link>
        {/* <Divider orientation="vertical" flexItem sx={{ bgcolor: (theme) => theme.palette.primary.main }} />
        <Link href="/about-us" underline="hover" color="#fff" sx={{ fontWeight: 500, color: (theme) => theme.palette.primary.main, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <LanguageSelect />
        </Link> */}
      </Box>
    </Box>
  )
}

export default TopAppBar
