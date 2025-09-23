import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const CartEmpty = () => {
  const navigate = useNavigate()

  const handleBackToMenu = () => {
    navigate('/menu')
  }
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      borderRadius: 5,
      mx: 2,
      p: 4
    }}>
      <Box sx={{
        bgcolor: 'white',
        borderRadius: '50%',
        p: 3,
        mb: 3
      }}>
        <Typography variant="h1" sx={{ fontSize: '4rem', opacity: 0.3 }}>
          🛒
        </Typography>
      </Box>
      <Typography variant="h4" gutterBottom color="text.primary" sx={{ fontWeight: 600 }}>
        Your cart is empty
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '400px' }}>
        Looks like you haven't added anything to your cart yet. Start exploring our delicious menu!
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button
          variant="contained"
          onClick={handleBackToMenu}
          sx={{
            borderRadius: 5,
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            textTransform: 'none'
          }}
        >
          View Menu
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/smart-meal-planner')}
          sx={{
            borderRadius: 5,
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            textTransform: 'none'
          }}
        >
          Calculate Calories
        </Button>
      </Box>
    </Box>
  )
}

export default CartEmpty
