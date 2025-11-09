// public/drag.js

let draggedTask = null; // Currently dragged task reference

/**
 * Initialize drag and drop functionality for all .task elements.
 */
function initializeDragAndDelete() {
  const tasks = document.querySelectorAll(".task");
  
  tasks.forEach((task) => {
    // Skip if already initialized
    if (task.hasAttribute('data-drag-initialized')) return;
    
    task.setAttribute('data-drag-initialized', 'true');
    task.setAttribute("draggable", "true");
    
    // When dragging starts
    task.addEventListener("dragstart", (e) => {
      draggedTask = task;
      task.classList.add("is-dragging");
      e.dataTransfer.setData('text/plain', task.dataset.taskId);
    });
    
    // When dragging ends
    task.addEventListener("dragend", () => {
      task.classList.remove("is-dragging");
      draggedTask = null;
    });
  });
}

/**
 * Set up drop zones for each swim lane
 */
const lanes = document.querySelectorAll(".swim-lane");

lanes.forEach((lane) => {
  // Allow drop
  lane.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  
  // Handle drop
  lane.addEventListener("drop", async (e) => {
    e.preventDefault();
    
    // If no task is being dragged, stop
    if (!draggedTask) return;
    
    // Keep a stable reference before resetting draggedTask
    const taskToMove = draggedTask;
    draggedTask = null;

    const taskId = parseInt(taskToMove.dataset.taskId);
    const newStatus = lane.id.replace('-lane', '');
    const oldStatus = taskToMove.dataset.status;
    
    // Clean up drag style
    taskToMove.classList.remove("is-dragging");
    
    // If dropped in same lane, just reinsert it
    if (oldStatus === newStatus) {
      lane.appendChild(taskToMove);
      return;
    }

    try {
      // Update backend
      await API.updateTask(taskId, { status: newStatus });

      // Reflect new status in DOM
      taskToMove.dataset.status = newStatus;
      lane.appendChild(taskToMove);
    } catch (error) {
      console.error('Failed to update task status:', error);
      alert('Failed to move task');
    }
  });
});

/**
 * Automatically initialize drag behavior for new tasks added to the DOM.
 */
const observer = new MutationObserver(initializeDragAndDelete);
observer.observe(document.querySelector(".lanes"), {
  childList: true,
  subtree: true,
});

// Initial setup
initializeDragAndDelete();
