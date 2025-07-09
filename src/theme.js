import { deepOrange } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'

const APP_BAR_HEIGHT = '90px'
const CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT})`

// Create a theme instance.
const theme = createTheme({
  fitbowl: {
    appBarHeight: APP_BAR_HEIGHT,
    contentHeight: CONTENT_HEIGHT
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#4C082A',
          secondary: '#00B389',
          card: '#ffffff'
        },
        secondary: {
          main: deepOrange[500]
        },
        background: {
          main: '#F5EDD8',
          default: '#FAF5E8'
        },
        text: {
          primary: '#4C082A',
          secondary: '#4C082A',
          textSub: '#5f6c7b',
          hover: '#00000020'
        }
      }
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
            background: '#dcdde1',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            background: '#b2bec3'
          }
        }
      }
    },
    MuiTypography: {
      defaultProps: {
        component: 'div'
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderWidth: '0.3px',
          '&:hover': {
            borderWidth: '1.5px'
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          '& fieldset': { borderWidth: '0.3px !important' },
          '&:hover fieldset': { borderWidth: '1.5px !important' },
          '&.Mui-focused fieldset': { borderWidth: '1.5px !important' }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontSize: '0.875rem' }
      }
    },
    MuiTypograph: {
      styleOverrides: {
        root: {
          '&.MuiTypography-body1': { fontSize: '0.875rem' }
        }
      }
    }
  }
})

export default theme