/**
 * models/shopModel.js
 * Database query helpers for the 'shops' table.
 *
 * Schema:
 *   id           UUID     PRIMARY KEY DEFAULT gen_random_uuid()
 *   name         TEXT     NOT NULL
 *   address      TEXT     NOT NULL
 *   phone        TEXT
 *   credit_limit NUMERIC(10,2) DEFAULT 0
 *   gps_lat      DOUBLE PRECISION
 *   gps_lng      DOUBLE PRECISION
 *   created_at   TIMESTAMPTZ DEFAULT NOW()
 */

const supabase = require('../config/db');

const getAllShops = async () => {
    return supabase
        .from('shops')
        .select('*')
        .order('created_at', { ascending: false });
};

const getShopById = async (id) => {
    return supabase
        .from('shops')
        .select('*')
        .eq('id', id)
        .single();
};

const createShop = async (shopData) => {
    return supabase
        .from('shops')
        .insert([shopData])
        .select()
        .single();
};

const updateShop = async (id, updates) => {
    return supabase
        .from('shops')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
};

const deleteShop = async (id) => {
    return supabase
        .from('shops')
        .delete()
        .eq('id', id);
};

module.exports = { getAllShops, getShopById, createShop, updateShop, deleteShop };
