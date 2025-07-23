import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import TextField from '@mui/material/TextField'
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
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import Chip from '@mui/material/Chip'
import { useForm } from 'react-hook-form'
import { useConfirm } from 'material-ui-confirm'
import { createNewAddressAPI, updateAddressAPI, deleteAddressAPI } from '~/apis'
import { toast } from 'react-toastify'

export default function AddressList({ addressList, setAddressList, customerDetails }) {
  const [openDialog, setOpenDialog] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const confirm = useConfirm()

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      customerId: customerDetails?.id || null,
      recipientName: '',
      recipientPhone: '',
      street: '',
      ward: '',
      district: '',
      city: '',
      isDefault: false
    }
  })

  const handleOpenDialog = () => {
    setOpenDialog(true)
    setShowAddForm(false)
    setShowEditForm(false)
    setEditingAddress(null)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setShowAddForm(false)
    setShowEditForm(false)
    setEditingAddress(null)
    reset()
  }

  const handleShowAddForm = () => {
    // Kiểm tra giới hạn 4 địa chỉ
    if (addressList && addressList.length >= 4) {
      toast.error('Bạn không thể thêm quá 4 địa chỉ!')
      return
    }

    setShowAddForm(true)
    setShowEditForm(false)
    setEditingAddress(null)
    reset()
  }

  const handleShowEditForm = (address) => {
    setShowEditForm(true)
    setShowAddForm(false)
    setEditingAddress(address)
    setValue('recipientName', address.recipientName || '')
    setValue('recipientPhone', address.recipientPhone || '')
    setValue('street', address.street)
    setValue('ward', address.ward)
    setValue('district', address.district)
    setValue('city', address.city)
    setValue('isDefault', address.isDefault)
  }

  const handleCancelForm = () => {
    setShowAddForm(false)
    setShowEditForm(false)
    setEditingAddress(null)
    reset()
  }

  const handleDeleteAddress = async (addressId) => {
    const { confirmed } = await confirm({
      title: 'Xác nhận xóa địa chỉ',
      description: 'Bạn có chắc chắn muốn xóa địa chỉ này không?',
      confirmationText: 'Xóa',
      cancellationText: 'Hủy',
      confirmationButtonProps: { color: 'error' }
    })

    if (confirmed) {
      toast.promise(deleteAddressAPI(addressId), {
        // pending: 'Đang xóa địa chỉ...'
      }).then(() => {
        const updatedAddresses = addressList?.filter(addr => addr.id !== addressId)
        setAddressList(prev => ({
          ...prev,
          addresses: updatedAddresses
        }))
        toast.success('Địa chỉ đã được xóa thành công!')
      })
    }
  }

  const onSubmit = async (data) => {
    // Kiểm tra giới hạn 4 địa chỉ khi tạo mới
    if (!editingAddress && addressList && addressList.length >= 4) {
      alert('Mỗi khách hàng chỉ được có tối đa 4 địa chỉ!')
      return
    }

    const fullAddress = `${data.street}, ${data.ward}, ${data.district}, ${data.city}`
    // Chuẩn bị payload cho API
    const addressPayload = {
      customerId: customerDetails?.id,
      recipientName: data.recipientName,
      recipientPhone: data.recipientPhone,
      street: data.street,
      ward: data.ward,
      district: data.district,
      city: data.city,
      isDefault: data.isDefault
    }

    // Nếu chọn làm mặc định, cần update tất cả địa chỉ khác về false trước
    if (data.isDefault && addressList && addressList.length > 0) {
      const updatePromises = addressList
        .filter(addr => addr.isDefault && (!editingAddress || addr.id !== editingAddress.id))
        .map(addr => updateAddressAPI({
          id: addr.id,
          customerId: customerDetails?.id,
          recipientName: addr.recipientName,
          recipientPhone: addr.recipientPhone,
          street: addr.street,
          ward: addr.ward,
          district: addr.district,
          city: addr.city,
          isDefault: false
        }))

      // Chờ tất cả update hoàn thành
      await Promise.all(updatePromises)
    }

    if (editingAddress) {
      // Cập nhật địa chỉ - gọi API update
      const updatePayload = {
        id: editingAddress.id,
        ...addressPayload
      }
      toast.promise(updateAddressAPI(updatePayload), {
        // pending: 'Đang cập nhật địa chỉ...',
      }).then(res => {
        if (!res.error) {
          toast.success('Địa chỉ đã được cập nhật thành công!')
          const updatedAddresses = addressList?.map(addr =>
            addr.id === editingAddress.id
              ? {
                ...res,
                fullAddress,
                fullAddressWithCustomer: `${data.recipientName} - ${data.recipientPhone} - ${fullAddress}`
              }
              : data.isDefault ? { ...addr, isDefault: false } : addr
          )

          setAddressList(prev => ({
            ...prev,
            addresses: updatedAddresses
          }))
        }
      })
    } else {
      // Thêm địa chỉ mới - gọi API create
      toast.promise(createNewAddressAPI(addressPayload), {
        // pending: 'Đang thêm địa chỉ...',
      }).then(res => {
        if (!res.error) {
          toast.success('Địa chỉ đã được thêm thành công!')
          const fullAddress = `${data.street}, ${data.ward}, ${data.district}, ${data.city}`
          // Cập nhật state frontend
          let updatedAddressList = [...(addressList || [])]

          // Nếu địa chỉ mới là mặc định, reset tất cả địa chỉ khác về false
          if (data.isDefault) {
            updatedAddressList = updatedAddressList.map(addr => ({ ...addr, isDefault: false }))
          }

          // Thêm địa chỉ mới vào danh sách
          const newAddressWithDisplay = {
            ...res,
            fullAddress,
            fullAddressWithCustomer: `${data.recipientName} - ${data.recipientPhone} - ${fullAddress}`
          }

          setAddressList(prev => ({
            ...prev,
            addresses: [...updatedAddressList, newAddressWithDisplay]
          }))
        }
      })
    }
    handleCancelForm()
  }


  return (
    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
      <Card sx={{
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        height: '100%'
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}>
            <Typography variant="h6" component="h3">
              Số địa chỉ
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={handleOpenDialog}
            >
              Quản lý
            </Button>
          </Box>

          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <LocationOnIcon sx={{
              fontSize: 40,
              color: '#4CAF50'
            }} />
            <Box>
              <Typography variant="h4" sx={{
                fontWeight: 700,
                color: 'primary.main',
                lineHeight: 1
              }}>
                {addressList?.length || 0}
              </Typography>
              <Typography variant="body2" sx={{
                color: 'primary.main',
                fontWeight: 500
              }}>
                {addressList?.length ? 'Địa chỉ đã lưu' : 'Chưa có địa chỉ nào'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Dialog quản lý địa chỉ */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{
          fontWeight: 600,
          color: '#2e7d32',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          Quản lý địa chỉ
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon sx={{ color: '#9E9E9E' }} />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Danh sách địa chỉ */}
            <Grid size={12}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Danh sách địa chỉ đã lưu
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon sx={{ color: '#ffffff' }} />}
                    onClick={handleShowAddForm}
                    sx={{
                      backgroundColor: '#4caf50',
                      '&:hover': { backgroundColor: '#45a049' }
                    }}
                  >
                    Thêm địa chỉ mới
                  </Button>
                </Box>

                {addressList && addressList.length > 0 ? (
                  <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                          <TableCell sx={{ fontWeight: 600 }}>Người nhận</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Địa chỉ</TableCell>
                          <TableCell sx={{ fontWeight: 600 }} align="center">Trạng thái</TableCell>
                          <TableCell sx={{ fontWeight: 600 }} align="center">Thao tác</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {addressList.map((address) => (
                          <TableRow key={address.id} hover>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {address.recipientName || 'Chưa có tên'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {address.recipientPhone || 'Chưa có SĐT'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {address.fullAddress}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={address.isDefault ? 'Mặc định' : 'Không mặc định'}
                                color={address.isDefault ? 'success' : 'default'}
                                size="small"
                                variant={address.isDefault ? 'filled' : 'outlined'}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleShowEditForm(address)}
                                  sx={{
                                    color: '#4caf50',
                                    '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.08)' }
                                  }}
                                >
                                  <EditIcon fontSize="small" sx={{ color: '#4CAF50' }} />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteAddress(address.id)}
                                  sx={{
                                    color: '#f44336',
                                    '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.08)' }
                                  }}
                                >
                                  <DeleteIcon fontSize="small" sx={{ color: '#F44336' }} />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{
                    textAlign: 'center',
                    py: 4,
                    backgroundColor: '#f9f9f9',
                    borderRadius: 1
                  }}>
                    <LocationOnIcon sx={{
                      fontSize: 48,
                      color: '#FF6B6B',
                      mb: 2,
                      filter: 'drop-shadow(0 2px 4px rgba(255,107,107,0.3))'
                    }} />
                    <Typography variant="body2" color="text.secondary">
                      Chưa có địa chỉ nào được lưu
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Form thêm địa chỉ mới */}
            {showAddForm && (
              <Grid size={12}>
                <Box sx={{
                  p: 3,
                  backgroundColor: '#f8f9fa',
                  borderRadius: 1,
                  border: '1px solid #e0e0e0'
                }}>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                      <AddIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Thêm địa chỉ mới
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleCancelForm}
                      sx={{
                        color: '#666',
                        borderColor: '#666',
                        '&:hover': { borderColor: '#999' }
                      }}
                    >
                      Hủy
                    </Button>
                  </Box>

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                      <Grid size={6}>
                        <TextField
                          {...register('recipientName', { required: 'Vui lòng nhập tên người nhận' })}
                          label="Tên người nhận"
                          fullWidth
                          size="small"
                          error={!!errors.recipientName}
                          helperText={errors.recipientName?.message}
                        />
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          {...register('recipientPhone', {
                            required: 'Vui lòng nhập số điện thoại',
                            pattern: {
                              value: /^[0-9]{10,11}$/,
                              message: 'Số điện thoại phải có 10-11 chữ số'
                            }
                          })}
                          label="Số điện thoại người nhận"
                          fullWidth
                          size="small"
                          error={!!errors.recipientPhone}
                          helperText={errors.recipientPhone?.message}
                        />
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          {...register('street', { required: 'Vui lòng nhập địa chỉ' })}
                          label="Địa chỉ"
                          fullWidth
                          size="small"
                          error={!!errors.street}
                          helperText={errors.street?.message}
                        />
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          {...register('ward', { required: 'Vui lòng nhập phường/xã' })}
                          label="Phường/Xã"
                          fullWidth
                          size="small"
                          error={!!errors.ward}
                          helperText={errors.ward?.message}
                        />
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          {...register('district', { required: 'Vui lòng nhập quận/huyện' })}
                          label="Quận/Huyện"
                          fullWidth
                          size="small"
                          error={!!errors.district}
                          helperText={errors.district?.message}
                        />
                      </Grid>
                      <Grid size={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Tỉnh/Thành phố</InputLabel>
                          <Select
                            {...register('city', { required: 'Vui lòng chọn tỉnh/thành phố' })}
                            label="Tỉnh/Thành phố"
                            error={!!errors.city}
                          >
                            <MenuItem value="HCM">TP. Hồ Chí Minh</MenuItem>
                            <MenuItem value="HN">Hà Nội</MenuItem>
                            <MenuItem value="DN">Đà Nẵng</MenuItem>
                            <MenuItem value="HP">Hải Phòng</MenuItem>
                            <MenuItem value="CT">Cần Thơ</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={12}>
                        <FormControl component="fieldset">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <input
                              type="checkbox"
                              {...register('isDefault')}
                              id="isDefault"
                            />
                            <label htmlFor="isDefault">
                              <Typography variant="body2">
                                Đặt làm địa chỉ mặc định
                              </Typography>
                            </label>
                          </Box>
                        </FormControl>
                      </Grid>
                      <Grid size={12}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                          <Button
                            variant="outlined"
                            onClick={handleCancelForm}
                            sx={{
                              color: '#666',
                              borderColor: '#666',
                              '&:hover': { borderColor: '#999' }
                            }}
                          >
                            Hủy
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            startIcon={<AddIcon />}
                            sx={{
                              backgroundColor: '#4caf50',
                              '&:hover': { backgroundColor: '#45a049' }
                            }}
                          >
                            Thêm địa chỉ
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </form>
                </Box>
              </Grid>
            )}

            {/* Form chỉnh sửa địa chỉ */}
            {showEditForm && editingAddress && (
              <Grid size={12}>
                <Box sx={{
                  p: 3,
                  backgroundColor: '#fff3e0',
                  borderRadius: 1,
                  border: '1px solid #ffb74d'
                }}>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#f57c00' }}>
                      <EditIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Chỉnh sửa địa chỉ
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleCancelForm}
                      sx={{
                        color: '#666',
                        borderColor: '#666',
                        '&:hover': { borderColor: '#999' }
                      }}
                    >
                      Hủy
                    </Button>
                  </Box>

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                      <Grid size={6}>
                        <TextField
                          {...register('recipientName', { required: 'Vui lòng nhập tên người nhận' })}
                          label="Tên người nhận"
                          fullWidth
                          size="small"
                          error={!!errors.recipientName}
                          helperText={errors.recipientName?.message}
                        />
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          {...register('recipientPhone', {
                            required: 'Vui lòng nhập số điện thoại',
                            pattern: {
                              value: /^[0-9]{10,11}$/,
                              message: 'Số điện thoại phải có 10-11 chữ số'
                            }
                          })}
                          label="Số điện thoại người nhận"
                          fullWidth
                          size="small"
                          error={!!errors.recipientPhone}
                          helperText={errors.recipientPhone?.message}
                        />
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          {...register('street', { required: 'Vui lòng nhập địa chỉ' })}
                          label="Địa chỉ"
                          fullWidth
                          size="small"
                          error={!!errors.street}
                          helperText={errors.street?.message}
                        />
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          {...register('ward', { required: 'Vui lòng nhập phường/xã' })}
                          label="Phường/Xã"
                          fullWidth
                          size="small"
                          error={!!errors.ward}
                          helperText={errors.ward?.message}
                        />
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          {...register('district', { required: 'Vui lòng nhập quận/huyện' })}
                          label="Quận/Huyện"
                          fullWidth
                          size="small"
                          error={!!errors.district}
                          helperText={errors.district?.message}
                        />
                      </Grid>
                      <Grid size={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Tỉnh/Thành phố</InputLabel>
                          <Select
                            {...register('city', { required: 'Vui lòng chọn tỉnh/thành phố' })}
                            label="Tỉnh/Thành phố"
                            error={!!errors.city}
                          >
                            <MenuItem value="HCM">TP. Hồ Chí Minh</MenuItem>
                            <MenuItem value="HN">Hà Nội</MenuItem>
                            <MenuItem value="DN">Đà Nẵng</MenuItem>
                            <MenuItem value="HP">Hải Phòng</MenuItem>
                            <MenuItem value="CT">Cần Thơ</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={12}>
                        <FormControl component="fieldset">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <input
                              type="checkbox"
                              {...register('isDefault')}
                              id="isDefaultEdit"
                            />
                            <label htmlFor="isDefaultEdit">
                              <Typography variant="body2">
                                Đặt làm địa chỉ mặc định
                              </Typography>
                            </label>
                          </Box>
                        </FormControl>
                      </Grid>
                      <Grid size={12}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                          <Button
                            variant="outlined"
                            onClick={handleCancelForm}
                            sx={{
                              color: '#666',
                              borderColor: '#666',
                              '&:hover': { borderColor: '#999' }
                            }}
                          >
                            Hủy
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            startIcon={<EditIcon />}
                            sx={{
                              backgroundColor: '#ff9800',
                              '&:hover': { backgroundColor: '#f57c00' }
                            }}
                          >
                            Cập nhật địa chỉ
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </form>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
      </Dialog>
    </Grid>
  )
}
