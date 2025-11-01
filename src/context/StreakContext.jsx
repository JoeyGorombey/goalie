import { createContext, useContext, useState, useEffect } from 'react'
import StreakModal from '../components/StreakModal.jsx'

const StreakContext = createContext()

export function StreakProvider({ children }) {
  const [showStreakModal, setShowStreakModal] = useState(false)
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    isNewRecord: false
  })

  // Check localStorage for today's streak extension
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const hasExtendedStreakToday = () => {
    const lastExtension = localStorage.getItem('lastStreakExtension')
    return lastExtension === getTodayDate()
  }

  const markStreakExtendedToday = () => {
    localStorage.setItem('lastStreakExtension', getTodayDate())
    // Dispatch custom event to notify Dashboard
    window.dispatchEvent(new CustomEvent('streakExtended'))
  }

  const checkAndShowStreak = (responseData) => {
    if (responseData?.streakUpdate && responseData.streakUpdate.isNewStreakDay) {
      const { currentStreak, longestStreak } = responseData.streakUpdate
      const isNewRecord = currentStreak === longestStreak && currentStreak > 1
      
      setStreakData({
        currentStreak,
        longestStreak,
        isNewRecord
      })
      setShowStreakModal(true)
      
      // Mark that streak was extended today
      markStreakExtendedToday()
    }
  }

  const closeStreakModal = () => {
    setShowStreakModal(false)
  }

  return (
    <StreakContext.Provider value={{ checkAndShowStreak, hasExtendedStreakToday }}>
      {children}
      {showStreakModal && (
        <StreakModal
          streak={streakData.currentStreak}
          longestStreak={streakData.longestStreak}
          isNewRecord={streakData.isNewRecord}
          onClose={closeStreakModal}
        />
      )}
    </StreakContext.Provider>
  )
}

export function useStreak() {
  const context = useContext(StreakContext)
  if (!context) {
    throw new Error('useStreak must be used within a StreakProvider')
  }
  return context
}

