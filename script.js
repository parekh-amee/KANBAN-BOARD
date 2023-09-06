// DOM elements
const todoTasksList = document.getElementById('todo-tasks');
const doingTasksList = document.getElementById('doing-tasks');
const doneTasksList = document.getElementById('done-tasks');
const taskForm = document.getElementById('taskForm');
const addTaskModal = document.getElementById('addTaskModal');
const closeModalButton = document.getElementById('closeModal');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');

// Event listeners
taskForm.addEventListener('submit', addTask);
closeModalButton.addEventListener('click', closeAddTaskModal);

// Load tasks when the page loads
document.addEventListener('DOMContentLoaded', loadTasks);

// Load tasks from the backend
function loadTasks() {
  fetch('tasks.php')
    .then(response => response.json())
    .then(tasks => {
      // Clear existing task lists
      todoTasksList.innerHTML = '';
      doingTasksList.innerHTML = '';
      doneTasksList.innerHTML = '';

      // Display tasks in their respective columns
      tasks.forEach(task => {
        const taskCard = createTaskCard(task);
        if (task.status === 'To Do') {
          todoTasksList.appendChild(taskCard);
        } else if (task.status === 'Doing') {
          doingTasksList.appendChild(taskCard);
        } else if (task.status === 'Done') {
          doneTasksList.appendChild(taskCard);
        }
      });
    });
}

// Create a task card element
function createTaskCard(task) {
  const card = document.createElement('div');
  card.className = 'task-card';
  card.draggable = true;
  card.dataset.taskId = task.id;
  card.innerHTML = `
    <h3>${task.title}</h3>
    <p>${task.description}</p>
    <div class="buttons">
      <button class="edit-button" onclick="editTask('${task.id}')">Edit</button>
      <button class="delete-button" onclick="deleteTask('${task.id}')">Delete</button>
    </div>
  `;
  card.addEventListener('dragstart', dragStart);
  return card;
}

// Add a new task
function addTask(event) {
  event.preventDefault();

  const title = titleInput.value;
  const description = descriptionInput.value;

  fetch('tasks.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description }),
  })
    .then(response => response.json())
    .then(newTask => {
      const taskCard = createTaskCard(newTask);
      todoTasksList.appendChild(taskCard);
      closeAddTaskModal();
    });

  // Clear the form inputs
  titleInput.value = '';
  descriptionInput.value = '';
}

// Edit an existing task
function editTask(taskId) {
  // Implement editing logic here
}

// Delete an existing task
function deleteTask(taskId) {
  // Implement deletion logic here
}

// Drag-and-drop functionality
let draggedTaskId = null;

function dragStart(event) {
  draggedTaskId = event.target.dataset.taskId;
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event, status) {
  event.preventDefault();

  const taskCard = document.querySelector(`[data-task-id="${draggedTaskId}"]`);
  taskCard.style.opacity = '1';

  // Update the task status on the backend
  fetch(`tasks.php?id=${draggedTaskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })
    .then(response => response.json())
    .then(() => {
      // Move the task card to the new column
      if (status === 'To Do') {
        todoTasksList.appendChild(taskCard);
      } else if (status === 'Doing') {
        doingTasksList.appendChild(taskCard);
      } else if (status === 'Done') {
        doneTasksList.appendChild(taskCard);
      }
    });
}

// Show/hide the add task modal
function openAddTaskModal() {
  addTaskModal.style.display = 'block';
}

function closeAddTaskModal() {
  addTaskModal.style.display = 'none';
}

// Close the modal if the user clicks outside of it
window.addEventListener('click', event => {
  if (event.target === addTaskModal) {
    closeAddTaskModal();
  }
});
