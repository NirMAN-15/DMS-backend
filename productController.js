/**
 * controllers/productController.js
 * CRUD business logic for the /api/products route.
 *
 * Access rules (enforced at route level):
 *   GET    /api/products       — any authenticated user  (admin + sales_rep)
 *   GET    /api/products/:id   — any authenticated user
 *   POST   /api/products       — admin only
 *   PUT    /api/products/:id   — admin only
 *   DELETE /api/products/:id   — admin only
 */

const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../models/productModel');

// ──────────────────────────────────────────────
// GET /api/products
// ──────────────────────────────────────────────
/**
 * @desc   Retrieve all products
 * @route  GET /api/products
 * @access Private (any authenticated user)
 */
const getProducts = async (req, res) => {
    try {
        const { data, error } = await getAllProducts();

        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }

        return res.status(200).json({
            success: true,
            count: data.length,
            data,
        });
    } catch (err) {
        console.error('[productController] getProducts error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ──────────────────────────────────────────────
// GET /api/products/:id
// ──────────────────────────────────────────────
/**
 * @desc   Retrieve a single product by ID
 * @route  GET /api/products/:id
 * @access Private (any authenticated user)
 */
const getProduct = async (req, res) => {
    try {
        const { data, error } = await getProductById(req.params.id);

        if (error || !data) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }

        return res.status(200).json({ success: true, data });
    } catch (err) {
        console.error('[productController] getProduct error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ──────────────────────────────────────────────
// POST /api/products
// ──────────────────────────────────────────────
/**
 * @desc   Add a new product
 * @route  POST /api/products
 * @access Private (admin only)
 */
const addProduct = async (req, res) => {
    const { name, sku, price, stock = 0, image_url } = req.body;

    // Validate required fields
    if (!name || !sku || price === undefined || price === null) {
        return res.status(400).json({
            success: false,
            message: 'name, sku, and price are required fields.',
        });
    }

    if (isNaN(Number(price)) || Number(price) < 0) {
        return res.status(400).json({ success: false, message: 'price must be a non-negative number.' });
    }

    try {
        const productData = {
            name: name.trim(),
            sku: sku.trim().toUpperCase(),
            price: Number(price),
            stock: Number(stock) || 0,
            image_url: image_url || null,
        };

        const { data, error } = await createProduct(productData);

        if (error) {
            // Unique constraint on SKU
            if (error.code === '23505') {
                return res.status(409).json({ success: false, message: `SKU '${sku}' already exists.` });
            }
            return res.status(400).json({ success: false, message: error.message });
        }

        return res.status(201).json({
            success: true,
            message: `Product '${data.name}' added successfully.`,
            data,
        });
    } catch (err) {
        console.error('[productController] addProduct error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ──────────────────────────────────────────────
// PUT /api/products/:id
// ──────────────────────────────────────────────
/**
 * @desc   Update an existing product
 * @route  PUT /api/products/:id
 * @access Private (admin only)
 */
const editProduct = async (req, res) => {
    // Only allow safe fields to be updated (prevents mass-assignment)
    const { name, sku, price, stock, image_url } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = name.trim();
    if (sku !== undefined) updates.sku = sku.trim().toUpperCase();
    if (price !== undefined) updates.price = Number(price);
    if (stock !== undefined) updates.stock = Number(stock);
    if (image_url !== undefined) updates.image_url = image_url;

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ success: false, message: 'No valid fields provided for update.' });
    }

    try {
        const { data, error } = await updateProduct(req.params.id, updates);

        if (error || !data) {
            return res.status(404).json({ success: false, message: 'Product not found or update failed.' });
        }

        return res.status(200).json({
            success: true,
            message: 'Product updated successfully.',
            data,
        });
    } catch (err) {
        console.error('[productController] editProduct error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ──────────────────────────────────────────────
// DELETE /api/products/:id
// ──────────────────────────────────────────────
/**
 * @desc   Delete a product by ID
 * @route  DELETE /api/products/:id
 * @access Private (admin only)
 */
const removeProduct = async (req, res) => {
    try {
        const { error } = await deleteProduct(req.params.id);

        if (error) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }

        return res.status(200).json({ success: true, message: 'Product deleted successfully.' });
    } catch (err) {
        console.error('[productController] removeProduct error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = { getProducts, getProduct, addProduct, editProduct, removeProduct };
