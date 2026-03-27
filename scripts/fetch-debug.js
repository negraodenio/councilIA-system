const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function getReport() {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/councilia_reports?session_id=eq.val_Kkh873SJFI`;
  
  const response = await fetch(url, {
    headers: {
      'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
    }
  });

  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

getReport();
