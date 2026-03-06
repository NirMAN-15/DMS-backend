/**
 * controllers/userController.js
 * Read-only endpoints for managing user records (admin only).
 * Registration is handled by authController.
 */

const supabase = require('../config/db');

/**
 * @desc   Get all users (excluding password_hash)
 * @route  GET /api/users
 * @access Private (admin only)
 */
const getUsers = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id, name, email, role, created_at')
            .order('created_at', { ascending: false });

        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }

        return res.status(200).json({ success: true, count: data.length, data });
    } catch (err) {
        console.error('[userController] getUsers error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

/**
 * @desc   Get a single user by ID
 * @route  GET /api/users/:id
 * @access Private (admin only)
 */
const getUser = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id, name, email, role, created_at')
            .eq('id', req.params.id)
            .single();

        if (error || !data) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        return res.status(200).json({ success: true, data });
    } catch (err) {
        console.error('[userController] getUser error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = { getUsers, getUser };
