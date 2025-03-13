// todoDom.js
import './output.css';
import { TaskRenderer } from './taskRenderer.js';
import { TaskActions } from './taskActions.js';
import { Task } from './taskModel.js';
import { TaskFilters } from './taskFilters.js';

export class TodoDom {
  constructor() {
    this.container = document.getElementById('todo-container');
    this.taskRenderer = new TaskRenderer();
    this.taskActions = new TaskActions();
    this.currentFilter = TaskFilters.filterAll;
    // Load tasks from localStorage or initialize empty array
    this.tasks = this.loadFromLocalStorage() || [];
    this.init();
  }

  init() {
    this.setupAddTaskButton();
    this.setupFilterButtons();
    this.renderModal();
    this.renderTasks();
  }

  // Save tasks to localStorage
  saveToLocalStorage() {
    localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
  }

  // Load tasks from localStorage
  loadFromLocalStorage() {
    const storedTasks = localStorage.getItem('todoTasks');
    if (storedTasks) {
      // Convert JSON back to Task objects
      const taskData = JSON.parse(storedTasks);
      return taskData.map(task => 
        new Task(
          task.id,
          task.name,
          task.completed,
          task.description,
          task.dueDate,
          task.priority
        )
      );
    }
    return null;
  }

  setupAddTaskButton() {
    const addTaskBtn = document.querySelector('.navbar-end .btn');
    addTaskBtn.addEventListener('click', () => this.showModal());
  }

  setupFilterButtons() {
    const filterLinks = document.querySelectorAll('.navbar a:not(.btn)');
    filterLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const filterType = e.target.textContent.toLowerCase();
        this.setFilter(filterType);
        this.renderTasks();
      });
    });
  }

  setFilter(filterType) {
    switch (filterType) {
      case 'today':
        this.currentFilter = TaskFilters.filterToday;
        break;
      case 'completed':
        this.currentFilter = TaskFilters.filterCompleted;
        break;
      case 'overdue':
        this.currentFilter = TaskFilters.filterOverdue;
        break;
      default:
        this.currentFilter = TaskFilters.filterAll;
    }
  }

  renderModal() {
    const modal = document.createElement('div');
    modal.innerHTML = `
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
            <div class="modal-action">
              <button type="submit" class="btn btn-primary">Add Task</button>
              <label for="task-modal" class="btn">Cancel</label>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const form = modal.querySelector('#task-form');
    form.addEventListener('submit', (e) => this.handleAddTask(e));
  }

  showModal() {
    const modalToggle = document.getElementById('task-modal');
    modalToggle.checked = true;
  }

  handleAddTask(e) {
    e.preventDefault();
    const form = e.target;
    const task = new Task(
      Date.now(),
      form.name.value,
      false,
      form.description.value,
      form.dueDate.value,
      form.priority.value
    );

    this.tasks.push(task);
    this.saveToLocalStorage(); // Save after adding new task
    this.renderTasks();

    form.reset();
    document.getElementById('task-modal').checked = false;
  }

  renderTasks() {
    this.container.innerHTML = '';
    const filteredTasks = this.currentFilter(this.tasks);
    filteredTasks.forEach(task => this.renderTask(task));
  }

  renderTask(task) {
    const taskElement = this.taskRenderer.createTaskElement(task);
    this.addTaskEventListeners(task, taskElement);
    this.container.appendChild(taskElement);
  }

  addTaskEventListeners(task, taskElement) {
    taskElement.querySelector('.task-checkbox')
      .addEventListener('change', () => {
        this.taskActions.toggleTaskCompletion(task, taskElement);
        this.saveToLocalStorage(); // Save after toggling completion
        this.renderTasks();
      });

    taskElement.querySelector('.more-btn')
      .addEventListener('click', () => this.taskActions.toggleTaskDetails(taskElement));

    taskElement.querySelector('.delete-btn')
      .addEventListener('click', () => {
        this.taskActions.deleteTask(task.id, taskElement, this.tasks);
        this.saveToLocalStorage(); // Save after deletion
        this.renderTasks();
      });

    taskElement.querySelector('.edit-btn')
      .addEventListener('click', () => {
        this.taskActions.editTask(task, taskElement);
        this.saveToLocalStorage(); // Save after editing
        this.renderTasks();
      });
  }
}