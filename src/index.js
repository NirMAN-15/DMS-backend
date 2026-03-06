/**
 * src/index.js
 * Main server entry point for the DMS Backend.
 *
 * Responsibilities:
 *  - Load environment variables
 *  - Connect to Supabase (via config/db.js)
 *  - Apply global middlewares (CORS, JSON parsing, logging)
 *  - Mount all route modules under /api
 *  - Start the HTTP server
 */

// --- 1. Load environment variables FIRST ---
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// --- 2. Import Supabase client (validates URL & key on startup) ---
const supabase = require('./config/db');

// --- 3. Import route modules ---
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const shopRoutes = require('./routes/shopRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// --- 4. Initialize Express app ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- 5. Configure CORS ---
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',');
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (e.g., mobile apps, Postman, curl)
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error(`CORS: Origin '${origin}' is not allowed.`));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// --- 6. Global Middlewares ---
app.use(express.json());          // Parse incoming JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('dev'));            // HTTP request logger (shows method, route, status, response time)

// --- 7. Health Check Route ---
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: '🚀 DMS Backend API is running!',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});

// --- 8. Mount API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// --- 9. 404 Handler (must be after all valid routes) ---
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route '${req.originalUrl}' not found.` });
});

// --- 10. Global Error Handler ---
app.use((err, req, res, next) => {
    console.error('[Error]', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'An unexpected server error occurred.',
    });
});

// --- 11. Start Server ---
app.listen(PORT, async () => {
    console.log(`\n✅ DMS Backend server running on http://localhost:${PORT}`);
    console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Supabase URL: ${process.env.SUPABASE_URL}`);

    // Verify Supabase connection with a lightweight query
    const { error } = await supabase.from('users').select('count').limit(1);
    if (error) {
        console.warn(`⚠️  Supabase connection warning: ${error.message}`);
        console.warn('   → Make sure the "users" table exists and your keys are correct.');
    } else {
        console.log('✅ Supabase connection verified!\n');
    }
});

module.exports = app; // Export for testing purposes
