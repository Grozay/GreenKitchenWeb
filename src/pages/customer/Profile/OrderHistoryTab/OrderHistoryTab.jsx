import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectCurrentLanguage } from '../../../../redux/translations/translationSlice'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useState } from 'react'
import OrderCard from './OrderCard'

export default function OrderHistoryTab({ customerDetails }) {
  const { t } = useTranslation()
  const currentLanguage = useSelector(selectCurrentLanguage)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [startDate, setStartDate] = useState(dayjs().subtract(30, 'day'))
  const [endDate, setEndDate] = useState(dayjs())
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(true)
  const [visibleCount, setVisibleCount] = useState(5)

  // Reset visibleCount về 5 mỗi khi filter thay đổi
  const handleStatusChange = (status) => {
    setSelectedStatus(status)
    setVisibleCount(5)
  }
  const handleStartDateChange = (date) => {
    setStartDate(date)
    setVisibleCount(5)
  }
  const handleEndDateChange = (date) => {
    setEndDate(date)
    setVisibleCount(5)
  }

  const statusOptions = [
    { key: 'all', label: t('profile.orderHistoryTab.statusOptions.all'), color: 'default' },
    { key: 'PENDING', label: t('profile.orderHistoryTab.statusOptions.pending'), color: 'warning' },
    { key: 'CONFIRMED', label: t('profile.orderHistoryTab.statusOptions.confirmed'), color: 'info' },
    { key: 'SHIPPING', label: t('profile.orderHistoryTab.statusOptions.shipping'), color: 'primary' },
    { key: 'DELIVERED', label: t('profile.orderHistoryTab.statusOptions.delivered'), color: 'success' },
    { key: 'CANCELLED', label: t('profile.orderHistoryTab.statusOptions.cancelled'), color: 'error' }
  ]

  // Lấy dữ liệu orders từ customerDetails
  const orders = customerDetails?.orders || []

  // Filter orders theo status và date range
  const filteredOrders = orders.filter(order => {
    // Filter theo status
    const statusMatch = selectedStatus === 'all' || order.status === selectedStatus

    // Filter theo date range
    const orderDate = dayjs(order.deliveryTime)
    const dateMatch = orderDate.isAfter(startDate.startOf('day')) &&
                     orderDate.isBefore(endDate.endOf('day'))

    return statusMatch && dateMatch
  }).sort((a, b) => {
    // Sort theo thời gian tạo đơn hàng (mới nhất lên trước)
    return dayjs(b.createdAt || b.deliveryTime).valueOf() - dayjs(a.createdAt || a.deliveryTime).valueOf()
  })

  const handleViewOrderDetails = (order) => {
    // TODO: Implement view details functionality
    alert(`${t('profile.orderHistoryTab.viewOrderDetails')} #${order.id}`)
  }

  return (
    <Box sx={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Filter*/}
      <Card sx={{ mb: 2, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 2 }}>
          <Grid container spacing={2}>
            {/* Filter theo trạng thái */}
            <Grid size={12}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#666', fontSize: '14px' }}>
                {t('profile.orderHistoryTab.orderStatus')}
              </Typography>
              <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.5
              }}>
                {statusOptions.map((status) => (
                  <Chip
                    key={status.key}
                    label={status.label}
                    variant={selectedStatus === status.key ? 'filled' : 'outlined'}
                    color={selectedStatus === status.key ? 'primary' : 'default'}
                    onClick={() => handleStatusChange(status.key)}
                    size="small"
                    sx={{
                      cursor: 'pointer',
                      fontSize: '14px',
                      height: '28px',
                      '&:hover': {
                        backgroundColor: selectedStatus === status.key
                          ? 'primary.main'
                          : 'rgba(76, 175, 80, 0.04)'
                      }
                    }}
                  />
                ))}
              </Box>
            </Grid>

            {/* Filter theo ngày tháng */}
            <Grid size={12}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#666', fontSize: '14px' }}>
                {t('profile.orderHistoryTab.orderTime')}
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <DatePicker
                    label={t('profile.orderHistoryTab.fromDate')}
                    value={startDate}
                    onChange={handleStartDateChange}
                    slotProps={{
                      textField: {
                        size: 'small',
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#4caf50'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#4caf50'
                            }
                          }
                        }
                      }
                    }}
                  />
                  <DatePicker
                    label={t('profile.orderHistoryTab.toDate')}
                    value={endDate}
                    onChange={handleEndDateChange}
                    minDate={startDate}
                    slotProps={{
                      textField: {
                        size: 'small',
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#4caf50'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#4caf50'
                            }
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </LocalizationProvider>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Phần 3: Danh sách đơn hàng với khả năng đóng/mở */}
      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2e7d32', fontSize: '14px' }}>
              {t('profile.orderHistoryTab.orderHistory')} ({filteredOrders.length} {t('profile.orderHistoryTab.orders')})
            </Typography>
            <IconButton
              onClick={() => setIsOrderHistoryOpen(!isOrderHistoryOpen)}
              sx={{ color: '#4caf50' }}
              size="small"
            >
              {isOrderHistoryOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>

          <Collapse in={isOrderHistoryOpen}>
            {/* Order Cards */}
            {filteredOrders.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px' }}>
                  {t('profile.orderHistoryTab.noOrdersMatch')}
                </Typography>
              </Box>
            ) : (
              <>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {filteredOrders.slice(0, visibleCount).map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onViewDetails={handleViewOrderDetails}
                    />
                  ))}
                </Box>
                {visibleCount < filteredOrders.length && (
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Chip
                      label={t('profile.orderHistoryTab.viewMore')}
                      color="primary"
                      clickable
                      onClick={() => setVisibleCount((prev) => prev + 5)}
                      size="small"
                      sx={{ fontWeight: 600, px: 2, py: 0.5, fontSize: '14px' }}
                    />
                  </Box>
                )}
              </>
            )}
          </Collapse>
        </CardContent>
      </Card>
    </Box>
  )
}
