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
import { useForm } from 'react-hook-form'
import { updateCustomerInfo } from '~/apis'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import { formatDate } from '~/utils/formatter'
import { toast } from 'react-toastify'

export default function BasicInfo({ basicInfo, setBasicInfo }) {
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
    const { email, firstName, lastName, phone, gender, birthDate } = data
    await toast.promise(updateCustomerInfo({ email, firstName, lastName, phone, gender, birthDate }), {
      pending: 'Updating...',
      success: 'Updated successfully!',
      error: 'Update failed!'
    }).then(res => {
      if (!res.error) {
        setOpenDialog(false)
        setBasicInfo(prev => ({
          ...prev,
          firstName,
          lastName,
          phone,
          gender,
          birthDate,
          fullName: `${firstName} ${lastName}`
        }))
      }
    })
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
                  Personal Information
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleOpenDialog}
                >
                  Update
                </Button>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#666' }}>
                      Full Name:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 400 }}>
                      {basicInfo?.fullName || 'Not updated'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#666' }}>
                      Phone Number:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 400 }}>
                      {basicInfo?.phone || 'Not updated'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#666' }}>
                      Email:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 400 }}>
                      {basicInfo?.email || 'Not updated'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#666' }}>
                      Gender:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 400 }}>
                      {basicInfo?.gender == 'UNDEFINED' ? 'Not updated' : basicInfo?.gender == 'MALE' ? 'Male' : 'Female'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#666' }}>
                      Date of Birth:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 400 }}>
                      {basicInfo?.birthDate ? formatDate(basicInfo.birthDate) : 'Not updated'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#666' }}>
                      Default Address:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 400, textAlign: 'right' }}>
                      {basicInfo?.addresses && basicInfo.addresses.length > 0
                        ? (() => {
                          const defaultAddress = basicInfo.addresses.find(addr => addr.isDefault === true)
                          return defaultAddress ? defaultAddress.fullAddress : 'No default address'
                        })()
                        : 'Not updated'}
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
            Update Personal Information
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                {/* First Name and Last Name */}
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="First Name"
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
                    label="Last Name"
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
                    label="Phone Number"
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
                    <InputLabel>Gender</InputLabel>
                    <Select
                      label="Gender"
                      {...register('gender', {
                        required: FIELD_REQUIRED_MESSAGE
                      })}
                    >
                      <MenuItem value="MALE">Male</MenuItem>
                      <MenuItem value="FEMALE">Female</MenuItem>
                    </Select>
                  </FormControl>
                  <FieldErrorAlert errors={errors} fieldName='gender' />
                </Grid>

                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
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
                    helperText="Email cannot be changed"
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
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
            >
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Grid>
  )
}

