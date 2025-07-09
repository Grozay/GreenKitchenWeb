import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import theme from '~/theme'

const exerciseLevels = [
  'Không tập luyện',
  'Tập nhẹ (1-3 buổi/tuần)',
  'Tập vừa (3-5 buổi/tuần)',
  'Tập nặng (6-7 buổi/tuần)',
  'Tập rất nặng (2 lần/ngày)'
]

const goals = [
  'Giảm cân',
  'Duy trì cân nặng',
  'Tăng cân'
]

const allergies = [
  'Đậu phộng',
  'Hải sản',
  'Trứng',
  'Sữa',
  'Lúa mì',
  'Đậu nành',
  'Cá',
  'Động vật có vỏ'
]

const styleInput = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.colorSchemes.light.palette.text.primary,
      borderRadius: '8px',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.colorSchemes.light.palette.text.primary,
      borderRadius: '8px',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.colorSchemes.light.palette.text.primary,
      borderWidth: '2px',
      borderRadius: '8px',
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
      color: `${theme.colorSchemes.light.palette.text.primary} !important`,
    },
  }
}

const styleSelect = {
  '& .MuiSelect-select': {
    color: theme.colorSchemes.light.palette.text.primary,
    borderRadius: '8px',
    '&:focus': {
      backgroundColor: 'transparent',
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.colorSchemes.light.palette.text.primary,
    '&.Mui-focused': {
      color: `${theme.colorSchemes.light.palette.text.primary} !important`,
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.colorSchemes.light.palette.text.primary,
    borderRadius: '8px',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.colorSchemes.light.palette.text.primary,
    borderRadius: '8px',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.colorSchemes.light.palette.text.primary,
    borderWidth: '2px',
    borderRadius: '8px',
  },
  '& .MuiSelect-icon': {
    color: theme.colorSchemes.light.palette.text.primary,
  },
  '& .MuiChip-root': {
    borderRadius: '4px',
    margin: '2px',
  },
  '& .MuiButton-root': {
    borderRadius: '8px',
  },
  '& .MuiPaper-root': {
    borderRadius: '8px',
  }
}

const CaloInfo = () => {
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    weight: '',
    height: '',
    exerciseLevel: '',
    goal: '',
    allergies: []
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAllergiesChange = (event) => {
    const {
      target: { value }
    } = event
    setFormData(prev => ({
      ...prev,
      allergies: typeof value === 'string' ? value.split(',') : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Xử lý dữ liệu form ở đây
  }

  const handleClear = () => {
    setFormData({
      gender: '',
      age: '',
      weight: '',
      height: '',
      exerciseLevel: '',
      goal: '',
      allergies: []
    })
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, backgroundColor: theme.palette.primary.card, borderRadius: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom color="text.primary" sx={{ mb: 4, fontWeight: 'bold' }}>
          Thông tin cá nhân
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="gender-label">Giới tính</InputLabel>
                <Select
                  sx={styleSelect}
                  labelId="gender-label"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  label="Giới tính"
                  required
                >
                  <MenuItem value="male">Nam</MenuItem>
                  <MenuItem value="female">Nữ</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <TextField
                sx={styleInput}
                fullWidth
                margin="normal"
                name="age"
                label="Tuổi"
                type="number"
                inputProps={{ min: 18, max: 80 }}
                value={formData.age}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <TextField
                sx={styleInput}
                fullWidth
                margin="normal"
                name="weight"
                label="Cân nặng (kg)"
                type="number"
                inputProps={{ min: 30, step: 0.1 }}
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <TextField
                sx={styleInput}
                fullWidth
                margin="normal"
                name="height"
                label="Chiều cao (cm)"
                type="number"
                inputProps={{ min: 100, max: 250 }}
                value={formData.height}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="exercise-level-label">Mức độ tập luyện</InputLabel>
                <Select
                  sx={styleSelect}
                  labelId="exercise-level-label"
                  name="exerciseLevel"
                  value={formData.exerciseLevel}
                  onChange={handleChange}
                  label="Mức độ tập luyện"
                  required
                >
                  {exerciseLevels.map((level, index) => (
                    <MenuItem key={index} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="goal-label">Mục tiêu</InputLabel>
                <Select
                  sx={styleSelect}
                  labelId="goal-label"
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  label="Mục tiêu"
                  required
                >
                  {goals.map((goal, index) => (
                    <MenuItem key={index} value={goal}>
                      {goal}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="allergies-label">Dị ứng với</InputLabel>
                <Select
                  sx={styleSelect}
                  labelId="allergies-label"
                  name="allergies"
                  multiple
                  value={formData.allergies}
                  onChange={handleAllergiesChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {allergies.map((allergy) => (
                    <MenuItem key={allergy} value={allergy}>
                      <Checkbox checked={formData.allergies.indexOf(allergy) > -1} />
                      {allergy}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleClear}
                sx={{
                  color: theme.palette.text.primary,
                  borderColor: theme.palette.primary.secondary,
                  '&:hover': {
                    borderColor: theme.palette.primary.secondary,
                    backgroundColor: `${theme.palette.primary.secondary}20`
                  }
                }}
              >
                Xóa dữ liệu
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: theme.palette.primary.secondary,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.secondary,
                    opacity: 0.9
                  }
                }}
              >
                Tính toán
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  )
}

export default CaloInfo