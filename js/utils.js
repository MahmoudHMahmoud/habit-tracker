// Utility Functions

/**
 * Gets the current date as a string in 'YYYY-MM-DD' format
 * @returns {string}
 */
function getTodayString() {
    const today = new Date();
    return formatDateString(today);
}

/**
 * Formats a Date object to 'YYYY-MM-DD' string
 * @param {Date} date 
 * @returns {string}
 */
function formatDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Formats a date string for display (e.g., 'May 8, 2026')
 * @param {string|Date} dateInput 
 * @returns {string}
 */
function formatDisplayDate(dateInput) {
    const date = typeof dateInput === 'string' ? new Date(dateInput + 'T00:00:00') : dateInput;
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Generates an array of date strings for the past N days (including today)
 * @param {number} days 
 * @returns {string[]}
 */
function getPastDays(days) {
    const dates = [];
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(formatDateString(d));
    }
    return dates;
}

/**
 * Generates a unique ID
 * @returns {string}
 */
function generateId() {
    return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

/**
 * Calculates the current streak for a habit
 * @param {string[]} completedDates Array of 'YYYY-MM-DD' strings when habit was completed
 * @returns {number}
 */
function calculateStreak(completedDates) {
    if (!completedDates || completedDates.length === 0) return 0;
    
    // Sort dates descending
    const sorted = [...completedDates].sort((a, b) => b.localeCompare(a));
    const today = getTodayString();
    
    let streak = 0;
    let currentDate = new Date();
    let index = 0;
    
    // Check if today is completed, if not, start checking from yesterday
    if (sorted[0] !== today) {
        // If yesterday isn't completed either, streak is 0
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (sorted[0] !== formatDateString(yesterday)) {
            return 0;
        }
        currentDate = yesterday;
    } else {
        streak++;
        index++;
        currentDate.setDate(currentDate.getDate() - 1);
    }
    
    // Count backwards
    while (index < sorted.length) {
        if (sorted[index] === formatDateString(currentDate)) {
            streak++;
            index++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }
    
    return streak;
}
