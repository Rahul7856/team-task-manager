const express = require('express');
const { body } = require('express-validator');
const projectController = require('../controllers/projectController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const projectValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Project name must be at least 2 characters'),
  body('description').optional().trim(),
];

const memberValidation = [
  body('userId').isInt().withMessage('Invalid user ID'),
  body('role').optional().isIn(['admin', 'member']).withMessage('Invalid role'),
];

router.use(authenticateToken);

// Project routes
router.post('/', projectValidation, projectController.createProject);
router.get('/', projectController.getUserProjects);
router.get('/:projectId', projectController.getProjectDetails);
router.patch('/:projectId', projectValidation, projectController.updateProject);

// Member management
router.post('/:projectId/members', memberValidation, projectController.addMember);
router.delete('/:projectId/members/:memberId', projectController.removeMember);

module.exports = router;
