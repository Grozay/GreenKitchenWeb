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
              <Box sx={{ p: 1 }}>
                <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 2, mb: 1 }} />
                <Skeleton variant="text" height={30} width="60%" sx={{ mb: 1 }} />
                <Skeleton variant="text" height={20} width="40%" sx={{ mb: 1 }} />
                <Skeleton variant="text" height={20} width="80%" sx={{ mb: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 5 }} />
                  <Skeleton variant="circular" width={36} height={36} />
                </Box>
              </Box>
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