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

export default function CustomerTDEETab() {
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
  // Load health records from API
  useEffect(() => {
    const getCustomerTDEEs = async () => {
      try {
        if (currentCustomer?.id) {
          const records = await getCustomerTDEEsAPI(currentCustomer.id)
          setHealthRecords(records || [])
        }
      } catch (error) {
        toast.error('Không thể tải dữ liệu sức khỏe')
      }
    }
    getCustomerTDEEs()
  }, [currentCustomer])

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
      SEDENTARY: 'Ít vận động',
      LIGHTLY_ACTIVE: 'Vận động nhẹ',
      MODERATELY_ACTIVE: 'Vận động vừa',
      VERY_ACTIVE: 'Vận động nhiều',
      EXTREMELY_ACTIVE: 'Vận động rất nhiều'
    }
    return levels[level] || level
  }

  const getGoalText = (goal) => {
    const goals = {
      LOSE_WEIGHT: 'Giảm cân',
      MAINTAIN: 'Duy trì',
      GAIN_WEIGHT: 'Tăng cân'
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
      toast.error('Vui lòng nhập đầy đủ cân nặng, chiều cao và tuổi')
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
      toast.error('Vui lòng nhập đầy đủ thông tin cơ bản')
      return
    }

    if (!currentCustomer?.id) {
      toast.error('Không tìm thấy thông tin khách hàng')
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

      toast.success('Đã lưu thông tin sức khỏe thành công!')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRecord = async (id) => {
    const { confirmed } = await confirm({
      title: 'Xác nhận xóa',
      description: 'Bạn có chắc chắn muốn xóa bản ghi này không?',
      confirmationText: 'Xóa',
      cancellationText: 'Hủy'
    })
    if (confirmed) {
      await deleteCustomerTDEEAPI(id)
      setHealthRecords(prev => prev.filter(record => record.id !== id))
      toast.success('Đã xóa bản ghi thành công!')
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
                Thông Tin Sức Khỏe Hiện Tại
              </Typography>
              <Chip
                label={`Cập nhật: ${new Date(latestRecord.calculationDate).toLocaleDateString('vi-VN')}`}
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
                    Tuổi
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
                    % mỡ
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3, backgroundColor: 'primary.light' }} />

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ mb: 1, color: 'text.secondary' }}>
                    BMR (Tỷ lệ trao đổi chất cơ bản)
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {latestRecord.bmr} kcal/ngày
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ mb: 1, color: 'text.secondary' }}>
                    TDEE (Tổng năng lượng tiêu hao)
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {latestRecord.tdee} kcal/ngày
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ mb: 1, color: 'text.secondary' }}>
                    Mức độ hoạt động
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
                  Lịch Sử Thông Tin Sức Khỏe
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenDialog(true)}
                  color="primary"
                >
                  Thêm Bản Ghi Mới
                </Button>
              </Box>

              <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ngày</TableCell>
                      <TableCell>Tuổi</TableCell>
                      <TableCell>Chiều cao (cm)</TableCell>
                      <TableCell>Cân nặng (kg)</TableCell>
                      <TableCell>Mỡ (%)</TableCell>
                      <TableCell>Mức độ hoạt động</TableCell>
                      <TableCell>TDEE</TableCell>
                      <TableCell>Mục tiêu</TableCell>
                      <TableCell>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {healthRecords.map((record) => (
                      <TableRow key={record.id} hover>
                        <TableCell>{new Date(record.calculationDate).toLocaleDateString('vi-VN')}</TableCell>
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
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Thêm Thông Tin Sức Khỏe Mới
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Basic Info */}
            <Grid size={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
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
                  <MenuItem value="MALE">Nam</MenuItem>
                  <MenuItem value="FEMALE">Nữ</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Tỷ lệ mỡ cơ thể (%)"
                type="number"
                step="0.1"
                value={currentRecord.bodyFatPercentage}
                onChange={(e) => handleInputChange('bodyFatPercentage', e.target.value)}
                helperText="Tùy chọn - để trống nếu không biết"
              />
            </Grid>

            {/* Activity & Goals */}
            <Grid size={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, mt: 2, color: 'primary.main' }}>
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
                  <MenuItem value="SEDENTARY">Ít vận động - Công việc văn phòng, không chơi thể thao</MenuItem>
                  <MenuItem value="LIGHTLY_ACTIVE">Vận động nhẹ - Chơi thể thao 1-3 buổi/tuần</MenuItem>
                  <MenuItem value="MODERATELY_ACTIVE">Vận động vừa - Chơi thể thao 3-5 buổi/tuần</MenuItem>
                  <MenuItem value="VERY_ACTIVE">Vận động nhiều - Chơi thể thao 6-7 buổi/tuần</MenuItem>
                  <MenuItem value="EXTREMELY_ACTIVE">Vận động viên - Chơi thể thao 2 buổi/ngày</MenuItem>
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
                  <MenuItem value="LOSE_WEIGHT">Giảm cân</MenuItem>
                  <MenuItem value="MAINTAIN">Duy trì</MenuItem>
                  <MenuItem value="GAIN_WEIGHT">Tăng cân</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* TDEE Calculator */}
            <Grid size={12}>
              <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    Tính toán TDEE
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={handleCalculateTDEE}
                    color="primary"
                  >
                    Tính toán
                  </Button>
                </Box>

                {tdeeResult && (
                  <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {tdeeResult.bmr}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        BMR (kcal/ngày)
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.dark' }}>
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
            disabled={loading}
            color="primary"
          >
            {loading ? 'Đang lưu...' : 'Lưu Thông Tin'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
