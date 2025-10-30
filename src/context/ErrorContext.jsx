import { createContext, useContext, useState } from 'react'
import ErrorToast from '../components/ErrorToast.jsx'

const ErrorContext = createContext()

export function useError() {
  const context = useContext(ErrorContext)
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider')
  }
  return context
}

export function ErrorProvider({ children }) {
  const [error, setError] = useState(null)

  const showError = (message) => {
    setError(message)
  }

  const hideError = () => {
    setError(null)
  }

  return (
    <ErrorContext.Provider value={{ showError, hideError }}>
      {children}
      {error && (
        <ErrorToast 
          message={error} 
          onClose={hideError}
          duration={6000}
        />
      )}
    </ErrorContext.Provider>
  )
}
