import React from 'react'
import Box from '@mui/material/Box'
import ItemSuggestMenu from './ItemSuggestMenu/ItemSuggestMenu'
import Grid from '@mui/material/Grid'

const ListSuggestMenu = ({ items }) => {
  return (
    <Box>
      <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
        {items.map((item, index) => (
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }} key={index}>
            <ItemSuggestMenu item={item} index={index} totalCalories={1300} totalProtein={20} totalCarbs={30} totalFat={8}/>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default ListSuggestMenu