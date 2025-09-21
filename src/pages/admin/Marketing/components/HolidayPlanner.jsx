import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import { getUpcomingHolidaysAPI, broadcastEmailScheduleAPI, adminCreateHolidayAPI, adminDeleteHolidayAPI, adminListHolidaysAPI, getVietnamPublicHolidaysAPI, getBlackFridayDateAPI, getThanksgivingDateAPI, getSpecialEventsAPI, getHolidayEmailTemplateAPI, getHolidayEmailTemplateWithTypeAPI, scheduleHolidayEmailAPI, sendImmediateHolidayEmailAPI, getAvailableTemplateTypesAPI, getScheduledHolidayEmailsAPI, deleteScheduledHolidayEmailAPI, updateScheduledHolidayEmailAPI } from '~/apis'
import { TextField } from '@mui/material'

const DayChip = ({ days }) => {
  const color = days <= 3 ? 'error' : days <= 10 ? 'warning' : 'default'
  return <Chip label={`${days} days`} color={color} size="small" />
}

const CountdownTimer = ({ holiday, currentTime, calculateCountdown, formatCountdown, getCountdownColor, getCountdownProgress }) => {
  const countdown = calculateCountdown(holiday.date)
  const totalDays = holiday.daysUntil || 365
  const progress = getCountdownProgress(countdown, totalDays)
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 120 }}>
      <Chip
        label={formatCountdown(countdown)}
        color={getCountdownColor(countdown)}
        size="small"
        sx={{ 
          fontWeight: 'bold',
          mb: 1,
          animation: countdown.days <= 1 && !countdown.isOverdue ? 'pulse 1s infinite' : 'none'
        }}
      />
      <Box sx={{ width: '100%', height: 4, bgcolor: 'grey.200', borderRadius: 2, overflow: 'hidden' }}>
        <Box
          sx={{
            width: `${progress}%`,
            height: '100%',
            bgcolor: getCountdownColor(countdown) === 'error' ? 'error.main' : 
                     getCountdownColor(countdown) === 'warning' ? 'warning.main' :
                     getCountdownColor(countdown) === 'info' ? 'info.main' : 'success.main',
            transition: 'width 0.3s ease-in-out'
          }}
        />
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, textAlign: 'center' }}>
        {countdown.isOverdue ? 'Đã qua' : `${Math.max(0, totalDays - countdown.days)}/${totalDays} days`}
      </Typography>
    </Box>
  )
}

