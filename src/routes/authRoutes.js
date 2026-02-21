/**
 * routes/authRoutes.js
 * Authentication routes:
 *   POST /api/auth/login    - Public
 *   POST /api/auth/register - Private (admin only)
 */

const express = require('express');
const router = express.Router();

const { login, register } = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');
const authorizeRoles = require('../middlewares/authorizeRoles');

// Public route - anyone can attempt login
router.post('/login', login);

// Protected route - only admins can register new sales reps
router.post('/register', verifyToken, authorizeRoles('admin'), register);

module.exports = router;
