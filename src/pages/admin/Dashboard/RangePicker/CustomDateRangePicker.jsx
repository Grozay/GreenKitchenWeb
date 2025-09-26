import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment from 'moment'

const CustomDateRangePicker = ({ onDateRangeChange, currentDateRange, onQuickSelect }) => {
  const [startDate, setStartDate] = useState(moment())
  const [endDate, setEndDate] = useState(moment())
  const [error, setError] = useState('')
  const [selectedOption, setSelectedOption] = useState(null) // Track selected quick option

  useEffect(() => {
    if (currentDateRange && currentDateRange[0] && currentDateRange[1]) {
      setStartDate(currentDateRange[0])
      setEndDate(currentDateRange[1])
      // Check if current range matches a quick option
      const start = currentDateRange[0]
      const end = currentDateRange[1]
      if (start.isSame(moment().startOf('week'), 'day') && end.isSame(moment().endOf('week'), 'day')) {
        setSelectedOption('thisWeek')
      } else if (start.isSame(moment().subtract(1, 'week').startOf('week'), 'day') && end.isSame(moment().subtract(1, 'week').endOf('week'), 'day')) {
        setSelectedOption('lastWeek')
      } else if (start.isSame(moment().subtract(1, 'month').startOf('month'), 'day') && end.isSame(moment().subtract(1, 'month').endOf('month'), 'day')) {
        setSelectedOption('lastMonth')
      } else {
        setSelectedOption(null)
      }
    }
  }, [currentDateRange])

  const handleApply = () => {
    setError('')
    setSelectedOption(null) // Reset selected option when manually applying
    onDateRangeChange([startDate, endDate])
  }

  const setThisWeek = () => {
    const start = moment().startOf('week')
    const end = moment().endOf('week')
    setStartDate(start)
    setEndDate(end)
    setSelectedOption('thisWeek')
    onDateRangeChange([start, end]) // Auto apply
  }

  const setLastWeek = () => {
    const start = moment().subtract(1, 'week').startOf('week')
    const end = moment().subtract(1, 'week').endOf('week')
    setStartDate(start)
    setEndDate(end)
    setSelectedOption('lastWeek')
    onDateRangeChange([start, end]) // Auto apply
  }

  const setLastMonth = () => {
    const start = moment().subtract(1, 'month').startOf('month')
    const end = moment().subtract(1, 'month').endOf('month')
    setStartDate(start)
    setEndDate(end)
    setSelectedOption('lastMonth')
    onDateRangeChange([start, end]) // Auto apply
  }

  const isInvalid = startDate.isAfter(endDate)

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} >
      <Box display="flex" flexDirection="row" justifyContent="space-between" gap={2}>
        <Box display="flex" alignItems="center" gap={2}>
          <DatePicker
            label="Start Date"
            value={startDate}
            format="DD/MM/YYYY"
            onChange={(date) => {
              setStartDate(date)
              setSelectedOption(null) // Reset on manual change
            }}
            renderInput={(params) => <TextField {...params} size="small" />}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            format="DD/MM/YYYY"
            onChange={(date) => {
              setEndDate(date)
              setSelectedOption(null) // Reset on manual change
            }}
            renderInput={(params) => <TextField {...params} size="small" />}
          />
          <Button variant="contained" onClick={handleApply} disabled={isInvalid} sx={{ p: 2, borderRadius: 5 }}>Apply</Button>
        </Box>
        {onQuickSelect && (
          <Box display="flex" gap={1}>
            <Button
              variant={selectedOption === 'thisWeek' ? 'contained' : 'outlined'}
              size="small"
              onClick={setThisWeek}
              disabled={selectedOption === 'thisWeek'}
              sx={{ borderRadius: 5 }}
            >
              This Week
            </Button>
            <Button
              variant={selectedOption === 'lastWeek' ? 'contained' : 'outlined'}
              size="small"
              onClick={setLastWeek}
              disabled={selectedOption === 'lastWeek'}
              sx={{ borderRadius: 5 }}
            >
              Last Week
            </Button>
            <Button
              variant={selectedOption === 'lastMonth' ? 'contained' : 'outlined'}
              size="small"
              onClick={setLastMonth}
              disabled={selectedOption === 'lastMonth'}
              sx={{ borderRadius: 5 }}
            >
              Last Month
            </Button>
          </Box>
        )}
        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    </LocalizationProvider>
  )
}

export default CustomDateRangePicker