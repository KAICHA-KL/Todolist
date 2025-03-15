// projectUIManager.js
export class ProjectUIManager {
    constructor(projectManager, todoDom) {
        this.projectManager = projectManager;
        this.todoDom = todoDom;
    }

    setupProjectButtons() {
        document.querySelectorAll('.navbar .menu li a:not(.btn)').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.navbar .menu li a:not(.btn)').forEach(l => l.classList.remove('bg-gray-700', 'text-white'));
                link.classList.add('bg-gray-700', 'text-white');
                if (link.dataset.project === 'all') {
                    this.projectManager.setCurrentProjectId(null);
                } else {
                    const projectName = e.target.textContent;
                    const project = this.projectManager.getProjects().find(p => p.name === projectName);
                    if (project) {
                        this.projectManager.setCurrentProjectId(project.id);
                    }
                }
                this.todoDom.renderTasks();
            });
        });

        const addProjectBtns = document.querySelectorAll('.navbar .menu .btn.add-project-btn');
        addProjectBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('project-modal').checked = true;
            });
        });
    }

    updateProjectList() {
        const projectMenus = document.querySelectorAll('.navbar .menu details ul');
        const projectSelect = document.querySelector('#task-form select[name="projectId"]');
        const projects = this.projectManager.getProjects();

        const projectHTML = `
            <li><a data-project="all">All Projects</a></li>
            ${projects.map(project => `
                <li><a data-project-id="${project.id}">${project.name}</a></li>
            `).join('')}
        `;

        const selectHTML = projects.map(project => `
            <option value="${project.id}" ${project.id === this.projectManager.getCurrentProjectId() ? 'selected' : ''}>${project.name}</option>
        `).join('');

        projectMenus.forEach(menu => menu.innerHTML = projectHTML);
        if (projectSelect) projectSelect.innerHTML = selectHTML;

        this.setupProjectButtons();
    }

    addProjectSelectToTask(taskElement, task) {
        const details = taskElement.querySelector('.details');
        const projectSelect = document.createElement('select');
        projectSelect.className = 'select select-bordered w-full project-select';
        projectSelect.innerHTML = this.projectManager.getProjects().map(project => `
            <option value="${project.id}" ${project.id === task.projectId ? 'selected' : ''}>${project.name}</option>
        `).join('');
        details.insertBefore(projectSelect, details.querySelector('.flex'));
    }

    setInitialProjectActiveClass() {
        const currentProjectId = this.projectManager.getCurrentProjectId();
        document.querySelectorAll('.navbar .menu li a:not(.btn)').forEach(link => {
            link.classList.remove('bg-gray-700', 'text-white');
            if (currentProjectId === null && link.dataset.project === 'all') {
                link.classList.add('bg-gray-700', 'text-white');
            } else if (link.dataset.projectId == currentProjectId) {
                link.classList.add('bg-gray-700', 'text-white');
            }
        });
    }
}