import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import CardMenu from '~/components/FoodCard/CardMenu'

const MenuList = ({ pkg, loading }) => {
  const skeletonArray = Array.from({ length: 8 }, (_, i) => i)

  const getTypeBasedIndex = (items, currentIndex) => {
    const currentItem = items[currentIndex]
    const currentType = currentItem.type

    let typeIndex = 1
    for (let i = 0; i < currentIndex; i++) {
      if (items[i].type === currentType) {
        typeIndex++
      }
    }
    return typeIndex
  }

  return (
    <Box>
      <Grid container spacing={2}>
        {loading || !pkg
          ? skeletonArray.map((_, idx) => (
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={idx}>
              <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 5 }} />
            </Grid>
          ))
          : pkg?.map((item, index) => {
            const typeBasedIndex = getTypeBasedIndex(pkg, index)
            return (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={item.id}>
                <CardMenu item={item} typeBasedIndex={typeBasedIndex} />
              </Grid>
            )
          })}
      </Grid>
    </Box>
  )
}

export default MenuList