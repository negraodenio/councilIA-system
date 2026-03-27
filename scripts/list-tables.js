const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listTables() {
  const { data, error } = await supabase
    .rpc('get_tables'); // This might not work if the RPC doesn't exist

  if (error) {
    console.log('RPC failed, trying raw query...');
    const { data: data2, error: error2 } = await supabase.from('information_schema.tables').select('table_name').eq('table_schema', 'public');
    if (error2) {
      console.error('Error listing tables:', error2);
    } else {
      console.log('Tables:', data2.map(t => t.table_name));
    }
  } else {
    console.log('Tables:', data);
  }
}

listTables();
