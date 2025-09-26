import { useState, useEffect } from 'react'
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
import Skeleton from '@mui/material/Skeleton'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment from 'moment'
import { getWeekMealPlanAPI } from '~/apis'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ContentCopyIcon from '@mui/icons-material/ContentCopy' // Thêm icon clone


const mealTypes = [
  { key: 'low', title: 'LOW CALORIES MENU', type: 'LOW' },
  { key: 'balance', title: 'BALANCE CALORIES MENU', type: 'BALANCE' },
  { key: 'high', title: 'HIGH CALORIES MENU', type: 'HIGH' },
  { key: 'vegetarian', title: 'VEGETARIAN MENU', type: 'VEGETARIAN' }
]

const WeekMealList = () => {
  const navigate = useNavigate() // Thêm hook navigate
  const [selectedType, setSelectedType] = useState('low') // Default meal type
  const [selectedDate, setSelectedDate] = useState(moment().startOf('week').add(1, 'days')) // Always set to Monday
  const [weekData, setWeekData] = useState(null)
  const [loading, setLoading] = useState(false)

  // Function to fetch data from API
  const fetchWeekData = (type, date) => {
    setLoading(true)
    getWeekMealPlanAPI(type, date.format('YYYY-MM-DD'))
      .then(res => setWeekData(res))
      .catch(() => setWeekData(null))
      .finally(() => setLoading(false))
  }

  // Call API when type or date changes
  useEffect(() => {
    fetchWeekData(selectedType, selectedDate)
  }, [selectedType, selectedDate])

  // Function to change week
  const handleChangeWeek = (direction) => {
    const newDate = moment(selectedDate).add(direction * 7, 'days').startOf('week').add(1, 'days') // Always set to Monday
    setSelectedDate(newDate)
  }

  // Function to handle date selection (always set to Monday of the selected week)
  const handleDateChange = (newDate) => {
    const monday = moment(newDate).startOf('week').add(1, 'days') // Monday
    setSelectedDate(monday)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          Manage WeekMeal
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/management/week-meals/create')}
            sx={{ fontWeight: 'bold' }}
          >
            Create New Week Meal
          </Button>
          {weekData && (
            <Button
              variant="outlined"
              color="info"
              startIcon={<ContentCopyIcon />}
              onClick={() => navigate(`/management/week-meals/create?clone=${weekData.id}`)}
              sx={{ fontWeight: 'bold' }}
            >
              Clone This Week Meal
            </Button>
          )}
        </Box>

        {/* Select meal type */}
        <FormControl fullWidth sx={{ mb: 2}}>
          <InputLabel>Meal Type</InputLabel>
          <Select
            value={selectedType}
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

        {/* Select date (DatePicker, always set to Monday) */}
        <Box sx={{ mb: 2 }}>
          <DatePicker
            label="Select Date "
            value={selectedDate}
            onChange={handleDateChange}
            format="DD/MM/YYYY"
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Box>

        {/* Previous and Next week buttons */}
        <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => handleChangeWeek(-1)}>
            Previous Week
          </Button>
          <Button variant="outlined" onClick={() => handleChangeWeek(1)}>
            Next Week
          </Button>
        </Box>

        {/* Display data */}
        {loading ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Skeleton variant="text" width={100} /></TableCell>
                  <TableCell><Skeleton variant="text" width={150} /></TableCell>
                  <TableCell><Skeleton variant="text" width={150} /></TableCell>
                  <TableCell><Skeleton variant="text" width={150} /></TableCell>
                  <TableCell><Skeleton variant="text" width={100} /></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                    <TableCell><Skeleton variant="text" width={150} /></TableCell>
                    <TableCell><Skeleton variant="text" width={150} /></TableCell>
                    <TableCell><Skeleton variant="text" width={150} /></TableCell>
                    <TableCell><Skeleton variant="rectangular" width={80} height={36} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : weekData ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Day</TableCell>
                  <TableCell>Breakfast</TableCell>
                  <TableCell>Lunch</TableCell>
                  <TableCell>Dinner</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {weekData.days.map((day, index) => (
                  <TableRow key={index}>
                    <TableCell>{day.day} ({day.date})</TableCell>
                    <TableCell>{day.meal1?.title || 'N/A'}</TableCell>
                    <TableCell>{day.meal2?.title || 'N/A'}</TableCell>
                    <TableCell>{day.meal3?.title || 'N/A'}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => {
                          if (weekData && weekData.id && day.id) {
                            navigate(`/management/week-meals/edit/${weekData.id}?dayId=${day.id}`)
                          } else {
                            toast.error('WeekMeal ID or Day ID is not available')
                          }
                        }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              No data for this week. Please add some data.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/management/week-meals/create?type=' + selectedType + '&date=' + selectedDate.format('YYYY-MM-DD'))}>
              Create WeekMeal
            </Button>
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  )
}

export default WeekMealList
