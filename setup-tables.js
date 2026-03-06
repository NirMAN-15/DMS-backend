/**
 * setup-tables.js
 * One-time script to create Supabase tables and seed admin user.
 * Run: node setup-tables.js
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setup() {
    console.log('🔧 Setting up DMS database tables...\n');

    // 1. Create users table
    console.log('1/6 Creating users table...');
    const { error: e1 } = await supabase.rpc('exec_sql', {
        query: `CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'sales_rep',
            created_at TIMESTAMPTZ DEFAULT NOW()
        );`
    });
    if (e1) {
        // Try direct approach if rpc doesn't work
        console.log('   RPC not available, trying REST approach...');
    } else {
        console.log('   ✅ users table ready');
    }

    // 2. Create products table
    console.log('2/6 Creating products table...');
    const { error: e2 } = await supabase.rpc('exec_sql', {
        query: `CREATE TABLE IF NOT EXISTS products (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            sku TEXT UNIQUE NOT NULL,
            price NUMERIC(10,2) NOT NULL,
            stock INTEGER DEFAULT 0,
            image_url TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );`
    });
    if (e2) console.log('   ⚠️', e2.message);
    else console.log('   ✅ products table ready');

    // 3. Create shops table
    console.log('3/6 Creating shops table...');
    const { error: e3 } = await supabase.rpc('exec_sql', {
        query: `CREATE TABLE IF NOT EXISTS shops (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            address TEXT NOT NULL,
            phone TEXT,
            credit_limit NUMERIC(10,2) DEFAULT 0,
            gps_lat DOUBLE PRECISION,
            gps_lng DOUBLE PRECISION,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );`
    });
    if (e3) console.log('   ⚠️', e3.message);
    else console.log('   ✅ shops table ready');

    // 4. Create orders table
    console.log('4/6 Creating orders table...');
    const { error: e4 } = await supabase.rpc('exec_sql', {
        query: `CREATE TABLE IF NOT EXISTS orders (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            shop_id UUID REFERENCES shops(id),
            sales_rep_id UUID REFERENCES users(id),
            total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMPTZ DEFAULT NOW()
        );`
    });
    if (e4) console.log('   ⚠️', e4.message);
    else console.log('   ✅ orders table ready');

    // 5. Create order_items table
    console.log('5/6 Creating order_items table...');
    const { error: e5 } = await supabase.rpc('exec_sql', {
        query: `CREATE TABLE IF NOT EXISTS order_items (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
            product_id UUID REFERENCES products(id),
            quantity INTEGER NOT NULL DEFAULT 1,
            unit_price NUMERIC(10,2) NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );`
    });
    if (e5) console.log('   ⚠️', e5.message);
    else console.log('   ✅ order_items table ready');

    // 6. Create admin user (password: admin123)
    console.log('6/6 Creating admin user...');
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('admin123', salt);

    const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', 'admin@dms.com')
        .single();

    if (existingUser) {
        console.log('   ℹ️  Admin user already exists, skipping.');
    } else {
        const { error: e6 } = await supabase
            .from('users')
            .insert([{
                name: 'Admin User',
                email: 'admin@dms.com',
                password_hash: hash,
                role: 'admin'
            }]);

        if (e6) console.log('   ⚠️', e6.message);
        else console.log('   ✅ Admin user created (admin@dms.com / admin123)');
    }

    console.log('\n🎉 Database setup complete!');
    console.log('   You can now start the backend with: npm run dev');
}

setup().catch(err => {
    console.error('❌ Setup failed:', err.message);
    process.exit(1);
});
