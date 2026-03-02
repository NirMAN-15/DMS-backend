/**
 * routes/productRoutes.js
 * Product API — mounted at /api/products in index.js
 *
 * Endpoints:
 *   GET    /api/products       — Any logged-in user (admin + sales_rep)
 *   GET    /api/products/:id   — Any logged-in user
 *   POST   /api/products       — Admin only
 *   PUT    /api/products/:id   — Admin only
 *   DELETE /api/products/:id   — Admin only
 */

const express = require('express');
const router = express.Router();

const {
    getProducts,
    getProduct,
    addProduct,
    editProduct,
    removeProduct,
} = require('../controllers/productController');

const verifyToken = require('../middlewares/verifyToken');
const authorizeRoles = require('../middlewares/authorizeRoles');

// All product routes require a valid JWT
router.use(verifyToken);

// ── READ — available to both admin and sales_rep ──────────────────────────
router.get('/', getProducts);   // GET  /api/products
router.get('/:id', getProduct);   // GET  /api/products/:id

// ── WRITE — admin only ────────────────────────────────────────────────────
router.post('/', authorizeRoles('admin'), addProduct);    // POST   /api/products
router.put('/:id', authorizeRoles('admin'), editProduct);   // PUT    /api/products/:id
router.delete('/:id', authorizeRoles('admin'), removeProduct); // DELETE /api/products/:id

module.exports = router;
