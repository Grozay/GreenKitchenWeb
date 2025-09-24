import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart'
import { LineChart } from '@mui/x-charts/LineChart'
import moment from 'moment'
import { fetchSalesFiguresAPI, fetchPopularFoodsAPI } from '~/apis' // Thêm fetchPopularFoodsAPI

// Thêm imports cho DatePicker
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

const SalesFiguresDashboard = ({ customBlue }) => {
  const [salesData, setSalesData] = useState([])
  const [selectedType, setSelectedType] = useState('year')
  const [selectedYear, setSelectedYear] = useState(moment().startOf('year'))
  const [selectedTypeForPie, setSelectedTypeForPie] = useState('year') // Thêm state cho PieChart
  const [selectedYearForPie, setSelectedYearForPie] = useState(moment().startOf('year'))
  const [pieData, setPieData] = useState([])

  const typeColors = {
    BALANCE: customBlue,
    HIGH: '#E75480',
    LOW: '#D9B6F3',
    VEGETARIAN: '#FFD700' // Nếu có data VEGETARIAN
  }

  useEffect(() => {
    let from, to, type
    if (selectedType === 'week') {
      from = moment().startOf('week')
      to = moment().endOf('week')
      type = 'day'
    } else if (selectedType === 'month') {
      from = moment().startOf('month')
      to = moment().endOf('month')
      type = 'month'
    } else if (selectedType === 'year') {
      from = moment(selectedYear).startOf('year')
      to = moment(selectedYear).endOf('year')
      type = 'year'
    } else if (selectedType === 'lastYear') {
      from = moment().subtract(1, 'year').startOf('year')
      to = moment().subtract(1, 'year').endOf('year')
      type = 'year'
    }

    // Fetch sales figures
    fetchSalesFiguresAPI(from.format('YYYY-MM-DD'), to.format('YYYY-MM-DD'), type).then(res => {
      if (res && res.labels && res.sales) {
        setSalesData(
          res.labels.map((label, idx) => ({
            month: label,
            sales: res.sales[idx]
          }))
        )
      }
    })
  }, [selectedType, selectedYear])

  // useEffect riêng cho PieChart
  useEffect(() => {
    let from, to
    if (selectedTypeForPie === 'week') {
      from = moment().startOf('week')
      to = moment().endOf('week')
    } else if (selectedTypeForPie === 'month') {
      from = moment().startOf('month')
      to = moment().endOf('month')
    } else if (selectedTypeForPie === 'year') {
      from = moment(selectedYearForPie).startOf('year')
      to = moment(selectedYearForPie).endOf('year')
    } else if (selectedTypeForPie === 'lastYear') {
      from = moment().subtract(1, 'year').startOf('year')
      to = moment().subtract(1, 'year').endOf('year')
    }

    // Fetch popular foods (menu meal types)
    fetchPopularFoodsAPI(from.format('YYYY-MM-DD'), to.format('YYYY-MM-DD')).then(res => {
      if (res && res.items) {
        // Hardcode 4 types, set 0% nếu thiếu
        const allTypes = ['BALANCE', 'HIGH', 'LOW', 'VEGETARIAN']
        const calculatedPieData = allTypes.map(type => {
          const item = res.items.find(i => i.type === type) // Giả sử response dùng 'type' thay 'foodName'
          const percentage = item ? item.percentage : 0
          return {
            value: Math.round(percentage),
            label: type.toUpperCase(), // 'BALANCE' -> 'BALANCE'
            color: typeColors[type] || '#ccc'
          }
        }).filter(d => d.value > 0) // Chỉ hiển thị nếu > 0%, hoặc bỏ filter để hiển thị tất cả
        setPieData(calculatedPieData)
      }
    })
  }, [selectedTypeForPie, selectedYearForPie]) // Dependency cho PieChart

  // Hàm xử lý khi chọn type từ Select cho LineChart
  const handleTypeChange = (e) => {
    const value = e.target.value
    setSelectedType(value)
    if (value === 'lastYear') {
      setSelectedYear(moment().subtract(1, 'year').startOf('year'))
    } else if (value === 'year') {
      setSelectedYear(moment().startOf('year'))
    }
  }

  // Hàm xử lý khi chọn type từ Select cho PieChart
  const handleTypeChangeForPie = (e) => {
    const value = e.target.value
    setSelectedTypeForPie(value)
    if (value === 'lastYear') {
      setSelectedYearForPie(moment().subtract(1, 'year').startOf('year'))
    } else if (value === 'year') {
      setSelectedYearForPie(moment().startOf('year'))
    }
  }

  // Hàm xử lý khi chọn năm từ DatePicker cho LineChart
  const handleYearChange = (newYear) => {
    const yearStart = moment(newYear).startOf('year')
    setSelectedYear(yearStart)
    setSelectedType('year')
  }

  // Hàm xử lý khi chọn năm từ DatePicker cho PieChart
  const handleYearChangeForPie = (newYear) => {
    const yearStart = moment(newYear).startOf('year')
    setSelectedYearForPie(yearStart)
    setSelectedTypeForPie('year')
  }

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Grid container spacing={2} mb={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 2, minHeight: 320, maxHeight: 400, boxShadow: 0 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={700} sx={{ color: customBlue }}>Sales Figures</Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <DatePicker
                  label="Select Year for Sales"
                  value={selectedYear}
                  onChange={handleYearChange}
                  views={['year']}
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: {
                        fontSize: '12px',
                        maxWidth: 100,
                        mr: 1
                      }
                    }
                  }}
                />
                <Select
                  value={selectedType}
                  onChange={handleTypeChange}
                  size="small"
                  sx={{
                    borderRadius: 2,
                    fontSize: 12,
                    height: 40
                  }}
                >
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                  <MenuItem value="year">This Year</MenuItem>
                  <MenuItem value="lastYear">Last Year</MenuItem>
                </Select>
              </Box>
            </Box>
            <LineChart
              height={220}
              series={[
                {
                  data: salesData.map(d => d.sales),
                  label: 'Sales (VNĐ)',
                  color: customBlue,
                  area: true,
                  showMark: true
                }
              ]}
              xAxis={[{ scaleType: 'point', data: salesData.map(d => d.month) }]}
              sx={{ mt: 4 }}
            />
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 2, minHeight: 350, maxHeight: 400, boxShadow: 0 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={700} sx={{ color: customBlue }}>Popular Food Types</Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <DatePicker
                  label="Select Year for Types"
                  value={selectedYearForPie}
                  onChange={handleYearChangeForPie}
                  views={['year']}
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: {
                        fontSize: '12px',
                        maxWidth: 100,
                        mr: 1
                      }
                    }
                  }}
                />
                <Select
                  value={selectedTypeForPie}
                  onChange={handleTypeChangeForPie}
                  size="small"
                  sx={{
                    borderRadius: 2,
                    fontSize: 12,
                    height: 40
                  }}
                >
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                  <MenuItem value="year">This Year</MenuItem>
                  <MenuItem value="lastYear">Last Year</MenuItem>
                </Select>
              </Box>
            </Box>
            {pieData.length === 0 ? (
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 245,
                bgcolor: '#fafafa',
                borderRadius: 1
              }}>
                <Typography color="textSecondary" fontSize={16}>
                  No data available
                </Typography>
              </Box>
            ) : (
              <PieChart
                series={[
                  {
                    data: pieData,
                    arcLabel: d => `${d.value}%`,
                    arcLabelMinAngle: 45,
                    innerRadius: 0,
                    outerRadius: 80,
                    startAngle: -90,
                    endAngle: 270,
                    cx: 90,
                    cy: 120,
                    paddingAngle: 4,
                    cornerRadius: 8,
                    highlightScope: { none: true },
                    faded: { innerRadius: 0, additionalRadius: 0 },
                    highlighted: { innerRadius: 0, additionalRadius: 0 }
                  }
                ]}
                height={245}
                width={200}
                slotProps={{
                  legend: { hidden: true }
                }}
                sx={{
                  [`& .${pieArcLabelClasses.root}`]: {
                    fill: '#fff',
                    fontWeight: 700
                  },
                  '& .MuiPieArc-root': {
                    cursor: 'default !important',
                    '&:hover': {
                      opacity: '1 !important'
                    }
                  }
                }}
              />
            )}
          </Card>
        </Grid>
      </Grid>
    </LocalizationProvider>
  )
}

export default SalesFiguresDashboard
