import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

const ItemPopover = ({ meal }) => {
  if (!meal) return null

  return (
    <Box
      sx={{
        minWidth: 260,
        maxWidth: 320,
        p: 2,
        bgcolor: '#fff',
        borderRadius: 2,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.2,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
        {meal.title}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
        {meal.description}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
        <Chip label={`Calories: ${meal.calories ?? '--'}`} color="warning" size="small" />
        <Chip label={`Protein: ${meal.protein ?? '--'}g`} color="success" size="small" />
        <Chip label={`Carbs: ${meal.carbs ?? '--'}g`} color="info" size="small" />
        <Chip label={`Fat: ${meal.fat ?? '--'}g`} color="secondary" size="small" />
      </Box>
      <Typography variant="subtitle2" sx={{ color: 'primary.dark', fontWeight: 500 }}>
        Giá: {meal.price ? `${meal.price} VNĐ` : '--'}
      </Typography>
      {meal.image && (
        <Box
          component="img"
          src={meal.image}
          alt={meal.title}
          sx={{
            width: '100%',
            height: 120,
            objectFit: 'cover',
            borderRadius: 1,
            mt: 1,
            boxShadow: 1,
          }}
        />
      )}
    </Box>
  )
}

export default ItemPopover
