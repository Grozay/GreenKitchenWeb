import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

const ItemPopover = ({ meal }) => {

  const translatedCalories = 'Calories'
  const translatedProtein = 'Protein'
  const translatedCarbs = 'Carbs'
  const translatedFat = 'Fat'
  const translatedPrice = 'Price:'

  // Dịch tự động cho title và description của meal (như trong MenuDetail và ItemWeekPlan)
  const translatedTitle = meal?.title || ''
  const translatedDescription = meal?.description || ''

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
        gap: 1.2
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
        {translatedTitle}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
        {translatedDescription}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
        <Chip label={`${translatedCalories} ${meal.calories ?? '--'}`} color="warning" size="small" />
        <Chip label={`${translatedProtein} ${meal.protein ?? '--'}g`} color="success" size="small" />
        <Chip label={`${translatedCarbs} ${meal.carbs ?? '--'}g`} color="info" size="small" />
        <Chip label={`${translatedFat} ${meal.fat ?? '--'}g`} color="secondary" size="small" />
      </Box>
      <Typography variant="subtitle2" sx={{ color: 'primary.dark', fontWeight: 500 }}>
        {translatedPrice} {meal.price ? `${meal.price} VND` : '--'}
      </Typography>
      {meal.image && (
        <Box
          component="img"
          src={meal.image}
          alt={translatedTitle}
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
