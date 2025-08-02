import { createRoot } from 'react-dom/client'
import App from '~/App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import theme from '~/theme'
import { ConfirmProvider } from 'material-ui-confirm'
import CssBaseline from '@mui/material/CssBaseline'
import { Provider } from 'react-redux'
import store from '~/redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import '~/customLibraries/i18n'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ToastContainer, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ScrollToTop from '~/components/ScrollToTop/ScrollToTop.jsx'


const persistor = persistStore(store)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <ScrollToTop />
        <ThemeProvider theme={theme} noSsr disableTransitionOnChange defaultMode='light'>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
            <ConfirmProvider defaultOptions={{
              allowClose: false,
              dialogProps: { maxWidth: 'xs' },
              confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
              cancellationButtonProps: { color: 'inherit' }
            }}>
              <CssBaseline />
              <App />
              <ToastContainer
                position="top-center"
                hideProgressBar
                closeOnClick
                transition={Slide}
                stacked
              />
            </ConfirmProvider>
          </GoogleOAuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
)
