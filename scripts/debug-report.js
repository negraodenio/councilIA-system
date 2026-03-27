const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkReport() {
  const { data, error } = await supabase
    .from('councilia_reports')
    .select('full_report')
    .eq('session_id', 'val_Kkh873SJFI')
    .single();

  if (error) {
    console.error('Error:', error);
    process.exit(1);
  }

  console.log(JSON.stringify(data.full_report, null, 2));
}

checkReport();
