import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { toast } from 'react-toastify'
import { createCustomerReferenceAPI } from '~/apis'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectCurrentLanguage } from '~/redux/translations/translationsSlice'

export default function FoodReferenceDialog({
  open,
  onClose,
  onCancel,
  customerDetails,
  setCustomerDetails,
  editMode = false,
  prefill = null,
  onSubmit
}) {
  const { t } = useTranslation()
  const currentLang = useSelector(selectCurrentLanguage)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    vegetarianType: '',
    canEatEggs: false,
    canEatDairy: false,
    note: '',
    favoriteProteins: [],
    favoriteCarbs: [],
    favoriteVegetables: [],
    allergies: [],
    customProtein: '',
    customCarb: '',
    customVegetable: '',
    customAllergy: ''
  })

  // Prefill when edit mode opens
  useEffect(() => {
    if (open) {
      if (editMode && prefill) {
        setFormData(prev => ({
          ...prev,
          vegetarianType: prefill.vegetarianType || '',
          canEatEggs: !!prefill.canEatEggs,
          canEatDairy: !!prefill.canEatDairy,
          note: prefill.note || '',
          favoriteProteins: prefill.favoriteProteins || [],
          favoriteCarbs: prefill.favoriteCarbs || [],
          favoriteVegetables: prefill.favoriteVegetables || [],
          allergies: prefill.allergies || []
        }))
      } else {
        // reset on create
        setFormData(prev => ({
          ...prev,
          vegetarianType: '',
          canEatEggs: false,
          canEatDairy: false,
          note: '',
          favoriteProteins: [],
          favoriteCarbs: [],
          favoriteVegetables: [],
          allergies: []
        }))
      }
    }
  }, [open, editMode, prefill])

  // Options for food preferences
  const proteinOptions = [
    t('profile.overviewTab.foodPreferences.proteins.beef'),
    t('profile.overviewTab.foodPreferences.proteins.chicken'),
    t('profile.overviewTab.foodPreferences.proteins.pork'),
    t('profile.overviewTab.foodPreferences.proteins.salmon'),
    t('profile.overviewTab.foodPreferences.proteins.mackerel'),
    t('profile.overviewTab.foodPreferences.proteins.shrimp'),
    t('profile.overviewTab.foodPreferences.proteins.crab')
  ]

  const carbOptions = [
    t('profile.overviewTab.foodPreferences.carbs.whiteRice'),
    t('profile.overviewTab.foodPreferences.carbs.brownRice'),
    t('profile.overviewTab.foodPreferences.carbs.purpleRice'),
    t('profile.overviewTab.foodPreferences.carbs.sweetPotato'),
    t('profile.overviewTab.foodPreferences.carbs.potato')
  ]

  const vegetableOptions = [
    t('profile.overviewTab.foodPreferences.vegetables.greenSalad'),
    t('profile.overviewTab.foodPreferences.vegetables.eggplant'),
    t('profile.overviewTab.foodPreferences.vegetables.broccoli'),
    t('profile.overviewTab.foodPreferences.vegetables.cauliflower'),
    t('profile.overviewTab.foodPreferences.vegetables.spinach')
  ]

  const allergyOptions = [
    t('profile.overviewTab.foodPreferences.allergies.peanuts'),
    t('profile.overviewTab.foodPreferences.allergies.cashews'),
    t('profile.overviewTab.foodPreferences.allergies.shellfish'),
    t('profile.overviewTab.foodPreferences.allergies.milk'),
    t('profile.overviewTab.foodPreferences.allergies.soy'),
    t('profile.overviewTab.foodPreferences.allergies.sesame'),
    t('profile.overviewTab.foodPreferences.allergies.fish'),
    t('profile.overviewTab.foodPreferences.allergies.seafood')
  ]

  const vegetarianTypes = [
    { value: 'NEVER', label: t('profile.overviewTab.vegetarianTypes.never') },
    { value: 'VEGAN', label: t('profile.overviewTab.vegetarianTypes.vegan') },
    { value: 'LUNAR_VEGAN', label: t('profile.overviewTab.vegetarianTypes.lunarVegan') }
  ]

  // Handle checkbox changes
  const handleCheckboxChange = (category, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }))
  }

  // Handle custom input changes
  const handleCustomInputChange = (category, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: value
    }))
  }

  // Add custom item to list
  const addCustomItem = (category, customField) => {
    const customValue = formData[customField].trim()
    if (customValue && !formData[category].includes(customValue)) {
      setFormData(prev => ({
        ...prev,
        [category]: [...prev[category], customValue],
        [customField]: ''
      }))
    }
  }

  // Remove item from list
  const removeItem = (category, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item !== value)
    }))
  }

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (editMode && onSubmit) {
        await onSubmit(formData)
        onClose()
        toast.success(t('profile.overviewTab.foodPreferences.updateSuccess'))
      } else {
        // Prepare data for API
        const referenceData = {
          customerId: customerDetails.id,
          vegetarianType: formData.vegetarianType || 'NEVER',
          canEatEggs: formData.canEatEggs,
          canEatDairy: formData.canEatDairy,
          note: formData.note,
          favoriteProteins: formData.favoriteProteins.map(name => ({ proteinName: name })),
          favoriteCarbs: formData.favoriteCarbs.map(name => ({ carbName: name })),
          favoriteVegetables: formData.favoriteVegetables.map(name => ({ vegetableName: name })),
          allergies: formData.allergies.map(name => ({ allergyName: name }))
        }

        const createdReference = await createCustomerReferenceAPI(referenceData)

        // Update customer details with new reference
        setCustomerDetails(prev => ({
          ...prev,
          customerReference: createdReference
        }))

        onClose()
        toast.success(t('profile.overviewTab.foodPreferences.saveSuccess'))
      }
    } catch {
      toast.error(t('profile.overviewTab.foodPreferences.saveError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {editMode ? t('profile.overviewTab.foodPreferences.editTitle') : t('profile.overviewTab.foodPreferences.setupTitle')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('profile.overviewTab.foodPreferences.description')}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Grid container spacing={4}>
          {/* Vegetarian Type */}
          <Grid size={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ fontWeight: 'bold', mb: 1 }}>
                🥗 {t('profile.overviewTab.foodPreferences.dietType')}
              </FormLabel>
              <RadioGroup
                value={formData.vegetarianType}
                onChange={(e) => {
                  const newValue = e.target.value
                  setFormData(prev => ({
                    ...prev,
                    vegetarianType: newValue,
                    // Reset eggs and dairy to false if choosing "Ăn mặn"
                    canEatEggs: newValue === 'NEVER' ? false : prev.canEatEggs,
                    canEatDairy: newValue === 'NEVER' ? false : prev.canEatDairy
                  }))
                }}
              >
                {vegetarianTypes.map((type) => (
                  <FormControlLabel
                    key={type.value}
                    value={type.value}
                    control={<Radio />}
                    label={type.label}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Eggs and Dairy */}
          {formData.vegetarianType && formData.vegetarianType !== 'NEVER' && (
            <Grid size={12}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                💡 <strong>{t('profile.overviewTab.foodPreferences.note')}:</strong> {t('profile.overviewTab.foodPreferences.eggsDairyNote')}
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.canEatEggs}
                      onChange={(e) => setFormData(prev => ({ ...prev, canEatEggs: e.target.checked }))}
                    />
                  }
                  label={t('profile.overviewTab.foodPreferences.canEatEggs')}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.canEatDairy}
                      onChange={(e) => setFormData(prev => ({ ...prev, canEatDairy: e.target.checked }))}
                    />
                  }
                  label={t('profile.overviewTab.foodPreferences.canEatDairy')}
                />
              </FormGroup>
            </Grid>
          )}

          {/* Note */}
          <Grid size={12}>
            <TextField
              fullWidth
              label={t('profile.overviewTab.foodPreferences.additionalNotes')}
              multiline
              rows={3}
              value={formData.note}
              onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
              placeholder={t('profile.overviewTab.foodPreferences.notePlaceholder')}
            />
          </Grid>

          {/* Favorite Proteins */}
          <Grid size={12}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              🥩 {t('profile.overviewTab.foodPreferences.favoriteProteins')}
            </Typography>
            <FormGroup sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
              {proteinOptions.map((protein) => (
                <FormControlLabel
                  key={protein}
                  control={
                    <Checkbox
                      checked={formData.favoriteProteins.includes(protein)}
                      onChange={() => handleCheckboxChange('favoriteProteins', protein)}
                    />
                  }
                  label={protein}
                  sx={{ minWidth: '200px' }}
                />
              ))}
            </FormGroup>
            <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                size="small"
                label={t('profile.overviewTab.foodPreferences.customProtein')}
                value={formData.customProtein}
                onChange={(e) => handleCustomInputChange('customProtein', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomItem('favoriteProteins', 'customProtein')}
              />
              <Button
                variant="outlined"
                onClick={() => addCustomItem('favoriteProteins', 'customProtein')}
              >
                {t('profile.overviewTab.foodPreferences.addButton')}
              </Button>
            </Box>
            {formData.favoriteProteins.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.favoriteProteins.map((protein, index) => (
                  <Chip
                    key={index}
                    label={protein}
                    onDelete={() => removeItem('favoriteProteins', protein)}
                    color="secondary"
                  />
                ))}
              </Box>
            )}
          </Grid>

          <Divider />

          {/* Favorite Carbs */}
          <Grid size={12}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              🍚 {t('profile.overviewTab.foodPreferences.favoriteCarbs')}
            </Typography>
            <FormGroup sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
              {carbOptions.map((carb) => (
                <FormControlLabel
                  key={carb}
                  control={
                    <Checkbox
                      checked={formData.favoriteCarbs.includes(carb)}
                      onChange={() => handleCheckboxChange('favoriteCarbs', carb)}
                    />
                  }
                  label={carb}
                  sx={{ minWidth: '200px' }}
                />
              ))}
            </FormGroup>
            <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                size="small"
                label={t('profile.overviewTab.foodPreferences.customCarb')}
                value={formData.customCarb}
                onChange={(e) => handleCustomInputChange('customCarb', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomItem('favoriteCarbs', 'customCarb')}
              />
              <Button
                variant="outlined"
                onClick={() => addCustomItem('favoriteCarbs', 'customCarb')}
              >
                {t('profile.overviewTab.foodPreferences.addButton')}
              </Button>
            </Box>
            {formData.favoriteCarbs.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.favoriteCarbs.map((carb, index) => (
                  <Chip
                    key={index}
                    label={carb}
                    onDelete={() => removeItem('favoriteCarbs', carb)}
                    color="info"
                  />
                ))}
              </Box>
            )}
          </Grid>

          <Divider />

          {/* Favorite Vegetables */}
          <Grid size={12}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              🥬 {t('profile.overviewTab.foodPreferences.favoriteVegetables')}
            </Typography>
            <FormGroup sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
              {vegetableOptions.map((vegetable) => (
                <FormControlLabel
                  key={vegetable}
                  control={
                    <Checkbox
                      checked={formData.favoriteVegetables.includes(vegetable)}
                      onChange={() => handleCheckboxChange('favoriteVegetables', vegetable)}
                    />
                  }
                  label={vegetable}
                  sx={{ minWidth: '200px' }}
                />
              ))}
            </FormGroup>
            <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                size="small"
                label={t('profile.overviewTab.foodPreferences.customVegetable')}
                value={formData.customVegetable}
                onChange={(e) => handleCustomInputChange('customVegetable', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomItem('favoriteVegetables', 'customVegetable')}
              />
              <Button
                variant="outlined"
                onClick={() => addCustomItem('favoriteVegetables', 'customVegetable')}
              >
                {t('profile.overviewTab.foodPreferences.addButton')}
              </Button>
            </Box>
            {formData.favoriteVegetables.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.favoriteVegetables.map((vegetable, index) => (
                  <Chip
                    key={index}
                    label={vegetable}
                    onDelete={() => removeItem('favoriteVegetables', vegetable)}
                    color="success"
                  />
                ))}
              </Box>
            )}
          </Grid>

          <Divider />

          {/* Allergies */}
          <Grid size={12}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'error.main' }}>
              ⚠️ {t('profile.overviewTab.foodPreferences.allergies')}
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              {t('profile.overviewTab.foodPreferences.allergiesNote')}
            </Alert>
            <FormGroup sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
              {allergyOptions.map((allergy) => (
                <FormControlLabel
                  key={allergy}
                  control={
                    <Checkbox
                      checked={formData.allergies.includes(allergy)}
                      onChange={() => handleCheckboxChange('allergies', allergy)}
                    />
                  }
                  label={allergy}
                  sx={{ minWidth: '200px' }}
                />
              ))}
            </FormGroup>
            <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                size="small"
                label={t('profile.overviewTab.foodPreferences.customAllergy')}
                value={formData.customAllergy}
                onChange={(e) => handleCustomInputChange('customAllergy', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomItem('allergies', 'customAllergy')}
              />
              <Button
                variant="outlined"
                onClick={() => addCustomItem('allergies', 'customAllergy')}
              >
                {t('profile.overviewTab.foodPreferences.addButton')}
              </Button>
            </Box>
            {formData.allergies.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.allergies.map((allergy, index) => (
                  <Chip
                    key={index}
                    label={allergy}
                    onDelete={() => removeItem('allergies', allergy)}
                    color="error"
                  />
                ))}
              </Box>
            )}
          </Grid>

          {/* Submit Button */}
          <Grid size={12}>
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={loading}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                  }
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    {t('profile.overviewTab.foodPreferences.saving')}
                  </>
                ) : (
                  t('profile.overviewTab.foodPreferences.savePreferences')
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onCancel} color="secondary">
          {t('common.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
