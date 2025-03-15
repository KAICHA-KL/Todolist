// taskRenderer.js

/**
 * Renders task elements for display.
 */
export class TaskRenderer {
    /**
     * Creates a DOM element for a task.
     * @param {Object} task - Task object to render
     * @returns {HTMLElement} Task element
     */
    createTaskElement(task) {
        const priorityColors = {
            low: "bg-blue-200 text-blue-800",
            medium: "bg-yellow-200 text-yellow-800",
            high: "bg-red-200 text-red-800"
        };
        
        const priorityColor = priorityColors[task.priority] || priorityColors.low;
        const div = document.createElement('div');
        div.className = 'task-item flex items-center gap-2 p-2 bg-white rounded mb-2 shadow';
        div.dataset.id = task.id;

        div.innerHTML = `
            <input type="checkbox" class="checkbox task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-name flex-1 ${task.completed ? 'line-through text-gray-500' : ''}">${task.name}</span>
            <span class="priority-flag px-2 py-1 rounded text-xs font-medium ${priorityColor}">
                ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
            <button class="btn btn-sm more-btn">Details</button>
            <div class="details hidden w-full mt-2 pt-2">
                <textarea class="textarea textarea-bordered w-full">${task.description || ''}</textarea>
                <input type="date" class="input input-bordered w-full" value="${task.dueDate || ''}">
                <select class="select select-bordered w-full">
                    <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
                    <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
                    <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
                </select>
                <div class="flex justify-end gap-2 mt-2">
                    <button class="btn btn-sm btn-warning edit-btn">Edit</button>
                    <button class="btn btn-sm btn-error delete-btn">Delete</button>
                </div>
            </div>
        `;
        return div;
    }
}