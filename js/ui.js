// UI Rendering and DOM Manipulation

class UI {
    constructor() {
        this.elements = {
            currentDate: document.getElementById('current-date'),
            progressPercent: document.getElementById('progress-percent'),
            progressBarFill: document.getElementById('progress-bar-fill'),
            habitList: document.getElementById('habit-list'),
            emptyState: document.getElementById('empty-state'),
            toastContainer: document.getElementById('toast-container'),
            
            // Modal Elements
            modal: document.getElementById('habit-modal'),
            modalTitle: document.getElementById('modal-title'),
            habitForm: document.getElementById('habit-form'),
            habitIdInput: document.getElementById('habit-id'),
            habitNameInput: document.getElementById('habit-name'),
            habitCategoryInput: document.getElementById('habit-category'),
            deleteBtn: document.getElementById('delete-habit-btn')
        };
    }

    renderHeaderDate() {
        const todayStr = getTodayString();
        this.elements.currentDate.textContent = formatDisplayDate(todayStr);
    }

    renderProgress(habits, recordsForToday) {
        const total = habits.length;
        if (total === 0) {
            this.elements.progressPercent.textContent = '0%';
            this.elements.progressBarFill.style.width = '0%';
            return;
        }

        const completed = recordsForToday.length;
        const percent = Math.round((completed / total) * 100);

        this.elements.progressPercent.textContent = `${percent}%`;
        this.elements.progressBarFill.style.width = `${percent}%`;
    }

    renderHabits(habits, todayRecords, storeInstance) {
        this.elements.habitList.innerHTML = '';
        const todayStr = getTodayString();

        if (habits.length === 0) {
            this.elements.emptyState.classList.remove('hidden');
            return;
        }

        this.elements.emptyState.classList.add('hidden');

        habits.forEach(habit => {
            const isCompleted = todayRecords.includes(habit.id);
            const completedDates = storeInstance.getCompletedDatesForHabit(habit.id);
            const streak = calculateStreak(completedDates);
            const historyDays = getPastDays(7); // Last 7 days

            const card = document.createElement('div');
            card.className = `habit-card ${isCompleted ? 'completed' : ''}`;
            card.style.setProperty('--card-color', `var(--cat-${habit.category})`);
            card.dataset.id = habit.id;

            card.innerHTML = `
                <div class="habit-card-main">
                    <div class="habit-info" data-action="edit">
                        <div class="habit-name">${this.escapeHTML(habit.name)}</div>
                        <div class="habit-meta">
                            <span class="streak-badge">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M17.5 19c2.5 0 4.5-2 4.5-4.5 0-3.5-4.5-8.5-4.5-8.5s-4.5 5-4.5 8.5c0 2.5 2 4.5 4.5 4.5z"></path>
                                    <path d="M10 14c2.5 0 4.5-2 4.5-4.5 0-3.5-4.5-8.5-4.5-8.5s-4.5 5-4.5 8.5c0 2.5 2 4.5 4.5 4.5z"></path>
                                </svg>
                                ${streak} day streak
                            </span>
                        </div>
                    </div>
                    <button class="habit-toggle" aria-label="Toggle habit completion" 
                            data-action="toggle" 
                            ${isCompleted ? 'checked' : ''}></button>
                </div>
                <div class="habit-history">
                    ${historyDays.reverse().map(date => {
                        const isDone = storeInstance.isHabitCompleted(habit.id, date);
                        const isToday = date === todayStr;
                        const statusClass = isDone ? 'done' : (date < todayStr && !isDone && date >= habit.createdAt ? 'missed' : '');
                        return `<div class="history-day ${statusClass}" data-date="${formatDisplayDate(date)}" ${isToday ? 'style="border: 1px solid var(--text-muted)"' : ''}></div>`;
                    }).join('')}
                </div>
            `;

            this.elements.habitList.appendChild(card);
        });
    }

    openModal(habit = null) {
        if (habit) {
            this.elements.modalTitle.textContent = 'Edit Habit';
            this.elements.habitIdInput.value = habit.id;
            this.elements.habitNameInput.value = habit.name;
            this.elements.habitCategoryInput.value = habit.category;
            this.elements.deleteBtn.classList.remove('hidden');
        } else {
            this.elements.modalTitle.textContent = 'New Habit';
            this.elements.habitIdInput.value = '';
            this.elements.habitNameInput.value = '';
            this.elements.habitCategoryInput.value = 'health';
            this.elements.deleteBtn.classList.add('hidden');
        }
        
        this.elements.modal.classList.remove('hidden');
        this.elements.habitNameInput.focus();
    }

    closeModal() {
        this.elements.modal.classList.add('hidden');
        this.elements.habitForm.reset();
    }

    showToast(message, isSuccess = true) {
        const toast = document.createElement('div');
        toast.className = `toast ${isSuccess ? 'success' : 'error'}`;
        toast.style.borderLeftColor = isSuccess ? 'var(--success-color)' : 'var(--danger-color)';
        toast.textContent = message;

        this.elements.toastContainer.appendChild(toast);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.classList.add('fade-out');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 3000);
    }

    // Utility to prevent XSS
    escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
}

const ui = new UI();
