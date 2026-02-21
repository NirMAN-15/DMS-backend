/**
 * controllers/authController.js
 * Handles user registration (by admin) and login.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/db');

/**
 * @desc   Login a user (admin or sales rep)
 * @route  POST /api/auth/login
 * @access Public
 */
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    try {
        // Fetch user from Supabase 'users' table by email
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        // Compare password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        // Sign JWT token (expires in 24h as per security guidelines)
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        return res.status(200).json({
            success: true,
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) {
        console.error('[authController] login error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

/**
 * @desc   Register a new sales rep (admin only)
 * @route  POST /api/auth/register
 * @access Private (admin)
 */
const register = async (req, res) => {
    const { name, email, password, role = 'sales_rep' } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    try {
        // Hash password with bcrypt (salt rounds = 10)
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const { data, error } = await supabase
            .from('users')
            .insert([{ name, email, password_hash, role }])
            .select()
            .single();

        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        return res.status(201).json({
            success: true,
            message: `User '${data.name}' registered successfully.`,
            user: { id: data.id, name: data.name, email: data.email, role: data.role },
        });
    } catch (err) {
        console.error('[authController] register error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = { login, register };
