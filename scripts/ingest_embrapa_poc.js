/**
 * scripts/ingest_embrapa_poc.js
 * 
 * Enhanced Version v7.1 with DOCX Support
 * Uses Mistral embeddings and Supabase
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { PDFParse } = require('pdf-parse');
const mammoth = require('mammoth');
const XLSX = require('xlsx');
require('dotenv').config({ path: '.env.vercel.prod' });

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
    await supabase.from('profiles').upsert({ id: userId, tenant_id: tenantId, role: 'admin', email: EMBRAPA_USER_EMAIL });
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
    const files = fs.readdirSync(EMBRAPA_FOLDER);
    console.log(`[POC Ingest] Found ${files.length} files. Starting ingestion...`);
    
    for (const filename of files) {
        const ext = path.extname(filename).toLowerCase();
        if (ext !== '.pdf' && ext !== '.docx' && ext !== '.xlsx') continue;
        
        const filePath = path.join(EMBRAPA_FOLDER, filename);
        console.log(`[POC Ingest] Processing ${filename}...`);
        
        try {
            let text = "";
            if (ext === '.pdf') {
                const buffer = fs.readFileSync(filePath);
                const parser = new PDFParse({ data: buffer });
                const result = await parser.getText();
                await parser.destroy();
                text = result.text || "";
            } else if (ext === '.docx') {
                const result = await mammoth.extractRawText({ path: filePath });
                text = result.value;
            } else if (ext === '.xlsx') {
                const workbook = XLSX.readFile(filePath);
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                // Convert to CSV for RAG
                text = XLSX.utils.sheet_to_csv(worksheet);
            }

            text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "").trim();
            if (text.length < 50) continue;

            // Robust chunking: 1000 chars with 200 overlap
            const chunks = [];
            const chunkSize = 1000;
            const overlap = 200;
            for (let i = 0; i < text.length; i += (chunkSize - overlap)) {
                const chunk = text.slice(i, i + chunkSize).trim();
                if (chunk.length > 50) chunks.push(chunk);
                if (i + chunkSize >= text.length) break;
            }

            console.log(`[POC Ingest] Ingesting ${chunks.length} chunks for ${filename}...`);
            
            for (let i = 0; i < chunks.length; i += 16) {
                const batch = chunks.slice(i, i + 16);
                const embeddings = await embedMistral(batch);
                const rows = batch.map((chunk, idx) => ({
                    persona_id: EMBRAPA_PERSONA_ID,
                    user_id: userId,
                    chunk_content: chunk,
                    embedding: embeddings[idx]
                }));
                const { error: insertErr } = await supabase.from('repo_embeddings').insert(rows);
                if (insertErr) console.error(`[POC Ingest] Insert error:`, insertErr);
            }
            
            await supabase.from('custom_persona_documents').upsert({
                persona_id: EMBRAPA_PERSONA_ID,
                user_id: userId,
                filename,
                file_type: ext.substring(1),
                status: 'ready',
                chunk_count: chunks.length
            });
            console.log(`[POC Ingest] Finished ${filename}`);
        } catch (err) {
            console.error(`[POC Ingest] Error in ${filename}:`, err);
        }
    }
}

async function run() {
    try {
        const userId = await setupEmbrapaUser();
        await ingestFolder(userId);
        console.log('[POC Setup] Ingestion complete.');
    } catch (err) {
        console.error('[POC Setup] Error:', err);
    }
}

run();
