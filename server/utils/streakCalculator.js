/**
 * Streak calculation utilities
 */

// Get today's date in YYYY-MM-DD format
function getTodayDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Get yesterday's date in YYYY-MM-DD format
function getYesterdayDate() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

// Calculate days between two dates
function daysBetween(date1Str, date2Str) {
  const date1 = new Date(date1Str);
  const date2 = new Date(date2Str);
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Calculate current streak from activity log
function calculateStreak(db) {
  const today = getTodayDate();
  const yesterday = getYesterdayDate();
  
  // Get all unique activity dates, ordered by date descending
  const activityDates = db.prepare(`
    SELECT DISTINCT activityDate 
    FROM activity_log 
    ORDER BY activityDate DESC
  `).all();
  
  if (activityDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, lastActivityDate: null };
  }
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastActivityDate = activityDates[0].activityDate;
  
  // Calculate current streak (must include today or yesterday)
  const mostRecentDate = activityDates[0].activityDate;
  if (mostRecentDate === today || mostRecentDate === yesterday) {
    currentStreak = 1;
    let expectedDate = new Date(mostRecentDate);
    
    for (let i = 1; i < activityDates.length; i++) {
      expectedDate.setDate(expectedDate.getDate() - 1);
      const expectedDateStr = expectedDate.toISOString().split('T')[0];
      
      if (activityDates[i].activityDate === expectedDateStr) {
        currentStreak++;
      } else {
        break;
      }
    }
  }
  
  // Calculate longest streak ever
  tempStreak = 1;
  let prevDate = new Date(activityDates[0].activityDate);
  
  for (let i = 1; i < activityDates.length; i++) {
    const currentDate = new Date(activityDates[i].activityDate);
    const dayDiff = Math.round((prevDate - currentDate) / (1000 * 60 * 60 * 24));
    
    if (dayDiff === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
    
    prevDate = currentDate;
  }
  
  longestStreak = Math.max(longestStreak, tempStreak);
  
  return {
    currentStreak,
    longestStreak,
    lastActivityDate
  };
}

// Log activity and update streak
function logActivity(db, activityType, goalId = null) {
  const today = getTodayDate();
  
  // Check if there's already an activity today
  const existingActivity = db.prepare(`
    SELECT id FROM activity_log 
    WHERE activityDate = ? 
    LIMIT 1
  `).get(today);
  
  const isNewStreakDay = !existingActivity;
  
  // Log the activity
  db.prepare(`
    INSERT INTO activity_log (activityDate, activityType, goalId)
    VALUES (?, ?, ?)
  `).run(today, activityType, goalId);
  
  // Recalculate streak
  const streakData = calculateStreak(db);
  
  // Update user_stats
  db.prepare(`
    UPDATE user_stats 
    SET currentStreak = ?,
        longestStreak = ?,
        lastActivityDate = ?,
        updatedAt = datetime('now')
    WHERE id = 1
  `).run(streakData.currentStreak, streakData.longestStreak, streakData.lastActivityDate);
  
  return {
    ...streakData,
    isNewStreakDay
  };
}

// Get user stats
function getUserStats(db) {
  const stats = db.prepare(`
    SELECT * FROM user_stats WHERE id = 1
  `).get();
  
  if (!stats) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null
    };
  }
  
  return stats;
}

// Get goals completed this week
function getGoalsCompletedThisWeek(db) {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfWeekStr = startOfWeek.toISOString().split('T')[0];
  
  const count = db.prepare(`
    SELECT COUNT(*) as count 
    FROM goals 
    WHERE status = 'completed' 
    AND updatedAt >= ?
  `).get(startOfWeekStr);
  
  return count.count || 0;
}

// Get active goals count
function getActiveGoalsCount(db) {
  const count = db.prepare(`
    SELECT COUNT(*) as count 
    FROM goals 
    WHERE status = 'active'
  `).get();
  
  return count.count || 0;
}

module.exports = {
  getTodayDate,
  getYesterdayDate,
  daysBetween,
  calculateStreak,
  logActivity,
  getUserStats,
  getGoalsCompletedThisWeek,
  getActiveGoalsCount
};

