import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import theme from '~/theme'
import { useDispatch, useSelector } from 'react-redux'
import { addItem, removeItem } from '~/redux/meal/mealSlice'
import { selectCurrentMeal } from '~/redux/meal/mealSlice'

const FoodCard = ({ card }) => {
  const [count, setCount] = useState(0)
  const selectedItems = useSelector(selectCurrentMeal)
  const dispatch = useDispatch()

  useEffect(() => {
    const itemInCart = selectedItems[card.type]?.find(item => item.id === card.id)
    setCount(itemInCart?.quantity || 0)
  }, [selectedItems, card.id, card.type])

  const handleDecrease = () => {
    if (count > 0) {
      setCount(prev => prev - 1)
      dispatch(removeItem({
        id: card.id,
        calories: card.calories,
        protein: card.protein,
        carbs: card.carbs,
        fat: card.fat,
        type: card.type
      }))
    }
  }

  const handleIncrease = () => {
    setCount(prev => prev + 1)
    dispatch(addItem({
      id: card.id,
      title: card.title,
      image: card.image,
      calories: card.calories,
      protein: card.protein,
      carbs: card.carbs,
      fat: card.fat,
      type: card.type,
      quantity: 1
    }))
  }

  return (
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
        minHeight: 260,
        border: '1.5px solid ' + theme.palette.primary.text,
        boxShadow: '0 2px 12px 0 rgba(122,35,51,0.07)',
        transition: 'all 0.2s ease-in-out',
        backgroundColor: count > 0 ? 'rgba(0, 179, 137, 0.25)' : theme.palette.primary.card,
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
        <img src={card?.image} alt={card?.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
      </Box>

      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        width: '60%',
        borderRadius: 5,
        p: 0.3,
        gap: { xs: 0.3, md: 0.4 },
        justifyContent: 'center',
        backgroundColor: theme.palette.primary.card
      }}>
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
          minHeight: { xs: 48, sm: 56 },
          lineHeight: '1.4',
          px: 1,
          mt: 'auto'
        }}
      >
        {card?.title}
      </Typography>
    </Box>
  )
}

export default FoodCard
