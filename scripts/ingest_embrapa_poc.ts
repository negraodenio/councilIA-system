/**
 * scripts/ingest_embrapa_poc.ts
 * 
 * Script to ingest the local Embrapa document folder into the database for the POC.
 * This script reads PDFs from the 'embrapa' folder, extracts text, generates embeddings,
 * and inserts them into repo_embeddings linked to a specific POC Persona ID.
 */

import * as fs from 'fs';
import * as path from 'path';
import { createAdminClient } from '../src/lib/supabase/admin';
import { embedMistralCached } from '../src/lib/embeddings/mistral';
// @ts-ignore
const pdf = require('pdf-parse');

// POC Constants
const EMBRAPA_USER_EMAIL = 'embrapa@embrapa.com';
const EMBRAPA_PERSONA_ID = '00000000-0000-0000-0000-0b61e2024000';
const EMBRAPA_FOLDER = path.join(process.cwd(), 'embrapa');

async function setupEmbrapaUser(supabase: any) {
    console.log(`[POC Setup] Ensuring user ${EMBRAPA_USER_EMAIL} exists...`);
    
    // 1. Check if user exists in profiles (simplified for the POC)
    const { data: profile } = await supabase
        .from('profiles')
        .select('id, tenant_id')
        .eq('email', EMBRAPA_USER_EMAIL) // Note: assuming email is in profiles or checking auth.users via admin
        .maybeSingle();

    let userId = profile?.id;
    let tenantId = profile?.tenant_id;

    if (!userId) {
        // Find in auth.users
        const { data: { users }, error: userErr } = await supabase.auth.admin.listUsers();
        const existingUser = users.find((u: any) => u.email === EMBRAPA_USER_EMAIL);
        
        if (existingUser) {
            userId = existingUser.id;
        } else {
            // Create user
            console.log(`[POC Setup] Creating auth user...`);
            const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
                email: EMBRAPA_USER_EMAIL,
                password: 'embrapa_poc_2026',
                email_confirm: true
            });
            if (createErr) throw createErr;
            userId = newUser.user.id;
        }
    }

    if (!tenantId) {
        tenantId = userId; // Default to user-isolated tenant
        console.log(`[POC Setup] Upserting tenant and profile...`);
        await supabase.from('tenants').upsert({ id: tenantId, name: 'Embrapa POC' });
        await supabase.from('profiles').upsert({ 
            id: userId, 
            tenant_id: tenantId, 
            role: 'admin',
            email: EMBRAPA_USER_EMAIL
        });
    }

    // 2. Ensure the POC Expert Persona exists
    console.log(`[POC Setup] Upserting specialized Embrapa persona...`);
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

    return { userId, tenantId };
}

async function ingestFolder(supabase: any, userId: string) {
    console.log(`[POC Ingest] Reading folder: ${EMBRAPA_FOLDER}`);
    const files = fs.readdirSync(EMBRAPA_FOLDER);
    
    for (const filename of files) {
        if (!filename.toLowerCase().endsWith('.pdf')) continue;
        
        const filePath = path.join(EMBRAPA_FOLDER, filename);
        console.log(`[POC Ingest] Processing ${filename}...`);
        
        const buffer = fs.readFileSync(filePath);
        try {
            const data = await pdf(buffer);
            let text = data.text || "";
            text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "").trim();
            
            if (text.length < 100) {
                console.warn(`[POC Ingest] Skipping ${filename}: Too little text extracted.`);
                continue;
            }

            // Chunk and Embed (using batch size of 10)
            const chunks: string[] = [];
            const chunkSize = 1000;
            for (let i = 0; i < text.length; i += 800) {
                const chunk = text.slice(i, i + 1000).trim();
                if (chunk.length > 50) chunks.push(chunk);
            }

            console.log(`[POC Ingest] Created ${chunks.length} chunks for ${filename}. Generating embeddings...`);
            
            for (let i = 0; i < chunks.length; i += 10) {
                const batch = chunks.slice(i, i + 10);
                const embeddings = await embedMistralCached(batch);
                
                const rows = batch.map((chunk, idx) => ({
                    persona_id: EMBRAPA_PERSONA_ID,
                    user_id: userId,
                    chunk_content: chunk,
                    embedding: embeddings[idx]
                }));

                const { error: insertErr } = await supabase.from('repo_embeddings').insert(rows);
                if (insertErr) console.error(`[POC Ingest] Batch insert error for ${filename}:`, insertErr);
            }
            
            // Create a document record for tracking
            await supabase.from('custom_persona_documents').upsert({
                persona_id: EMBRAPA_PERSONA_ID,
                user_id: userId,
                filename,
                file_type: 'pdf',
                status: 'ready',
                chunk_count: chunks.length
            });

            console.log(`[POC Ingest] Successfully ingested ${filename}`);
        } catch (err) {
            console.error(`[POC Ingest] Failed to process ${filename}:`, err);
        }
    }
}

async function main() {
    try {
        const supabase = createAdminClient();
        const { userId } = await setupEmbrapaUser(supabase);
        await ingestFolder(supabase, userId);
        console.log('[POC Setup] DONE. Embrapa@embrapa.com is ready for the presentation.');
    } catch (err) {
        console.error('[POC Setup] Fatal Error:', err);
    }
}

main();
