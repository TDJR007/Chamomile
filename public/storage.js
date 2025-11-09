// public/storage.js

/**
 * Load tasks from backend API
 */
async function loadTasks() {
  try {
    const tasks = await API.getTasks();
    
    // Clear existing tasks
    document.querySelectorAll('.task').forEach(task => task.remove());
    
    // Render tasks in their lanes
    tasks.forEach(task => {
      const taskElement = createTaskElement(task);
      
      // Map backend status to lane IDs
      const laneId = `${task.status}-lane`;
      const lane = document.getElementById(laneId);
      
      if (lane) {
        lane.appendChild(taskElement);
      }
    });
    
    console.log(`✅ Loaded ${tasks.length} tasks`);
  } catch (error) {
    console.error('Failed to load tasks:', error);
    alert('Failed to load tasks. Please refresh the page.');
  }
}

/**
 * Save task to backend (not used anymore, kept for compatibility)
 */
function saveTasks() {
  // No-op: we now save on every action (create/update/delete)
  console.log('Tasks synced with backend');
}