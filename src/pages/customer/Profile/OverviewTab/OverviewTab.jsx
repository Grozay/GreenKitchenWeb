
import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import FoodPreferenceDialog from './FoodPreferenceDialog'

export default function OverviewTab({ customerDetails, setCustomerDetails }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [userDeclined, setUserDeclined] = useState(false)

  const vegetarianTypes = [
    { value: 'NEVER', label: 'Ăn mặn' },
    { value: 'VEGAN', label: 'Ăn thuần chay' },
    { value: 'LUNAR_VEGAN', label: 'Ăn chay 2 ngày rằm mỗi tháng' }
  ]

  // Handle cancel dialog
  const handleCancelDialog = () => {
    setDialogOpen(false)
    setUserDeclined(true)
  }

  // Handle dialog close after successful submission
  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  // Open dialog if no customer reference
  if (!customerDetails?.customerReference && !dialogOpen && !userDeclined) {
    setDialogOpen(true)
  }

  const reference = customerDetails?.customerReference
  // Helper để lấy label chế độ ăn
  const vegetarianLabel =
    vegetarianTypes.find(v => v.value === reference?.vegetarianType)?.label || 'Không xác định'

  // Helper để lấy danh sách tên từ mảng object
  const getNames = (arr, key) =>
    Array.isArray(arr) && arr.length > 0
      ? arr.map(item => item[key]).join(', ')
      : 'Chưa có thông tin'

  return (
    <>
      {/* Main Content */}
      <Box sx={{
        p: { xs: 2, sm: 3, md: 4 },
        maxWidth: '900px',
        mx: 'auto'
      }}>
        {customerDetails?.customerReference ? (
          <>
            <Box sx={{
              textAlign: 'center',
              mb: 4,
              p: 3,
              backgroundColor: 'primary.main',
              borderRadius: 2,
              color: 'white'
            }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                🌟 Hồ sơ ẩm thực của bạn
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Thông tin sở thích và chế độ ăn uống đã được lưu
              </Typography>
            </Box>

            <Box sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              p: { xs: 2, sm: 3 },
              boxShadow: 1
            }}>
              {/* Chế độ ăn uống */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                <Typography sx={{ fontWeight: 'bold', minWidth: 140 }}>🥗 Chế độ ăn uống:</Typography>
                <Typography sx={{ ml: 1 }}>{vegetarianLabel}</Typography>
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
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                <Typography sx={{ fontWeight: 'bold', minWidth: 140, color: 'error.main' }}>
                  ⚠️ Dị ứng thực phẩm:
                </Typography>
                <Typography sx={{ ml: 1 }}>
                  {getNames(reference.allergies, 'allergyName') === 'Chưa có thông tin'
                    ? <span style={{ color: '#43a047', fontWeight: 500 }}>Không có dị ứng nào</span>
                    : getNames(reference.allergies, 'allergyName')}
                </Typography>
              </Box>

              {/* Protein yêu thích */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                <Typography sx={{ fontWeight: 'bold', minWidth: 140 }}>🥩 Protein yêu thích:</Typography>
                <Typography sx={{ ml: 1 }}>
                  {getNames(reference.favoriteProteins, 'proteinName')}
                </Typography>
              </Box>

              {/* Carbs yêu thích */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                <Typography sx={{ fontWeight: 'bold', minWidth: 140 }}>🍚 Carbs yêu thích:</Typography>
                <Typography sx={{ ml: 1 }}>
                  {getNames(reference.favoriteCarbs, 'carbName')}
                </Typography>
              </Box>

              {/* Rau củ yêu thích */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                <Typography sx={{ fontWeight: 'bold', minWidth: 140 }}>🥬 Rau củ yêu thích:</Typography>
                <Typography sx={{ ml: 1 }}>
                  {getNames(reference.favoriteVegetables, 'vegetableName')}
                </Typography>
              </Box>
            </Box>
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" gutterBottom>
              👋 Chào mừng bạn đến với Green Kitchen!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              Hãy chia sẻ sở thích ẩm thực để chúng tôi có thể phục vụ bạn tốt hơp
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

      {/* Food Preference Dialog */}
      <FoodPreferenceDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onCancel={handleCancelDialog}
        customerDetails={customerDetails}
        setCustomerDetails={setCustomerDetails}
      />
    </>
  )
}
