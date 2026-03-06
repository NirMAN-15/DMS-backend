/**
 * routes/shopRoutes.js
 * Shop API — mounted at /api/shops in index.js
 *
 * Endpoints:
 *   GET    /api/shops       — Any logged-in user
 *   GET    /api/shops/:id   — Any logged-in user
 *   POST   /api/shops       — Admin only
 *   PUT    /api/shops/:id   — Admin only
 *   DELETE /api/shops/:id   — Admin only
 */

const express = require('express');
const router = express.Router();

const {
    getShops,
    getShop,
    addShop,
    editShop,
    removeShop,
} = require('../controllers/shopController');

const verifyToken = require('../middlewares/verifyToken');
const authorizeRoles = require('../middlewares/authorizeRoles');

// All shop routes require a valid JWT
router.use(verifyToken);

// ── READ — available to all authenticated users ───────────────────────────
router.get('/', getShops);
router.get('/:id', getShop);

// ── WRITE — admin only ────────────────────────────────────────────────────
router.post('/', authorizeRoles('admin'), addShop);
router.put('/:id', authorizeRoles('admin'), editShop);
router.delete('/:id', authorizeRoles('admin'), removeShop);

module.exports = router;
