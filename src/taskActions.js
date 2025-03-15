// taskActions.js

/**
 * Attaches interactive actions to task elements.
 */
export class TaskActions {
    /**
     * Attaches event listeners to a task element.
     * @param {HTMLElement} taskElement - Task DOM element
     * @param {Object} task - Task object
     * @param {TodoDom} todoDom - TodoDom instance for updates
     */
    attachActions(taskElement, task, todoDom) {
        const checkbox = taskElement.querySelector('.task-checkbox');
        const moreBtn = taskElement.querySelector('.more-btn');
        const editBtn = taskElement.querySelector('.edit-btn');
        const deleteBtn = taskElement.querySelector('.delete-btn');
        const projectSelect = taskElement.querySelector('.details .project-select');

        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;
            taskElement.querySelector('.task-name').classList.toggle('line-through', task.completed);
            taskElement.querySelector('.task-name').classList.toggle('text-gray-500', task.completed);
            todoDom.saveTasks();
        });

        moreBtn.addEventListener('click', () => {
            taskElement.querySelector('.details').classList.toggle('hidden');
        });

        projectSelect.addEventListener('change', () => {
            task.projectId = parseInt(projectSelect.value);
            todoDom.saveTasks();
            todoDom.renderTasks();
        });

        editBtn.addEventListener('click', () => {
            const descriptionEl = taskElement.querySelector('.details .textarea');
            const dueDateEl = taskElement.querySelector('.details .input[type="date"]');
            const priorityEl = taskElement.querySelector('.details .priority-select');

            task.description = descriptionEl ? descriptionEl.value : task.description || '';
            task.dueDate = dueDateEl ? dueDateEl.value : task.dueDate || '';
            task.priority = priorityEl ? priorityEl.value : task.priority || 'low';
            task.projectId = projectSelect ? parseInt(projectSelect.value) : task.projectId;

            const taskIndex = todoDom.tasks.findIndex(t => t.id === task.id);
            if (taskIndex !== -1) {
                todoDom.tasks[taskIndex] = { ...task };
            }

            todoDom.saveTasks();
            todoDom.renderTasks();
        });

        deleteBtn.addEventListener('click', () => {
            const index = todoDom.tasks.findIndex(t => t.id === task.id);
            if (index !== -1) {
                todoDom.tasks.splice(index, 1);
                todoDom.saveTasks();
                todoDom.renderTasks();
            }
        });
    }
}