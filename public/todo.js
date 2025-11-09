// public/todo.js

const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoLane = document.getElementById("todo-lane");

todoForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const value = todoInput.value.trim();
  if (!value) return;
  
  const submitBtn = todoForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Adding...';
  
  try {
    // Create task via API
    const newTask = await API.createTask(value);
    
    // Create and append task element
    const taskElement = createTaskElement(newTask);
    todoLane.appendChild(taskElement);
    
    // Clear input
    todoInput.value = "";
    
    console.log(`✅ Created task: ${newTask.id}`);
  } catch (error) {
    console.error('Failed to create task:', error);
    alert('Failed to create task');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'ADD';
  }
});