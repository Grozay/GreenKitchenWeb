import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { selectCurrentCustomer } from '~/redux/user/customerSlice'
import { fetchCustomerDetails, updateCustomerInfo } from '~/apis'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import { formatDate } from '~/utils/formatter'

export default function BasicInfo({ basicInfo, setBasicInfo }) {
  const currentCustomer = useSelector(selectCurrentCustomer)
  const [openDialog, setOpenDialog] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: basicInfo?.email || '',
      firstName: basicInfo?.firstName || '',
      lastName: basicInfo?.lastName || '',
      phone: basicInfo?.phone || '',
      gender: basicInfo?.gender || '',
      birthDate: basicInfo?.birthDate || ''
    }
  })

  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const submitUpdate = async (data) => {
    try {
      const { email, firstName, lastName, phone, gender, birthDate } = data
      await updateCustomerInfo({ email, firstName, lastName, phone, gender, birthDate })
      setOpenDialog(false)
      // Refresh data sau khi cập nhật
      const newData = await fetchCustomerDetails(currentCustomer.email)
      setBasicInfo(newData)
    } catch {
      // Error handling
    }
  }

  return (
    <Grid size={12}>
      <Card sx={{
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <CardContent sx={{ p: 3 }}>
          {!basicInfo ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
              }}>
                <Typography variant="h6" component="h2">
                  Thông tin cá nhân
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleOpenDialog}
                >
                  Cập nhật
                </Button>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#666' }}>
                      Họ tên:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 400 }}>
                      {basicInfo?.fullName || 'Chưa cập nhật'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#666' }}>
                      Số điện thoại:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 400 }}>
                      {basicInfo?.phone || 'Chưa cập nhật'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#666' }}>
                      Email:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 400 }}>
                      {basicInfo?.email || 'Chưa cập nhật'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#666' }}>
                      Giới tính:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 400 }}>
                      {basicInfo?.gender == 'UNDEFINED' ? 'Chưa cập nhật' : basicInfo?.gender == 'MALE' ? 'Nam' : 'Nữ'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#666' }}>
                      Ngày sinh:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 400 }}>
                      {basicInfo?.birthDate ? formatDate(basicInfo.birthDate) : 'Chưa cập nhật'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#666' }}>
                      Địa chỉ mặc định:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 400, textAlign: 'right' }}>
                      {basicInfo?.addresses && basicInfo.addresses.length > 0
                        ? (() => {
                          const defaultAddress = basicInfo.addresses.find(addr => addr.isDefault === true)
                          return defaultAddress ? defaultAddress.fullAddress : 'Chưa có địa chỉ mặc định'
                        })()
                        : 'Chưa cập nhật'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog cập nhật thông tin */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(submitUpdate)}>
          <DialogTitle>
            Cập nhật thông tin cá nhân
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                {/* First Name and Last Name */}
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Tên"
                    variant="outlined"
                    error={!!errors['firstName']}
                    {...register('firstName', {
                      required: FIELD_REQUIRED_MESSAGE
                    })}
                  />
                  <FieldErrorAlert errors={errors} fieldName='firstName' />
                </Grid>

                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Họ"
                    variant="outlined"
                    error={!!errors['lastName']}
                    {...register('lastName', {
                      required: FIELD_REQUIRED_MESSAGE
                    })}
                  />
                  <FieldErrorAlert errors={errors} fieldName='lastName' />
                </Grid>

                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    variant="outlined"
                    error={!!errors['phone']}
                    {...register('phone', {
                      required: FIELD_REQUIRED_MESSAGE
                    })}
                  />
                  <FieldErrorAlert errors={errors} fieldName='phone' />
                </Grid>

                <Grid size={12}>
                  <FormControl fullWidth variant="outlined" error={!!errors['gender']}>
                    <InputLabel>Giới tính</InputLabel>
                    <Select
                      label="Giới tính"
                      {...register('gender', {
                        required: FIELD_REQUIRED_MESSAGE
                      })}
                    >
                      <MenuItem value="MALE">Nam</MenuItem>
                      <MenuItem value="FEMALE">Nữ</MenuItem>
                    </Select>
                  </FormControl>
                  <FieldErrorAlert errors={errors} fieldName='gender' />
                </Grid>

                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Ngày sinh"
                    type="date"
                    variant="outlined"
                    error={!!errors['birthDate']}
                    {...register('birthDate', {
                      required: FIELD_REQUIRED_MESSAGE
                    })}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                  <FieldErrorAlert errors={errors} fieldName='birthDate' />
                </Grid>

                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={basicInfo?.email || ''}
                    variant="outlined"
                    disabled
                    helperText="Email không thể thay đổi"
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              color="inherit"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
            >
              Lưu thay đổi
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Grid>
  )
}

