const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        environment: NODE_ENV,
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Root endpoint
app.get('/api', (req, res) => {
    res.json({
        message: 'Task Manager API',
        version: '1.0.0',
        environment: NODE_ENV
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found'
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
});