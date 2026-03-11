
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nzrumwmlogcodvztokqt.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56cnVtd21sb2djb2R2enRva3F0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTI3NTE4MCwiZXhwIjoyMDg2ODUxMTgwfQ.GZjfSSCGrTRQcwTTmPaoS6DkEiAUWrivVJHT7ErP14k';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updatePlan(emailSearch) {
    try {
        console.log(`Searching for user with email keyword: ${emailSearch}`);

        // Profiles table has 'email' (string) and 'id' (uuid)
        const { data: profiles, error: pErr } = await supabase
            .from('profiles')
            .select('id, email, tenant_id')
            .ilike('email', `%${emailSearch}%`);

        if (pErr) throw pErr;

        if (!profiles || profiles.length === 0) {
            console.log(`No users found in profiles for ${emailSearch}`);
            return;
        }

        for (const profile of profiles) {
            const tenantId = profile.tenant_id || profile.id;
            console.log(`Updating plan to 'team' (Corporate) for tenant_id: ${tenantId} (${profile.email})`);

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
            console.log(`Plan updated successfully for ${profile.email}`);
        }
    } catch (err) {
        console.error(`Error updating plan for ${emailSearch}:`, err);
    }
}

async function run() {
    await updatePlan('negraodenio');
    await updatePlan('fullnegraodenio');
    console.log('Finished plan updates.');
}

run();
