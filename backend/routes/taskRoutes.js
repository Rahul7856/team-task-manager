const express = require('express');
const { body } = require('express-validator');
const taskController = require('../controllers/taskController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const taskValidation = [
  body('title').trim().isLength({ min: 2 }).withMessage('Task title must be at least 2 characters'),
  body('description').optional().trim(),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
];

const updateValidation = [
  body('title').optional().trim().isLength({ min: 2 }).withMessage('Task title must be at least 2 characters'),
  body('status').optional().isIn(['todo', 'in_progress', 'completed']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
];

router.use(authenticateToken);

// Task routes
router.post('/projects/:projectId/tasks', taskValidation, taskController.createTask);
router.get('/projects/:projectId/tasks', taskController.getProjectTasks);
router.patch('/projects/:projectId/tasks/:taskId', updateValidation, taskController.updateTask);
router.delete('/projects/:projectId/tasks/:taskId', taskController.deleteTask);

// Dashboard route
router.get('/dashboard/stats', taskController.getDashboardStats);

module.exports = router;
