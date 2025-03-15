// taskFilters.js
import { isToday, isPast, parseISO } from 'date-fns';

export class TaskFilters {
  static filterToday(tasks) {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return isToday(parseISO(task.dueDate));
    });
  }

  static filterCompleted(tasks) {
    return tasks.filter(task => task.completed);
  }

  static filterOverdue(tasks) {
    return tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      return isPast(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate));
    });
  }

  static filterAll(tasks) {
    return tasks; // Return all tasks unfiltered
  }

  static filterActive(tasks) {
    return tasks.filter(task => !task.completed); // Show only incomplete tasks
  }
}