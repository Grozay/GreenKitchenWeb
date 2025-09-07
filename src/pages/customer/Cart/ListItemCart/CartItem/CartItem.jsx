import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import Grid from '@mui/material/Grid'
import { useState } from 'react' // Bỏ useMemo vì sẽ dùng component nhỏ
import ConfirmModal from '~/components/Modals/ComfirmModal/ComfirmModal'
import useTranslate from '~/hooks/useTranslate'
import { useSelector } from 'react-redux'
import { selectCurrentLanguage } from '~/redux/translations/translationsSlice'
import { useTranslation } from 'react-i18next'

// Component nhỏ để dịch từng ingredient (tránh gọi hook trong map)
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

const CartItem = ({
  item,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemove,
  calculateItemNutrition
}) => {
  const [confirmDialog, setConfirmDialog] = useState(false)
  const currentLang = useSelector(selectCurrentLanguage)
  const { t } = useTranslation()
  const nutrition = calculateItemNutrition(item)

  // Dịch tự động cho title và description
  const translatedTitle = useTranslate(getProductTitle() || '', currentLang)
  const translatedDescription = useTranslate(getProductDescription() || '', currentLang)

  // Lấy title đúng chuẩn (ưu tiên menuMeal, customMeal, weekMeal)
  function getProductTitle() {
    if (item.isCustom) {
      return item.customMeal?.title || item.title || 'Custom Meal'
    } else if (item.itemType === 'WEEK_MEAL') {
      return item.title || 'Week Meal'
    } else {
      return item.menuMeal?.title || item.title || 'Menu Meal'
    }
  }

  // Lấy image đúng chuẩn
  const getProductImage = () => {
    if (item.isCustom) {
      if (item.customMeal?.image) return item.customMeal.image
      if (item.customMeal?.details && item.customMeal.details.length > 0) {
        return item.customMeal.details[0].image || 'https://res.cloudinary.com/quyendev/image/upload/v1753600162/lkxear2dns4tpnjzntny.png'
      }
      return 'https://res.cloudinary.com/quyendev/image/upload/v1753600162/lkxear2dns4tpnjzntny.png'
    } else if (item.itemType === 'WEEK_MEAL') {
      return item.image || 'https://res.cloudinary.com/quyendev/image/upload/v1753600162/lkxear2dns4tpnjzntny.png'
    } else {
      return item.menuMeal?.image || item.image || 'https://res.cloudinary.com/quyendev/image/upload/v1753600162/lkxear2dns4tpnjzntny.png'
    }
  }

  // Lấy description đúng chuẩn
  function getProductDescription() {
    if (item.isCustom) {
      return item.customMeal?.description || item.description || 'Custom meal với các nguyên liệu được lựa chọn'
    } else if (item.itemType === 'WEEK_MEAL') {
      return item.description || 'Tuần ăn với các bữa được chọn'
    } else {
      return item.menuMeal?.description || item.description || ''
    }
  }

  const handleRemove = () => {
    setConfirmDialog(true)
  }

  // Sửa lại hàm xác nhận xóa để truyền đúng id
  const confirmRemove = () => {
    onRemove(item.id) // Dùng item.id cho tất cả loại
    setConfirmDialog(false)
  }

  const handleIncreaseQuantity = () => {
    onIncreaseQuantity(item.id)
  }

  const handleDecreaseQuantity = () => {
    if (item.quantity > 1) {
      onDecreaseQuantity(item.id)
    } else {
      handleRemove()
    }
  }

  const items = [
    { label: t('nutrition.calories'), value: `${Math.round(nutrition.calories)}` }, // Sửa thành cart.calories
    { label: t('nutrition.protein'), value: `${Math.round(nutrition.protein)}g` },
    { label: t('nutrition.carbs'), value: `${Math.round(nutrition.carbs)}g` },
    { label: t('nutrition.fat'), value: `${Math.round(nutrition.fat)}g` }
  ]

  return (
    <>
      <Box sx={{
        bgcolor: 'white',
        borderRadius: 5,
        border: '1px solid #e0e0e0',
        mb: 2,
        overflow: 'hidden'
      }}>
        <Box sx={{
          p: { xs: 2, md: 3 }
        }}>
          <Box sx={{
            display: 'flex',
            gap: { xs: 2, md: 5 },
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            {/* Product Image */}
            <Box sx={{
              flexShrink: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center'
            }}>
              <Avatar
                src={getProductImage()}
                alt={translatedTitle}
                sx={{
                  width: { xs: 100, md: 120 },
                  height: { xs: 100, md: 120 },
                  borderRadius: '50%'
                }}
              />
            </Box>

            {/* Product Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' } }}>
                <Box>
                  <Typography variant="h6" sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: '#2c2c2c',
                    fontSize: { xs: '1rem', md: '1.25rem' }
                  }}>
                    {translatedTitle}
                  </Typography>

                  <Typography variant="body2" sx={{
                    color: 'text.secondary',
                    mb: 2,
                    fontSize: { xs: '0.8rem', md: '0.875rem' }
                  }}>
                    {translatedDescription}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                    <Typography variant="h6" sx={{
                      fontWeight: 700,
                      color: '#2c2c2c',
                      fontSize: { xs: '1.1rem', md: '1.25rem' }
                    }}>
                      {item.totalPrice?.toLocaleString() || '0'} VNĐ
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{
                      textDecoration: 'line-through',
                      fontSize: { xs: '0.8rem', md: '0.875rem' }
                    }}>
                      {((item.totalPrice || 0) * 1.2).toLocaleString()} VNĐ
                    </Typography>
                  </Box>
                </Box>

                {/* Quantity and Actions */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 2, sm: 0 }
                }}>
                  {item.itemType !== 'WEEK_MEAL' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        onClick={handleDecreaseQuantity}
                        size="small"
                        sx={{
                          border: '1px solid #e0e0e0',
                          borderRadius: 1,
                          width: 32,
                          height: 32,
                          '&:hover': { bgcolor: '#f5f5f5' }
                        }}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>

                      <Typography variant="h6" sx={{
                        mx: 2,
                        minWidth: '30px',
                        textAlign: 'center',
                        fontWeight: 600,
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        px: 2,
                        py: 0.5
                      }}>
                        {item.quantity}
                      </Typography>

                      <IconButton
                        onClick={handleIncreaseQuantity}
                        size="small"
                        sx={{
                          border: '1px solid #e0e0e0',
                          borderRadius: 1,
                          width: 32,
                          height: 32,
                          '&:hover': { bgcolor: '#f5f5f5' }
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography>
                        <Box component="span" fontWeight="bold">Quantity:</Box>
                      </Typography>
                      <Typography variant="h6" sx={{
                        mx: 2,
                        minWidth: '30px',
                        textAlign: 'center',
                        fontWeight: 600,
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        px: 2,
                        py: 0.5
                      }}>
                        {item.quantity}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ ml: { xs: 0, sm: 4 }, mb: { xs: 2, sm: 0 } }}>
                    <IconButton
                      onClick={handleRemove}
                      size="small"
                      sx={{
                        color: '#666',
                        '&:hover': { color: '#f44336', bgcolor: '#ffebee' }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>

              {/* Nutrition Info */}
              {item.itemType !== 'WEEK_MEAL' ? (
                <Box>
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
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ height: '30px' }}></Box> // Khoảng trống để đồng bộ với card khác
              )}

              {/* Custom Meal Ingredients */}
              {item.isCustom && item.customMeal?.details && ( // Sửa item.details thành item.customMeal?.details
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    {t('cart.ingredients')}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {item.customMeal.details.slice(0, 5).map((detail) => ( // Dùng item.customMeal.details trực tiếp
                      <IngredientItem
                        key={detail.id}
                        title={detail.title}
                        currentLang={currentLang}
                      />
                    ))}
                    {item.customMeal.details.length > 5 && ( // Dùng item.customMeal.details
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          px: 1,
                          py: 0.5,
                          fontSize: '0.7rem'
                        }}
                      >
                        {t('cart.moreIngredients', { count: item.customMeal.details.length - 5 })}
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Confirmation Modal dùng modal bạn đã làm sẵn */}
      <ConfirmModal
        open={confirmDialog}
        onClose={() => setConfirmDialog(false)}
        onConfirm={confirmRemove}
        title={t('cart.confirmRemoveTitle')}
        description={t('cart.confirmRemoveDescription', { item: translatedTitle })}
        btnName={t('cart.remove')}
      />
    </>
  )
}

export default CartItem