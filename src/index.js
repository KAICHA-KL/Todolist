// Import CSS files

import './output.css';

// index.js
import { TodoDom } from './todoDom.js';

// Create an instance of TodoDom when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new TodoDom();
});