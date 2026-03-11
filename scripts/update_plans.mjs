
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56cnVtd21sb2djb2R2enRva3F0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTI3NTE4MCwiZXhwIjoyMDg2ODUxMTgwfQ.GZjfSSCGrTRQcwTTmPaoS6DkEiAUWrivVJHT7ErP14k';

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase URL or Service Key missing');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updatePlan(emailSearch: string) {
    try {
        // 1. Find the user by metadata if possible, or profiles
        console.log(`Searching for user with keyword: ${emailSearch}`);

        // Check profiles table which usually has emails or identifiers
        const { data: profiles, error: pErr } = await supabase
            .from('profiles')
            .select('id, full_name, tenant_id')
            .or(`full_name.ilike.%${emailSearch}%,id.ilike.%${emailSearch}%`);

        if (pErr) throw pErr;

        if (!profiles || profiles.length === 0) {
            console.log(`No users found for ${emailSearch}`);
            return;
        }

        for (const profile of profiles) {
            const tenantId = profile.tenant_id || profile.id;
            console.log(`Updating plan to 'team' for tenant_id: ${tenantId} (${profile.full_name})`);

            const { data: sub, error: sErr } = await supabase
                .from('subscriptions')
                .upsert({
                    tenant_id: tenantId,
                    plan: 'team',
                    status: 'active',
                    updated_at: new Date().toISOString()
                })
                .select();

            if (sErr) throw sErr;
            console.log(`Plan updated successfully for ${profile.full_name}`);
        }
    } catch (err) {
        console.error(`Error updating plan:`, err);
    }
}

// Update both users mentioned
(async () => {
    await updatePlan('negraodenio');
    await updatePlan('fullnegraodenio');
})();
