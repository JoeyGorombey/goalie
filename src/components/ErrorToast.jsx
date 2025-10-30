import { useEffect } from 'react'
import './ErrorToast.css'

function ErrorToast({ message, onClose, duration = 5000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  return (
    <div className="error-toast" role="alert">
      <div className="error-toast-content">
        <div className="error-toast-icon">⚠️</div>
        <div className="error-toast-message">{message}</div>
        <button 
          className="error-toast-close" 
          onClick={onClose}
          aria-label="Close error"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default ErrorToast
