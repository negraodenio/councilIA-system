import { createClient } from '@supabase/supabase-js';

const url = "https://nzrumwmlogcodvztokqt.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56cnVtd21sb2djb2R2enRva3F0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTI3NTE4MCwiZXhwIjoyMDg2ODUxMTgwfQ.GZjfSSCGrTRQcwTTmPaoS6DkEiAUWrivVJHT7ErP14k";

async function run() {
    const adminSupabase = createClient(url, key);

    console.log("Testing custom_persona_documents table via admin key...");
    const { data: existing, error: err } = await adminSupabase
        .from("custom_persona_documents")
        .select("id")
        .limit(1);

    console.log("Result:", existing);
    console.log("Error:", err);
}

run().catch(console.error);
