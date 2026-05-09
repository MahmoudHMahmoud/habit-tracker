// Data Store Layer using LocalStorage

class HabitStore {
    constructor() {
        this.STORAGE_KEY_HABITS = 'habit_tracker_habits';
        this.STORAGE_KEY_RECORDS = 'habit_tracker_records';
        this.habits = this.loadHabits();
        this.records = this.loadRecords();
    }

    // --- Core Loading/Saving ---

    loadHabits() {
        const data = localStorage.getItem(this.STORAGE_KEY_HABITS);
        return data ? JSON.parse(data) : [];
    }

    loadRecords() {
        const data = localStorage.getItem(this.STORAGE_KEY_RECORDS);
        return data ? JSON.parse(data) : {};
    }

    saveHabits() {
        localStorage.setItem(this.STORAGE_KEY_HABITS, JSON.stringify(this.habits));
    }

    saveRecords() {
        localStorage.setItem(this.STORAGE_KEY_RECORDS, JSON.stringify(this.records));
    }

    // --- Habit Management ---

    getHabits() {
        return this.habits;
    }

    getHabit(id) {
        return this.habits.find(h => h.id === id);
    }

    addHabit(name, category) {
        const newHabit = {
            id: generateId(),
            name,
            category,
            createdAt: getTodayString()
        };
        this.habits.push(newHabit);
        this.saveHabits();
        return newHabit;
    }

    updateHabit(id, name, category) {
        const habit = this.getHabit(id);
        if (habit) {
            habit.name = name;
            habit.category = category;
            this.saveHabits();
        }
        return habit;
    }

    deleteHabit(id) {
        this.habits = this.habits.filter(h => h.id !== id);
        
        // Also remove records for this habit
        for (const date in this.records) {
            this.records[date] = this.records[date].filter(hId => hId !== id);
            if (this.records[date].length === 0) {
                delete this.records[date];
            }
        }
        
        this.saveHabits();
        this.saveRecords();
    }

    // --- Record Management ---

    getRecordsForDate(dateString) {
        return this.records[dateString] || [];
    }

    isHabitCompleted(habitId, dateString) {
        const dailyRecords = this.getRecordsForDate(dateString);
        return dailyRecords.includes(habitId);
    }

    toggleHabitCompletion(habitId, dateString) {
        if (!this.records[dateString]) {
            this.records[dateString] = [];
        }

        const dailyRecords = this.records[dateString];
        const index = dailyRecords.indexOf(habitId);

        let isCompleted = false;
        if (index === -1) {
            dailyRecords.push(habitId);
            isCompleted = true;
        } else {
            dailyRecords.splice(index, 1);
        }

        // Clean up empty dates
        if (dailyRecords.length === 0) {
            delete this.records[dateString];
        }

        this.saveRecords();
        return isCompleted;
    }

    getCompletedDatesForHabit(habitId) {
        const dates = [];
        for (const [date, habits] of Object.entries(this.records)) {
            if (habits.includes(habitId)) {
                dates.push(date);
            }
        }
        return dates;
    }
}

// Global store instance
const store = new HabitStore();
