/**
 * controllers/orderController.js
 * Business logic for the /api/orders route.
 *
 * Access rules:
 *   GET    /api/orders         — any authenticated user
 *   GET    /api/orders/:id     — any authenticated user
 *   POST   /api/orders         — any authenticated user (sales reps create orders)
 *   PATCH  /api/orders/:id     — admin only (update status)
 *   DELETE /api/orders/:id     — admin only
 */

const {
    getAllOrders,
    getOrderById,
    getOrderItems,
    createOrder,
    createOrderItems,
    updateOrderStatus,
    deleteOrder,
} = require('../models/orderModel');

const getOrders = async (req, res) => {
    try {
        const { data, error } = await getAllOrders();
        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        return res.status(200).json({ success: true, count: data.length, data });
    } catch (err) {
        console.error('[orderController] getOrders error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

const getOrder = async (req, res) => {
    try {
        const { data: order, error } = await getOrderById(req.params.id);
        if (error || !order) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        // Also fetch order items
        const { data: items, error: itemsError } = await getOrderItems(req.params.id);
        if (itemsError) {
            return res.status(500).json({ success: false, message: itemsError.message });
        }

        return res.status(200).json({ success: true, data: { ...order, items } });
    } catch (err) {
        console.error('[orderController] getOrder error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

/**
 * Create an order with items.
 * Body: { shop_id, items: [{ product_id, quantity, unit_price }] }
 */
const addOrder = async (req, res) => {
    const { shop_id, items } = req.body;

    if (!shop_id || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'shop_id and items array are required.',
        });
    }

    try {
        // Calculate total amount from items
        const total_amount = items.reduce((sum, item) => {
            return sum + (Number(item.quantity) * Number(item.unit_price));
        }, 0);

        // Create the order header
        const orderData = {
            shop_id,
            sales_rep_id: req.user.id, // from JWT token
            total_amount,
            status: 'pending',
        };

        const { data: order, error: orderError } = await createOrder(orderData);
        if (orderError) {
            return res.status(400).json({ success: false, message: orderError.message });
        }

        // Create order items linked to the order
        const orderItems = items.map((item) => ({
            order_id: order.id,
            product_id: item.product_id,
            quantity: Number(item.quantity),
            unit_price: Number(item.unit_price),
        }));

        const { data: createdItems, error: itemsError } = await createOrderItems(orderItems);
        if (itemsError) {
            return res.status(400).json({ success: false, message: itemsError.message });
        }

        return res.status(201).json({
            success: true,
            message: 'Order created successfully.',
            data: { ...order, items: createdItems },
        });
    } catch (err) {
        console.error('[orderController] addOrder error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

const patchOrderStatus = async (req, res) => {
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ success: false, message: 'status is required.' });
    }

    const validStatuses = ['pending', 'confirmed', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        });
    }

    try {
        const { data, error } = await updateOrderStatus(req.params.id, status);
        if (error || !data) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }
        return res.status(200).json({ success: true, message: 'Order status updated.', data });
    } catch (err) {
        console.error('[orderController] patchOrderStatus error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

const removeOrder = async (req, res) => {
    try {
        const { error } = await deleteOrder(req.params.id);
        if (error) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }
        return res.status(200).json({ success: true, message: 'Order deleted successfully.' });
    } catch (err) {
        console.error('[orderController] removeOrder error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = { getOrders, getOrder, addOrder, patchOrderStatus, removeOrder };
