/**
 * routes/dashboardRoutes.js
 * Dashboard API — mounted at /api/dashboard in index.js
 *
 * Endpoints:
 *   GET /api/dashboard/stats — Admin only
 */

const express = require('express');
const router = express.Router();

const { getStats } = require('../controllers/dashboardController');
const verifyToken = require('../middlewares/verifyToken');
const authorizeRoles = require('../middlewares/authorizeRoles');

router.get('/stats', verifyToken, authorizeRoles('admin'), getStats);

module.exports = router;
