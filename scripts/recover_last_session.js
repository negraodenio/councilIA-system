const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nzrumwmlogcodvztokqt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56cnVtd21sb2djb2R2enRva3F0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTI3NTE4MCwiZXhwIjoyMDg2ODUxMTgwfQ.GZjfSSCGrTRQcwTTmPaoS6DkEiAUWrivVJHT7ErP14k';

const supabase = createClient(supabaseUrl, supabaseKey);

async function getLastSession() {
    const { data, error } = await supabase
        .from('validations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

    if (error) {
        console.error('Error fetching session:', error);
        return;
    }

    if (data && data.length > 0) {
        const v = data[0];
        console.log('--- LAST SESSION PROPOSAL ---');
        console.log(v.proposal || v.full_result?.metadata?.proposal || v.full_result?.proposal || 'No proposal found in record.');
        console.log('\n--- FULL RECORD (DEBUG) ---');
        console.log(JSON.stringify(v, null, 2));
    } else {
        console.log('No sessions found.');
    }
}

getLastSession();
