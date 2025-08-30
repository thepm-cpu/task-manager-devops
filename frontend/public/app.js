const API_BASE = '/api';
let tasks = [];

// Detect environment and update UI
function detectEnvironment() {
    const hostname = window.location.hostname;
    let env = 'production';
    
    if (hostname.includes('dev') || hostname.includes('localhost')) {
        env = 'dev';
    } else if (hostname.includes('staging')) {
        env = 'staging';
    }
    
    const envIndicator = document.getElementById('envIndicator');
    const envName = document.getElementById('envName');
    
    envName.textContent = env.toUpperCase();
    envIndicator.className = `env-indicator env-${env}`;
}

// Load tasks from API
async function loadTasks() {
    try {
        const response = await fetch(`${API_BASE}/tasks`);
        if (response.ok) {
            tasks = await response.json();
            renderTasks();
            updateStats();
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

// Add new task
async function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    
    if (!taskText) return;
    
    try {
        const response = await fetch(`${API_BASE}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: taskText })
        });
        
        if (response.ok) {
            const newTask = await response.json();
            tasks.push(newTask);
            taskInput.value = '';
            renderTasks();
            updateStats();
        }
    } catch (error) {
        console.error('Error adding task:', error);
    }
}

// Toggle task completion
async function toggleTask(taskId) {
    try {
        const response = await fetch(`${API_BASE}/tasks/${taskId}/toggle`, {
            method: 'PUT'
        });
        
        if (response.ok) {
            const updatedTask = await response.json();
            const taskIndex = tasks.findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
                tasks[taskIndex] = updatedTask;
                renderTasks();
                updateStats();
            }
        }
    } catch (error) {
        console.error('Error toggling task:', error);
    }
}

// Delete task
async function deleteTask(taskId) {
    try {
        const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            tasks = tasks.filter(t => t.id !== taskId);
            renderTasks();
            updateStats();
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// Render tasks in UI
function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <span>${task.text}</span>
            <div class="task-actions">
                <button class="btn-small btn-complete" onclick="toggleTask(${task.id})">
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="btn-small btn-delete" onclick="deleteTask(${task.id})">
                    Delete
                </button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// Update statistics
function updateStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
}

// Handle Enter key in input
document.addEventListener('DOMContentLoaded', function() {
    detectEnvironment();
    loadTasks();
    
    document.getElementById('taskInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});