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
      },
      styleOverrides: {
        h6: {
          color: '#4C082A',
          fontWeight: 600
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderWidth: '0.3px',
          fontWeight: 500,
          '&:hover': {
            borderWidth: '1.5px'
          }
        },
        contained: {
          backgroundColor: '#4C082A',
          '&:hover': {
            backgroundColor: '#6D0B3A',
            boxShadow: '0 4px 8px rgba(76, 8, 42, 0.3)'
          }
        },
        outlined: {
          borderColor: '#4C082A',
          color: '#4C082A',
          '&:hover': {
            borderColor: '#6D0B3A',
            backgroundColor: 'rgba(76, 8, 42, 0.04)',
            color: '#6D0B3A'
          }
        },
        text: {
          '&.MuiButton-colorInherit': {
            color: '#666',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#4C082A'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4C082A'
            }
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#4C082A'
          }
        }
      }
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#4C082A'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4C082A'
            }
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#4C082A'
          }
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#4C082A'
            }
          }
        }
      }
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#4C082A'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #e0e0e0'
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: '#4C082A',
          fontWeight: 600,
          borderBottom: '1px solid #e0e0e0'
        }
      }
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          borderTop: '1px solid #e0e0e0',
          padding: '16px 24px'
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
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          }
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