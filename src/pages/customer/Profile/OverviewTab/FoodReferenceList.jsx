
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import GreenyAvt from '~/assets/images/greeny.png'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectCurrentLanguage } from '~/redux/translations/translationsSlice'

export default function FoodReferenceList({ customerDetails, vegetarianTypes, setPrefill, setEditMode, setDialogOpen, setUserDeclined }) {
  const { t } = useTranslation()
  const currentLang = useSelector(selectCurrentLanguage)
  const reference = customerDetails?.customerReference
  // Helper để lấy label chế độ ăn
  const vegetarianLabel = vegetarianTypes.find(v => v.value === reference?.vegetarianType)?.label || t('profile.overviewTab.foodReferenceList.unknown')

  // Render list as Chips for nicer UI
  const renderChips = (arr, key, color = 'default') => {
    if (!Array.isArray(arr) || arr.length === 0) {
      return <Typography sx={{ color: 'text.disabled' }}>{t('profile.overviewTab.foodReferenceList.noInfo')}</Typography>
    }
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {arr.map((item, idx) => (
          <Chip key={idx} label={item[key]} color={color} size="small" />
        ))}
      </Box>
    )
  }

  return (
    <Box>
      {customerDetails?.customerReference ? (
        <>
          {/* Single merged card with header and Edit button */}
          <Box sx={{ backgroundColor: 'white', borderRadius: 2, boxShadow: 2, overflow: 'hidden' }}>
            {/* Card header */}
            <Box sx={(theme) => ({
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: theme.palette.common.white,
              px: { xs: 2, sm: 3 },
              py: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            })}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 0.3, color: 'white' }}>
                🌟 {t('profile.overviewTab.foodReferenceList.title')}
              </Typography>
              <Button
                variant="outlined"
                color="inherit"
                sx={{
                  borderColor: 'common.white',
                  color: 'common.white',
                  '&:hover': {
                    borderColor: 'common.white',
                    backgroundColor: 'rgba(255,255,255,0.12)'
                  }
                }}
                onClick={() => {
                  // Prefill values for edit
                  const r = customerDetails.customerReference
                  setPrefill({
                    vegetarianType: r.vegetarianType || '',
                    canEatEggs: !!r.canEatEggs,
                    canEatDairy: !!r.canEatDairy,
                    note: r.note || '',
                    favoriteProteins: (r.favoriteProteins || []).map(p => p.proteinName),
                    favoriteCarbs: (r.favoriteCarbs || []).map(c => c.carbName),
                    favoriteVegetables: (r.favoriteVegetables || []).map(v => v.vegetableName),
                    allergies: (r.allergies || []).map(a => a.allergyName)
                  })
                  setEditMode(true)
                  setDialogOpen(true)
                }}
              >
                ✏️ {t('common.edit')}
              </Button>
            </Box>
            {/* Card body */}
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              {/* Chế độ ăn uống */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                <Typography sx={{ fontWeight: 'bold', minWidth: 140 }}>🥗 {t('profile.overviewTab.foodReferenceList.dietType')}:</Typography>
                <Chip
                  label={vegetarianLabel}
                  size="small"
                  color={reference?.vegetarianType === 'VEGAN' ? 'success' : reference?.vegetarianType === 'LUNAR_VEGAN' ? 'secondary' : 'default'}
                  sx={{ ml: 1 }}
                />
                {(reference.canEatEggs || reference.canEatDairy) && (
                  <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                    {reference.canEatEggs && (
                      <Chip label={t('profile.overviewTab.foodReferenceList.canEatEggs')} color="success" size="small" icon={<span>🥚</span>} />
                    )}
                    {reference.canEatDairy && (
                      <Chip label={t('profile.overviewTab.foodReferenceList.canEatDairy')} color="success" size="small" icon={<span>🥛</span>} />
                    )}
                  </Box>
                )}
              </Box>

              {/* Ghi chú */}
              {reference.note && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontWeight: 'bold', minWidth: 140 }}>💭 {t('profile.overviewTab.foodReferenceList.notes')}:</Typography>
                  <Typography sx={{ ml: 1 }}>{reference.note}</Typography>
                </Box>
              )}

              {/* Dị ứng thực phẩm */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap' }}>
                <Typography sx={{ fontWeight: 'bold', minWidth: 140, color: 'error.main' }}>
                  ⚠️ {t('profile.overviewTab.foodReferenceList.allergies')}:
                </Typography>
                <Box sx={{ ml: 1 }}>
                  {Array.isArray(reference.allergies) && reference.allergies.length > 0
                    ? renderChips(reference.allergies, 'allergyName', 'error')
                    : <Typography sx={{ color: '#43a047', fontWeight: 500 }}>{t('profile.overviewTab.foodReferenceList.noAllergies')}</Typography>}
                </Box>
              </Box>

              {/* Protein yêu thích */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap' }}>
                <Typography sx={{ fontWeight: 'bold', minWidth: 140 }}>🥩 {t('profile.overviewTab.foodReferenceList.favoriteProteins')}:</Typography>
                <Box sx={{ ml: 1 }}>
                  {renderChips(reference.favoriteProteins, 'proteinName', 'secondary')}
                </Box>
              </Box>

              {/* Carbs yêu thích */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap' }}>
                <Typography sx={{ fontWeight: 'bold', minWidth: 140 }}>🍚 {t('profile.overviewTab.foodReferenceList.favoriteCarbs')}:</Typography>
                <Box sx={{ ml: 1 }}>
                  {renderChips(reference.favoriteCarbs, 'carbName', 'info')}
                </Box>
              </Box>

              {/* Rau củ yêu thích */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1, flexWrap: 'wrap' }}>
                <Typography sx={{ fontWeight: 'bold', minWidth: 140 }}>🥬 {t('profile.overviewTab.foodReferenceList.favoriteVegetables')}:</Typography>
                <Box sx={{ ml: 1 }}>
                  {renderChips(reference.favoriteVegetables, 'vegetableName', 'success')}
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8, backgroundColor: 'white' }}>
          <img src={GreenyAvt} alt="green kitchen" style={{ height: 120 }} />
          <Typography variant="h5" gutterBottom>
            {t('profile.overviewTab.foodReferenceList.welcomeTitle')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            {t('profile.overviewTab.foodReferenceList.welcomeDescription')}
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setDialogOpen(true)
              setUserDeclined(false)
            }}
            sx={{ px: 4, py: 1.5 }}
          >
            📝 {t('profile.overviewTab.foodReferenceList.setupButton')}
          </Button>
        </Box>
      )}
    </Box>
  )
}
