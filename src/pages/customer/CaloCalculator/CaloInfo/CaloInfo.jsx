import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import theme from '~/theme'
import { useForm, Controller } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { createCustomerHealthyInfoAPI } from '~/apis/index'
import { toast } from 'react-toastify'

const exerciseLevels = [
  { value: 'SEDENTARY', label: 'Ít vận động' },
  { value: 'LIGHT', label: 'Vận động nhẹ (1-3 buổi/tuần)' },
  { value: 'MODERATE', label: 'Vận động vừa (3-5 buổi/tuần)' },
  { value: 'ACTIVE', label: 'Vận động nhiều (6-7 buổi/tuần)' },
  { value: 'VERY_ACTIVE', label: 'Vận động rất nhiều (2 lần/ngày)' }
]

const goals = [
  { value: 'LOSE_WEIGHT', label: 'Giảm cân' },
  { value: 'MAINTAIN_WEIGHT', label: 'Duy trì cân nặng' },
  { value: 'GAIN_WEIGHT', label: 'Tăng cân' },
  { value: 'BUILD_MUSCLE', label: 'Tăng cơ' }
]

const allergies = [
  { value: 'PEANUTS', label: 'Đậu phộng' },
  { value: 'SEAFOOD', label: 'Hải sản' },
  { value: 'EGGS', label: 'Trứng' },
  { value: 'MILK', label: 'Sữa' },
  { value: 'WHEAT', label: 'Lúa mì' },
  { value: 'SOY', label: 'Đậu nành' },
  { value: 'FISH', label: 'Cá' },
  { value: 'SHELLFISH', label: 'Động vật có vỏ' }
]

const styleInput = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.colorSchemes.light.palette.text.primary,
      borderRadius: '8px'
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.colorSchemes.light.palette.text.primary,
      borderRadius: '8px'
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.colorSchemes.light.palette.text.primary,
      borderWidth: '2px',
      borderRadius: '8px'
    }
  },
  '& .MuiInputBase-input': {
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    },
    '&[type=number]': {
      '-moz-appearance': 'textfield'
    },
    '&.Mui-focused': {
      color: theme.colorSchemes.light.palette.text.primary
    }
  },
  '& .MuiInputLabel-root': {
    fontSize: { xs: '1rem', sm: '0.875rem' },
    color: theme.colorSchemes.light.palette.text.primary,
    '&.Mui-focused': {
      color: `${theme.colorSchemes.light.palette.text.primary} !important`
    }
  }
}

const styleSelect = {
  '& .MuiSelect-select': {
    color: theme.colorSchemes.light.palette.text.primary,
    borderRadius: '8px',
    '&:focus': {
      backgroundColor: 'transparent'
    }
  },
  '& .MuiInputLabel-root': {
    color: theme.colorSchemes.light.palette.text.primary,
    '&.Mui-focused': {
      color: `${theme.colorSchemes.light.palette.text.primary} !important`
    }
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.colorSchemes.light.palette.text.primary,
    borderRadius: '8px'
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.colorSchemes.light.palette.text.primary,
    borderRadius: '8px'
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.colorSchemes.light.palette.text.primary,
    borderWidth: '2px',
    borderRadius: '8px'
  },
  '& .MuiSelect-icon': {
    color: theme.colorSchemes.light.palette.text.primary
  },
  '& .MuiChip-root': {
    borderRadius: '4px',
    margin: '2px'
  },
  '& .MuiButton-root': {
    borderRadius: '8px'
  },
  '& .MuiPaper-root': {
    borderRadius: '8px'
  }
}

