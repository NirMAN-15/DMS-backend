/**
 * config/db.js
 * Initializes and exports the Supabase client.
 * The client uses the SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env
 * so that all backend operations bypass Row-Level Security (RLS) where needed.
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ [Config] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
