import { useEffect, useState } from 'react'
import { Box, Card, CardContent, Typography, Stack, Chip, Button, CircularProgress } from '@mui/material'
import { getUpcomingHolidaysAPI, broadcastEmailScheduleAPI, adminCreateHolidayAPI, adminDeleteHolidayAPI, adminListHolidaysAPI } from '~/apis'
import { TextField } from '@mui/material'

const DayChip = ({ days }) => {
  const color = days <= 3 ? 'error' : days <= 10 ? 'warning' : 'default'
  return <Chip label={`${days} days`} color={color} size="small" />
}

const HolidayPlanner = ({ onShowSnackbar }) => {
  const [holidays, setHolidays] = useState([])
  const [adminHolidays, setAdminHolidays] = useState([])
  const [loading, setLoading] = useState(true)
  const [schedulingId, setSchedulingId] = useState(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ name: '', country: 'VN', date: '', lunar: false, recurrenceType: 'NONE', description: '' })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUpcomingHolidaysAPI(null, 180)
        setHolidays(data)
        const adminList = await adminListHolidaysAPI()
        setAdminHolidays(adminList)
      } catch (e) {
        onShowSnackbar?.('Failed to load holidays', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
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

  if (loading) return <Box display="flex" justifyContent="center" mt={2}><CircularProgress /></Box>

  return (
    <Stack spacing={2}>
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

      {holidays.map(h => (
        <Card key={h.id} variant="outlined">
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <Box>
                <Typography variant="h6">{h.name}</Typography>
                <Typography variant="body2" color="text.secondary">{h.date} • {h.country} {h.lunar ? '(Lunar)' : ''}</Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <DayChip days={h.daysUntil} />
                <Button size="small" variant="contained" disabled={schedulingId === h.id} onClick={() => schedulePromo(h)}>
                  {schedulingId === h.id ? 'Scheduling…' : 'Schedule promo'}
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}

      <Typography variant="h6" sx={{ mt: 2 }}>All configured holidays</Typography>
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
    </Stack>
  )
}

export default HolidayPlanner


