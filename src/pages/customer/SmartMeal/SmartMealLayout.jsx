import Box from '@mui/material/Box'
import AppBar from '~/components/AppBar/AppBar'
import theme from '~/theme'
import TabCal from './Item/TabCal/TabCal'
import ChoiceCal from './Item/HealthyChoice/HealthyChoice'
import ListCard from './Item/ListCard/ListCard'
import { useState, useRef, useEffect } from 'react'
import Footer from '~/components/Footer/Footer'
// import { ItemHealthy } from '~/apis/mockData'
import TabCalMobile from './Item/TabCal/TabCalMobile'
import { useSelector } from 'react-redux'
import { selectCurrentMeal } from '~/redux/meal/mealSlice'
import HealthyChoiceMobile from './Item/HealthyChoice/HealthyChoiceMobile'
import { getIngredientsAPI } from '~/apis'
import { t } from 'i18next'

const SmartMealLayout = () => {
  const [itemHealthy, setItemHealthy] = useState({})
  const [value, setValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const proteinRef = useRef(null)
  const carbsRef = useRef(null)
  const sideRef = useRef(null)
  const sauceRef = useRef(null)
  const selectedItems = useSelector(selectCurrentMeal)


  useEffect(() => {
    const handleScroll = () => {
      const refs = [proteinRef, carbsRef, sideRef, sauceRef]
      const offsets = refs.map(ref => {
        if (!ref.current) return Infinity
        return Math.abs(ref.current.getBoundingClientRect().top - (parseInt(theme.fitbowl.appBarHeight) + 80))
      })
      const minIndex = offsets.indexOf(Math.min(...offsets))
      if (minIndex !== value) setValue(minIndex)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [value])

  const handleChange = (event, newValue) => {
    setValue(newValue)
    const refs = [proteinRef, carbsRef, sideRef, sauceRef]
    setTimeout(() => {
      refs[newValue]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 40)
  }

  useEffect(() => {
    getIngredientsAPI().then(data => {
      setLoading(true)
      setItemHealthy(data)
    }).catch(error => {
      console.error('Error fetching ingredients:', error)
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  return (
    <Box>
      <AppBar />
      <Box
        sx={{
          mt: theme.fitbowl.appBarHeight,
          backgroundColor: theme.colorSchemes.light.palette.background.default,
          minHeight: '100vh',
          px: { xs: 0, sm: 0, md: 2 },
          py: { xs: 1, sm: 2, md: 3 }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 2, md: 4 },
            alignItems: 'flex-start',
            maxWidth: '90vw',
            mx: 'auto',
            width: '100%'
          }}
        >
          <Box
            sx={{
              flex: 2,
              minWidth: 0,
              width: '100%',
              maxWidth: { xs: '100%', md: '90vw' },
              mx: 'auto',
              mb: { xs: 3, md: 0 }
            }}
          >
            <Box
              sx={{
                position: 'sticky',
                top: theme.fitbowl.appBarHeight,
                zIndex: 10,
                my: { xs: 2, md: 3 },
                mx: 'auto',
                width: '100%',
                maxWidth: 540,
                minWidth: 0,
                p: { xs: 1, md: 2 },
                boxShadow: 'none',
                background: 'transparent'
              }}
            >
              <Box
                sx={{
                  display: { xs: 'none', md: 'block' }
                }}
              >
                <TabCal value={value} handleChange={handleChange} />
              </Box>
              <Box
                sx={{
                  display: { xs: 'block', md: 'none' }
                }}
              >
                <TabCalMobile value={value} handleChange={handleChange} />
              </Box>
            </Box>
            <Box sx={{ mx: '15px' }}>
              <Box ref={proteinRef} sx={{ scrollMarginTop: `calc(${theme.fitbowl.appBarHeight} + 80px)` }}>
                <ListCard title="SELECT PROTEIN" index={1} type="PROTEIN" cards={itemHealthy?.protein} loading={loading}/>
              </Box>
              <Box ref={carbsRef} sx={{ scrollMarginTop: `calc(${theme.fitbowl.appBarHeight} + 80px)` }}>
                <ListCard title="SELECT CARBS" index={2} type="CARDS" cards={itemHealthy?.carbs} loading={loading} />
              </Box>
              <Box ref={sideRef} sx={{ scrollMarginTop: `calc(${theme.fitbowl.appBarHeight} + 80px)` }}>
                <ListCard title="SELECT SIDE" index={3} type="SIDE" cards={itemHealthy?.side} loading={loading}/>
              </Box>
              <Box ref={sauceRef} sx={{ scrollMarginTop: `calc(${theme.fitbowl.appBarHeight} + 80px)` }}>
                <ListCard title="SELECT SAUCE" index={4} type="SAUCE" cards={itemHealthy?.sauce} loading={loading}/>
              </Box>
            </Box>


          </Box>
          <Box
            sx={{
              position: 'sticky',
              top: theme.fitbowl.appBarHeight,
              height: '85vh',
              minWidth: '40%',
              maxWidth: '40%',
              flex: 1,
              borderRadius: 4,
              p: 2,
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              alignItems: 'center',
              overflowY: 'auto',
              background: theme.colorSchemes.light.palette.background.default
            }}
          >
            <ChoiceCal />
          </Box>
        </Box>
        <Box sx={{
          display: { xs: 'block', md: 'none' },
          position: 'sticky',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          width: '100%',
          marginTop: 'auto'
        }}>
          {selectedItems.protein.length === 0 &&
            selectedItems.carbs.length === 0 &&
            selectedItems.side.length === 0 &&
            selectedItems.sauce.length === 0 ? (
              <Box></Box>
            ) : (
              <HealthyChoiceMobile />
            )}
        </Box>
      </Box>
      <Footer />
    </Box>
  )
}

export default SmartMealLayout