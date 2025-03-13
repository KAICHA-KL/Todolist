export class TaskActions {
    toggleTaskCompletion(task, taskElement) {
        task.completed = !task.completed;
        const taskName = taskElement.querySelector('.task-name');
        taskName.classList.toggle('line-through');
        taskName.classList.toggle('text-gray-500');
    }

    toggleTaskDetails(taskElement) {
        const details = taskElement.querySelector('.details');
        details.classList.toggle('hidden');
    }

    deleteTask(taskId, taskElement, tasksArray) {
        taskElement.remove();
        const taskIndex = tasksArray.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) tasksArray.splice(taskIndex, 1);
    }

    editTask(task, taskElement) {
        task.description = taskElement.querySelector('.description').value;
        task.dueDate = taskElement.querySelector('.due-date').value;
        task.priority = taskElement.querySelector('.priority').value;
        const taskName = taskElement.querySelector('.task-name');

        if (!task.completed) {
            taskName.textContent = task.name;
        }
    }
}

