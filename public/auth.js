// public/auth.js

const API_BASE = '/api';

// Tab switching
document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        // Update active tab
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update active form
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        document.getElementById(`${targetTab}-form`).classList.add('active');
        
        // Clear messages
        clearMessages();
    });
});

// Set timestamp when signup form is shown (for bot detection)
document.querySelector('[data-tab="signup"]').addEventListener('click', () => {
    document.getElementById('signup-timestamp').value = Date.now();
});

// Initialize timestamp on page load
document.getElementById('signup-timestamp').value = Date.now();

// Login handler
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    const btn = e.target.querySelector('.submit-btn');
    btn.disabled = true;
    btn.textContent = 'Logging in...';
    
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }
        
        // Store token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        showMessage('Login successful! Redirecting...', 'success');
        
        // Redirect to main app
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
        
    } catch (error) {
        showMessage(error.message, 'error');
        btn.disabled = false;
        btn.textContent = 'Login';
    }
});

// Signup handler
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const nickname = document.getElementById('signup-nickname').value; // Honeypot
    const timestamp = parseInt(document.getElementById('signup-timestamp').value);
    
    const btn = e.target.querySelector('.submit-btn');
    btn.disabled = true;
    btn.textContent = 'Creating account...';
    
    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email, 
                password, 
                nickname, // Will be empty for humans, filled for bots
                timestamp 
            }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Signup failed');
        }
        
        showMessage('Account created! Please login.', 'success');
        
        // Switch to login tab
        setTimeout(() => {
            document.querySelector('[data-tab="login"]').click();
            document.getElementById('login-email').value = email;
        }, 1500);
        
    } catch (error) {
        showMessage(error.message, 'error');
        btn.disabled = false;
        btn.textContent = 'Sign Up';
    }
});

// Helper functions
function showMessage(text, type) {
    const container = document.getElementById('message-container');
    const className = type === 'error' ? 'error-message' : 'success-message';
    container.innerHTML = `<div class="${className}">${text}</div>`;
}

function clearMessages() {
    document.getElementById('message-container').innerHTML = '';
}