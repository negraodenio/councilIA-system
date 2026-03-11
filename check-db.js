const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

try {
    const envStr = fs.readFileSync('.env.local', 'utf8');
    const keyMatch = envStr.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);
    const key = keyMatch[1].trim().replace(/['"]/g, '');

    const payload = key.split('.')[1];
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
    const url = `https://${decoded.ref}.supabase.co`;

    const supabase = createClient(url, key);

    async function check() {
        console.log("Checking debate_events for Founder messages...");
        const { data, error } = await supabase
            .from('debate_events')
            .select('*')
            .eq('model', 'Founder')
            .order('ts', { ascending: false })
            .limit(5);

        if (error) console.error("Error:", error);
        else console.log("Recent Founder events:", data);
    }
    check();
} catch (e) { console.error(e); }
