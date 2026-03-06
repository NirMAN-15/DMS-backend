/**
 * controllers/dashboardController.js
 * Aggregated statistics for the admin dashboard.
 */

const supabase = require('../config/db');

/**
 * @desc   Get dashboard summary statistics
 * @route  GET /api/dashboard/stats
 * @access Private (admin only)
 */
const getStats = async (req, res) => {
    try {
        // Run all count queries in parallel
        const [productsRes, shopsRes, ordersRes, usersRes] = await Promise.all([
            supabase.from('products').select('id', { count: 'exact', head: true }),
            supabase.from('shops').select('id', { count: 'exact', head: true }),
            supabase.from('orders').select('id', { count: 'exact', head: true }),
            supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'sales_rep'),
        ]);

        // Get recent orders for quick overview
        const { data: recentOrders } = await supabase
            .from('orders')
            .select('id, total_amount, status, created_at, shops(name)')
            .order('created_at', { ascending: false })
            .limit(5);

        return res.status(200).json({
            success: true,
            data: {
                totalProducts: productsRes.count || 0,
                totalShops: shopsRes.count || 0,
                totalOrders: ordersRes.count || 0,
                totalSalesReps: usersRes.count || 0,
                recentOrders: recentOrders || [],
            },
        });
    } catch (err) {
        console.error('[dashboardController] getStats error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = { getStats };
