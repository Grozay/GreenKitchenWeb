import Box from '@mui/material/Box'
import AppBar from '~/components/AppBar/AppBar'
import Footer from '~/components/Footer/Footer'
import theme from '~/theme'
import CaloInfo from './CaloInfo/CaloInfo'

const CaloCalculatorLayout = () => {
  return (
    <>
      <Box>
        <AppBar/>
        <Box sx={{ mt: theme.fitbowl.appBarHeight }}>
          <Box sx={{ py: 5 }}>
            <CaloInfo/>
          </Box>
        </Box>
        <Footer/>
      </Box>
    </>
  )
}

export default CaloCalculatorLayout