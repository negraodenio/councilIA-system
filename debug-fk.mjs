import { createClient } from '@supabase/supabase-js';

const url = 'https://nzrumwmlogcodvztokqt.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56cnVtd21sb2djb2R2enRva3F0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTI3NTE4MCwiZXhwIjoyMDg2ODUxMTgwfQ.GZjfSSCGrTRQcwTTmPaoS6DkEiAUWrivVJHT7ErP14k';
const supabase = createClient(url, key);

async function test() {
    const personaId = '7c8f1c58-cf89-41cc-a86a-f9b57158978b';
    const userId = 'b03272f8-9f65-463f-8574-a898851aa5f0';

    console.log('Inserting test document...');
    const { data: doc, error: docErr } = await supabase
        .from('custom_persona_documents')
        .insert({
            persona_id: personaId,
            user_id: userId,
            filename: 'test_debug.txt',
            status: 'processing'
        })
        .select('id')
        .single();

    if (docErr) {
        console.error('Doc Insert Failed:', docErr.message);
        return;
    }

    console.log('Created doc with ID:', doc.id);

    console.log('Inserting test embedding...');
    const { error: embErr } = await supabase
        .from('repo_embeddings')
        .insert({
            document_id: doc.id,
            persona_id: personaId,
            user_id: userId,
            chunk_content: 'test content',
            embedding: new Array(1536).fill(0)
        });

    if (embErr) {
        console.error('Embedding Insert Failed:', embErr.message);
    } else {
        console.log('Embedding Insert SUCCESS!');
    }
}

test().catch(console.error);
