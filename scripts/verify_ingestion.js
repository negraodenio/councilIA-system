const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verify() {
    const hubs = {
        technologist: '00000000-0000-0000-0000-0b61e2024001',
        devil:        '00000000-0000-0000-0000-0b61e2024002',
        visionary:    '00000000-0000-0000-0000-0b61e2024003',
        ethicist:     '00000000-0000-0000-0000-0b61e2024004',
        marketeer:    '00000000-0000-0000-0000-0b61e2024004',
        financier:    '00000000-0000-0000-0000-0b61e2024002',
    };

    console.log('--- RAG Hub Verification ---');
    for (const [name, id] of Object.entries(hubs)) {
        const { count, error } = await supabase
            .from('repo_embeddings')
            .select('*', { count: 'exact', head: true })
            .eq('persona_id', id);
        
        if (error) {
            console.error(`Error checking ${name}:`, error);
        } else {
            console.log(`${name.padEnd(15)}: ${count} chunks`);
        }
    }
}

verify();
