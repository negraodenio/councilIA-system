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

    async function testInsert() {
        console.log("Testing insert into debate_events...");
        const runId = "run_KOZ7EpZqQH"; // from user's screenshot
        const message = "This is a test interjection.";

        const { error, data } = await supabase.from('debate_events').insert({
            run_id: runId,
            event_type: 'model_msg',
            model: 'Founder',
            payload: {
                text: message,
                round: 0,
                persona: 'Founder'
            }
        }).select();

        if (error) {
            console.error("Supabase Insert Error:", error);
        } else {
            console.log("Success! Inserted:", data);
        }
    }
    testInsert();
} catch (e) { console.error(e); }