const CaloInfo = () => {
  const navigate = useNavigate()
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    mode: 'onChange', // Validate khi có thay đổi
    defaultValues: {
      gender: '',
      age: '',
      weight: '',
      height: '',
      exerciseLevel: '',
      goal: '',
      allergies: []
    }
  })

  const onSubmit = async (data) => {
    try {
      const customerId = 2 // Lấy từ user state hoặc localStorage
      const healthyInfoData = {
        customerId: customerId,
        age: parseInt(data.age),
        weight: parseFloat(data.weight),
        height: parseFloat(data.height),
        activityLevel: data.exerciseLevel,
        goal: data.goal,
        allergies: data.allergies
      }

      await createCustomerHealthyInfoAPI(healthyInfoData)
      toast.success('Infomation healthy has been saved successfully!')
      const path = createSearchParams(data)
      navigate(`/calo-calculator/suggest?${path.toString()}`)
    } catch {
      toast.error('An error occurred while saving information. Please try again!')
    }
  }

  const handleClear = () => {
    reset()
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, backgroundColor: theme.palette.primary.card, borderRadius: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom color="text.primary" sx={{ mb: 4, fontWeight: 'bold' }}>
          Thông tin cá nhân
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} method='post' >
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="gender-label">Giới tính</InputLabel>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: 'Vui lòng chọn giới tính' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      sx={styleSelect}
                      labelId="gender-label"
                      label="Giới tính"
                      error={!!errors.gender}
                    >
                      <MenuItem value="male">Nam</MenuItem>
                      <MenuItem value="female">Nữ</MenuItem>
                    </Select>
                  )}
                />
                {errors.gender && (
                  <Typography color="error" variant="caption">
                    {errors.gender.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <Controller
                name="age"
                control={control}
                rules={{
                  required: 'Vui lòng nhập tuổi',
                  min: { value: 18, message: 'Tuổi phải lớn hơn 18' },
                  max: { value: 60, message: 'Tuổi không hợp lệ' },
                  pattern: {
                    value: /^[0-9]+$/,
                    message: 'Tuổi phải là số nguyên dương'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={styleInput}
                    fullWidth
                    margin="normal"
                    label="Tuổi"
                    type="number"
                    error={!!errors.age}
                    helperText={errors.age?.message}
                    inputProps={{ min: 1, max: 120 }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <Controller
                name="weight"
                control={control}
                rules={{
                  required: 'Vui lòng nhập cân nặng',
                  min: { value: 20, message: 'Cân nặng phải từ 20kg trở lên' },
                  max: { value: 300, message: 'Cân nặng không được vượt quá 300kg' },
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: 'Cân nặng phải là số hợp lệ (tối đa 2 chữ số thập phân)'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={styleInput}
                    fullWidth
                    margin="normal"
                    label="Cân nặng (kg)"
                    type="number"
                    error={!!errors.weight}
                    helperText={errors.weight?.message}
                    inputProps={{ min: 20, max: 300, step: 0.1 }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <Controller
                name="height"
                control={control}
                rules={{
                  required: 'Vui lòng nhập chiều cao',
                  min: { value: 100, message: 'Chiều cao phải từ 100cm trở lên' },
                  max: { value: 250, message: 'Chiều cao không được vượt quá 250cm' },
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: 'Chiều cao phải là số hợp lệ (tối đa 2 chữ số thập phân)'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={styleInput}
                    fullWidth
                    margin="normal"
                    label="Chiều cao (cm)"
                    type="number"
                    error={!!errors.height}
                    helperText={errors.height?.message}
                    inputProps={{ min: 100, max: 250, step: 0.1 }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="exercise-level-label">Mức độ vận động</InputLabel>
                <Controller
                  name="exerciseLevel"
                  control={control}
                  rules={{ required: 'Vui lòng chọn mức độ vận động' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      sx={styleSelect}
                      labelId="exercise-level-label"
                      label="Mức độ vận động"
                      error={!!errors.exerciseLevel}
                    >
                      {exerciseLevels.map((level, index) => (
                        <MenuItem key={index} value={level.value}>
                          {level.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.exerciseLevel && (
                  <Typography color="error" variant="caption">
                    {errors.exerciseLevel.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="goal-label">Mục tiêu</InputLabel>
                <Controller
                  name="goal"
                  control={control}
                  rules={{ required: 'Vui lòng chọn mục tiêu' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      sx={styleSelect}
                      labelId="goal-label"
                      label="Mục tiêu"
                      error={!!errors.goal}
                    >
                      {goals.map((goal, index) => (
                        <MenuItem key={index} value={goal.value}>
                          {goal.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.goal && (
                  <Typography color="error" variant="caption">
                    {errors.goal.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="allergies-label">Dị ứng thực phẩm (nếu có)</InputLabel>
                <Controller
                  name="allergies"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      multiple
                      sx={styleSelect}
                      labelId="allergies-label"
                      label="Dị ứng thực phẩm (nếu có)"
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => {
                            const allergy = allergies.find(a => a.value === value)
                            return (
                              <Chip key={value} label={allergy?.label || value} />
                            )
                          })}
                        </Box>
                      )}
                    >
                      {allergies.map((allergy) => (
                        <MenuItem key={allergy.value} value={allergy.value}>
                          <Checkbox checked={field.value?.includes(allergy.value)} />
                          {allergy.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleClear}
                sx={{
                  color: theme.colorSchemes.light.palette.text.primary,
                  borderColor: theme.colorSchemes.light.palette.text.primary,
                  '&:hover': {
                    borderColor: theme.colorSchemes.light.palette.text.primary,
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                Xóa hết
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: theme.colorSchemes.light.palette.primary.main,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: theme.colorSchemes.light.palette.primary.dark
                  }
                }}
              >
                Xác nhận
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  )
}

export default CaloInfo