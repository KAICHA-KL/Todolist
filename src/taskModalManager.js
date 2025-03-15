// taskModalManager.js
import { Task } from './taskModel.js';

export class TaskModalManager {
    constructor(todoDom) {
        this.todoDom = todoDom;
    }

    renderModals() {
        const modalsContainer = document.createElement('div');
        modalsContainer.innerHTML = this.getModalHTML();
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

    getModalHTML() {
        return `
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
                                ${this.getProjectOptionsHTML()}
                            </select>
                        </div>
                        <div class="modal-action">
                            <button type="submit" class="btn btn-primary">Add Task</button>
                            <label for="task-modal" class="btn">Cancel</label>
                        </div>
                    </form>
                </div>
            </div>

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
    }

    getProjectOptionsHTML() {
        const projectManager = this.todoDom.projectManager;
        return projectManager.getProjects().map(project => `
            <option value="${project.id}" ${project.id === projectManager.getCurrentProjectId() ? 'selected' : ''}>${project.name}</option>
        `).join('');
    }

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
            parseInt(form.projectId.value) || this.todoDom.projectManager.getCurrentProjectId()
        );

        this.todoDom.addTask(task);
        form.reset();
        document.getElementById('task-modal').checked = false;
    }

    handleAddProject(e) {
        e.preventDefault();
        const form = e.target;
        const projectName = form.projectName.value.trim();
        if (!projectName) return;

        const projectManager = this.todoDom.projectManager;
        const newProject = projectManager.addProject(projectName);
        
        if (newProject) {
            this.todoDom.updateProjectList();
            projectManager.setCurrentProjectId(newProject.id);
            this.todoDom.updateActiveClasses(); // Ensure new project is darkened
            this.todoDom.renderTasks();
        }

        form.reset();
        document.getElementById('project-modal').checked = false;
    }
}