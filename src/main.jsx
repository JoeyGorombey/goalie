import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ErrorProvider } from './context/ErrorContext.jsx'
import { StreakProvider } from './context/StreakContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorProvider>
      <StreakProvider>
        <App />
      </StreakProvider>
    </ErrorProvider>
  </StrictMode>,
)
