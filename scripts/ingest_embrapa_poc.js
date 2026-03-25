/**
 * scripts/ingest_embrapa_poc.js
 * 
 * JS version for easier execution with standard node.
 * Uses MISTRAL_API_KEY from .env.local
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const pdf = require('pdf-parse');
require('dotenv').config({ path: '.env.local' });

// POC Constants
const EMBRAPA_USER_EMAIL = 'embrapa@embrapa.com';
const EMBRAPA_PERSONA_ID = '00000000-0000-0000-0000-0b61e2024000';
const EMBRAPA_FOLDER = path.join(process.cwd(), 'embrapa');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function embedMistral(inputs) {
    const response = await fetch('https://api.mistral.ai/v1/embeddings', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'mistral-embed',
            input: inputs
        })
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Mistral embeddings failed: ${response.status} - ${err}`);
    }

    const data = await response.json();
    return data.data.map(x => x.embedding);
}

async function setupEmbrapaUser() {
    console.log(`[POC Setup] Ensuring user ${EMBRAPA_USER_EMAIL} exists...`);
    
    // Check if user exists
    const { data: { users } } = await supabase.auth.admin.listUsers();
    let existingUser = users.find(u => u.email === EMBRAPA_USER_EMAIL);
    let userId;

    if (!existingUser) {
        console.log(`[POC Setup] Creating auth user...`);
        const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
            email: EMBRAPA_USER_EMAIL,
            password: 'embrapa_poc_2026',
            email_confirm: true
        });
        if (createErr) throw createErr;
        userId = newUser.user.id;
    } else {
        userId = existingUser.id;
    }

    const tenantId = userId;
    await supabase.from('tenants').upsert({ id: tenantId, name: 'Embrapa POC' });
    await supabase.from('profiles').upsert({ 
        id: userId, 
        tenant_id: tenantId, 
        role: 'admin',
        email: EMBRAPA_USER_EMAIL
    });

    await supabase.from('custom_personas').upsert({
        id: EMBRAPA_PERSONA_ID,
        tenant_id: tenantId,
        user_id: userId,
        name: 'Embrapa Knowledge Base',
        role: 'Global POC Data Store',
        description: 'Repositório de protocolos analíticos e normas técnicas da Embrapa.',
        color: '#22c55e',
        emoji: '🔬',
        is_active: true
    });

    return userId;
}

async function ingestFolder(userId) {
    if (!fs.existsSync(EMBRAPA_FOLDER)) {
        console.error(`[POC Ingest] Folder not found: ${EMBRAPA_FOLDER}`);
        return;
    }

    const files = fs.readdirSync(EMBRAPA_FOLDER);
    console.log(`[POC Ingest] Found ${files.length} files in ${EMBRAPA_FOLDER}`);
    
    for (const filename of files) {
        if (!filename.toLowerCase().endsWith('.pdf')) continue;
        
        const filePath = path.join(EMBRAPA_FOLDER, filename);
        console.log(`[POC Ingest] Processing ${filename}...`);
        
        try {
            const buffer = fs.readFileSync(filePath);
            const data = await pdf(buffer);
            let text = data.text || "";
            text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "").trim();
            
            if (text.length < 100) {
                console.warn(`[POC Ingest] Skipping ${filename}: Too little text (${text.length} chars)`);
                continue;
            }

            const chunks = [];
            for (let i = 0; i < text.length; i += 1000) {
                const chunk = text.slice(i, i + 1200).trim();
                if (chunk.length > 50) chunks.push(chunk);
            }

            console.log(`[POC Ingest] Ingesting ${chunks.length} chunks for ${filename}...`);
            
            for (let i = 0; i < chunks.length; i += 16) { // Batch size 16
                const batch = chunks.slice(i, i + 16);
                const embeddings = await embedMistral(batch);
                
                const rows = batch.map((chunk, idx) => ({
                    persona_id: EMBRAPA_PERSONA_ID,
                    user_id: userId,
                    chunk_content: chunk,
                    embedding: embeddings[idx]
                }));

                const { error: insertErr } = await supabase.from('repo_embeddings').insert(rows);
                if (insertErr) console.error(`[POC Ingest] Insert error for ${filename} at chunk ${i}:`, insertErr);
            }
            
            await supabase.from('custom_persona_documents').upsert({
                persona_id: EMBRAPA_PERSONA_ID,
                user_id: userId,
                filename,
                file_type: 'pdf',
                status: 'ready',
                chunk_count: chunks.length
            });
            console.log(`[POC Ingest] Finished ${filename}`);
        } catch (err) {
            console.error(`[POC Ingest] Failed ${filename}:`, err);
        }
    }
}

async function run() {
    try {
        const userId = await setupEmbrapaUser();
        await ingestFolder(userId);
        console.log('[POC Setup] All Embrapa documents ingested successfully.');
    } catch (err) {
        console.error('[POC Setup] Fatal Error:', err);
    }
}

run();
