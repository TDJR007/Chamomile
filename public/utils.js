// public/utils.js

/**
 * Create task element from backend task object
 */
function createTaskElement(task) {
  const taskEl = document.createElement("p");
  taskEl.classList.add("task");
  taskEl.setAttribute("draggable", "true");
  taskEl.innerText = task.title;
  
  // Store task data for later use
  taskEl.dataset.taskId = task.id;
  taskEl.dataset.status = task.status;

  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "✖";
  deleteBtn.classList.add("delete-btn");
  
  deleteBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    
    try {
      await API.deleteTask(task.id);
      taskEl.remove();
      console.log(`✅ Deleted task: ${task.id}`);
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task');
    }
  });

  taskEl.appendChild(deleteBtn);
  taskEl.dataset.hasDeleteBtn = "true";

  return taskEl;
}