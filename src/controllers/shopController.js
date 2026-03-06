/**
 * controllers/shopController.js
 * CRUD business logic for the /api/shops route.
 *
 * Access rules (enforced at route level):
 *   GET    /api/shops       — any authenticated user
 *   GET    /api/shops/:id   — any authenticated user
 *   POST   /api/shops       — admin only
 *   PUT    /api/shops/:id   — admin only
 *   DELETE /api/shops/:id   — admin only
 */

const {
    getAllShops,
    getShopById,
    createShop,
    updateShop,
    deleteShop,
} = require('../models/shopModel');

const getShops = async (req, res) => {
    try {
        const { data, error } = await getAllShops();
        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        return res.status(200).json({ success: true, count: data.length, data });
    } catch (err) {
        console.error('[shopController] getShops error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

const getShop = async (req, res) => {
    try {
        const { data, error } = await getShopById(req.params.id);
        if (error || !data) {
            return res.status(404).json({ success: false, message: 'Shop not found.' });
        }
        return res.status(200).json({ success: true, data });
    } catch (err) {
        console.error('[shopController] getShop error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

const addShop = async (req, res) => {
    const { name, address, phone, credit_limit = 0, gps_lat, gps_lng } = req.body;

    if (!name || !address) {
        return res.status(400).json({
            success: false,
            message: 'name and address are required fields.',
        });
    }

    try {
        const shopData = {
            name: name.trim(),
            address: address.trim(),
            phone: phone ? phone.trim() : null,
            credit_limit: Number(credit_limit) || 0,
            gps_lat: gps_lat || null,
            gps_lng: gps_lng || null,
        };

        const { data, error } = await createShop(shopData);

        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        return res.status(201).json({
            success: true,
            message: `Shop '${data.name}' added successfully.`,
            data,
        });
    } catch (err) {
        console.error('[shopController] addShop error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

const editShop = async (req, res) => {
    const { name, address, phone, credit_limit, gps_lat, gps_lng } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = name.trim();
    if (address !== undefined) updates.address = address.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (credit_limit !== undefined) updates.credit_limit = Number(credit_limit);
    if (gps_lat !== undefined) updates.gps_lat = gps_lat;
    if (gps_lng !== undefined) updates.gps_lng = gps_lng;

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ success: false, message: 'No valid fields provided for update.' });
    }

    try {
        const { data, error } = await updateShop(req.params.id, updates);
        if (error || !data) {
            return res.status(404).json({ success: false, message: 'Shop not found or update failed.' });
        }
        return res.status(200).json({ success: true, message: 'Shop updated successfully.', data });
    } catch (err) {
        console.error('[shopController] editShop error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

const removeShop = async (req, res) => {
    try {
        const { error } = await deleteShop(req.params.id);
        if (error) {
            return res.status(404).json({ success: false, message: 'Shop not found.' });
        }
        return res.status(200).json({ success: true, message: 'Shop deleted successfully.' });
    } catch (err) {
        console.error('[shopController] removeShop error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = { getShops, getShop, addShop, editShop, removeShop };
