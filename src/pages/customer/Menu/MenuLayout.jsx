import { useEffect, useState, useRef, useMemo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import AppBar from '~/components/AppBar/AppBar'
import { getMenuMealAPI } from '~/apis'
import theme from '~/theme'
import MenuList from './MenuList/MenuList'
import TabMenu from './TabMenu/TabMenu'
import TabMenuMobile from './TabMenu/TabMenuMobile'
import Footer from '~/components/Footer/Footer'
import { useTranslation } from 'react-i18next'
import FilterListIcon from '@mui/icons-material/FilterList'

function MenuLayout() {
  const [mealPackages, setMealPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [value, setValue] = useState(0)
  const [sortOrder, setSortOrder] = useState('asc')

  const highRef = useRef(null)
  const balanceRef = useRef(null)
  const lowRef = useRef(null)
  const vegetarianRef = useRef(null)

  const { t } = useTranslation()

  const getFilteredMeals = useMemo(() => {
    // Sort toàn bộ mealPackages theo price trước khi filter
    const sortedMeals = [...mealPackages].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.price - b.price
      } else {
        return b.price - a.price
      }
    })
    // Trả về hàm filter theo type
    return (type) => sortedMeals.filter(meal => meal.type === type)
  }, [mealPackages, sortOrder]) // Dependencies: chỉ tính toán lại khi mealPackages hoặc sortOrder thay đổi

  const handleSortChange = (event) => {
    setSortOrder(event.target.value)
  }

  useEffect(() => {
    const fetchMealPackages = async () => {
      try {
        setLoading(true)
        const data = await getMenuMealAPI()
        setMealPackages(data)
      } catch {
        // Error fetching meal packages
      } finally {
        setLoading(false)
      }
    }
    fetchMealPackages()
  }, [])

  // Chỉ cập nhật tab khi cuộn, không khi click tab
  useEffect(() => {
    let isTabClick = false
    const refs = [highRef, balanceRef, lowRef, vegetarianRef]
    const handleTabClick = () => {
      isTabClick = true
      setTimeout(() => { isTabClick = false }, 800) // Đợi scroll xong
    }
    // Lắng nghe sự kiện click tab
    document.addEventListener('tab-menu-click', handleTabClick)

    const observer = new IntersectionObserver(
      (entries) => {
        if (isTabClick) return // Nếu vừa click tab thì không update value
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = refs.findIndex(ref => ref.current === entry.target)
            if (index !== -1 && index !== value) {
              setValue(index)
            }
          }
        })
      },
      {
        threshold: 0.3,
        rootMargin: `-${parseInt(theme.fitbowl.appBarHeight) + 80}px 0px -60% 0px`
      }
    )
    refs.forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })
    return () => {
      refs.forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current)
        }
      })
      document.removeEventListener('tab-menu-click', handleTabClick)
    }
  }, [value])

  const handleChange = (event, newValue) => {
    // Phát sự kiện để báo là click tab
    const tabClickEvent = new Event('tab-menu-click')
    document.dispatchEvent(tabClickEvent)
    setValue(newValue)
    const refs = [highRef, balanceRef, lowRef, vegetarianRef]
    if (refs[newValue]?.current) {
      const targetElement = refs[newValue].current
      const offsetTop = targetElement.offsetTop
      const appBarHeight = parseInt(theme.fitbowl.appBarHeight) || 64
      const stickyTabHeight = 60
      const extraOffset = 5
      window.scrollTo({
        top: offsetTop - appBarHeight - stickyTabHeight - extraOffset,
        behavior: 'smooth'
      })
    }
  }

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, color: theme.palette.text.primary, minHeight: '100vh', fontFamily: '"Poppins", sans-serif' }}>
      <AppBar />
      <Box sx={{ maxWidth: '1280px', mx: 'auto', px: 2, py: 6, mt: theme.fitbowl.appBarHeight }}>
        <Typography
          variant="h1"
          align="center"
          sx={{
            fontSize: { xs: '2.5rem', md: '4rem' },
            fontWeight: 300,
            letterSpacing: '0.1em',
            mb: 2,
            color: theme.palette.text.primary
          }}
        >
          {t('menu.choose')} <span style={{ fontWeight: 800, color: theme.palette.primary.secondary }}>{t('menu.mealPlan')}</span>
        </Typography>
        <Box sx={{ width: '6rem', height: '0.4rem', bgcolor: theme.palette.primary.secondary, mx: 'auto', mb: 4 }} />
        <Typography
          variant="body1"
          align="center"
          sx={{ maxWidth: '48rem', mx: 'auto', mb: 6, fontSize: { xs: '1rem', md: '1.15rem' }, color: theme.palette.text.textSub }}
        >
          {t('menu.description')}
        </Typography>

        {/* Tab Navigation - Sticky */}
        <Box
          sx={{
            position: 'sticky',
            top: theme.fitbowl.appBarHeight,
            zIndex: 100,
            py: 2,
            mb: 6,
            display: 'flex',
            justifyContent: 'center',
            maxWidth: '1280px',
            mx: 'auto',
            px: 2
          }}
        >
          {/* Desktop TabMenu */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <TabMenu value={value} handleChange={handleChange} />
          </Box>
          {/* Mobile TabMenu */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <TabMenuMobile value={value} handleChange={handleChange} />
          </Box>
        </Box>

        {/* filter price */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <FormControl variant="outlined" size='small' sx={{ minWidth: 150, borderRadius: 5 }}>
            <InputLabel sx={{ color: theme.palette.primary.main }}>{t('menu.filter')}</InputLabel>
            <Select
              value={sortOrder}
              onChange={handleSortChange}
              label={t('menu.filter')}
              MenuProps={{
                sx: {
                  '& .MuiPaper-root': {
                    borderRadius: 3
                  }
                } }
              }
              sx={{
                color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main
                },
                borderRadius: 5
              }}
            >
              <MenuItem value="asc">{t('menu.priceAsc')}</MenuItem>
              <MenuItem value="desc">{t('menu.priceDesc')}</MenuItem>
            </Select>
          </FormControl>
          <FilterListIcon sx={{ ml: 1, color: theme.palette.primary.main }} />
        </Box>

        {/* HIGH PROTEIN Section */}
        <Box ref={highRef} sx={{ mb: 8 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: theme.palette.text.primary }}>
            {t('menu.high')}
          </Typography>
          <MenuList pkg={getFilteredMeals('HIGH')} loading={loading} />
        </Box>

        {/* BALANCE Section */}
        <Box ref={balanceRef} sx={{ mb: 8 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: theme.palette.text.primary }}>
            {t('menu.balance')}
          </Typography>
          <MenuList pkg={getFilteredMeals('BALANCE')} loading={loading} />
        </Box>

        {/* LOW CARB Section */}
        <Box ref={lowRef} sx={{ mb: 8 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: theme.palette.text.primary }}>
            {t('menu.low')}
          </Typography>
          <MenuList pkg={getFilteredMeals('LOW')} loading={loading} />
        </Box>

        {/* VEGETARIAN Section */}
        <Box ref={vegetarianRef} sx={{ mb: 8 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: theme.palette.text.primary }}>
            {t('menu.vegetarian')}
          </Typography>
          <MenuList pkg={getFilteredMeals('VEGETARIAN')} loading={loading} />
        </Box>
      </Box>
      <Footer />
    </Box>
  )
}

export default MenuLayout