const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Signup validation
const signupValidation = [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').optional().trim(),
  body('lastName').optional().trim(),
];

// Login validation
const loginValidation = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/signup', signupValidation, authController.signup);
router.post('/login', loginValidation, authController.login);
router.get('/me', authenticateToken, authController.getCurrentUser);

module.exports = router;
