// public/api.js

const API_BASE = '/api';

/**
 * Get auth token from localStorage
 */
function getAuthToken() {
    return localStorage.getItem('token');
}

/**
 * Make authenticated API request
 */
async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });
    
    // Handle unauthorized (token expired or invalid)
    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth.html';
        throw new Error('Session expired');
    }
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error || 'Request failed');
    }
    
    return data;
}

/**
 * API Methods
 */
const API = {
    // Get all tasks
    async getTasks() {
        const data = await apiRequest('/todos');
        return data.tasks;
    },
    
    // Create task
    async createTask(title, description = '') {
        const data = await apiRequest('/todos', {
            method: 'POST',
            body: JSON.stringify({ title, description }),
        });
        return data.task;
    },
    
    // Update task
    async updateTask(taskId, updates) {
        const data = await apiRequest(`/todos/${taskId}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
        return data.task;
    },
    
    // Delete task
    async deleteTask(taskId) {
        await apiRequest(`/todos/${taskId}`, {
            method: 'DELETE',
        });
    },
};