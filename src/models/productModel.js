/**
 * models/productModel.js
 * Database query helpers for the 'products' table.
 * All raw Supabase queries live here so controllers stay lean.
 *
 * Schema (create this table in Supabase SQL editor):
 *   id         UUID     PRIMARY KEY DEFAULT gen_random_uuid()
 *   name       TEXT     NOT NULL
 *   sku        TEXT     UNIQUE NOT NULL
 *   price      NUMERIC(10,2) NOT NULL
 *   stock      INTEGER  DEFAULT 0
 *   image_url  TEXT
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 */

const supabase = require('../config/db');

// ──────────────────────────────────────────────
// READ
// ──────────────────────────────────────────────

/**
 * Get all products (newest first).
 * @returns {{ data: Array|null, error: object|null }}
 */
const getAllProducts = async () => {
    return supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
};

/**
 * Get a single product by its UUID.
 * @param {string} id
 * @returns {{ data: object|null, error: object|null }}
 */
const getProductById = async (id) => {
    return supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
};

// ──────────────────────────────────────────────
// CREATE
// ──────────────────────────────────────────────

/**
 * Insert a new product record.
 * @param {{ name: string, sku: string, price: number, stock?: number, image_url?: string }} productData
 * @returns {{ data: object|null, error: object|null }}
 */
const createProduct = async (productData) => {
    return supabase
        .from('products')
        .insert([productData])
        .select()
        .single();
};

// ──────────────────────────────────────────────
// UPDATE
// ──────────────────────────────────────────────

/**
 * Update an existing product by its UUID.
 * @param {string} id
 * @param {object} updates — Any subset of product fields
 * @returns {{ data: object|null, error: object|null }}
 */
const updateProduct = async (id, updates) => {
    return supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
};

// ──────────────────────────────────────────────
// DELETE
// ──────────────────────────────────────────────

/**
 * Delete a product by its UUID.
 * @param {string} id
 * @returns {{ error: object|null }}
 */
const deleteProduct = async (id) => {
    return supabase
        .from('products')
        .delete()
        .eq('id', id);
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
