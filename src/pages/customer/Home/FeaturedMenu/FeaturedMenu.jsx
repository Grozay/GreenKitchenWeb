import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import Skeleton from '@mui/material/Skeleton' // Add this import
import theme from '~/theme'
import CardMenu from '~/components/FoodCard/CardMenu'
import { getMenuMealAPI } from '~/apis'
// eslint-disable-next-line no-unused-vars
import _ from 'lodash'
import { useEffect, useState } from 'react'

const VISIBLE_COUNT = 4
const TRANSITION_DURATION = 500 // ms

const FeaturedMenu = () => {
  const [mealPackages, setMealPackages] = useState([])
  const [startIndex, setStartIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [loading, setLoading] = useState(true) // Add loading state

  useEffect(() => {
    const fetchMealPackages = async () => {
      try {
        setLoading(true) // Set loading to true before fetching
        const data = await getMenuMealAPI()
        setMealPackages(data)
      } catch {
        // Error fetching meal packages
      } finally {
        setLoading(false) // Set loading to false after fetching (success or error)
      }
    }
    fetchMealPackages()
  }, [])

  // Calculate the type-based index for consistent labeling
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

  // Handle previous button click
  const handlePrev = () => {
    if (isAnimating) return

    setIsAnimating(true)

    if (startIndex === 0) {
      // Loop back to the end
      const maxStartIndex = Math.max(0, mealPackages.length - VISIBLE_COUNT)
      setIsLooping(true)

      // First move temporarily out of view in the opposite direction
      setTimeout(() => {
        setIsLooping(false)
        setStartIndex(maxStartIndex)
      }, 50)
    } else {
      setStartIndex(prev => Math.max(prev - VISIBLE_COUNT, 0))
    }

    // Reset animating state after transition completes
    setTimeout(() => setIsAnimating(false), TRANSITION_DURATION)
  }

  // Handle next button click
  const handleNext = () => {
    if (isAnimating) return

    setIsAnimating(true)

    if (startIndex + VISIBLE_COUNT >= mealPackages.length) {
      // Loop back to the beginning
      setIsLooping(true)

      // First move temporarily out of view in the opposite direction
      setTimeout(() => {
        setIsLooping(false)
        setStartIndex(0)
      }, 50)
    } else {
      setStartIndex(prev => Math.min(prev + VISIBLE_COUNT, mealPackages.length - VISIBLE_COUNT))
    }

    // Reset animating state after transition completes
    setTimeout(() => setIsAnimating(false), TRANSITION_DURATION)
  }

  // Create an array for skeleton placeholders
  const skeletonArray = Array.from({ length: VISIBLE_COUNT }, (_, i) => i)

  return (
    <Box sx={{ py: 8, bgcolor: theme.palette.background.default }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          textAlign="center"
          sx={{
            mb: 6,
            fontWeight: 'bold',
            color: theme.palette.primary.main
          }}
        >
          Green-made bowls
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <IconButton
            onClick={handlePrev}
            disabled={isAnimating || loading}
            sx={{ zIndex: 2 }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>

          <Box sx={{ overflow: 'hidden', width: '100%', position: 'relative' }}>
            {loading ? (
              // Skeleton loading UI
              <Box sx={{ display: 'flex' }}>
                {skeletonArray.map((_, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      width: { xs: '50%', md: `${100 / VISIBLE_COUNT}%` },
                      flexShrink: 0,
                      padding: '0 16px'
                    }}
                  >
                    <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 2, mb: 1 }} />
                    <Skeleton variant="text" height={30} width="60%" sx={{ mb: 1 }} />
                    <Skeleton variant="text" height={20} width="40%" sx={{ mb: 1 }} />
                    <Skeleton variant="text" height={20} width="80%" sx={{ mb: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 5 }} />
                      <Skeleton variant="circular" width={36} height={36} />
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              // Actual content when loaded
              <Box
                sx={{
                  display: 'flex',
                  transition: isLooping ? 'none' : `transform ${TRANSITION_DURATION / 1000}s ease`,
                  transform: `translateX(-${startIndex * (100 / VISIBLE_COUNT)}%)`
                }}
              >
                {mealPackages.map((item, idx) => (
                  <Box
                    key={item.id}
                    sx={{
                      width: { xs: '50%', md: `${100 / VISIBLE_COUNT}%` },
                      flexShrink: 0,
                      padding: '0 16px'
                    }}
                  >
                    <CardMenu
                      item={item}
                      typeBasedIndex={getTypeBasedIndex(mealPackages, idx)}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          <IconButton
            onClick={handleNext}
            disabled={isAnimating || loading}
            sx={{ zIndex: 2 }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>

        <Box textAlign="center" sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderColor: theme.palette.primary.secondary,
              color: theme.palette.primary.secondary,
              px: 4,
              py: 1.5,
              fontWeight: 'bold',
              borderRadius: 10,
              '&:focus': {
                borderColor: theme.palette.primary.secondary,
                color: theme.palette.primary.secondary
              },
              '&:hover': {
                bgcolor: theme.palette.primary.secondary,
                color: 'white'
              }
            }}
          >
            View all meal packages
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default FeaturedMenu