const HolidayPlanner = ({ onShowSnackbar }) => {
  const [holidays, setHolidays] = useState([])
  const [adminHolidays, setAdminHolidays] = useState([])
  const [loading, setLoading] = useState(true)
  const [schedulingId, setSchedulingId] = useState(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ name: '', country: 'VN', date: '', lunar: false, recurrenceType: 'NONE', description: '' })

  // Public API holidays
  const [publicHolidays, setPublicHolidays] = useState([])
  const [selectedHolidays, setSelectedHolidays] = useState(new Set())
  const [savingSelected, setSavingSelected] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [upcomingYear, setUpcomingYear] = useState(new Date().getFullYear())
  const [currentTime, setCurrentTime] = useState(new Date())

  // Schedule dialog state
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [selectedHolidayForSchedule, setSelectedHolidayForSchedule] = useState(null)
  const [emailTemplate, setEmailTemplate] = useState(null)
  const [templateTypes, setTemplateTypes] = useState([])
  const [selectedTemplateType, setSelectedTemplateType] = useState('')
  const [scheduleForm, setScheduleForm] = useState({
    scheduleAt: '',
    daysBefore: 1,
    sendTime: '09:00',
    targetAudience: 'all',
    customSubject: '',
    customContent: '',
    isActive: true
  })
  const [scheduling, setScheduling] = useState(false)
  const [loadingTemplate, setLoadingTemplate] = useState(false)
  const [scheduledHolidays, setScheduledHolidays] = useState([])
  const [loadingScheduled, setLoadingScheduled] = useState(false)
  
  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [holidayToDelete, setHolidayToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load backend holidays
        const backendHolidays = await getUpcomingHolidaysAPI(null, 180)
        setHolidays(backendHolidays)
        const adminList = await adminListHolidaysAPI()
        setAdminHolidays(adminList)

        // Load public API holidays
        await loadPublicHolidays()
        
        // Load scheduled holidays
        await loadScheduledHolidays()
      } catch (e) {
        onShowSnackbar?.('Failed to load holidays', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const loadPublicHolidays = async (year = selectedYear, currentScheduledHolidays = null) => {
    try {
      setLoading(true)

      // Load Vietnam public holidays for selected year
      const [vnHolidays, bfDate, tgDate, spEvents] = await Promise.all([
        getVietnamPublicHolidaysAPI(year),
        getBlackFridayDateAPI(year),
        getThanksgivingDateAPI(year),
        getSpecialEventsAPI(year)
      ])

      // Get Vietnamese Tet dates
      const tetHolidays = getVietnameseTetDates(year)

      // Combine all public holidays
      const allPublicHolidays = [
        ...vnHolidays.map(h => ({
          id: h.date,
          name: h.name,
          date: h.date,
          country: 'VN',
          lunar: h.name.toLowerCase().includes('tết') || h.name.toLowerCase().includes('trung thu'),
          source: 'public-api',
          year: year
        })),
        ...(bfDate ? [bfDate] : []),
        ...(tgDate ? [tgDate] : []),
        ...spEvents,
        ...tetHolidays // Add Vietnamese Tet
      ].filter(h => h.date) // Remove null entries

      // Use current scheduled holidays if provided, otherwise use state
      const scheduledHolidaysToCheck = currentScheduledHolidays || scheduledHolidays

      // Filter out already scheduled holidays
      const filteredHolidays = allPublicHolidays.filter(holiday => {
        return !scheduledHolidaysToCheck.some(scheduled => 
          scheduled.holidayName === holiday.name && 
          new Date(scheduled.holidayDate).toDateString() === new Date(holiday.date).toDateString()
        )
      })

      // Sort by date - past holidays at the end
      filteredHolidays.sort((a, b) => {
        const aDate = new Date(a.date)
        const bDate = new Date(b.date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const aIsPast = aDate < today
        const bIsPast = bDate < today
        
        // If one is past and one is not, past goes to end
        if (aIsPast && !bIsPast) return 1
        if (!aIsPast && bIsPast) return -1
        
        // If both are past or both are future, sort by date
        return aDate - bDate
      })

      setPublicHolidays(filteredHolidays)
      const scheduledCount = allPublicHolidays.length - filteredHolidays.length
      onShowSnackbar?.(
        `Loaded ${filteredHolidays.length} holidays for ${year}${scheduledCount > 0 ? ` (${scheduledCount} already scheduled)` : ''}`, 
        'success'
      )
    } catch (error) {
      console.warn('Failed to load public holidays:', error)
      onShowSnackbar?.('Failed to load public holidays', 'warning')
    } finally {
      setLoading(false)
    }
  }

  // Load scheduled holiday emails
  const loadScheduledHolidays = async () => {
    try {
      setLoadingScheduled(true)
      const data = await getScheduledHolidayEmailsAPI()
      setScheduledHolidays(data)
      return data // Return the data for immediate use
    } catch (error) {
      console.error('Failed to load scheduled holidays:', error)
      onShowSnackbar?.('Failed to load scheduled holidays', 'error')
      return [] // Return empty array on error
    } finally {
      setLoadingScheduled(false)
    }
  }

  // Check if a holiday is already scheduled
  const isHolidayScheduled = (holiday) => {
    return scheduledHolidays.some(scheduled => 
      scheduled.holidayName === holiday.name && 
      new Date(scheduled.holidayDate).toDateString() === new Date(holiday.date).toDateString()
    )
  }

  // Get Vietnamese Tet (Lunar New Year) dates
  const getVietnameseTetDates = (year) => {
    // Tet dates for 2024-2026 (approximate)
    const tetDates = {
      2024: '2024-02-10',
      2025: '2025-01-29', 
      2026: '2026-02-17',
      2027: '2027-02-06',
      2028: '2028-01-26'
    }
    
    const tetDate = tetDates[year]
    if (!tetDate) return []
    
    return [{
      id: `tet-${year}`,
      name: 'Tết Nguyên Đán',
      country: 'VN',
      date: tetDate,
      lunar: true,
      description: 'Tết Nguyên Đán - Năm mới âm lịch của Việt Nam',
      isTet: true
    }]
  }

  // Load template types on component mount
  useEffect(() => {
    const loadTemplateTypes = async () => {
      try {
        const response = await getAvailableTemplateTypesAPI()
        setTemplateTypes(response.templateTypes || [])
      } catch (error) {
        console.warn('Failed to load template types:', error)
      }
    }
    loadTemplateTypes()
  }, [])

  // Countdown timer - update every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const schedulePromo = async (h) => {
    try {
      setSchedulingId(h.id)
      const subject = `${h.name} Sale`
      const content = `<h2>${h.name} Specials</h2><p>Don’t miss our holiday deals!</p>`
      const scheduleAt = `${h.date}T09:00:00`
      await broadcastEmailScheduleAPI({ subject, content, scheduleAt })
      onShowSnackbar?.('Scheduled email for holiday', 'success')
    } catch (e) {
      onShowSnackbar?.('Failed to schedule email', 'error')
    } finally {
      setSchedulingId(null)
    }
  }

  const createHoliday = async (e) => {
    e.preventDefault()
    try {
      setCreating(true)
      const payload = { ...form }
      payload.lunar = !!payload.lunar
      const res = await adminCreateHolidayAPI(payload)
      setAdminHolidays(prev => [res, ...prev])
      onShowSnackbar?.('Holiday created', 'success')
      setForm({ name: '', country: 'VN', date: '', lunar: false, recurrenceType: 'NONE', description: '' })
    } catch (e) {
      onShowSnackbar?.('Failed to create holiday', 'error')
    } finally {
      setCreating(false)
    }
  }

  const deleteHoliday = async (id) => {
    try {
      await adminDeleteHolidayAPI(id)
      setAdminHolidays(prev => prev.filter(h => h.id !== id))
      onShowSnackbar?.('Holiday deleted', 'success')
    } catch (e) {
      onShowSnackbar?.('Failed to delete holiday', 'error')
    }
  }

  const handleHolidaySelection = (holidayId) => {
    setSelectedHolidays(prev => {
      const newSet = new Set(prev)
      if (newSet.has(holidayId)) {
        newSet.delete(holidayId)
      } else {
        newSet.add(holidayId)
      }
      return newSet
    })
  }

  const saveSelectedHolidays = async () => {
    const currentYearSelectedHolidays = publicHolidays
      .filter(h => new Date(h.date).getFullYear() === selectedYear)
      .filter(h => !isHolidayPassed(h.date)) // Only include holidays that haven't passed
      .filter(h => selectedHolidays.has(h.id))
    
    if (currentYearSelectedHolidays.length === 0) {
      onShowSnackbar?.('Please select at least one holiday for the current year', 'warning')
      return
    }

    setSavingSelected(true)
    try {
      const selectedHolidayData = publicHolidays
        .filter(h => new Date(h.date).getFullYear() === selectedYear)
        .filter(h => !isHolidayPassed(h.date)) // Only include holidays that haven't passed
        .filter(h => selectedHolidays.has(h.id))

      // Save each selected holiday to database
      const savePromises = selectedHolidayData.map(holiday => {
        const payload = {
          name: holiday.name,
          date: holiday.date,
          country: holiday.country || 'VN',
          lunar: holiday.lunar || false,
          recurrenceType: 'YEARLY_GREGORIAN',
          description: holiday.description || `Public holiday: ${holiday.name}`
        }
        return adminCreateHolidayAPI(payload)
      })

      await Promise.all(savePromises)

      // Clear selections and refresh data
      setSelectedHolidays(new Set())

      // Refresh admin holidays list
      const adminList = await adminListHolidaysAPI()
      setAdminHolidays(adminList)

      onShowSnackbar?.(`Saved ${currentYearSelectedHolidays.length} holiday(s) to database`, 'success')
    } catch (error) {
      console.error('Failed to save holidays:', error)
      onShowSnackbar?.('Failed to save holidays', 'error')
    } finally {
      setSavingSelected(false)
    }
  }

  const selectAllHolidays = () => {
    const currentYearHolidays = publicHolidays
      .filter(h => new Date(h.date).getFullYear() === selectedYear)
      .filter(h => !isHolidayPassed(h.date)) // Only select holidays that haven't passed
    const allIds = new Set(currentYearHolidays.map(h => h.id))
    setSelectedHolidays(allIds)
  }

  const deselectAllHolidays = () => {
    setSelectedHolidays(new Set())
  }

  // Helper function to get current year selected holidays count
  const getCurrentYearSelectedCount = () => {
    return publicHolidays
      .filter(h => new Date(h.date).getFullYear() === selectedYear)
      .filter(h => !isHolidayPassed(h.date)) // Only count holidays that haven't passed
      .filter(h => selectedHolidays.has(h.id)).length
  }

  // Helper function to check if a holiday date has passed
  const isHolidayPassed = (holidayDate) => {
    const today = new Date()
    const holiday = new Date(holidayDate)
    // Set time to start of day for accurate comparison
    today.setHours(0, 0, 0, 0)
    holiday.setHours(0, 0, 0, 0)
    return holiday < today
  }

  // Countdown calculation functions
  const calculateCountdown = (holidayDate) => {
    const now = currentTime
    const target = new Date(holidayDate)
    const diff = target.getTime() - now.getTime()

    if (diff <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        total: 0,
        isOverdue: true
      }
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return {
      days,
      hours,
      minutes,
      seconds,
      total: diff,
      isOverdue: false
    }
  }

  const formatCountdown = (countdown) => {
    if (countdown.isOverdue) {
      return "Đã qua"
    }
    
    if (countdown.days > 0) {
      return `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m`
    } else if (countdown.hours > 0) {
      return `${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`
    } else if (countdown.minutes > 0) {
      return `${countdown.minutes}m ${countdown.seconds}s`
    } else {
      return `${countdown.seconds}s`
    }
  }

  const getCountdownColor = (countdown) => {
    if (countdown.isOverdue) return 'error'
    if (countdown.days <= 1) return 'error'
    if (countdown.days <= 7) return 'warning'
    if (countdown.days <= 30) return 'info'
    return 'success'
  }

  const getCountdownProgress = (countdown, totalDays) => {
    if (countdown.isOverdue) return 100
    if (totalDays <= 0) return 0
    return Math.max(0, Math.min(100, ((totalDays - countdown.days) / totalDays) * 100))
  }

  // Year navigation functions
  const goToPreviousYear = () => {
    setSelectedYear(prev => prev - 1)
  }

  const goToNextYear = () => {
    setSelectedYear(prev => prev + 1)
  }

  const goToCurrentYear = () => {
    setSelectedYear(new Date().getFullYear())
  }

  // Reload public holidays when year changes
  useEffect(() => {
    if (activeTab === 1) { // Only load when on Public Holidays tab
      loadPublicHolidays(selectedYear)
    }
  }, [selectedYear, activeTab])

  // Schedule dialog functions
  const openScheduleDialog = async (holiday) => {
    try {
      setLoadingTemplate(true)
      setSelectedHolidayForSchedule(holiday)
      
      // Check if holiday is from database (has numeric ID) or public API (has string ID)
      let template
      if (typeof holiday.id === 'number' || (typeof holiday.id === 'string' && !isNaN(holiday.id))) {
        // Holiday from database - load template from API
        template = await getHolidayEmailTemplateAPI(parseInt(holiday.id))
      } else {
        // Holiday from public API - generate template locally
        template = generateLocalTemplate(holiday)
      }
      
      setEmailTemplate(template)
      
      // Set default template type
      setSelectedTemplateType(template.templateType || 'generic')
      
      // Calculate schedule date (holiday date - days before)
      const holidayDate = new Date(holiday.date)
      const scheduleDate = new Date(holidayDate)
      scheduleDate.setDate(scheduleDate.getDate() - 1) // Default 1 day before
      
      setScheduleForm({
        scheduleAt: scheduleDate.toISOString().slice(0, 16), // YYYY-MM-DDTHH:MM format
        daysBefore: 1,
        sendTime: '09:00',
        targetAudience: 'all',
        customSubject: template.subject || '',
        customContent: template.content || '',
        isActive: true
      })
      
      setScheduleDialogOpen(true)
    } catch (error) {
      console.error('Failed to load email template:', error)
      onShowSnackbar?.('Failed to load email template', 'error')
    } finally {
      setLoadingTemplate(false)
    }
  }

  // Generate template locally for public API holidays
  const generateLocalTemplate = (holiday) => {
    const holidayName = holiday.name.toLowerCase()
    let templateType = 'generic'
    let subject = `${holiday.name} - Ưu Đãi Đặc Biệt Từ Green Kitchen!`
    let content = ''

    if (holidayName.includes('tết') || holidayName.includes('tet') || holidayName.includes('nguyên đán')) {
      templateType = 'tet'
      subject = 'Chúc Mừng Năm Mới - Ưu Đãi Đặc Biệt Từ Green Kitchen!'
    } else if (holidayName.includes('black friday')) {
      templateType = 'black_friday'
      subject = 'BLACK FRIDAY - Siêu Sale Lên Đến 50% Tại Green Kitchen!'
    } else if (holidayName.includes('thanksgiving')) {
      templateType = 'thanksgiving'
      subject = 'Thanksgiving Special - Cảm Ơn Quý Khách Hàng!'
    } else if (holidayName.includes('cyber monday')) {
      templateType = 'cyber_monday'
      subject = 'CYBER MONDAY - Deal Sốc Chỉ Có Online!'
    } else if (holidayName.includes('quốc khánh') || holidayName.includes('national day')) {
      templateType = 'national_day'
      subject = 'Chào Mừng Ngày Quốc Khánh - Ưu Đãi Đặc Biệt!'
    } else if (holidayName.includes('giáng sinh') || holidayName.includes('christmas')) {
      templateType = 'christmas'
      subject = 'Merry Christmas - Quà Tặng Đặc Biệt Từ Green Kitchen!'
    } else if (holidayName.includes('valentine')) {
      templateType = 'valentine'
      subject = 'Valentine\'s Day - Bữa Tối Lãng Mạn Cho Cặp Đôi!'
    } else if (holidayName.includes('phụ nữ') || holidayName.includes('women')) {
      templateType = 'womens_day'
      subject = 'Ngày Quốc Tế Phụ Nữ - Tôn Vinh Vẻ Đẹp Tự Nhiên!'
    }

    // Generate basic content
    const holidayDate = new Date(holiday.date).toLocaleDateString('vi-VN')
    content = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #4caf50, #8bc34a); padding: 20px; border-radius: 10px;">
        <div style="text-align: center; color: white; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 28px;">${holiday.name}!</h1>
          <p style="font-size: 16px; margin: 10px 0;">Ưu đãi đặc biệt từ Green Kitchen</p>
        </div>
        
        <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #2e7d32; margin-top: 0;">Dear {{customerName}},</h2>
          
          <p>Nhân dịp <strong>${holiday.name}</strong> (${holidayDate}), Green Kitchen xin gửi đến bạn những ưu đãi đặc biệt!</p>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #2e7d32; margin-top: 0;">Ưu Đãi Đặc Biệt:</h3>
            <ul style="color: #333; line-height: 1.6;">
              <li><strong>15% OFF</strong> cho tất cả đơn hàng</li>
              <li><strong>Miễn phí ship</strong> cho đơn hàng từ 300,000 VNĐ</li>
              <li><strong>Combo đặc biệt</strong> với giá ưu đãi</li>
              <li><strong>Quà tặng</strong> món tráng miệng miễn phí</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{frontendUrl}}/menu" style="background: #4caf50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block;">
              Đặt Món Ngay
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
            Chúc bạn một ngày ${holiday.name} vui vẻ!<br>
            <strong>Green Kitchen Team</strong>
          </p>
        </div>
      </div>
    `

    return {
      subject,
      content,
      holidayName: holiday.name,
      holidayDate: holidayDate,
      templateType
    }
  }

  const loadTemplateWithType = async (templateType) => {
    if (!selectedHolidayForSchedule) return
    
    try {
      setLoadingTemplate(true)
      let template
      
      // Check if holiday is from database (has numeric ID) or public API (has string ID)
      if (typeof selectedHolidayForSchedule.id === 'number' || (typeof selectedHolidayForSchedule.id === 'string' && !isNaN(selectedHolidayForSchedule.id))) {
        // Holiday from database - load template from API
        template = await getHolidayEmailTemplateWithTypeAPI(parseInt(selectedHolidayForSchedule.id), templateType)
      } else {
        // Holiday from public API - generate template locally with specific type
        template = generateLocalTemplateWithType(selectedHolidayForSchedule, templateType)
      }
      
      setEmailTemplate(template)
      setScheduleForm(prev => ({
        ...prev,
        customSubject: template.subject || '',
        customContent: template.content || ''
      }))
    } catch (error) {
      console.error('Failed to load template with type:', error)
      onShowSnackbar?.('Failed to load template', 'error')
    } finally {
      setLoadingTemplate(false)
    }
  }

  // Handle delete scheduled holiday email
  const handleDeleteScheduled = (scheduled) => {
    setHolidayToDelete(scheduled)
    setDeleteDialogOpen(true)
  }

  // Confirm delete
  const confirmDelete = async () => {
    if (!holidayToDelete) return
    
    // Debug: Check the holidayToDelete object
    console.log('holidayToDelete:', holidayToDelete)
    
    if (!holidayToDelete.id) {
      onShowSnackbar?.('Invalid holiday ID. Cannot delete.', 'error')
      return
    }
    
    setDeleting(true)
    try {
      await deleteScheduledHolidayEmailAPI(holidayToDelete.id)
      onShowSnackbar?.('Scheduled email deleted successfully!', 'success')
      
      // Refresh scheduled holidays first
      const updatedScheduledHolidays = await loadScheduledHolidays()
      
      // Refresh public holidays to show the deleted holiday back in the list
      await loadPublicHolidays(selectedYear, updatedScheduledHolidays)
      
      // Close dialog
      setDeleteDialogOpen(false)
      setHolidayToDelete(null)
    } catch (error) {
      console.error('Failed to delete scheduled email:', error)
      onShowSnackbar?.('Failed to delete scheduled email', 'error')
    } finally {
      setDeleting(false)
    }
  }

  // Cancel delete
  const cancelDelete = () => {
    setDeleteDialogOpen(false)
    setHolidayToDelete(null)
  }

  // Handle edit scheduled holiday email
  const handleEditScheduled = (scheduled) => {
    // Open schedule dialog with pre-filled data
    setSelectedHolidayForSchedule({
      id: scheduled.holidayId,
      name: scheduled.holidayName,
      date: scheduled.holidayDate
    })
    
    setScheduleForm({
      scheduleAt: new Date(scheduled.scheduleAt).toISOString().slice(0, 16),
      daysBefore: scheduled.daysBefore || 1,
      sendTime: new Date(scheduled.scheduleAt).toTimeString().slice(0, 5),
      targetAudience: scheduled.targetAudience || 'all',
      customSubject: scheduled.subject || '',
      customContent: scheduled.content || '',
      isActive: scheduled.isActive
    })
    
    setEmailTemplate({
      subject: scheduled.subject,
      content: scheduled.content,
      holidayName: scheduled.holidayName,
      holidayDate: scheduled.holidayDate,
      templateType: scheduled.templateType || 'generic'
    })
    
    setScheduleDialogOpen(true)
  }

  // Generate template locally with specific type for public API holidays
  const generateLocalTemplateWithType = (holiday, templateType) => {
    const holidayDate = new Date(holiday.date).toLocaleDateString('vi-VN')
    
    // Generate template based on type
    let subject = `${holiday.name} - Ưu Đãi Đặc Biệt Từ Green Kitchen!`
    let content = ''

    switch (templateType.toLowerCase()) {
      case 'tet':
        subject = 'Chúc Mừng Năm Mới - Ưu Đãi Đặc Biệt Từ Green Kitchen!'
        break
      case 'black_friday':
        subject = 'BLACK FRIDAY - Siêu Sale Lên Đến 50% Tại Green Kitchen!'
        break
      case 'thanksgiving':
        subject = 'Thanksgiving Special - Cảm Ơn Quý Khách Hàng!'
        break
      case 'cyber_monday':
        subject = 'CYBER MONDAY - Deal Sốc Chỉ Có Online!'
        break
      case 'national_day':
        subject = 'Chào Mừng Ngày Quốc Khánh - Ưu Đãi Đặc Biệt!'
        break
      case 'christmas':
        subject = 'Merry Christmas - Quà Tặng Đặc Biệt Từ Green Kitchen!'
        break
      case 'valentine':
        subject = 'Valentine\'s Day - Bữa Tối Lãng Mạn Cho Cặp Đôi!'
        break
      case 'womens_day':
        subject = 'Ngày Quốc Tế Phụ Nữ - Tôn Vinh Vẻ Đẹp Tự Nhiên!'
        break
      default:
        subject = `${holiday.name} - Ưu Đãi Đặc Biệt Từ Green Kitchen!`
    }

    // Generate basic content (same as generateLocalTemplate)
    content = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #4caf50, #8bc34a); padding: 20px; border-radius: 10px;">
        <div style="text-align: center; color: white; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 28px;">${holiday.name}!</h1>
          <p style="font-size: 16px; margin: 10px 0;">Ưu đãi đặc biệt từ Green Kitchen</p>
        </div>
        
        <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #2e7d32; margin-top: 0;">Dear {{customerName}},</h2>
          
          <p>Nhân dịp <strong>${holiday.name}</strong> (${holidayDate}), Green Kitchen xin gửi đến bạn những ưu đãi đặc biệt!</p>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #2e7d32; margin-top: 0;">Ưu Đãi Đặc Biệt:</h3>
            <ul style="color: #333; line-height: 1.6;">
              <li><strong>15% OFF</strong> cho tất cả đơn hàng</li>
              <li><strong>Miễn phí ship</strong> cho đơn hàng từ 300,000 VNĐ</li>
              <li><strong>Combo đặc biệt</strong> với giá ưu đãi</li>
              <li><strong>Quà tặng</strong> món tráng miệng miễn phí</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{frontendUrl}}/menu" style="background: #4caf50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block;">
              Đặt Món Ngay
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
            Chúc bạn một ngày ${holiday.name} vui vẻ!<br>
            <strong>Green Kitchen Team</strong>
          </p>
        </div>
      </div>
    `

    return {
      subject,
      content,
      holidayName: holiday.name,
      holidayDate: holidayDate,
      templateType
    }
  }

  const createSchedule = async () => {
    if (!selectedHolidayForSchedule || !scheduleForm.scheduleAt) {
      onShowSnackbar?.('Please fill in all required fields', 'warning')
      return
    }

    setScheduling(true)
    try {
      // Check if holiday is from database (has numeric ID) or public API (has string ID)
      if (typeof selectedHolidayForSchedule.id === 'number' || (typeof selectedHolidayForSchedule.id === 'string' && !isNaN(selectedHolidayForSchedule.id))) {
        // Holiday from database - use API directly
        const scheduleData = {
          holidayId: parseInt(selectedHolidayForSchedule.id),
          scheduleAt: new Date(scheduleForm.scheduleAt).toISOString(),
          customSubject: scheduleForm.customSubject,
          customContent: scheduleForm.customContent,
          targetAudience: scheduleForm.targetAudience,
          isActive: scheduleForm.isActive,
          daysBefore: scheduleForm.daysBefore,
          templateType: selectedTemplateType
        }

        await scheduleHolidayEmailAPI(scheduleData)
        onShowSnackbar?.('Email scheduled successfully!', 'success')
      } else {
        // Holiday from public API - save to database first, then schedule
        const holidayData = {
          name: selectedHolidayForSchedule.name,
          country: selectedHolidayForSchedule.country || 'VN',
          date: selectedHolidayForSchedule.date,
          lunar: selectedHolidayForSchedule.lunar || false,
          recurrenceType: 'YEARLY_GREGORIAN',
          description: selectedHolidayForSchedule.description || ''
        }
        
        const savedHoliday = await adminCreateHolidayAPI(holidayData)
        
        const scheduleData = {
          holidayId: savedHoliday.id,
          scheduleAt: new Date(scheduleForm.scheduleAt).toISOString(),
          customSubject: scheduleForm.customSubject,
          customContent: scheduleForm.customContent,
          targetAudience: scheduleForm.targetAudience,
          isActive: scheduleForm.isActive,
          daysBefore: scheduleForm.daysBefore,
          templateType: selectedTemplateType
        }

        await scheduleHolidayEmailAPI(scheduleData)
        onShowSnackbar?.('Holiday saved and email scheduled successfully!', 'success')
      }

      // Refresh scheduled holidays first
      const updatedScheduledHolidays = await loadScheduledHolidays()
      
      // Force refresh public holidays with updated scheduled holidays
      await loadPublicHolidays(selectedYear, updatedScheduledHolidays)

      setScheduleDialogOpen(false)
      setSelectedHolidayForSchedule(null)
      setEmailTemplate(null)
    } catch (error) {
      console.error('Failed to schedule email:', error)
      onShowSnackbar?.('Failed to schedule email', 'error')
    } finally {
      setScheduling(false)
    }
  }

  const sendImmediateEmail = async () => {
    if (!selectedHolidayForSchedule) {
      onShowSnackbar?.('No holiday selected', 'warning')
      return
    }

    setScheduling(true)
    try {
      // Check if holiday is from database (has numeric ID) or public API (has string ID)
      if (typeof selectedHolidayForSchedule.id === 'number' || (typeof selectedHolidayForSchedule.id === 'string' && !isNaN(selectedHolidayForSchedule.id))) {
        // Holiday from database - use API directly
        const scheduleData = {
          holidayId: parseInt(selectedHolidayForSchedule.id),
          scheduleAt: new Date().toISOString(),
          customSubject: scheduleForm.customSubject,
          customContent: scheduleForm.customContent,
          targetAudience: scheduleForm.targetAudience,
          isActive: true,
          daysBefore: 0,
          templateType: selectedTemplateType
        }

        const response = await sendImmediateHolidayEmailAPI(scheduleData)
        onShowSnackbar?.(`Email sent to ${response.sentCount || 0} recipients!`, 'success')
      } else {
        // Holiday from public API - save to database first, then send
        const holidayData = {
          name: selectedHolidayForSchedule.name,
          country: selectedHolidayForSchedule.country || 'VN',
          date: selectedHolidayForSchedule.date,
          lunar: selectedHolidayForSchedule.lunar || false,
          recurrenceType: 'YEARLY_GREGORIAN',
          description: selectedHolidayForSchedule.description || ''
        }
        
        const savedHoliday = await adminCreateHolidayAPI(holidayData)
        
        const scheduleData = {
          holidayId: savedHoliday.id,
          scheduleAt: new Date().toISOString(),
          customSubject: scheduleForm.customSubject,
          customContent: scheduleForm.customContent,
          targetAudience: scheduleForm.targetAudience,
          isActive: true,
          daysBefore: 0,
          templateType: selectedTemplateType
        }

        const response = await sendImmediateHolidayEmailAPI(scheduleData)
        onShowSnackbar?.(`Holiday saved and email sent to ${response.sentCount || 0} recipients!`, 'success')
      }

      // Refresh scheduled holidays first
      const updatedScheduledHolidays = await loadScheduledHolidays()
      
      // Force refresh public holidays with updated scheduled holidays
      await loadPublicHolidays(selectedYear, updatedScheduledHolidays)

      setScheduleDialogOpen(false)
      setSelectedHolidayForSchedule(null)
      setEmailTemplate(null)
    } catch (error) {
      console.error('Failed to send immediate email:', error)
      onShowSnackbar?.('Failed to send email', 'error')
    } finally {
      setScheduling(false)
    }
  }

  if (loading) return <Box display="flex" justifyContent="center" mt={2}><CircularProgress /></Box>

  return (
    <Stack spacing={2}>
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
      {/* Tabs */}
      <Card variant="outlined">
        <CardContent sx={{ pb: 0 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Upcoming Holidays" />
            <Tab label={`Public Holidays ${publicHolidays.length > 0 ? `(${publicHolidays.length})` : ''}`} />
            <Tab label={`Manage Holidays ${adminHolidays.length > 0 ? `(${adminHolidays.length})` : ''}`} />
          </Tabs>
        </CardContent>
      </Card>

      {/* Tab Content */}
      {activeTab === 0 && (
        <>
          {/* Upcoming Holidays Tab */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>Add holiday</Typography>
          <Box component="form" onSubmit={createHoliday} sx={{ display: 'grid', gridTemplateColumns: '1fr 120px 1fr 120px 1fr', gap: 2, alignItems: 'center' }}>
            <TextField label="Name" value={form.name} required onChange={e => setForm({ ...form, name: e.target.value })} />
            <TextField label="Country" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
            <TextField label="Date" type="date" InputLabelProps={{ shrink: true }} required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            <TextField label="Lunar" select SelectProps={{ native: true }} value={form.lunar ? 'true' : 'false'} onChange={e => setForm({ ...form, lunar: e.target.value === 'true' })}>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </TextField>
            <TextField label="Recurrence" select SelectProps={{ native: true }} value={form.recurrenceType} onChange={e => setForm({ ...form, recurrenceType: e.target.value })}>
              <option value="NONE">None</option>
              <option value="YEARLY_GREGORIAN">Yearly (Gregorian)</option>
            </TextField>
            <TextField label="Description" fullWidth value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} sx={{ gridColumn: '1 / -2' }} />
            <Button type="submit" variant="contained" disabled={creating}>{creating ? 'Saving…' : 'Save'}</Button>
          </Box>
        </CardContent>
      </Card>

          {/* Year Selector for Upcoming Holidays */}
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ mr: 2 }}>Upcoming Holidays</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  Year:
                </Typography>
                <IconButton size="small" onClick={() => setUpcomingYear(prev => prev - 1)}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>‹</Typography>
                </IconButton>
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <Select
                    value={upcomingYear}
                    onChange={(e) => setUpcomingYear(e.target.value)}
                    sx={{ fontWeight: 'bold' }}
                  >
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() - 1 + i
                      return (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
                <IconButton size="small" onClick={() => setUpcomingYear(prev => prev + 1)}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>›</Typography>
                </IconButton>
                <Button size="small" variant="outlined" onClick={() => setUpcomingYear(new Date().getFullYear())}>
                  Current Year
                </Button>
                <Chip
                  label={`${holidays.filter(h => new Date(h.date).getFullYear() === upcomingYear).length} holidays`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Scheduled email campaigns for {upcomingYear} with live countdown timers
              </Typography>
            </CardContent>
          </Card>


          {/* Scheduled Holiday Emails */}
          {scheduledHolidays.length > 0 && (
            <Card variant="outlined" sx={{ mt: 3, border: '2px solid', borderColor: 'success.main' }}>
          <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ mr: 2, color: 'success.main' }}>
 Scheduled Holiday Emails
                  </Typography>
                  <Chip 
                    label={`${scheduledHolidays.length} scheduled`} 
                    color="success" 
                    size="small" 
                  />
              </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Email campaigns that have been scheduled for upcoming holidays
                </Typography>
                
                {loadingScheduled ? (
                  <Box display="flex" justifyContent="center" py={2}>
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  <Stack spacing={2}>
                    {scheduledHolidays
                      .filter(sh => new Date(sh.holidayDate).getFullYear() === upcomingYear)
                      .sort((a, b) => new Date(a.scheduleAt) - new Date(b.scheduleAt))
                      .map(scheduled => {
                        const scheduleDate = new Date(scheduled.scheduleAt)
                        const holidayDate = new Date(scheduled.holidayDate)
                        const countdown = calculateCountdown(scheduled.holidayDate)
                        
                        return (
                          <Card key={scheduled.id} variant="outlined" sx={{ 
                            border: '1px solid',
                            borderColor: scheduled.isActive ? 'success.light' : 'warning.light',
                            bgcolor: scheduled.isActive ? 'success.50' : 'warning.50'
                          }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                    {scheduled.holidayName}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Holiday: {holidayDate.toLocaleDateString('vi-VN', { 
                                      weekday: 'long', 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Email scheduled: {scheduleDate.toLocaleDateString('vi-VN', { 
                                      weekday: 'long', 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Subject: {scheduled.subject}
                                  </Typography>
                                  <Box sx={{ mt: 1 }}>
                                    <Chip 
                                      label={scheduled.isActive ? 'Active' : 'Inactive'} 
                                      color={scheduled.isActive ? 'success' : 'warning'} 
                                      size="small" 
                                      sx={{ mr: 1 }}
                                    />
                                    <Chip 
                                      label={`Target: ${scheduled.targetAudience}`} 
                                      color="info" 
                                      size="small" 
                                    />
              </Box>
                                </Box>
                                <Stack direction="row" spacing={2} alignItems="center">
                                  <CountdownTimer
                                    holiday={{ date: scheduled.holidayDate, daysUntil: countdown.days }}
                                    currentTime={currentTime}
                                    calculateCountdown={calculateCountdown}
                                    formatCountdown={formatCountdown}
                                    getCountdownColor={getCountdownColor}
                                    getCountdownProgress={getCountdownProgress}
                                  />
                                  <Stack direction="row" spacing={1}>
                                    <Button 
                                      size="small" 
                                      variant="outlined"
                                      color="error"
                                      onClick={() => handleDeleteScheduled(scheduled)}
                                    >
                                      Delete
                                    </Button>
                                    <Button 
                                      size="small" 
                                      variant="outlined"
                                      color="primary"
                                      onClick={() => handleEditScheduled(scheduled)}
                                    >
                                      Edit
                </Button>
                                  </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
                        )
                      })}
                    
                    {scheduledHolidays.filter(sh => new Date(sh.holidayDate).getFullYear() === upcomingYear).length === 0 && (
                      <Alert severity="info">
                        No scheduled emails for {upcomingYear}. Schedule some email campaigns for upcoming holidays!
                      </Alert>
                    )}
            </Stack>
                )}
          </CardContent>
        </Card>
          )}
        </>
      )}

      {activeTab === 1 && (
        <>
          {/* Public Holidays Tab */}
          <Card variant="outlined">
        <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6" gutterBottom>Public Holidays</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Select holidays from public APIs to save to your database or schedule email campaigns
          </Typography>
                  {scheduledHolidays.length > 0 && (
                    <Alert severity="info" sx={{ mt: 1 }}>
                      <Typography variant="body2">
                        <strong>{scheduledHolidays.length} holidays</strong> have been scheduled and are hidden from this list. 
                        Check the "Upcoming Holidays" tab to see scheduled campaigns.
                      </Typography>
                    </Alert>
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" variant="outlined" onClick={selectAllHolidays}>
                    Select All
                  </Button>
                  <Button size="small" variant="outlined" onClick={deselectAllHolidays}>
                    Deselect All
                  </Button>
            <Button
              size="small"
                    variant="contained"
                    onClick={saveSelectedHolidays}
                    disabled={savingSelected || getCurrentYearSelectedCount() === 0}
                    sx={{ mr: 1 }}
                  >
                    {savingSelected ? 'Saving...' : `Import to DB (${getCurrentYearSelectedCount()})`}
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => {
                      if (getCurrentYearSelectedCount() > 0) {
                        const firstSelected = publicHolidays
                          .filter(h => new Date(h.date).getFullYear() === selectedYear)
                          .filter(h => !isHolidayPassed(h.date)) // Only include holidays that haven't passed
                          .find(h => selectedHolidays.has(h.id))
                        if (firstSelected) openScheduleDialog(firstSelected)
                      }
                    }}
                    disabled={getCurrentYearSelectedCount() === 0}
                    color="secondary"
                  >
                    Schedule Email
            </Button>
                </Box>
          </Box>

              {/* Year Selector */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  Year:
              </Typography>
                <IconButton size="small" onClick={goToPreviousYear}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>‹</Typography>
                </IconButton>
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    sx={{ fontWeight: 'bold' }}
                  >
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() - 2 + i
                      return (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
                <IconButton size="small" onClick={goToNextYear}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>›</Typography>
                </IconButton>
                <Button size="small" variant="outlined" onClick={goToCurrentYear}>
                  Current Year
                </Button>
                <Chip
                  label={`${publicHolidays.length} holidays`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                  </Box>

              {(() => {
                const currentYearHolidays = publicHolidays.filter(h => new Date(h.date).getFullYear() === selectedYear)
                const passedHolidays = currentYearHolidays.filter(h => isHolidayPassed(h.date))
                const availableHolidays = currentYearHolidays.filter(h => !isHolidayPassed(h.date))
                
                return (
                  <>
                    {getCurrentYearSelectedCount() > 0 && (
                      <Alert severity="info" sx={{ mb: 2 }}>
                        Selected {getCurrentYearSelectedCount()} holiday(s) for {selectedYear}.
                        <br />
                        • Click "Import to DB" to save holidays to database only
                        <br />
                        • Click "Schedule Email" to create automated email campaigns
                      </Alert>
                    )}
                    
                    {passedHolidays.length > 0 && (
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        <strong>{passedHolidays.length} holiday(s)</strong> have already passed and cannot be scheduled or selected.
                        Only <strong>{availableHolidays.length} holiday(s)</strong> are available for scheduling.
                      </Alert>
                    )}
                  </>
                )
              })()}

              <Button
                variant="outlined"
                startIcon={<CircularProgress size={16} sx={{ display: loading ? 'inline-block' : 'none' }} />}
                onClick={() => loadPublicHolidays(selectedYear)}
                disabled={loading}
                sx={{ mb: 2 }}
              >
                {loading ? 'Loading...' : `Refresh ${selectedYear} Holidays`}
              </Button>

              {(() => {
                const currentYearHolidays = publicHolidays.filter(h => new Date(h.date).getFullYear() === selectedYear)
                const futureHolidays = currentYearHolidays.filter(h => !isHolidayPassed(h.date))
                const pastHolidays = currentYearHolidays.filter(h => isHolidayPassed(h.date))
                
                return (
                  <>
                    {/* Future Holidays */}
                    {futureHolidays.length > 0 && (
                      <>
                        <Typography variant="h6" sx={{ mt: 2, mb: 1, color: 'success.main' }}>
                          Upcoming Holidays ({futureHolidays.length})
                        </Typography>
                        {futureHolidays.map(h => (
                          <Card key={h.id} variant="outlined" sx={{ 
                            mb: 1, 
                            bgcolor: 'background.paper',
                            borderColor: 'divider',
                            '&:hover': {
                              bgcolor: 'action.hover'
                            }
                          }}>
                            <CardContent sx={{ py: 1 }}>
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={selectedHolidays.has(h.id)}
                                      onChange={() => handleHolidaySelection(h.id)}
                                      size="small"
                                    />
                                  }
                                  label=""
                                  sx={{ minWidth: 'auto', mr: 0 }}
                                />
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    {h.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {new Date(h.date).toLocaleDateString('vi-VN')} • {h.country}
                                    {h.lunar && (
                                      <Chip 
                                        label="Lunar" 
                                        size="small" 
                                        color="warning" 
                                        sx={{ ml: 1 }} 
                                      />
                                    )}
                                    {h.source && (
                                      <Chip 
                                        label="Public API" 
                                        size="small" 
                                        color="info" 
                                        sx={{ ml: 1 }} 
                                      />
                                    )}
                                    {h.year && (
                                      <Chip
                                        label={`Year: ${h.year}`}
                                        size="small"
                                        color="default"
                                        variant="outlined"
                                        sx={{ ml: 1 }}
                                      />
                                    )}
                                  </Typography>
                                  {h.description && (
                                    <Typography variant="caption" color="text.secondary">
                                      {h.description}
                                    </Typography>
                                  )}
                                </Box>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => openScheduleDialog(h)}
                                  color="secondary"
                                  startIcon={<Typography></Typography>}
                                >
                                  Schedule
                                </Button>
                              </Stack>
                            </CardContent>
                          </Card>
                        ))}
                      </>
                    )}
                    
                    {/* Past Holidays */}
                    {pastHolidays.length > 0 && (
                      <>
                        <Typography variant="h6" sx={{ mt: 3, mb: 1, color: 'text.disabled' }}>
                          Past Holidays ({pastHolidays.length})
                        </Typography>
                        {pastHolidays.map(h => {
                          const isPassed = isHolidayPassed(h.date)
                          return (
                            <Card key={h.id} variant="outlined" sx={{ 
                              mb: 1, 
                              opacity: isPassed ? 0.6 : 1,
                              bgcolor: isPassed ? 'action.hover' : 'background.paper',
                              borderColor: isPassed ? 'divider' : 'divider',
                              '&:hover': {
                                bgcolor: isPassed ? 'action.hover' : 'action.hover'
                              }
                            }}>
                              <CardContent sx={{ py: 1 }}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={selectedHolidays.has(h.id)}
                                        onChange={() => handleHolidaySelection(h.id)}
                                        size="small"
                                        disabled={isPassed}
                                        sx={{
                                          ...(isPassed && {
                                            color: 'text.disabled',
                                            '&.Mui-disabled': {
                                              color: 'text.disabled'
                                            }
                                          })
                                        }}
                                      />
                                    }
                                    label=""
                                    sx={{ 
                                      minWidth: 'auto', 
                                      mr: 0,
                                      ...(isPassed && {
                                        opacity: 0.6
                                      })
                                    }}
                                  />
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle1" sx={{ 
                                      fontWeight: 'bold',
                                      color: isPassed ? 'text.disabled' : 'text.primary'
                                    }}>
                                      {h.name}
                                      {isPassed && (
                                        <Chip 
                                          label="Đã qua" 
                                          size="small" 
                                          color="default" 
                                          variant="outlined"
                                          sx={{ 
                                            ml: 1,
                                            bgcolor: 'action.disabled',
                                            color: 'text.disabled',
                                            borderColor: 'divider'
                                          }}
                                        />
                                      )}
                                    </Typography>
                                    <Typography variant="body2" color={isPassed ? 'text.disabled' : 'text.secondary'}>
                                      {new Date(h.date).toLocaleDateString('vi-VN')} • {h.country}
                                      {h.lunar && (
                                        <Chip 
                                          label="Lunar" 
                                          size="small" 
                                          color="warning" 
                                          sx={{ 
                                            ml: 1,
                                            ...(isPassed && {
                                              opacity: 0.6,
                                              bgcolor: 'action.disabled',
                                              color: 'text.disabled'
                                            })
                                          }} 
                                        />
                                      )}
                                      {h.source && (
                                        <Chip 
                                          label="Public API" 
                                          size="small" 
                                          color="info" 
                                          sx={{ 
                                            ml: 1,
                                            ...(isPassed && {
                                              opacity: 0.6,
                                              bgcolor: 'action.disabled',
                                              color: 'text.disabled'
                                            })
                                          }} 
                                        />
                                      )}
                                      {h.year && (
                                        <Chip
                                          label={`Year: ${h.year}`}
                                          size="small"
                                          color="default"
                                          variant="outlined"
                                          sx={{ 
                                            ml: 1,
                                            ...(isPassed && {
                                              opacity: 0.6,
                                              bgcolor: 'action.disabled',
                                              color: 'text.disabled',
                                              borderColor: 'divider'
                                            })
                                          }}
                                        />
                                      )}
                                    </Typography>
                                    {h.description && (
                                      <Typography variant="caption" color={isPassed ? 'text.disabled' : 'text.secondary'}>
                                        {h.description}
                                      </Typography>
                                    )}
                                  </Box>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => openScheduleDialog(h)}
                                    color="secondary"
                                    disabled={isPassed}
                                    startIcon={<Typography></Typography>}
                                    sx={{
                                      ...(isPassed && {
                                        bgcolor: 'action.disabled',
                                        color: 'text.disabled',
                                        borderColor: 'divider',
                                        '&:hover': {
                                          bgcolor: 'action.disabled',
                                          color: 'text.disabled',
                                          borderColor: 'divider'
                                        }
                                      })
                                    }}
                                  >
                                    {isPassed ? 'Đã qua' : 'Schedule'}
                                  </Button>
                                </Stack>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </>
                    )}
                  </>
                )
              })()}

              {publicHolidays.length === 0 && !loading && (
                <Alert severity="warning">
                  No public holidays loaded. Click "Refresh Public Holidays" to load data.
                </Alert>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 2 && (
        <>
          {/* Manage Holidays Tab */}
          <Typography variant="h6" gutterBottom>All configured holidays</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Manage holidays stored in your database
                  </Typography>
          {adminHolidays.map(h => (
            <Card key={`cfg-${h.id}`} variant="outlined">
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle1">{h.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{h.date} • {h.country} {h.lunar ? '(Lunar)' : ''} • {h.recurrenceType}</Typography>
                  </Box>
                  <Button color="error" size="small" onClick={() => deleteHoliday(h.id)}>Delete</Button>
                </Stack>
                </CardContent>
              </Card>
          ))}

          {adminHolidays.length === 0 && (
            <Alert severity="info">
              No holidays configured yet. Use the "Public Holidays" tab to add holidays from public APIs.
            </Alert>
          )}
        </>
      )}

      {/* Schedule Dialog */}
      <Dialog
        open={scheduleDialogOpen}
        onClose={() => setScheduleDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6"> Schedule Holiday Email</Typography>
            {selectedHolidayForSchedule && (
              <Chip 
                label={selectedHolidayForSchedule.name} 
                color="primary" 
                variant="outlined"
              />
            )}
          </Box>
          {selectedHolidayForSchedule && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Holiday Date: {new Date(selectedHolidayForSchedule.date).toLocaleDateString('vi-VN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
                  </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Left Column - Form */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom> Email Settings</Typography>
                  <Stack spacing={2}>
                    <TextField
                      label="Email Subject"
                      fullWidth
                      value={scheduleForm.customSubject}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, customSubject: e.target.value }))}
                      placeholder="Enter email subject..."
                    />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          label="Days Before Holiday"
                          type="number"
                          fullWidth
                          value={scheduleForm.daysBefore}
                          onChange={(e) => setScheduleForm(prev => ({ ...prev, daysBefore: parseInt(e.target.value) || 0 }))}
                          helperText="How many days before holiday to send"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Send Time"
                          type="time"
                          fullWidth
                          value={scheduleForm.sendTime}
                          onChange={(e) => setScheduleForm(prev => ({ ...prev, sendTime: e.target.value }))}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>

                    <TextField
                      label="Schedule Date & Time"
                      type="datetime-local"
                      fullWidth
                      value={scheduleForm.scheduleAt}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, scheduleAt: e.target.value }))}
                      InputLabelProps={{ shrink: true }}
                      helperText="When to send the email"
                    />

                    <FormControl fullWidth>
                      <InputLabel>Target Audience</InputLabel>
                      <Select
                        value={scheduleForm.targetAudience}
                        onChange={(e) => setScheduleForm(prev => ({ ...prev, targetAudience: e.target.value }))}
                      >
                        <MenuItem value="all">All Customers</MenuItem>
                        <MenuItem value="active">Active Customers</MenuItem>
                        <MenuItem value="vip">VIP Customers</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel>Template Type</InputLabel>
                      <Select
                        value={selectedTemplateType}
                        onChange={(e) => {
                          setSelectedTemplateType(e.target.value)
                          loadTemplateWithType(e.target.value)
                        }}
                        disabled={loadingTemplate}
                      >
                        {templateTypes.map(type => (
                          <MenuItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <MuiFormControlLabel
                      control={
                        <Checkbox
                          checked={scheduleForm.isActive}
                          onChange={(e) => setScheduleForm(prev => ({ ...prev, isActive: e.target.checked }))}
                        />
                      }
                      label="Active (Enable this email campaign)"
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column - Email Preview */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ mr: 2 }}> Email Preview</Typography>
                    {loadingTemplate && <CircularProgress size={20} />}
          </Box>

                  {emailTemplate ? (
                    <Box sx={{ 
                      border: '1px solid', 
                      borderColor: 'divider', 
                      borderRadius: 1, 
                      p: 2,
                      bgcolor: 'background.paper',
                      maxHeight: 400,
                      overflow: 'auto'
                    }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Subject: {emailTemplate.subject}
            </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Box 
                        dangerouslySetInnerHTML={{ __html: emailTemplate.content }}
                        sx={{ 
                          '& *': { 
                            maxWidth: '100% !important',
                            fontSize: '12px !important'
                          }
                        }}
                      />
                    </Box>
                  ) : (
                    <Alert severity="info">
                      Select a template type to preview the email content
                    </Alert>
                  )}

                  <TextField
                    label="Custom Content (Optional)"
                    multiline
                    rows={6}
                    fullWidth
                    value={scheduleForm.customContent}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, customContent: e.target.value }))}
                    sx={{ mt: 2 }}
                    placeholder="Override the template content with your custom message..."
                  />
        </CardContent>
      </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setScheduleDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={sendImmediateEmail} 
            disabled={scheduling}
            variant="outlined"
            color="warning"
          >
            {scheduling ? 'Sending...' : ' Send Now'}
          </Button>
          <Button 
            onClick={createSchedule} 
            variant="contained" 
            disabled={scheduling}
            color="primary"
          >
            {scheduling ? ' Scheduling...' : ' Schedule Email'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" color="error">
              Delete Scheduled Email
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete this scheduled email?
          </Typography>
          {holidayToDelete && (
            <Card variant="outlined" sx={{ p: 2, bgcolor: 'background.paper' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                {holidayToDelete.holidayName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Holiday: {new Date(holidayToDelete.holidayDate).toLocaleDateString('vi-VN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Scheduled: {new Date(holidayToDelete.scheduleAt).toLocaleDateString('vi-VN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Subject: {holidayToDelete.subject}
              </Typography>
            </Card>
          )}
          <Alert severity="warning" sx={{ mt: 2 }}>
            This action cannot be undone. The holiday will be moved back to the Public Holidays list.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={cancelDelete} 
            variant="outlined"
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete} 
            variant="contained" 
            color="error"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} /> : null}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

export default HolidayPlanner


