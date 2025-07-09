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
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight'
import HeightIcon from '@mui/icons-material/Height'
import PersonIcon from '@mui/icons-material/Person'

export default function HealthProfileTab() {
  const [healthRecords, setHealthRecords] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [currentRecord, setCurrentRecord] = useState({
    age: '',
    height: '',
    weight: '',
    musclePercentage: '',
    fatPercentage: '',
    workoutDaysPerWeek: '',
    gender: 'male',
    activityLevel: 'sedentary',
    goal: 'maintain'
  })
  const [tdeeResult, setTdeeResult] = useState(null)

  // Mock data - sẽ thay bằng API call thật
  useEffect(() => {
    const mockHealthRecords = [
      {
        id: 1,
        date: '2025-01-15',
        age: 25,
        height: 170,
        weight: 65,
        musclePercentage: 35,
        fatPercentage: 15,
        workoutDaysPerWeek: 4,
        gender: 'male',
        activityLevel: 'moderate',
        goal: 'muscle_gain',
        bmr: 1680,
        tdee: 2352
      },
      {
        id: 2,
        date: '2024-12-01',
        age: 25,
        height: 170,
        weight: 67,
        musclePercentage: 33,
        fatPercentage: 18,
        workoutDaysPerWeek: 3,
        gender: 'male',
        activityLevel: 'light',
        goal: 'fat_loss',
        bmr: 1695,
        tdee: 2204
      }
    ]
    setHealthRecords(mockHealthRecords)
  }, [])

  // Tính BMR (Basal Metabolic Rate) theo công thức Mifflin-St Jeor
  const calculateBMR = (weight, height, age, gender) => {
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161
    }
  }

  // Tính TDEE (Total Daily Energy Expenditure)
  const calculateTDEE = (bmr, activityLevel) => {
    const activityMultipliers = {
      sedentary: 1.2, // Ít vận động
      light: 1.375, // Vận động nhẹ (1-3 ngày/tuần)
      moderate: 1.55, // Vận động vừa (3-5 ngày/tuần)
      active: 1.725, // Vận động nhiều (6-7 ngày/tuần)
      very_active: 1.9 // Vận động rất nhiều (2 lần/ngày)
    }
    return Math.round(bmr * activityMultipliers[activityLevel])
  }

  const getActivityLevelText = (level) => {
    const levels = {
      sedentary: 'Ít vận động',
      light: 'Vận động nhẹ (1-3 ngày/tuần)',
      moderate: 'Vận động vừa (3-5 ngày/tuần)',
      active: 'Vận động nhiều (6-7 ngày/tuần)',
      very_active: 'Vận động rất nhiều (2 lần/ngày)'
    }
    return levels[level] || level
  }

  const getGoalText = (goal) => {
    const goals = {
      fat_loss: 'Giảm cân',
      maintain: 'Duy trì',
      muscle_gain: 'Tăng cơ'
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
      alert('Vui lòng nhập đầy đủ cân nặng, chiều cao và tuổi')
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

  const handleSaveRecord = () => {
    if (!currentRecord.weight || !currentRecord.height || !currentRecord.age) {
      alert('Vui lòng nhập đầy đủ thông tin cơ bản')
      return
    }

    const bmr = calculateBMR(
      parseFloat(currentRecord.weight),
      parseFloat(currentRecord.height),
      parseInt(currentRecord.age),
      currentRecord.gender
    )
    const tdee = calculateTDEE(bmr, currentRecord.activityLevel)

    const newRecord = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      ...currentRecord,
      age: parseInt(currentRecord.age),
      height: parseFloat(currentRecord.height),
      weight: parseFloat(currentRecord.weight),
      musclePercentage: parseFloat(currentRecord.musclePercentage) || 0,
      fatPercentage: parseFloat(currentRecord.fatPercentage) || 0,
      workoutDaysPerWeek: parseInt(currentRecord.workoutDaysPerWeek) || 0,
      bmr: Math.round(bmr),
      tdee
    }

    setHealthRecords(prev => [newRecord, ...prev])
    setOpenDialog(false)
    setCurrentRecord({
      age: '',
      height: '',
      weight: '',
      musclePercentage: '',
      fatPercentage: '',
      workoutDaysPerWeek: '',
      gender: 'male',
      activityLevel: 'sedentary',
      goal: 'maintain'
    })
    setTdeeResult(null)
  }

  const handleDeleteRecord = (id) => {
    setHealthRecords(prev => prev.filter(record => record.id !== id))
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
          background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
        }}>
          <CardContent sx={{ p: { xs: 2, md: 3 }, position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{
                fontWeight: 700,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}>
                Thông Tin Sức Khỏe Hiện Tại
              </Typography>
              <Chip
                label={`Cập nhật: ${new Date(latestRecord.date).toLocaleDateString('vi-VN')}`}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600
                }}
              />
            </Box>

            <Grid container spacing={3}>
              <Grid size={{ xs: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <PersonIcon sx={{ fontSize: 40, mb: 1, opacity: 0.9 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                    {latestRecord.age}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Tuổi
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <HeightIcon sx={{ fontSize: 40, mb: 1, opacity: 0.9 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                    {latestRecord.height}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    cm
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <MonitorWeightIcon sx={{ fontSize: 40, mb: 1, opacity: 0.9 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                    {latestRecord.weight}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    kg
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <FitnessCenterIcon sx={{ fontSize: 40, mb: 1, opacity: 0.9 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                    {latestRecord.workoutDaysPerWeek}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    ngày/tuần
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3, backgroundColor: 'rgba(255,255,255,0.3)' }} />

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ mb: 1, opacity: 0.9 }}>
                    BMR (Tỷ lệ trao đổi chất cơ bản)
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                    {latestRecord.bmr} kcal/ngày
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ mb: 1, opacity: 0.9 }}>
                    TDEE (Tổng năng lượng tiêu hao)
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                    {latestRecord.tdee} kcal/ngày
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ mb: 1, opacity: 0.9 }}>
                    Mức độ hoạt động
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    {getActivityLevelText(latestRecord.activityLevel)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Decorative elements */}
            <Box sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 150,
              height: 150,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.1)',
              zIndex: 0
            }} />
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3}>
        {/* Add New Record Section */}
        <Grid size={12}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                  Quản Lý Thông Tin Sức Khỏe
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenDialog(true)}
                  sx={{
                    backgroundColor: '#4caf50',
                    '&:hover': { backgroundColor: '#2e7d32' }
                  }}
                >
                  Thêm Bản Ghi Mới
                </Button>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Theo dõi và lưu lại lịch sử thông tin sức khỏe của bạn. Hệ thống sẽ tự động tính toán BMR và TDEE.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Health Records History */}
        <Grid size={12}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2e7d32' }}>
                Lịch Sử Thông Tin Sức Khỏe
              </Typography>

              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Ngày</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Tuổi</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Chiều cao (cm)</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Cân nặng (kg)</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Cơ bắp (%)</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Mỡ (%)</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Tập/tuần</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>TDEE</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Mục tiêu</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {healthRecords.map((record) => (
                      <TableRow key={record.id} hover>
                        <TableCell>{new Date(record.date).toLocaleDateString('vi-VN')}</TableCell>
                        <TableCell>{record.age}</TableCell>
                        <TableCell>{record.height}</TableCell>
                        <TableCell>{record.weight}</TableCell>
                        <TableCell>{record.musclePercentage || '-'}</TableCell>
                        <TableCell>{record.fatPercentage || '-'}</TableCell>
                        <TableCell>{record.workoutDaysPerWeek}</TableCell>
                        <TableCell>
                          <Chip
                            label={`${record.tdee} kcal`}
                            size="small"
                            sx={{ backgroundColor: '#e8f5e8', color: '#2e7d32' }}
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
                            sx={{ color: '#f44336' }}
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
                    Chưa có dữ liệu. Hãy thêm bản ghi đầu tiên!
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
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2e7d32' }}>
            Thêm Thông Tin Sức Khỏe Mới
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Basic Info */}
            <Grid size={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#2e7d32' }}>
                Thông tin cơ bản
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Tuổi"
                type="number"
                value={currentRecord.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Chiều cao (cm)"
                type="number"
                value={currentRecord.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Cân nặng (kg)"
                type="number"
                step="0.1"
                value={currentRecord.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  value={currentRecord.gender}
                  label="Giới tính"
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                >
                  <MenuItem value="male">Nam</MenuItem>
                  <MenuItem value="female">Nữ</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Số ngày tập/tuần"
                type="number"
                inputProps={{ min: 0, max: 7 }}
                value={currentRecord.workoutDaysPerWeek}
                onChange={(e) => handleInputChange('workoutDaysPerWeek', e.target.value)}
              />
            </Grid>

            {/* Body Composition */}
            <Grid size={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, mt: 2, color: '#2e7d32' }}>
                Thành phần cơ thể (tùy chọn)
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Tỷ lệ cơ bắp (%)"
                type="number"
                step="0.1"
                value={currentRecord.musclePercentage}
                onChange={(e) => handleInputChange('musclePercentage', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Tỷ lệ mỡ (%)"
                type="number"
                step="0.1"
                value={currentRecord.fatPercentage}
                onChange={(e) => handleInputChange('fatPercentage', e.target.value)}
              />
            </Grid>

            {/* Activity & Goals */}
            <Grid size={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, mt: 2, color: '#2e7d32' }}>
                Mức độ hoạt động & Mục tiêu
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Mức độ hoạt động</InputLabel>
                <Select
                  value={currentRecord.activityLevel}
                  label="Mức độ hoạt động"
                  onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                >
                  <MenuItem value="sedentary">Ít vận động</MenuItem>
                  <MenuItem value="light">Vận động nhẹ (1-3 ngày/tuần)</MenuItem>
                  <MenuItem value="moderate">Vận động vừa (3-5 ngày/tuần)</MenuItem>
                  <MenuItem value="active">Vận động nhiều (6-7 ngày/tuần)</MenuItem>
                  <MenuItem value="very_active">Vận động rất nhiều (2 lần/ngày)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Mục tiêu</InputLabel>
                <Select
                  value={currentRecord.goal}
                  label="Mục tiêu"
                  onChange={(e) => handleInputChange('goal', e.target.value)}
                >
                  <MenuItem value="fat_loss">Giảm cân</MenuItem>
                  <MenuItem value="maintain">Duy trì</MenuItem>
                  <MenuItem value="muscle_gain">Tăng cơ</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* TDEE Calculator */}
            <Grid size={12}>
              <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                    Tính toán TDEE
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={handleCalculateTDEE}
                    sx={{ borderColor: '#4caf50', color: '#4caf50' }}
                  >
                    Tính toán
                  </Button>
                </Box>

                {tdeeResult && (
                  <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#4caf50' }}>
                        {tdeeResult.bmr}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        BMR (kcal/ngày)
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                        {tdeeResult.tdee}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        TDEE (kcal/ngày)
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
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveRecord}
            sx={{
              backgroundColor: '#4caf50',
              '&:hover': { backgroundColor: '#2e7d32' }
            }}
          >
            Lưu Thông Tin
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
