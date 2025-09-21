import React, { useState, useEffect } from 'react'
import { Box, Grid, Card, CardContent, CardMedia, Typography, Button } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux' // Thêm useDispatch
import { selectCustomerId } from '~/redux/user/customerSlice'
import { getCustomMealByIdAPI } from '~/apis'
import AppBar from '~/components/AppBar/AppBar'
import Footer from '~/components/Footer/Footer'
import theme from '~/theme'
import { useTranslation } from 'react-i18next'
import useTranslate from '~/hooks/useTranslate'
import { selectCurrentLanguage } from '~/redux/translations/translationsSlice'
import { setMealFromCustom, setMeal } from '~/redux/meal/mealSlice' // Thêm import action
import { useNavigate } from 'react-router-dom' // Thêm import navigate

// Component nhỏ để dịch từng ingredient (tương tự CartItem)
const IngredientItem = ({ title, currentLang }) => {
  const translatedTitle = useTranslate(title || '', currentLang)
  return (
    <Typography
      variant="caption"
      sx={{
        bgcolor: '#f5f5f5',
        px: 1,
        py: 0.5,
        borderRadius: 1,
        fontSize: '0.7rem'
      }}
    >
      {translatedTitle}
    </Typography>
  )
}

const SavedCustomMealLayout = () => {
  const [customMeals, setCustomMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const customerId = useSelector(selectCustomerId)
  const currentLang = useSelector(selectCurrentLanguage)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCustomMeals = async () => {
      if (customerId) {
        try {
          const data = await getCustomMealByIdAPI(customerId)
          // Kiểm tra nếu data là mảng, nếu không thì wrap vào mảng hoặc set rỗng
          const mealsArray = Array.isArray(data) ? data : (data ? [data] : [])
          setCustomMeals(mealsArray)
        } catch (error) {
          console.error('Error fetching custom meals:', error)
          setCustomMeals([]) // Set rỗng nếu lỗi
        }
      }
      setLoading(false)
    }
    fetchCustomMeals()
  }, [customerId])

  if (loading) return <Typography>Loading...</Typography>

  const handleAdjust = (meal) => {
    dispatch(setMealFromCustom(meal)) // Giữ set selectedItems
    dispatch(setMeal(meal)) // Thêm set meal vào Redux
    navigate('/saved-smart-meal-planner') // Không cần state
  }

  return (
    <Box>
      <AppBar /> {/* Thêm AppBar */}
      <Box
        sx={{
          mt: theme.fitbowl.appBarHeight, // Thêm margin top cho AppBar
          backgroundColor: theme.colorSchemes.light.palette.background.default,
          minHeight: '100vh',
          px: { xs: 0, sm: 0, md: 2 },
          py: { xs: 1, sm: 2, md: 3 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h4" gutterBottom>Saved Custom Meals</Typography>
          {customMeals.length === 0 ? (
            <Typography>No custom meals found.</Typography>
          ) : (
            <Grid container spacing={2}>
              {customMeals.map((meal) => {
                // Giả định quantity = 1 nếu không có (có thể thêm vào data nếu cần)
                const quantity = meal.quantity || 1
                const items = [
                  { label: t('nutrition.calories'), value: `${Math.round(meal.calories)}`, perUnit: `${Math.round(meal.calories / quantity)}` },
                  { label: t('nutrition.protein'), value: `${Math.round(meal.protein)}g`, perUnit: `${Math.round(meal.protein / quantity)}g` },
                  { label: t('nutrition.carbs'), value: `${Math.round(meal.carb)}g`, perUnit: `${Math.round(meal.carb / quantity)}g` },
                  { label: t('nutrition.fat'), value: `${Math.round(meal.fat)}g`, perUnit: `${Math.round(meal.fat / quantity)}g` }
                ]

                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={meal.id}>
                    <Card sx={{ maxWidth: 345, height: '100%', borderRadius: 5, display: 'flex', flexDirection: 'column' }}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={meal.image}
                        alt={meal.title}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {meal.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {meal.description}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Price: {meal.price.toLocaleString()} VND
                        </Typography>

                        {/* Nutrition Info (theo CartItem) */}
                        <Box sx={{ mt: 2 }}>
                          <Box sx={{ borderBottom: '1.5px dashed' }}></Box>
                          <Box sx={{ mt: 2.5 }}>
                            <Grid
                              container
                              spacing={2}
                              sx={{
                                textAlign: 'center',
                                display: 'flex',
                                justifyContent: 'center',
                                justifyItems: 'center',
                                width: '100%',
                                m: 1,
                                '& .MuiGrid-item': {
                                  padding: '0 8px',
                                  flexBasis: '25%',
                                  maxWidth: '25%',
                                  flexGrow: 1
                                }
                              }}
                            >
                              {items.map((nutritionItem, index) => (
                                <Grid size={{ xs: 3 }} key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                  <Typography variant="h7" fontWeight="bold" sx={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.2 }}>
                                    {nutritionItem.value}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 400, fontSize: '0.75rem' }}>
                                    {nutritionItem.label}
                                  </Typography>
                                  {quantity > 1 && (
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25, fontSize: '0.6rem' }}>
                                      ({nutritionItem.perUnit} per unit)
                                    </Typography>
                                  )}
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        </Box>

                        {/* Ingredients (theo CartItem) */}
                        {meal.details && meal.details.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                              {t('cart.ingredients')}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {meal.details.slice(0, 5).map((detail) => (
                                <IngredientItem
                                  key={detail.id}
                                  title={detail.title}
                                  currentLang={currentLang}
                                />
                              ))}
                              {meal.details.length > 5 && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: 'text.secondary',
                                    px: 1,
                                    py: 0.5,
                                    fontSize: '0.7rem'
                                  }}
                                >
                                  {t('cart.moreIngredients', { count: meal.details.length - 5 })}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                          <Button variant="contained" sx={{ mt: 1, borderRadius: 5 }} onClick={() => handleAdjust(meal)}>Adjust</Button>
                          <Button variant="contained" sx={{ mt: 1, borderRadius: 5, backgroundColor: theme.colorSchemes.light.palette.primary.secondary }}>Add to Cart</Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          )}
        </Box>
      </Box>
      <Footer /> {/* Thêm Footer */}
    </Box>
  )
}

export default SavedCustomMealLayout
