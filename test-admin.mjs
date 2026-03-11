import { createClient } from '@supabase/supabase-js';

const url = "https://nzrumwmlogcodvztokqt.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56cnVtd21sb2djb2R2enRva3F0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTI3NTE4MCwiZXhwIjoyMDg2ODUxMTgwfQ.GZjfSSCGrTRQcwTTmPaoS6DkEiAUWrivVJHT7ErP14k";

async function run() {
    const adminSupabase = createClient(url, key);

    console.log("Testing subscriptions...");
    const { data: sub, error: subErr } = await adminSupabase
        .from("subscriptions")
        .select("plan")
        .limit(1);
    console.log("Sub:", sub, "Err:", subErr);

    console.log("Testing count...");
    const { data: existing, error: countErr } = await adminSupabase
        .from("custom_personas")
        .select("id")
        .limit(1);
    console.log("Existing:", existing, "Err:", countErr);
}

run().catch(console.error);
