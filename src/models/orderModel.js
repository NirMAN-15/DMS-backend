/**
 * models/orderModel.js
 * Database query helpers for the 'orders' and 'order_items' tables.
 *
 * Schema:
 *   orders:
 *     id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
 *     shop_id       UUID REFERENCES shops(id)
 *     sales_rep_id  UUID REFERENCES users(id)
 *     total_amount  NUMERIC(10,2) NOT NULL DEFAULT 0
 *     status        TEXT DEFAULT 'pending'
 *     created_at    TIMESTAMPTZ DEFAULT NOW()
 *
 *   order_items:
 *     id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
 *     order_id      UUID REFERENCES orders(id) ON DELETE CASCADE
 *     product_id    UUID REFERENCES products(id)
 *     quantity      INTEGER NOT NULL DEFAULT 1
 *     unit_price    NUMERIC(10,2) NOT NULL
 *     created_at    TIMESTAMPTZ DEFAULT NOW()
 */

const supabase = require('../config/db');

const getAllOrders = async () => {
    return supabase
        .from('orders')
        .select('*, shops(name), users!orders_sales_rep_id_fkey(name, email)')
        .order('created_at', { ascending: false });
};

const getOrderById = async (id) => {
    return supabase
        .from('orders')
        .select('*, shops(name), users!orders_sales_rep_id_fkey(name, email)')
        .eq('id', id)
        .single();
};

const getOrderItems = async (orderId) => {
    return supabase
        .from('order_items')
        .select('*, products(name, sku)')
        .eq('order_id', orderId);
};

const createOrder = async (orderData) => {
    return supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();
};

const createOrderItems = async (items) => {
    return supabase
        .from('order_items')
        .insert(items)
        .select();
};

const updateOrderStatus = async (id, status) => {
    return supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
};

const deleteOrder = async (id) => {
    return supabase
        .from('orders')
        .delete()
        .eq('id', id);
};

module.exports = {
    getAllOrders,
    getOrderById,
    getOrderItems,
    createOrder,
    createOrderItems,
    updateOrderStatus,
    deleteOrder,
};
