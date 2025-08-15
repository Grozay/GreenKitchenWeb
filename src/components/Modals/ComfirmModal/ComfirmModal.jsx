import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
  minWidth: 320,
  maxWidth: 400,
  width: '90%',
  outline: 'none'
}

const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm',
  description = '',
  btnName = 'Confirm'
}) => {
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
          {title}
        </Typography>
        <Typography variant="body1" textAlign="center" mb={3}>
          {description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            onClick={onConfirm}
            sx={{
              minWidth: 120,
              borderRadius: 5,
              bgcolor: (theme) => theme.palette.primary.secondary,
              '&:hover': {
                bgcolor: (theme) => theme.palette.primary.main
              }
            }}
          >
            {btnName}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default ConfirmModal