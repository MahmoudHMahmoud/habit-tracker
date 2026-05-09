// Main Application Logic

class App {
    constructor(store, ui) {
        this.store = store;
        this.ui = ui;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        // FAB to open add modal
        document.getElementById('fab-add-habit').addEventListener('click', () => {
            this.ui.openModal();
        });

        // Empty state add button
        document.getElementById('empty-state-add-btn').addEventListener('click', () => {
            this.ui.openModal();
        });

        // Close modal
        document.getElementById('close-modal-btn').addEventListener('click', () => {
            this.ui.closeModal();
        });
        document.getElementById('cancel-modal-btn').addEventListener('click', () => {
            this.ui.closeModal();
        });

        // Close modal on overlay click
        document.getElementById('habit-modal').addEventListener('click', (e) => {
            if (e.target.id === 'habit-modal') {
                this.ui.closeModal();
            }
        });

        // Form Submit (Add/Edit)
        document.getElementById('habit-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSaveHabit();
        });

        // Delete Habit
        document.getElementById('delete-habit-btn').addEventListener('click', () => {
            this.handleDeleteHabit();
        });

        // Habit List Events (Event Delegation)
        document.getElementById('habit-list').addEventListener('click', (e) => {
            const card = e.target.closest('.habit-card');
            if (!card) return;

            const habitId = card.dataset.id;
            
            // Handle Toggle Completion
            if (e.target.closest('[data-action="toggle"]')) {
                this.handleToggleHabit(habitId);
                return;
            }

            // Handle Edit Habit
            if (e.target.closest('[data-action="edit"]')) {
                const habit = this.store.getHabit(habitId);
                if (habit) {
                    this.ui.openModal(habit);
                }
                return;
            }
        });

        // Check for date changes if app is left open
        setInterval(() => this.checkForDateChange(), 60000); // Check every minute
    }

    render() {
        const todayStr = getTodayString();
        const habits = this.store.getHabits();
        const todayRecords = this.store.getRecordsForDate(todayStr);

        this.ui.renderHeaderDate();
        this.ui.renderHabits(habits, todayRecords, this.store);
        this.ui.renderProgress(habits, todayRecords);
    }

    handleSaveHabit() {
        const idInput = document.getElementById('habit-id').value;
        const nameInput = document.getElementById('habit-name').value.trim();
        const categoryInput = document.getElementById('habit-category').value;

        if (!nameInput) return;

        if (idInput) {
            // Edit existing
            this.store.updateHabit(idInput, nameInput, categoryInput);
            this.ui.showToast('Habit updated successfully');
        } else {
            // Add new
            this.store.addHabit(nameInput, categoryInput);
            this.ui.showToast('New habit created!');
        }

        this.ui.closeModal();
        this.render();
    }

    handleDeleteHabit() {
        const idInput = document.getElementById('habit-id').value;
        if (idInput && confirm('Are you sure you want to delete this habit? All history will be lost.')) {
            this.store.deleteHabit(idInput);
            this.ui.closeModal();
            this.ui.showToast('Habit deleted');
            this.render();
        }
    }

    handleToggleHabit(habitId) {
        const todayStr = getTodayString();
        const isCompleted = this.store.toggleHabitCompletion(habitId, todayStr);
        
        if (isCompleted) {
            // Play a subtle success interaction (e.g., toast)
            // this.ui.showToast('Great job!', true);
        }
        
        this.render();
    }

    checkForDateChange() {
        const renderedDate = this.ui.elements.currentDate.textContent;
        const actualDate = formatDisplayDate(getTodayString());
        
        if (renderedDate !== actualDate) {
            // It's a new day! Re-render everything
            this.render();
            this.ui.showToast('A new day has started!', true);
        }
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    const app = new App(store, ui);
});
