// taskStorage.js

/**
 * Handles task storage operations
 */
export class TaskStorage {
    /**
     * Loads tasks from localStorage.
     * @returns {Array} Array of tasks or empty array if loading fails
     */
    loadTasks() {
        try {
            const storedTasks = localStorage.getItem('todoTasks');
            return storedTasks ? JSON.parse(storedTasks) : [];
        } catch (error) {
            console.error('Error loading tasks from localStorage:', error);
            return [];
        }
    }

    /**
     * Saves tasks to localStorage.
     * @param {Array} tasks - The tasks array to save
     */
    saveTasks(tasks) {
        try {
            localStorage.setItem('todoTasks', JSON.stringify(tasks));
        } catch (error) {
            console.error('Error saving tasks to localStorage:', error);
        }
    }
}