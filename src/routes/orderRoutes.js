/**
 * routes/orderRoutes.js
 * Order API — mounted at /api/orders in index.js
 *
 * Endpoints:
 *   GET    /api/orders         — Any logged-in user
 *   GET    /api/orders/:id     — Any logged-in user
 *   POST   /api/orders         — Any logged-in user (sales reps create orders)
 *   PATCH  /api/orders/:id     — Admin only (update status)
 *   DELETE /api/orders/:id     — Admin only
 */

const express = require('express');
const router = express.Router();

const {
    getOrders,
    getOrder,
    addOrder,
    patchOrderStatus,
    removeOrder,
} = require('../controllers/orderController');

const verifyToken = require('../middlewares/verifyToken');
const authorizeRoles = require('../middlewares/authorizeRoles');

// All order routes require a valid JWT
router.use(verifyToken);

// ── READ — available to all authenticated users ───────────────────────────
router.get('/', getOrders);
router.get('/:id', getOrder);

// ── CREATE — any authenticated user can place an order ────────────────────
router.post('/', addOrder);

// ── UPDATE/DELETE — admin only ────────────────────────────────────────────
router.patch('/:id', authorizeRoles('admin'), patchOrderStatus);
router.delete('/:id', authorizeRoles('admin'), removeOrder);

module.exports = router;
