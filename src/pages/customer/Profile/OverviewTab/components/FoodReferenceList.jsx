
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import GreenyAvt from '~/assets/images/greeny.png'

export default function FoodReferenceList({ customerDetails, vegetarianTypes, setPrefill, setEditMode, setDialogOpen, setUserDeclined }) {
  const reference = customerDetails?.customerReference
  // Helper để lấy label chế độ ăn
  const vegetarianLabel = vegetarianTypes.find(v => v.value === reference?.vegetarianType)?.label || 'Không xác định'

  // Render list as Chips for nicer UI
  const renderChips = (arr, key, color = 'default') => {
    if (!Array.isArray(arr) || arr.length === 0) {
      return <Typography sx={{ color: 'text.disabled' }}>Chưa có thông tin</Typography>
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
                🌟 SỞ THÍCH THỰC PHẨM CỦA TÔI
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
                ✏️ Chỉnh sửa
              </Button>
            </Box>
            {/* Card body */}
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              {/* Chế độ ăn uống */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                <Typography sx={{ fontWeight: 'bold', minWidth: 140 }}>🥗 Chế độ ăn uống:</Typography>
                <Chip
                  label={vegetarianLabel}
                  size="small"
                  color={reference?.vegetarianType === 'VEGAN' ? 'success' : reference?.vegetarianType === 'LUNAR_VEGAN' ? 'secondary' : 'default'}
                  sx={{ ml: 1 }}
                />
                {(reference.canEatEggs || reference.canEatDairy) && (
                  <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                    {reference.canEatEggs && (
                      <Chip label="Ăn được trứng" color="success" size="small" icon={<span>🥚</span>} />
                    )}
                    {reference.canEatDairy && (
                      <Chip label="Ăn được sữa" color="success" size="small" icon={<span>🥛</span>} />
                    )}
                  </Box>
                )}
              </Box>

              {/* Ghi chú */}
              {reference.note && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontWeight: 'bold', minWidth: 140 }}>💭 Ghi chú:</Typography>
                  <Typography sx={{ ml: 1 }}>{reference.note}</Typography>
                </Box>
              )}

              {/* Dị ứng thực phẩm */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap' }}>
                <Typography sx={{ fontWeight: 'bold', minWidth: 140, color: 'error.main' }}>
                  ⚠️ Dị ứng thực phẩm:
                </Typography>
                <Box sx={{ ml: 1 }}>
                  {Array.isArray(reference.allergies) && reference.allergies.length > 0
                    ? renderChips(reference.allergies, 'allergyName', 'error')
                    : <Typography sx={{ color: '#43a047', fontWeight: 500 }}>Không có dị ứng nào</Typography>}
                </Box>
              </Box>

              {/* Protein yêu thích */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap' }}>
                <Typography sx={{ fontWeight: 'bold', minWidth: 140 }}>🥩 Protein yêu thích:</Typography>
                <Box sx={{ ml: 1 }}>
                  {renderChips(reference.favoriteProteins, 'proteinName', 'secondary')}
                </Box>
              </Box>

              {/* Carbs yêu thích */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap' }}>
                <Typography sx={{ fontWeight: 'bold', minWidth: 140 }}>🍚 Carbs yêu thích:</Typography>
                <Box sx={{ ml: 1 }}>
                  {renderChips(reference.favoriteCarbs, 'carbName', 'info')}
                </Box>
              </Box>

              {/* Rau củ yêu thích */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1, flexWrap: 'wrap' }}>
                <Typography sx={{ fontWeight: 'bold', minWidth: 140 }}>🥬 Rau củ yêu thích:</Typography>
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
            Chào mừng bạn đến với Green Kitchen!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Hãy chia sẻ sở thích ẩm thực để chúng tôi có thể phục vụ bạn tốt hơn
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setDialogOpen(true)
              setUserDeclined(false)
            }}
            sx={{ px: 4, py: 1.5 }}
          >
            📝 Thiết lập sở thích ẩm thực
          </Button>
        </Box>
      )}
    </Box>
  )
}
