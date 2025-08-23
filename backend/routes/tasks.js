const express = require('express');
const router = express.Router();

// In-memory storage (replace with database in production)
let tasks = [
    { id: 1, text: 'Welcome to your DevOps Task Manager!', completed: false, createdAt: new Date() },
    { id: 2, text: 'This app demonstrates CI/CD pipeline', completed: false, createdAt: new Date() },
    { id: 3, text: 'Try adding, completing, and deleting tasks', completed: true, createdAt: new Date() }
];

let nextId = 4;

// GET /api/tasks - Get all tasks
router.get('/', (req, res) => {
    res.json(tasks);
});

// GET /api/tasks/:id - Get specific task
router.get('/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
});

// POST /api/tasks - Create new task
router.post('/', (req, res) => {
    const { text } = req.body;
    
    if (!text || text.trim() === '') {
        return res.status(400).json({ error: 'Task text is required' });
    }
    
    const newTask = {
        id: nextId++,
        text: text.trim(),
        completed: false,
        createdAt: new Date()
    };
    
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// PUT /api/tasks/:id - Update task
router.put('/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    const { text, completed } = req.body;
    
    if (text !== undefined) {
        tasks[taskIndex].text = text.trim();
    }
    
    if (completed !== undefined) {
        tasks[taskIndex].completed = completed;
    }
    
    tasks[taskIndex].updatedAt = new Date();
    res.json(tasks[taskIndex]);
});

// PUT /api/tasks/:id/toggle - Toggle task completion
router.put('/:id/toggle', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    tasks[taskIndex].updatedAt = new Date();
    
    res.json(tasks[taskIndex]);
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    const deletedTask = tasks.splice(taskIndex, 1)[0];
    res.json(deletedTask);
});

// DELETE /api/tasks - Delete all tasks
router.delete('/', (req, res) => {
    const deletedCount = tasks.length;
    tasks = [];
    nextId = 1;
    
    res.json({
        message: `Deleted ${deletedCount} tasks`,
        deletedCount
    });
});

module.exports = router;