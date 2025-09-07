import LanguageIcon from '@mui/icons-material/Language'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentLanguage, updateCurrentLanguage } from '~/redux/translations/translationsSlice'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import i18n from '~/customLibraries/i18n'

const LanguageSelect = () => {
  const dispatch = useDispatch()
  const currentLanguageCode = useSelector(selectCurrentLanguage)
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'vi', name: 'Vietnamese' }
  ]

  const currentLanguage = languages.find((lang) => lang.code === currentLanguageCode) || languages[1]

  const handleSwitchLanguage = () => {
    const newLanguage = currentLanguageCode === 'en' ? 'vi' : 'en'
    dispatch(updateCurrentLanguage(newLanguage))  // Cập nhật Redux
    i18n.changeLanguage(newLanguage)  // Cập nhật i18n
  }

  return (
    <Box>
      <Box
        variant="text"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.6,
          cursor: 'pointer',
          '&:hover': { backgroundColor: (theme) => theme.palette.action.hover }
        }}
        onClick={handleSwitchLanguage}
      >
        <LanguageIcon fontSize="small" sx={{ color: (theme) => theme.palette.text.primary }} />
        <Typography sx={{ fontSize: 13, fontWeight: 500, color: (theme) => theme.palette.text.primary }}>
          {currentLanguage.name}
        </Typography>
      </Box>
    </Box>
  )
}

export default LanguageSelect