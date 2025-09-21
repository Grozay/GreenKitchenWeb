import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import FavoriteIcon from '@mui/icons-material/Favorite'
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight'
import HeightIcon from '@mui/icons-material/Height'
import PersonIcon from '@mui/icons-material/Person'
import { toast } from 'react-toastify'
import { saveCustomerTDEEAPI, getCustomerTDEEsAPI, deleteCustomerTDEEAPI } from '~/apis'
import { useSelector } from 'react-redux'
import { selectCurrentCustomer } from '~/redux/user/customerSlice'
import { useConfirm } from 'material-ui-confirm'
import { useTranslation } from 'react-i18next'
import { selectCurrentLanguage } from '~/redux/translations/translationsSlice'

export default function CustomerTDEETab({ customerDetails, setCustomerDetails }) {
  const { t } = useTranslation()
  const currentLang = useSelector(selectCurrentLanguage)
  const currentCustomer = useSelector(selectCurrentCustomer)
  const [healthRecords, setHealthRecords] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentRecord, setCurrentRecord] = useState({
    age: '',
    height: '',
    weight: '',
    bodyFatPercentage: '',
    gender: 'MALE',
    activityLevel: 'SEDENTARY',
    goal: 'MAINTAIN'
  })
  const [tdeeResult, setTdeeResult] = useState(null)
  const confirm = useConfirm()

  useEffect(() => {
    if (customerDetails?.customerTDEEs) {
      setHealthRecords(customerDetails.customerTDEEs)
    } else {
      setHealthRecords([])
    }
  }, [customerDetails])

  // Tính BMR (Basal Metabolic Rate) theo công thức Mifflin-St Jeor
  const calculateBMR = (weight, height, age, gender) => {
    if (gender === 'MALE') {
      return 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161
    }
  }

  // Tính TDEE (Total Daily Energy Expenditure)
  const calculateTDEE = (bmr, activityLevel) => {
    const activityMultipliers = {
      SEDENTARY: 1.2,
      LIGHTLY_ACTIVE: 1.375,
      MODERATELY_ACTIVE: 1.55,
      VERY_ACTIVE: 1.725,
      EXTREMELY_ACTIVE: 1.9
    }
    return Math.round(bmr * activityMultipliers[activityLevel])
  }

  const getActivityLevelText = (level) => {
    const levels = {
      SEDENTARY: t('profile.tdeeTab.activityLevels.sedentary'),
      LIGHTLY_ACTIVE: t('profile.tdeeTab.activityLevels.lightlyActive'),
      MODERATELY_ACTIVE: t('profile.tdeeTab.activityLevels.moderatelyActive'),
      VERY_ACTIVE: t('profile.tdeeTab.activityLevels.veryActive'),
      EXTREMELY_ACTIVE: t('profile.tdeeTab.activityLevels.extremelyActive')
    }
    return levels[level] || level
  }

  const getGoalText = (goal) => {
    const goals = {
      LOSE_WEIGHT: t('profile.tdeeTab.goals.loseWeight'),
      MAINTAIN: t('profile.tdeeTab.goals.maintain'),
      GAIN_WEIGHT: t('profile.tdeeTab.goals.gainWeight')
    }
    return goals[goal] || goal
  }

  const handleInputChange = (field, value) => {
    setCurrentRecord(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCalculateTDEE = () => {
    const { weight, height, age, gender, activityLevel } = currentRecord

    if (!weight || !height || !age) {
      toast.error(t('profile.tdeeTab.errors.missingBasicInfo'))
      return
    }

    const bmr = calculateBMR(
      parseFloat(weight),
      parseFloat(height),
      parseInt(age),
      gender
    )
    const tdee = calculateTDEE(bmr, activityLevel)

    setTdeeResult({ bmr: Math.round(bmr), tdee })
  }

  const handleSaveRecord = async () => {
    if (!currentRecord.weight || !currentRecord.height || !currentRecord.age) {
      toast.error(t('profile.tdeeTab.errors.missingBasicInfo'))
      return
    }

    if (!currentCustomer?.id) {
      toast.error(t('profile.tdeeTab.errors.customerNotFound'))
      return
    }

    setLoading(true)
    try {
      const bmr = calculateBMR(
        parseFloat(currentRecord.weight),
        parseFloat(currentRecord.height),
        parseInt(currentRecord.age),
        currentRecord.gender
      )
      const tdee = calculateTDEE(bmr, currentRecord.activityLevel)

      const tdeeData = {
        customer: { id: currentCustomer.id },
        age: parseInt(currentRecord.age),
        height: parseFloat(currentRecord.height),
        weight: parseFloat(currentRecord.weight),
        bodyFatPercentage: currentRecord.bodyFatPercentage ? parseFloat(currentRecord.bodyFatPercentage) : null,
        gender: currentRecord.gender,
        activityLevel: currentRecord.activityLevel,
        goal: currentRecord.goal,
        bmr: Math.round(bmr),
        tdee: tdee
      }

      const savedRecord = await saveCustomerTDEEAPI(tdeeData)

      // Add to local state
      setHealthRecords(prev => [savedRecord, ...prev])

      // Reset form
      setOpenDialog(false)
      setCurrentRecord({
        age: '',
        height: '',
        weight: '',
        bodyFatPercentage: '',
        gender: 'MALE',
        activityLevel: 'SEDENTARY',
        goal: 'MAINTAIN'
      })
      setTdeeResult(null)

      toast.success(t('profile.tdeeTab.messages.saveSuccess'))
    } catch (error) {
      toast.error(t('profile.tdeeTab.messages.saveError'))
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRecord = async (id) => {
    const { confirmed } = await confirm({
      title: t('profile.tdeeTab.deleteConfirm.title'),
      description: t('profile.tdeeTab.deleteConfirm.description'),
      confirmationText: t('common.delete'),
      cancellationText: t('common.cancel')
    })
    if (confirmed) {
      await deleteCustomerTDEEAPI(id)
      setHealthRecords(prev => prev.filter(record => record.id !== id))
      toast.success(t('profile.tdeeTab.messages.deleteSuccess'))
    }
  }

  const latestRecord = healthRecords[0]

  return (
    <Box sx={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Current Health Summary */}
      {latestRecord && (
        <Card sx={{
          mb: 3,
          borderRadius: 3,
          backgroundColor: 'white',
          color: 'primary.main',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
        }}>
          <CardContent sx={{ p: { xs: 2, md: 3 }, position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{
                fontWeight: 700,
                color: 'primary.main'
              }}>
                {t('profile.tdeeTab.currentHealthInfo.title')}
              </Typography>
              <Chip
                label={`${t('profile.tdeeTab.currentHealthInfo.lastUpdate')}: ${new Date(latestRecord.calculationDate).toLocaleDateString(currentLang === 'vi' ? 'vi-VN' : 'en-US')}`}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            </Box>

            <Grid container spacing={3}>
              <Grid size={{ xs: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <PersonIcon sx={{ fontSize: 40, mb: 1, color: '#2196F3' }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {latestRecord.age}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t('profile.tdeeTab.fields.age')}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <HeightIcon sx={{ fontSize: 40, mb: 1, color: '#4CAF50' }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {latestRecord.height}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    cm
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <MonitorWeightIcon sx={{ fontSize: 40, mb: 1, color: '#FF9800' }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {latestRecord.weight}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    kg
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <FavoriteIcon sx={{ fontSize: 40, mb: 1, color: '#E91E63' }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {latestRecord.bodyFatPercentage || '-'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t('profile.tdeeTab.fields.bodyFatPercentage')}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3, backgroundColor: 'primary.light' }} />

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ mb: 1, color: 'text.secondary' }}>
                    {t('profile.tdeeTab.bmr.title')}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {latestRecord.bmr} {t('profile.tdeeTab.units.kcalPerDay')}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ mb: 1, color: 'text.secondary' }}>
                    {t('profile.tdeeTab.tdee.title')}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {latestRecord.tdee} {t('profile.tdeeTab.units.kcalPerDay')}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ mb: 1, color: 'text.secondary' }}>
                    {t('profile.tdeeTab.fields.activityLevel')}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {getActivityLevelText(latestRecord.activityLevel)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3}>
        {/* Health Records History */}
        <Grid size={12}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {t('profile.tdeeTab.history.title')}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenDialog(true)}
                  color="primary"
                >
                  {t('profile.tdeeTab.history.addNew')}
                </Button>
              </Box>

              <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('profile.tdeeTab.table.date')}</TableCell>
                      <TableCell>{t('profile.tdeeTab.table.age')}</TableCell>
                      <TableCell>{t('profile.tdeeTab.table.height')}</TableCell>
                      <TableCell>{t('profile.tdeeTab.table.weight')}</TableCell>
                      <TableCell>{t('profile.tdeeTab.table.bodyFat')}</TableCell>
                      <TableCell>{t('profile.tdeeTab.table.activityLevel')}</TableCell>
                      <TableCell>{t('profile.tdeeTab.table.tdee')}</TableCell>
                      <TableCell>{t('profile.tdeeTab.table.goal')}</TableCell>
                      <TableCell>{t('profile.tdeeTab.table.actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {healthRecords.map((record) => (
                      <TableRow key={record.id} hover>
                        <TableCell>{new Date(record.calculationDate).toLocaleDateString(currentLang === 'vi' ? 'vi-VN' : 'en-US')}</TableCell>
                        <TableCell>{record.age}</TableCell>
                        <TableCell>{record.height}</TableCell>
                        <TableCell>{record.weight}</TableCell>
                        <TableCell>{record.bodyFatPercentage || '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label={getActivityLevelText(record.activityLevel)}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${record.tdee} kcal`}
                            size="small"
                            color="primary"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getGoalText(record.goal)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteRecord(record.id)}
                            sx={{ color: 'error.main' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {healthRecords.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('profile.tdeeTab.history.noData')}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add/Edit Record Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
            {t('profile.tdeeTab.dialog.title')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Basic Info */}
            <Grid size={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                {t('profile.tdeeTab.dialog.basicInfo')}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label={t('profile.tdeeTab.fields.age')}
                type="number"
                value={currentRecord.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label={t('profile.tdeeTab.fields.heightCm')}
                type="number"
                value={currentRecord.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label={t('profile.tdeeTab.fields.weightKg')}
                type="number"
                step="0.1"
                value={currentRecord.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>{t('profile.tdeeTab.fields.gender')}</InputLabel>
                <Select
                  value={currentRecord.gender}
                  label={t('profile.tdeeTab.fields.gender')}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                >
                  <MenuItem value="MALE">{t('profile.tdeeTab.genders.male')}</MenuItem>
                  <MenuItem value="FEMALE">{t('profile.tdeeTab.genders.female')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={t('profile.tdeeTab.fields.bodyFatPercentage')}
                type="number"
                step="0.1"
                value={currentRecord.bodyFatPercentage}
                onChange={(e) => handleInputChange('bodyFatPercentage', e.target.value)}
                helperText={t('profile.tdeeTab.fields.bodyFatHelper')}
              />
            </Grid>

            {/* Activity & Goals */}
            <Grid size={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, mt: 2, color: 'primary.main' }}>
                {t('profile.tdeeTab.dialog.activityAndGoals')}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>{t('profile.tdeeTab.fields.activityLevel')}</InputLabel>
                <Select
                  value={currentRecord.activityLevel}
                  label={t('profile.tdeeTab.fields.activityLevel')}
                  onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                >
                  <MenuItem value="SEDENTARY">{t('profile.tdeeTab.activityDescriptions.sedentary')}</MenuItem>
                  <MenuItem value="LIGHTLY_ACTIVE">{t('profile.tdeeTab.activityDescriptions.lightlyActive')}</MenuItem>
                  <MenuItem value="MODERATELY_ACTIVE">{t('profile.tdeeTab.activityDescriptions.moderatelyActive')}</MenuItem>
                  <MenuItem value="VERY_ACTIVE">{t('profile.tdeeTab.activityDescriptions.veryActive')}</MenuItem>
                  <MenuItem value="EXTREMELY_ACTIVE">{t('profile.tdeeTab.activityDescriptions.extremelyActive')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>{t('profile.tdeeTab.fields.goal')}</InputLabel>
                <Select
                  value={currentRecord.goal}
                  label={t('profile.tdeeTab.fields.goal')}
                  onChange={(e) => handleInputChange('goal', e.target.value)}
                >
                  <MenuItem value="LOSE_WEIGHT">{t('profile.tdeeTab.goals.loseWeight')}</MenuItem>
                  <MenuItem value="MAINTAIN">{t('profile.tdeeTab.goals.maintain')}</MenuItem>
                  <MenuItem value="GAIN_WEIGHT">{t('profile.tdeeTab.goals.gainWeight')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* TDEE Calculator */}
            <Grid size={12}>
              <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {t('profile.tdeeTab.calculator.title')}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={handleCalculateTDEE}
                    color="primary"
                  >
                    {t('profile.tdeeTab.calculator.calculate')}
                  </Button>
                </Box>

                {tdeeResult && (
                  <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {tdeeResult.bmr}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('profile.tdeeTab.bmr.label')}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                        {tdeeResult.tdee}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('profile.tdeeTab.tdee.label')}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveRecord}
            disabled={loading}
            color="primary"
          >
            {loading ? t('profile.tdeeTab.dialog.saving') : t('profile.tdeeTab.dialog.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
