import { useState } from 'react'
import { useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import SaveIcon from '@mui/icons-material/Save'
import ShoppingCart from '@mui/icons-material/ShoppingCart'
import { useTheme } from '@mui/material'
import { ItemHealthy } from '~/apis/mockData'
import { selectCurrentMeal } from '~/redux/meal/mealSlice'
import { calcCustomTotal, getSuggestedMeals, getNutritionalAdvice } from '~/utils/nutrition'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PageviewIcon from '@mui/icons-material/Pageview'
import SuggestFood from './SuggestFood'
import SelectedFood from './SelectedFood'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useDispatch } from 'react-redux'
import { clearCart } from '~/redux/meal/mealSlice'

const DrawerInfoMobile = ({ onClose }) => {
  const [isReviewing, setIsReviewing] = useState(true)
  const dispatch = useDispatch()
  const theme = useTheme()
  const selected = useSelector(selectCurrentMeal)
  const customTotal = calcCustomTotal(selected)
  const suggestedMeals = getSuggestedMeals(customTotal, ItemHealthy, selected)
  const nutritionalAdvice = getNutritionalAdvice(customTotal)
  const allSelectedItems = Object.values(selected).flat()

  const isBalanced = suggestedMeals.length === 0 && customTotal.calories > 0

  const handleOrderCustom = () => {
    alert('You have successfully ordered a custom meal!')
  }

  const handleClearSelections = () => {
    dispatch(clearCart())
  }

  const handleSaveCustom = () => {
    alert('Your custom meal has been saved!')
  }

  const handleCloseDrawer = () => {
    onClose()
  }

  return (
    <Box
      sx={{
        p: 3,
        width: '100%',
        bgcolor: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%'
      }}
      role="dialog"
      aria-labelledby="drawer-title"
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SearchIcon sx={{ color: theme.palette.primary.secondary }} />
            <Typography id="drawer-title" variant="h6" sx={{ fontWeight: 'medium' }}>
              Healthy Meals Just For You
            </Typography>
          </Box>
          <Box
            sx={{
              width: '10rem',
              height: '0.2rem',
              bgcolor: theme.palette.primary.secondary,
              borderRadius: 2
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
          <IconButton
            onClick={handleCloseDrawer}
            aria-label="Close drawer"
            sx={{
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                color: theme.palette.text.primary
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Scrollable Content */}
      <Box sx={{ flex: 1, overflowY: 'auto', mx: 2, mb: 2, pt: 2 }}>
        {isReviewing ? (
          // --- REVIEW VIEW ---
          <>
            {selected.protein.length > 0 && (
              <SelectedFood allSelectedItems={selected.protein} title="Protein" />
            )}
            {selected.carbs.length > 0 && (
              <SelectedFood allSelectedItems={selected.carbs} title="Carbs" />
            )}
            {selected.side.length > 0 && (
              <SelectedFood allSelectedItems={selected.side} title="Side" />
            )}
            {selected.sauce.length > 0 && (
              <SelectedFood allSelectedItems={selected.sauce} title="Sauce" />
            )}
          </>
        ) : (
          // --- BUILDER VIEW ---
          <>
            {/* Always show review button if there are selected items */}
            {allSelectedItems.length > 0 && (
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<PageviewIcon />}
                  onClick={() => setIsReviewing(true)}
                  sx={{ borderRadius: 5 }}
                >
                  Review My Selections ({allSelectedItems.length} items)
                </Button>
              </Box>
            )}

            {/* Show either balanced message or suggestions */}
            {isBalanced ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'success.main' }} />
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 'medium' }}>
                  Your meal is well-balanced!
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 3 }}>
                  You can now order your custom meal or review your choices.
                </Typography>
              </Box>
            ) : (
              // SUGGESTING STATE
              <>
                {nutritionalAdvice && (
                  <Typography sx={{ mb: 2, fontStyle: 'italic', color: 'text.secondary', textAlign: 'center' }}>
                    {nutritionalAdvice}
                  </Typography>
                )}
                <SuggestFood suggestedMeals={suggestedMeals} />
              </>
            )}
          </>
        )}
      </Box>

      {/* Sticky Custom Meal Section */}
      <Box
        sx={{
          borderRadius: 2,
          position: 'sticky',
          bottom: 0,
          zIndex: 1,
          bgcolor: theme.palette.background.default
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1.5 }}>
          {isReviewing && (
            <>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => setIsReviewing(false)}
                sx={{ borderRadius: 5, color: theme.palette.text.primary }}
                aria-label="Back to Builder"
              >
              Back to Builder
              </Button>
              <Button
                variant="outlined"
                onClick={handleClearSelections}
                sx={{
                  borderRadius: 5,
                  color: theme.palette.text.primary,
                  borderColor: theme.palette.text.primary,
                  fontWeight: 400,
                  '&:hover': {
                    bgcolor: '#00000010'
                  }
                }}
                aria-label="Clear selections"
              >
              Clear Selections
              </Button>
            </>
          )}
        </Box>
        <Box
          sx={{
            width: '10rem',
            height: '0.2rem',
            mx: 'auto',
            mb: 1.5,
            bgcolor: theme.palette.text.primary,
            borderRadius: 2
          }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1.5 }}>
          <LocalOfferIcon sx={{ color: theme.palette.primary.secondary }} />
          <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
            Or order your custom meal
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1.5 }}>
          <TrendingUpIcon sx={{ color: theme.palette.primary.secondary }} />
          <Typography
            variant="body1"
            sx={{ textAlign: 'center', fontSize: { xs: '0.875rem', sm: '1rem' }, whiteSpace: 'nowrap' }}
          >
            Calories: {Math.round(customTotal.calories)} kcal | Protein: {Math.round(customTotal.protein)}g | Carbs:{' '}
            {Math.round(customTotal.carbs)}g | Fat: {Math.round(customTotal.fat)}g
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<ShoppingCart />}
            sx={{ borderRadius: 5 }}
            onClick={handleOrderCustom}
            aria-label="Order custom meal"
          >
            Order meal
          </Button>
          <Button
            variant="outlined"
            color="success"
            startIcon={<SaveIcon />}
            sx={{ borderRadius: 5 }}
            onClick={handleSaveCustom}
            aria-label="Save custom meal"
          >
            Save meal
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default DrawerInfoMobile