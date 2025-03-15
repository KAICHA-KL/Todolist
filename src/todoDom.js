// todoDom.js
import './output.css';
import { TaskFilters } from './taskFilters.js';
import { TaskRenderer } from './taskRenderer.js';
import { TaskActions } from './taskActions.js';
import { Task } from './taskModel.js';

/**
 * Handles DOM manipulation for the Todo application.
 */
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
        this.currentFilter = TaskFilters.filterAll;
        this.tasks = this.loadTasks() || [];
        
        this.init();
    }

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
     */
    saveTasks() {
        try {
            localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Error saving tasks to localStorage:', error);
        }
    }

    /**
     * Initializes the application by setting up UI components.
     */
    init() {
        this.setupAddTaskButton();
        this.setupFilterButtons();
        this.setupProjectButtons();
        this.renderModal();
        this.renderTasks();
    }

    /**
     * Sets up the "+ Task" button to open the modal.
     */
    setupAddTaskButton() {
        const addBtn = document.getElementById('add-task-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                document.getElementById('task-modal').checked = true;
            });
        }
    }

    /**
     * Sets up filter buttons to change task visibility.
     */
    setupFilterButtons() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.currentFilter = TaskFilters[filter] || TaskFilters.filterAll;
                this.renderTasks();
            });
        });
    }

    /**
     * Sets up project-related buttons
     */
    setupProjectButtons() {
        // Handle project selection
        document.querySelectorAll('.navbar .menu li a:not(.btn)').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const projectName = e.target.textContent;
                const project = this.projectManager.getProjects().find(p => p.name === projectName);
                if (project) {
                    this.projectManager.setCurrentProjectId(project.id);
                    this.renderTasks();
                }
            });
        });

        // Handle "Add Project" button
        const addProjectBtn = document.querySelector('.navbar .menu .btn.add-project-btn');
        if (addProjectBtn) {
            addProjectBtn.addEventListener('click', () => {
                document.getElementById('project-modal').checked = true;
            });
        }
    }

    /**
     * Updates the project list in the navbar and modal.
     */
    updateProjectList() {
        const projectMenus = document.querySelectorAll('.navbar .menu details ul');
        const projectSelect = document.querySelector('#task-form select[name="projectId"]');
        const projects = this.projectManager.getProjects();

        const projectHTML = projects.map(project => `
            <li><a>${project.name}</a></li>
        `).join('');
        
        const selectHTML = projects.map(project => `
            <option value="${project.id}" ${project.id === this.projectManager.getCurrentProjectId() ? 'selected' : ''}>${project.name}</option>
        `).join('');

        projectMenus.forEach(menu => menu.innerHTML = projectHTML);
        if (projectSelect) projectSelect.innerHTML = selectHTML;

        this.setupProjectButtons(); // Reattach event listeners
    }

    /**
     * Renders both task and project modals
     */
    renderModal() {
        const modalsContainer = document.createElement('div');
        modalsContainer.innerHTML = `
            <!-- Task Modal -->
            <input type="checkbox" id="task-modal" class="modal-toggle" />
            <div class="modal" role="dialog">
                <div class="modal-box">
                    <h3 class="text-lg font-bold">Add New Task</h3>
                    <form id="task-form" class="space-y-4 mt-4">
                        <div>
                            <input type="text" name="name" placeholder="Task Name" class="input input-bordered w-full" required>
                        </div>
                        <div>
                            <textarea name="description" class="textarea textarea-bordered w-full" placeholder="Description"></textarea>
                        </div>
                        <div>
                            <input type="date" name="dueDate" class="input input-bordered w-full">
                        </div>
                        <div>
                            <select name="priority" class="select select-bordered w-full">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div>
                            <select name="projectId" class="select select-bordered w-full">
                                ${this.projectManager.getProjects().map(project => `
                                    <option value="${project.id}" ${project.id === this.projectManager.getCurrentProjectId() ? 'selected' : ''}>${project.name}</option>
                                `).join('')}
                            </select>
                        </div>
                        <div class="modal-action">
                            <button type="submit" class="btn btn-primary">Add Task</button>
                            <label for="task-modal" class="btn">Cancel</label>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Project Modal -->
            <input type="checkbox" id="project-modal" class="modal-toggle" />
            <div class="modal" role="dialog">
                <div class="modal-box">
                    <h3 class="text-lg font-bold">Add New Project</h3>
                    <form id="project-form" class="space-y-4 mt-4">
                        <div>
                            <input type="text" name="projectName" placeholder="Project Name" class="input input-bordered w-full" required>
                        </div>
                        <div class="modal-action">
                            <button type="submit" class="btn btn-primary">Add Project</button>
                            <label for="project-modal" class="btn">Cancel</label>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modalsContainer);

        const taskForm = modalsContainer.querySelector('#task-form');
        if (taskForm) {
            taskForm.addEventListener('submit', (e) => this.handleAddTask(e));
        }

        const projectForm = modalsContainer.querySelector('#project-form');
        if (projectForm) {
            projectForm.addEventListener('submit', (e) => this.handleAddProject(e));
        }
    }

    /**
     * Handles task form submission.
     * @param {Event} e - Form submission event
     */
    handleAddTask(e) {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value.trim();
        if (!name) return;

        const task = new Task(
            Date.now(),
            name,
            false,
            form.description.value.trim(),
            form.dueDate.value,
            form.priority.value,
            parseInt(form.projectId.value) || this.projectManager.getCurrentProjectId()
        );

        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();

        form.reset();
        document.getElementById('task-modal').checked = false;
    }

    /**
     * Handles project form submission
     * @param {Event} e - Form submission event
     */
    handleAddProject(e) {
        e.preventDefault();
        const form = e.target;
        const projectName = form.projectName.value.trim();
        if (!projectName) return;

        const newProject = this.projectManager.addProject(projectName);
        if (newProject) {
            this.updateProjectList();
            this.projectManager.setCurrentProjectId(newProject.id);
            this.renderTasks();
        }

        form.reset();
        document.getElementById('project-modal').checked = false;
    }

    /**
     * Renders tasks in the container based on the current filter and project.
     */
    renderTasks() {
        this.container.innerHTML = '';
        const filteredTasks = this.currentFilter(this.tasks)
            .filter(task => task.projectId === this.projectManager.getCurrentProjectId());
        filteredTasks.forEach(task => this.renderTask(task));
    }

    /**
     * Renders a single task element with project selection.
     * @param {Object} task - Task object to render
     */
    renderTask(task) {
        try {
            const taskElement = this.taskRenderer.createTaskElement(task);
            const details = taskElement.querySelector('.details');
            const projectSelect = document.createElement('select');
            projectSelect.className = 'select select-bordered w-full';
            projectSelect.innerHTML = this.projectManager.getProjects().map(project => `
                <option value="${project.id}" ${project.id === task.projectId ? 'selected' : ''}>${project.name}</option>
            `).join('');
            details.insertBefore(projectSelect, details.querySelector('.flex'));
            
            this.taskActions.attachActions(taskElement, task, this);
            this.container.appendChild(taskElement);
        } catch (error) {
            console.error('Error rendering task:', error);
        }
    }
}