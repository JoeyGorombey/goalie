// Convert date string to YYYY-MM-DD format for date input
export const formatDateForInput = (dateString) => {
  if (!dateString || dateString === 'No due date' || dateString.trim() === '') {
    return ''
  }
  
  // If already in YYYY-MM-DD format, return as-is
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateString
  }
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return ''
    }
    
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    
    return `${year}-${month}-${day}`
  } catch {
    return ''
  }
}

// Convert YYYY-MM-DD from date input to date string for storage
export const parseDateFromInput = (dateInput) => {
  if (!dateInput || dateInput.trim() === '') {
    return 'No due date'
  }
  
  try {
    const date = new Date(dateInput)
    if (isNaN(date.getTime())) {
      return 'No due date'
    }
    
    // Format as readable date string
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return 'No due date'
  }
}

// Format date string for display
export const formatDateForDisplay = (dateString) => {
  if (!dateString || dateString === 'No due date') {
    return 'No due date'
  }
  
  // If it's already a formatted string, return it
  if (typeof dateString === 'string' && !dateString.includes('T') && !dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateString
  }
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return dateString || 'No due date'
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return dateString || 'No due date'
  }
}
