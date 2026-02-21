/**
 * models/userModel.js
 * Database query helpers for the 'users' table.
 * All raw Supabase queries live here so controllers stay lean.
 */

const supabase = require('../config/db');

/**
 * Find a user by their email address.
 * @param {string} email
 * @returns {object|null} user record or null
 */
const findUserByEmail = async (email) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (error) return null;
    return data;
};

/**
 * Find a user by their ID.
 * @param {string} id
 * @returns {object|null} user record or null
 */
const findUserById = async (id) => {
    const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role, created_at')
        .eq('id', id)
        .single();

    if (error) return null;
    return data;
};

module.exports = { findUserByEmail, findUserById };
