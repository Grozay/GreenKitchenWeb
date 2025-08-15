import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import theme from '~/theme'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentMeal } from '~/redux/meal/mealSlice'
import { createIngredientActHistory, removeIngredientActHistory } from '~/redux/meal/mealSlice'
import { selectSuggestedSauces, setShowSauceHint, clearSuggestions, setSuggestedSauces } from '~/redux/meal/suggestSauceSlice'


const FoodCard = ({ card }) => {
  const [count, setCount] = useState(0)
  const selectedItems = useSelector(selectCurrentMeal)
  const dispatch = useDispatch()
  const [isFlipped, setIsFlipped] = useState(false)


  useEffect(() => {
    const itemInCart = selectedItems[card.type.toLowerCase()]?.find(item => item.id === card.id)
    setCount(itemInCart?.quantity || 0)
  }, [selectedItems, card.id, card.type])

  const handleCardClick = (e) => {
    // if (card.type === 'SAUCE' && isSuggested) {
    //   dispatch(setShowSauceHint(false))
    //   dispatch(clearSuggestions())
    // }
    if (e.target.closest('button')) {
      return
    }
    setIsFlipped(!isFlipped)
  }

  const handleDecrease = (e) => {
    e.stopPropagation()
    if (count > 0) {
      const customerId = 1 // Lấy từ user state hoặc localStorage

      if (card.type === 'PROTEIN' && count === 1) {
        dispatch(setShowSauceHint(false))
        dispatch(clearSuggestions())
      }
      dispatch(removeIngredientActHistory({
        item: {
          id: card.id,
          calories: card.calories,
          protein: card.protein,
          carbs: card.carbs,
          fat: card.fat,
          type: card.type
        },
        customerId
      }))
    }
  }

  // console.log('🚀 ~ handleIncrease ~ isSuggested:', isSuggested)
  const handleIncrease = (e) => {
    e.stopPropagation()
    const customerId = 1
    // if (card.type === 'SAUCE' && isSuggested) {
    //   dispatch(setShowSauceHint(false))
    //   dispatch(clearSuggestions())
    // }
    // if (card.type === 'PROTEIN') {
    //   dispatch(setSuggestedSauces(sauceSuggestions || []))
    //   dispatch(setShowSauceHint(true))
    // }

    dispatch(createIngredientActHistory({
      item: {
        id: card.id,
        title: card.title,
        image: card.image,
        calories: card.calories,
        protein: card.protein,
        carbs: card.carbs,
        fat: card.fat,
        type: card.type,
        price: card.price,
        stock: card.stock
      },
      customerId
    }))
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        minHeight: 260,
        position: 'relative',
        perspective: '1000px',
        borderRadius: 2,
        transition: 'all 0.3s ease'
      }}
      onClick={handleCardClick}
    >
      {/* Lớp chứa card có thể lật */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transition: 'transform 0.5s',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          borderRadius: 5
        }}
      >
        {/* Mặt trước */}
        <Box
          sx={{
            borderRadius: 5,
            pt: { xs: 2, md: 3 },
            pb: { xs: 2, md: 0 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            // border: isSuggested ? '2px solid #00B389' : 'none',
            boxShadow: '0 2px 12px 0 rgba(122,35,51,0.07)',
            transition: 'all 0.2s ease-in-out',
            backgroundColor: count > 0 ? 'rgba(0, 179, 137, 0.25)' : theme.palette.primary.card,
            position: 'absolute',
            backfaceVisibility: 'hidden',
            '&:hover': {
              boxShadow: '0 4px 16px 0 rgba(122,35,51,0.1)',
              background: count > 0 ? 'rgba(0, 179, 137, 0.25)' : '#00000010',
              borderColor: theme.palette.primary.text
            }
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: count > 0 ? 'rgba(0, 179, 137, 0.25)' : theme.palette.primary.card,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: { xs: 1, md: 1.5 },
              flexShrink: 0,
              overflow: 'hidden',
              border: '2px solid',
              borderColor: count > 0 ? theme.palette.background.main : 'transparent',
              transition: 'all 0.3s ease'
            }}
          >
            <Box component="img" src={card?.image} alt={card?.title} sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%'
            }} />
          </Box>

          <Typography
            sx={{
              color: theme.palette.primary.text,
              fontWeight: 500,
              textAlign: 'center',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%',
              px: 1,
              mt: 'auto',
              mb: 2
            }}
          >
            {card?.title}
          </Typography>

          {/* Counter ở mặt trước */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '60%',
              borderRadius: 5,
              p: 0.3,
              gap: { xs: 0.3, md: 0.4 },
              justifyContent: 'center',
              backgroundColor: theme.palette.primary.card,
              mt: 'auto',
              mb: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <IconButton
              size="small"
              onClick={handleDecrease}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>

            <Typography
              sx={{
                width: 30,
                height: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: 1
              }}
            >
              {count}
            </Typography>

            <IconButton
              size="small"
              onClick={handleIncrease}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Mặt sau */}
        <Box
          sx={{
            borderRadius: 5,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            border: '1.5px solid ' + theme.palette.primary.text,
            boxShadow: '0 2px 12px 0 rgba(122,35,51,0.07)',
            backgroundColor: count > 0 ? 'rgba(0, 179, 137, 0.25)' : theme.palette.primary.card,
            position: 'absolute',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            justifyContent: 'center'
          }}
        >
          {/* <Typography variant="h7" fontWeight="bold" textAlign="center" mb={1}>
            {card?.title}
          </Typography> */}

          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
            <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='body2' >Calories:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{card?.calories || 0}</Typography>
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='body2' >Protein:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{card?.protein || 0}g</Typography>
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='body2' >Carbs:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{card?.carbs || 0}g</Typography>
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='body2' >Fat:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{card?.fat || 0}g</Typography>
            </Typography>
          </Box>

          {card?.description && (
            <Typography
              variant="body2"
              sx={{
                fontStyle: 'italic',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textAlign: 'center',
                mb: 2
              }}
            >
              &quot;{card.description}&quot;
            </Typography>
          )}

          {/* Counter ở mặt sau */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '60%',
              borderRadius: 5,
              py: 0.3,
              gap: { xs: 0.3, md: 0.4 },
              justifyContent: 'center',
              backgroundColor: theme.palette.primary.card,
              minWidth: '75%',
              mt: 'auto',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <IconButton
              size="small"
              onClick={handleDecrease}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>

            <Typography
              sx={{
                width: 30,
                height: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: 1
              }}
            >
              {count}
            </Typography>

            <IconButton
              size="small"
              onClick={handleIncrease}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default FoodCard
