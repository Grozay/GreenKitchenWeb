import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

export default function NonMemberNotice({ customerDetails }) {
  return (
    <Card sx={{
      background: 'linear-gradient(135deg, #782d0aff 0%, #764ba2 100%)',
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
      textAlign: 'center'
    }}>
      <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
        <Typography sx={{ fontSize: '80px', mb: 2 }}>🎯</Typography>
        <Typography variant="h4" sx={{
          fontWeight: 'bold',
          color: 'white',
          mb: 2,
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          Hello {customerDetails?.fullName}!
        </Typography>
        <Typography variant="h5" sx={{
          fontWeight: 'bold',
          color: '#FFD700',
          mb: 3,
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          You are not a member yet!
        </Typography>
        <Typography variant="h6" sx={{
          color: 'white',
          mb: 4,
          opacity: 0.9
        }}>
          Order any dish to get membership benefits! 🌟
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: '#FFD700',
            color: '#000',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            px: 4,
            py: 1.5,
            borderRadius: 3,
            boxShadow: '0 4px 16px rgba(255, 215, 0, 0.4)',
            '&:hover': {
              backgroundColor: '#FFC107',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(255, 215, 0, 0.6)'
            },
            transition: 'all 0.3s ease'
          }}
          onClick={() => window.location.href = '/menu'}
        >
          🍽️ See Menu
        </Button>
      </CardContent>
    </Card>
  )
}
