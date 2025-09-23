import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { useState, useEffect } from 'react'

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

const CustomMealInfoModal = ({ open, onClose, onSave, defaultTitle, defaultDesc }) => {
  const [title, setTitle] = useState(defaultTitle || '')
  const [desc, setDesc] = useState(defaultDesc || '')

  const translatedSaveYourCustomMeal = 'Save Your Custom Meal'
  const translatedMealName = 'Meal Name'
  const translatedDescription = 'Description'
  const translatedSave = 'Save'

  useEffect(() => {
    setTitle(defaultTitle || '')
    setDesc(defaultDesc || '')
  }, [defaultTitle, defaultDesc, open])

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
          {translatedSaveYourCustomMeal}
        </Typography>
        <TextField
          label={translatedMealName}
          value={title}
          onChange={e => setTitle(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label={translatedDescription}
          value={desc}
          onChange={e => setDesc(e.target.value)}
          fullWidth
          multiline
          rows={2}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          <Button variant="contained" onClick={() => onSave({ title, desc })} sx={{
            minWidth: 140,
            borderRadius: 5,
            bgcolor: (theme) => theme.palette.primary.secondary,
            '&:hover': {
              bgcolor: (theme) => theme.palette.primary.main
            }
          }}>{translatedSave}</Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default CustomMealInfoModal