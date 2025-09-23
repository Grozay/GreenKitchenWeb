import { useState, useEffect } from 'react' // Loại bỏ useLocation khỏi đây
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom' // Thêm useLocation vào đây
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
import { getMenuMealAPI, createWeekMealAPI, getByIdWeekMealAPI } from '~/apis'
import { toast } from 'react-toastify'

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

const WeekMealCreate = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const cloneId = searchParams.get('clone') // Lấy ID từ query

  // Parse query params
  const typeParam = searchParams.get('type')
  const typeMap = { low: 'LOW', balance: 'BALANCE', high: 'HIGH', vegetarian: 'VEGETARIAN' }
  const initialType = typeMap[typeParam?.toLowerCase()] || 'LOW' // Map lowercase to uppercase
  const dateParam = searchParams.get('date')
  let initialDate
  if (dateParam) {
    const parsedDate = moment(dateParam)
    initialDate = parsedDate.isValid() ? parsedDate : moment().startOf('week').add(1, 'days') // Nếu không hợp lệ, set mặc định tuần này
  } else {
    initialDate = moment().startOf('week').add(1, 'days') // Mặc định tuần này nếu không có date
  }

  const [menuMeals, setMenuMeals] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState(initialType) // Set initial từ query
  const [weekStart, setWeekStart] = useState(initialDate) // Set initial từ query
  const [selectedMeals, setSelectedMeals] = useState({
    T2: { meal1: '', meal2: '', meal3: '' },
    T3: { meal1: '', meal2: '', meal3: '' },
    T4: { meal1: '', meal2: '', meal3: '' },
    T5: { meal1: '', meal2: '', meal3: '' },
    T6: { meal1: '', meal2: '', meal3: '' }
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [currentSelection, setCurrentSelection] = useState({ day: '', mealKey: '' })

  // Fetch menuMeals on mount
  useEffect(() => {
    const fetchMenuMeals = async () => {
      try {
        const data = await getMenuMealAPI()
        setMenuMeals(data)
      } catch (error) {
        toast.error('Failed to load menu meals')
      }
    }
    fetchMenuMeals()
  }, [])

  // Fetch clone data if cloneId exists
  useEffect(() => {
    if (cloneId) {
      const fetchCloneData = async () => {
        try {
          const data = await getByIdWeekMealAPI(cloneId)
          // Set dữ liệu vào state
          setSelectedType(data.type || 'LOW')
          setWeekStart(moment(data.weekStart, 'YYYY-MM-DD'))
          // Set selectedMeals từ data.days
          const newSelectedMeals = {}
          data.days.forEach(day => {
            newSelectedMeals[day.day] = {
              meal1: day.meal1?.id?.toString() || '',
              meal2: day.meal2?.id?.toString() || '',
              meal3: day.meal3?.id?.toString() || ''
            }
          })
          setSelectedMeals(newSelectedMeals)
          toast.info('Data cloned successfully! You can edit before creating.')
        } catch (error) {
          toast.error('Failed to clone data')
        }
      }
      fetchCloneData()
    }
  }, [cloneId])

  // Handle date change (always set to Monday)
  const handleDateChange = (newDate) => {
    const monday = moment(newDate).startOf('week').add(1, 'days')
    setWeekStart(monday)
  }

  // Handle meal selection (open modal)
  const handleMealChange = (day, mealKey, value) => {
    if (value) {
      const meal = menuMeals.find(m => m.id === parseInt(value))
      setSelectedMeal(meal)
      setCurrentSelection({ day, mealKey })
      setModalOpen(true)
    } else {
      setSelectedMeals(prev => ({
        ...prev,
        [day]: { ...prev[day], [mealKey]: value }
      }))
    }
  }

  // Confirm selection in modal
  const handleConfirmSelection = () => {
    const { day, mealKey } = currentSelection
    setSelectedMeals(prev => ({
      ...prev,
      [day]: { ...prev[day], [mealKey]: selectedMeal.id.toString() }
    }))
    setModalOpen(false)
    setSelectedMeal(null)
  }

  // Cancel modal
  const handleCancelSelection = () => {
    setModalOpen(false)
    setSelectedMeal(null)
  }

  // Submit form
  const handleSubmit = async () => {
    setLoading(true)
    try {
      const weekEnd = moment(weekStart).add(4, 'days').format('YYYY-MM-DD') // Friday
      const days = daysOfWeek.map((d, index) => ({
        day: d.day,
        date: moment(weekStart).add(index, 'days').format('YYYY-MM-DD'),
        meal1: parseInt(selectedMeals[d.day].meal1) || null,
        meal2: parseInt(selectedMeals[d.day].meal2) || null,
        meal3: parseInt(selectedMeals[d.day].meal3) || null
      }))

      const data = {
        weekStart: weekStart.format('YYYY-MM-DD'),
        weekEnd,
        type: selectedType,
        days
      }

      await createWeekMealAPI(data)
      toast.success('WeekMeal created successfully')
      navigate('/management/week-meals/list') // Navigate back to list
    } catch (error) {
      toast.error('Failed to create WeekMeal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          {cloneId ? 'Clone WeekMeal' : 'Create WeekMeal'} {/* Thay đổi title nếu clone */}
        </Typography>

        {/* Form Controls */}
        <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
          <FormControl sx={{ mb: 2, maxWidth: 400, width: '100%' }}>
            <InputLabel>Meal Type</InputLabel>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              label="Meal Type"
              sx={{
                '& .MuiSelect-select': {
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap'
                }
              }}
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
            onChange={handleDateChange}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{
                  maxWidth: 400,
                  width: '100%',
                  '& .MuiInputBase-input': {
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                  }
                }}
              />
            )}
          />
        </Box>

        {/* Meal Selection Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Day</TableCell>
                <TableCell>Breakfast</TableCell>
                <TableCell>Lunch</TableCell>
                <TableCell>Dinner</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {daysOfWeek.map(({ day, label }) => (
                <TableRow key={day}>
                  <TableCell>{label} ({day})</TableCell>
                  {['meal1', 'meal2', 'meal3'].map(mealKey => (
                    <TableCell key={mealKey} sx={{ width: 300, maxWidth: 300 }}>
                      <Select
                        value={selectedMeals[day][mealKey]}
                        onChange={(e) => handleMealChange(day, mealKey, e.target.value)}
                        displayEmpty
                        sx={{
                          maxWidth: 300,
                          minWidth: 120,
                          width: '100%',
                          '& .MuiSelect-select': {
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap'
                          }
                        }}
                      >
                        <MenuItem value="">
                          <em>Select Meal</em>
                        </MenuItem>
                        {menuMeals
                          .filter(meal => meal.type === selectedType) // Filter meals by selectedType
                          .map(meal => (
                            <MenuItem key={meal.id} value={meal.id}>
                              {meal.title} ({meal.type})
                            </MenuItem>
                          ))}
                      </Select>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Submit Button */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create WeekMeal'}
          </Button>
        </Box>

        {/* Modal for Meal Details */}
        <Dialog open={modalOpen} onClose={handleCancelSelection} maxWidth="md" fullWidth >
          <DialogTitle>{selectedMeal?.title}</DialogTitle>
          <DialogContent sx={{ borderRadius: 5 }}>
            {selectedMeal && (
              <Box >
                <img
                  src={selectedMeal.image}
                  alt={selectedMeal.title}
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }}
                />
                <Typography variant="body1" gutterBottom>
                  {selectedMeal.description}
                </Typography>
                <Typography variant="body2">
                  <Box>Calories:</Box> {selectedMeal.calories} kcal
                </Typography>
                <Typography variant="body2">
                  <Box>Protein:</Box> {selectedMeal.protein} g
                </Typography>
                <Typography variant="body2">
                  <Box>Carbs:</Box> {selectedMeal.carbs} g
                </Typography>
                <Typography variant="body2">
                  <Box>Fat:</Box> {selectedMeal.fat} g
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelSelection}>Cancel</Button>
            <Button onClick={handleConfirmSelection} variant="contained">
              Select
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  )
}

export default WeekMealCreate
