// todoDom.js
import './output.css';
import { TaskFilters } from './taskFilters.js';
import { TaskRenderer } from './taskRenderer.js';
import { TaskActions } from './taskActions.js';
import { TaskStorage } from './taskStorage.js';
import { TaskModalManager } from './taskModalManager.js';
import { ProjectUIManager } from './projectUIManager.js';

export class TodoDom {
    constructor(projectManager) {
        this.container = document.getElementById('todo-container');
        if (!this.container) {
            console.error('Todo container not found');
            return;
        }

        this.projectManager = projectManager;
        this.taskRenderer = new TaskRenderer();
        this.taskActions = new TaskActions();
        this.taskStorage = new TaskStorage();
        this.modalManager = new TaskModalManager(this);
        this.projectUIManager = new ProjectUIManager(projectManager, this);

        this.currentFilter = TaskFilters.filterAll;
        this.tasks = this.taskStorage.loadTasks() || [];

        this.init();
    }

    init() {
        this.setupAddTaskButton();
        this.setupFilterButtons();
        this.projectUIManager.setupProjectButtons();
        this.modalManager.renderModals();
        this.updateActiveClasses(); // Set initial active states
        this.renderTasks();
    }

    setupAddTaskButton() {
        const addBtn = document.getElementById('add-task-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                document.getElementById('task-modal').checked = true;
            });
        }
    }

    setupFilterButtons() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove darkening from all filter buttons
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('bg-gray-700', 'text-white'));
                // Darken the clicked button
                btn.classList.add('bg-gray-700', 'text-white');
                const filter = btn.dataset.filter;
                this.currentFilter = TaskFilters[filter] || TaskFilters.filterAll;
                this.renderTasks();
            });
        });
    }

    renderTasks() {
        this.container.innerHTML = '';
        let tasksToDisplay;
        if (this.projectManager.getCurrentProjectId() === null) {
            tasksToDisplay = this.currentFilter(this.tasks);
        } else {
            const projectTasks = this.tasks.filter(task => task.projectId === this.projectManager.getCurrentProjectId());
            tasksToDisplay = this.currentFilter(projectTasks);
        }
        tasksToDisplay.forEach(task => this.renderTask(task));
    }

    renderTask(task) {
        try {
            if (!task.id || !task.name) {
                console.error('Invalid task object:', task);
                return;
            }
            const taskElement = this.taskRenderer.createTaskElement(task);
            this.projectUIManager.addProjectSelectToTask(taskElement, task);
            this.taskActions.attachActions(taskElement, task, this);
            this.container.appendChild(taskElement);
        } catch (error) {
            console.error('Error rendering task:', error, 'Task:', task);
        }
    }

    addTask(task) {
        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
    }

    updateProjectList() {
        this.projectUIManager.updateProjectList();
    }

    saveTasks() {
        this.taskStorage.saveTasks(this.tasks);
    }

    setInitialFilterActiveClass() {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('bg-gray-700', 'text-white'));
        const initialFilterBtn = document.querySelector(`.filter-btn[data-filter="${this.getCurrentFilterName()}"]`);
        if (initialFilterBtn) {
            initialFilterBtn.classList.add('bg-gray-700', 'text-white');
        }
    }

    getCurrentFilterName() {
        if (this.currentFilter === TaskFilters.filterAll) return 'filterAll';
        if (this.currentFilter === TaskFilters.filterActive) return 'filterActive';
        if (this.currentFilter === TaskFilters.filterCompleted) return 'filterCompleted';
        if (this.currentFilter === TaskFilters.filterToday) return 'filterToday';
        if (this.currentFilter === TaskFilters.filterOverdue) return 'filterOverdue';
        return 'filterAll';
    }

    updateActiveClasses() {
        this.setInitialFilterActiveClass();
        this.projectUIManager.setInitialProjectActiveClass();
    }
}