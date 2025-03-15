// taskModel.js
export class Task {
    constructor(id, name, completed, description, dueDate, priority, projectId) {
        this.id = id;
        this.name = name;
        this.completed = completed;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.projectId = projectId || 1; // Default to project 1 if not specified
    }
}