// projectManager.js

/**
 * Manages project data, including storage and retrieval from localStorage.
 */
export class ProjectManager {
    constructor() {
        // Load projects or initialize with a default project
        this.projects = this.loadProjectsFromLocalStorage() || [
            { id: 1, name: "Project 1" }
        ];
        this.currentProjectId = 1; // Default to first project
    }

    /**
     * Loads projects from localStorage.
     * @returns {Array|null} Array of projects or null if loading fails
     */
    loadProjectsFromLocalStorage() {
        try {
            const storedProjects = localStorage.getItem('todoProjects');
            return storedProjects ? JSON.parse(storedProjects) : null;
        } catch (error) {
            console.error('Error loading projects from localStorage:', error);
            return null;
        }
    }

    /**
     * Saves projects to localStorage.
     */
    saveProjectsToLocalStorage() {
        try {
            localStorage.setItem('todoProjects', JSON.stringify(this.projects));
        } catch (error) {
            console.error('Error saving projects to localStorage:', error);
        }
    }

    /**
     * Adds a new project and saves it.
     * @param {string} projectName - Name of the new project
     * @returns {Object|null} New project object or null if invalid
     */
    addProject(projectName) {
        if (!projectName || !projectName.trim()) return null;
        const newProject = {
            id: Date.now(),
            name: projectName.trim()
        };
        this.projects.push(newProject);
        this.saveProjectsToLocalStorage();
        return newProject;
    }

    /**
     * Edits an existing project's name
     * @param {number} projectId - ID of the project to edit
     * @param {string} newName - New name for the project
     * @returns {Object|null} Updated project object or null if invalid
     */
    editProject(projectId, newName) {
        if (!newName || !newName.trim()) return null;
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return null;
        
        project.name = newName.trim();
        this.saveProjectsToLocalStorage();
        return project;
    }

    /**
     * Gets the list of projects.
     * @returns {Array} Array of project objects
     */
    getProjects() {
        return this.projects;
    }

    /**
     * Sets the current project ID.
     * @param {number} projectId - ID of the project to set as current
     */
    setCurrentProjectId(projectId) {
        this.currentProjectId = projectId;
    }

    /**
     * Gets the current project ID.
     * @returns {number} Current project ID
     */
    getCurrentProjectId() {
        return this.currentProjectId;
    }
}