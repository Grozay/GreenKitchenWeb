import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment from 'moment'
import { getMenuMealAPI, getByIdWeekMealAPI, updateWeekMealDayAPI, getWeekMealDayByIdAPI } from '~/apis'
import { toast } from 'react-toastify'
import Skeleton from '@mui/material/Skeleton' // Thêm import Skeleton

const mealTypes = [
  { key: 'LOW', title: 'LOW CALORIES MENU' },
  { key: 'BALANCE', title: 'BALANCE CALORIES MENU' },
  { key: 'HIGH', title: 'HIGH CALORIES MENU' },
  { key: 'VEGETARIAN', title: 'VEGETARIAN MENU' }
]

const daysOfWeek = [
  { day: 'T2', label: 'Monday' },
  { day: 'T3', label: 'Tuesday' },
  { day: 'T4', label: 'Wednesday' },
  { day: 'T5', label: 'Thursday' },
  { day: 'T6', label: 'Friday' }
]

const WeekMealEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()

  // Parse query params
  const searchParams = new URLSearchParams(location.search)
  const selectedDayId = searchParams.get('dayId') // Lấy dayId từ query

  // Validation cho ID và dayId
  useEffect(() => {
    if (!id || id === 'undefined' || !selectedDayId) {
      toast.error('Invalid ID or Day ID')
      navigate('/management/week-meals/list')
      return
    }
  }, [id, selectedDayId, navigate])

  const [menuMeals, setMenuMeals] = useState([])
  const [loading, setLoading] = useState(false)
  const [dayData, setDayData] = useState(null) // Thay weekData thành dayData
  const [selectedType, setSelectedType] = useState('LOW')
  const [weekStart, setWeekStart] = useState(moment().startOf('week').add(1, 'days'))
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [currentSelection, setCurrentSelection] = useState({ day: '', mealKey: '' })

  // Fetch menuMeals and day data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true) // Thêm loading state
        const [menuData, dayData] = await Promise.all([
          getMenuMealAPI(),
          getWeekMealDayByIdAPI(id, selectedDayId)
        ])
        setMenuMeals(menuData)
        setDayData(dayData)
        setSelectedType(dayData.type || 'LOW')
        setWeekStart(moment(dayData.date).startOf('week').add(1, 'days'))
      } catch (error) {
        toast.error('Failed to load data')
      } finally {
        setLoading(false) // Set loading false
      }
    }
    fetchData()
  }, [id, selectedDayId])

  // Handle meal selection (open modal)
  const handleMealChange = (day, mealKey, value) => {
    if (value) {
      const meal = menuMeals.find(m => m.id === parseInt(value))
      setSelectedMeal(meal)
      setCurrentSelection({ day, mealKey })
      setModalOpen(true)
    }
  }

  // Confirm selection in modal and update via API
  const handleConfirmSelection = async () => {
    const { mealKey } = currentSelection
    const data = {
      meal1Id: mealKey === 'meal1' ? selectedMeal.id : dayData.meal1?.id,
      meal2Id: mealKey === 'meal2' ? selectedMeal.id : dayData.meal2?.id,
      meal3Id: mealKey === 'meal3' ? selectedMeal.id : dayData.meal3?.id
    }

    try {
      await updateWeekMealDayAPI(id, selectedDayId, data)
      toast.success('Day updated successfully')
      // Reload data
      const updatedData = await getWeekMealDayByIdAPI(id, selectedDayId)
      setDayData(updatedData)
      setModalOpen(false)
      setSelectedMeal(null)
    } catch (error) {
      toast.error('Failed to update day')
    }
  }

  // Cancel modal
  const handleCancelSelection = () => {
    setModalOpen(false)
    setSelectedMeal(null)
  }

  if (loading || !dayData) {
    return (
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto', overflowX: 'hidden' }}>
          {/* Skeleton cho Title */}
          <Skeleton variant="text" width={300} height={40} sx={{ mb: 4 }} />

          {/* Skeleton cho Form Controls */}
          <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Skeleton variant="rectangular" width={250} height={56} sx={{ flex: 1, minWidth: 250 }} />
            <Skeleton variant="rectangular" width={250} height={56} sx={{ flex: 1, minWidth: 250 }} />
          </Box>

          {/* Skeleton cho Table */}
          <Skeleton variant="rectangular" width="100%" height={200} />
        </Box>
      </LocalizationProvider>
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto', overflowX: 'hidden' }}>
        <Typography variant="h4" gutterBottom>
          Edit WeekMeal Day - {dayData.day}
        </Typography>

        {/* Form Controls */}
        <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 250, flex: 1 }}>
            <InputLabel>Meal Type</InputLabel>
            <Select
              value={selectedType}
              disabled
              onChange={(e) => setSelectedType(e.target.value)}
              label="Meal Type"
            >
              {mealTypes.map(({ key, title }) => (
                <MenuItem key={key} value={key}>
                  {title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <DatePicker
            label="Week Start (Monday)"
            value={weekStart}
            disabled
            onChange={(newDate) => setWeekStart(moment(newDate).startOf('week').add(1, 'days'))}
            format="DD/MM/YYYY"
            renderInput={(params) => <TextField {...params} sx={{ minWidth: 250, flex: 1 }} />}
          />
        </Box>

        {/* Meal Selection Table - Chỉ hiển thị 1 day */}
        <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Table sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 120, fontWeight: 700 }}>Day</TableCell>
                <TableCell sx={{ minWidth: 200, fontWeight: 700 }}>Breakfast</TableCell>
                <TableCell sx={{ minWidth: 200, fontWeight: 700 }}>Lunch</TableCell>
                <TableCell sx={{ minWidth: 200, fontWeight: 700 }}>Dinner</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key={dayData.id}>
                <TableCell>{dayData.day} ({dayData.date})</TableCell>
                {['meal1', 'meal2', 'meal3'].map(mealKey => {
                  const currentMeal = dayData[mealKey]
                  const currentValue = currentMeal ? currentMeal.id : ''
                  return (
                    <TableCell key={mealKey}>
                      <Select
                        value={currentValue} // Gán mặc định id của meal hiện tại
                        onChange={(e) => handleMealChange(dayData.day, mealKey, e.target.value)}
                        sx={{ minWidth: 180, maxWidth: 200 }}
                        displayEmpty
                        disabled={loading}
                      >
                        <MenuItem value="">
                          <em>{currentMeal ? currentMeal.title : 'Select Meal'}</em>
                        </MenuItem>
                        {menuMeals
                          .filter(meal => meal.type === selectedType) // Filter theo selectedType
                          .map(meal => (
                            <MenuItem key={meal.id} value={meal.id}>
                              {meal.title} ({meal.type})
                            </MenuItem>
                          ))}
                      </Select>
                    </TableCell>
                  )
                })}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Submit Button */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            onClick={() => navigate('/management/week-meals/list')}
          >
            Back to List
          </Button>
        </Box>

        {/* Modal for Meal Details */}
        <Dialog open={modalOpen} onClose={handleCancelSelection} maxWidth="md" fullWidth>
          <DialogTitle>{selectedMeal?.title}</DialogTitle>
          <DialogContent>
            {selectedMeal && (
              <Box>
                <img
                  src={selectedMeal.image}
                  alt={selectedMeal.title}
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }}
                />
                <Typography variant="body1" gutterBottom>
                  {selectedMeal.description}
                </Typography>
                <Typography variant="body2">
                  <strong>Calories:</strong> {selectedMeal.calories || 'N/A'} kcal
                </Typography>
                <Typography variant="body2">
                  <strong>Protein:</strong> {selectedMeal.protein || 'N/A'} g
                </Typography>
                <Typography variant="body2">
                  <strong>Carbs:</strong> {selectedMeal.carbs || 'N/A'} g
                </Typography>
                <Typography variant="body2">
                  <strong>Fat:</strong> {selectedMeal.fat || 'N/A'} g
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelSelection}>Cancel</Button>
            <Button onClick={handleConfirmSelection} variant="contained">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  )
}

export default WeekMealEdit
