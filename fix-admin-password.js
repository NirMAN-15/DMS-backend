// fix-admin-password.js — One-time script to fix admin password
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fixAdmin() {
    const hash = await bcrypt.hash('admin123', 10);
    console.log('Generated hash:', hash);

    const { data, error } = await supabase
        .from('users')
        .update({ password_hash: hash })
        .eq('email', 'admin@dms.com')
        .select('id, name, email, role');

    if (error) {
        console.error('ERROR:', error.message);
    } else {
        console.log('SUCCESS! Admin password updated.');
        console.log('User:', data[0]);
        console.log('\nLogin with:');
        console.log('  Email:    admin@dms.com');
        console.log('  Password: admin123');
    }
}

fixAdmin();
