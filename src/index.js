// index.js
import './output.css';
import { TodoDom } from './todoDom.js';
import { ProjectManager } from './projectManager.js';

/**
 * Initializes the Todo application when the DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    const projectManager = new ProjectManager();
    new TodoDom(projectManager);
});