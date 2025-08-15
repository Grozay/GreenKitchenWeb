import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import FoodCard from '~/components/FoodCard/FoodCard'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
  minWidth: 400,
  maxWidth: 700,
  width: '90%',
  outline: 'none'
}

const SauceSuggestionModal = ({
  open,
  sauces,
  selectedSauceIds,
  onOrderNow,
  onClose
}) => {
  const selected = useState(selectedSauceIds)

  const handleOrderNow = () => {
    if (onOrderNow) onOrderNow(selected)
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
            color: (theme) => theme.palette.grey[500],
            zIndex: 1
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" fontWeight={700} textAlign="center" mb={2}>
          Gợi ý sốt phù hợp cho bạn
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {sauces.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Typography color="text.secondary" align="center">
                Không có sốt phù hợp với lựa chọn protein của bạn.
              </Typography>
            </Grid>
          ) : (
            sauces.map(sauce => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={sauce.id}>
                <FoodCard card={sauce} />
              </Grid>
            ))
          )}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleOrderNow}
            sx={{
              minWidth: 140,
              borderRadius: 5,
              bgcolor: (theme) => theme.palette.primary.secondary,
              '&:hover': {
                bgcolor: (theme) => theme.palette.primary.secondary
              }
            }}
          >
            Order Now
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default SauceSuggestionModal