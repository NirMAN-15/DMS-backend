/**
 * routes/userRoutes.js
 * User API — mounted at /api/users in index.js
 *
 * Endpoints:
 *   GET /api/users      — Admin only, list all users
 *   GET /api/users/:id  — Admin only, get a single user
 */

const express = require('express');
const router = express.Router();

const { getUsers, getUser } = require('../controllers/userController');
const verifyToken = require('../middlewares/verifyToken');
const authorizeRoles = require('../middlewares/authorizeRoles');

// All user routes require admin access
router.use(verifyToken, authorizeRoles('admin'));

router.get('/', getUsers);
router.get('/:id', getUser);

module.exports = router;
