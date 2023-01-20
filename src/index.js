import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import { Router } from 'react-router-dom'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import frLocale from 'date-fns/locale/fr'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import App from './components/App'
import FirebaseContextProvider from './contexts/firebase'
import NewTripContextProvider from './contexts/newTrip'
import SessionContextProvider from './contexts/session'
import SignupContextProvider from './contexts/signup'
import history from './helper/history'
import commonSettings from './styles/theme'

import './styles/global.css'
import './styles/firebaseui-styling.global.css'
import 'react-multi-carousel/lib/styles.css'

Sentry.init({
  dsn: 'https://55f990c86b454598b8ba7d6f1b22fae5@o1108965.ingest.sentry.io/6137015',
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
})

// eslint-disable-next-line no-console
console.log(`${process.env.REACT_APP_NAME} v${process.env.REACT_APP_VERSION}`)

ReactDOM.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <CssBaseline />
      <ThemeProvider theme={commonSettings}>
        <Router history={history}>
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={frLocale}>
            <FirebaseContextProvider>
              <SessionContextProvider>
                <SignupContextProvider>
                  <NewTripContextProvider>
                    <App />
                  </NewTripContextProvider>
                </SignupContextProvider>
              </SessionContextProvider>
            </FirebaseContextProvider>
          </LocalizationProvider>
        </Router>
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
