/**
 * scripts/ingest_embrapa_poc_granular.js
 * 
 * Granular ingestion mapping specific PDFs to persona knowledge hubs.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { PDFParse } = require('pdf-parse');
require('dotenv').config({ path: '.env.local' });

// POC Constants
const EMBRAPA_USER_EMAIL = 'embrapa@embrapa.com';
const EMBRAPA_FOLDER = path.join(process.cwd(), 'embrapa');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Mapping Hubs
const HUBS = {
    technologist: '00000000-0000-0000-0000-0b61e2024001', // Cientista Analítico
    devil:         '00000000-0000-0000-0000-0b61e2024002', // Auditor de Qualidade
    visionary:     '00000000-0000-0000-0000-0b61e2024003', // R&D Visionário
    ethicist:      '00000000-0000-0000-0000-0b61e2024004', // Regulatório
    marketeer:     '00000000-0000-0000-0000-0b61e2024004', // Share Regulatory hub for now
    financier:     '00000000-0000-0000-0000-0b61e2024002', // Share Quality/Stats hub
};

const FILE_MAPPING = {
    // ⚡ Cientista Analítico (Technologist)
    'Eurachem Method Validation Guide.pdf': 'technologist',
    'Ellison, Barwick and Farrant (2009) Practical Statistics for the Analytical Scientist - A Bench Guide (1).pdf': 'technologist',
    '2.3.7. Instrument control for linear calibration.pdf': 'technologist',
    '2.3.7.1. Control chart for a linear calibration line.pdf': 'technologist',
    '10 Souza, Pinto,  Junqueira (2007) In-house method validation - Application in arsenic analysis.pdf': 'technologist',
    '10a Souza, Lima, Teodoro & Junqueira (2007) Determinacao de avermectinas em leite.pdf': 'technologist',

    // 😈 Auditor de Qualidade e Riscos (Devil)
    '1.3.6.7.2. Critical Values of the Student_s-t Distribution.pdf': 'devil',
    '1.3.6.7.4. Critical Values of the Chi-Square Distribution.pdf': 'devil',
    'ISO 5725-2 1994 OCR (1).pdf': 'devil',
    'Horwitz (1995) Protocol for the design conduct and interpretation of method-performance studies (1).pdf': 'devil',

    // 🔮 Gestor de Inovação P&D (Visionary)
    'Kellog Soil Survey Methods (1).pdf': 'visionary',
    'IUPAC-Quantities, Units and Symbols in Physical Chemistry.pdf': 'visionary',
    'AOAC 2016_Apendice F Guidelines for Standard Method Performance Requirements (1).pdf': 'visionary',

    // ⚖️ Estrategista Regulatório (Ethicist)
    'RDC 166_Validação de métodos Anvisa.pdf': 'ethicist',
    'guia-de-validacao-controle-de-qualidade-analitica MAPA (1).pdf': 'ethicist',
    'DOQ-Cgcre-8_09 (1).pdf': 'ethicist',

    // 📊 Transferência de Tecnologia (Marketeer)
    'guia-de-validacao-controle-de-qualidade-analitica.pdf': 'marketeer',
    'Tese Validacao de Metodos (Scheilla Vitorino Souza, 2007).pdf': 'marketeer',

    // 💰 Analista de Fomento e Economia (Financier)
    'Thompson and Lowthian (2011) Notes on statistics and data quality for analytical chemists (1).pdf': 'financier',
    'Miller & Miller (2010) Statistics and Chemometrics for Analytical Chemistry 6th ed (1).pdf': 'financier',
};

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
    if (!response.ok) throw new Error(`Mistral Error: ${response.status}`);
    const data = await response.json();
    return data.data.map(x => x.embedding);
}

async function setupHubs(userId, tenantId) {
    console.log(`[POC Setup] Setting up Hub Personas...`);
    for (const [key, id] of Object.entries(HUBS)) {
        await supabase.from('custom_personas').upsert({
            id,
            tenant_id: tenantId,
            user_id: userId,
            name: `Hub ${key.charAt(0).toUpperCase() + key.slice(1)}`,
            role: 'Knowledge Store',
            is_active: false // Hidden internal hub
        });
    }
}

async function run() {
    try {
        console.log(`[POC Ingest] Starting granular ingestion for ${EMBRAPA_USER_EMAIL}...`);
        
        // 1. Get User
        const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
        if (userError) throw userError;

        let existingUser = userData.users.find(u => u.email === EMBRAPA_USER_EMAIL);
        if (!existingUser) {
            console.log(`[POC Ingest] User ${EMBRAPA_USER_EMAIL} not found. Creating...`);
            const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
                email: EMBRAPA_USER_EMAIL,
                password: 'embrapa_poc_2026',
                email_confirm: true
            });
            if (createError) throw createError;
            existingUser = newUser.user;
        }

        const userId = existingUser.id;
        const tenantId = userId;
        console.log(`[POC Ingest] Using UserId: ${userId}`);

        await setupHubs(userId, tenantId);

        console.log(`[POC Ingest] Clearing previous embeddings for user: ${userId}`);
        await supabase.from('repo_embeddings').delete().eq('user_id', userId);

        // 3. Ingest files with mapping
        if (!fs.existsSync(EMBRAPA_FOLDER)) {
            console.error(`[POC Ingest] Folder not found: ${EMBRAPA_FOLDER}`);
            return;
        }
        const files = fs.readdirSync(EMBRAPA_FOLDER);
        for (const filename of files) {
        if (!filename.toLowerCase().endsWith('.pdf')) continue;
        const targetPersonaKey = FILE_MAPPING[filename] || 'technologist'; // Default to tech
        const targetPersonaId = HUBS[targetPersonaKey];
        
        console.log(`[POC Ingest] Processing ${filename} -> HUB: ${targetPersonaKey}`);
        
        try {
            const buffer = fs.readFileSync(path.join(EMBRAPA_FOLDER, filename));
            const parser = new PDFParse({ data: buffer });
            const data = await parser.getText();
            let text = data.text || "";
            await parser.destroy();
            text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "").trim();
            if (text.length < 50) continue;

            const chunks = [];
            for (let i = 0; i < text.length; i += 1000) {
                const chunk = text.slice(i, i + 1200).trim();
                if (chunk.length > 50) chunks.push(chunk);
            }

            for (let i = 0; i < chunks.length; i += 16) {
                const batch = chunks.slice(i, i + 16);
                const embeddings = await embedMistral(batch);
                const rows = batch.map((chunk, idx) => ({
                    persona_id: targetPersonaId,
                    user_id: userId,
                    chunk_content: chunk,
                    embedding: embeddings[idx]
                }));
                const { error: insertErr } = await supabase.from('repo_embeddings').insert(rows);
                if (insertErr) console.error(`[POC Ingest] error:`, insertErr);
            }
        } catch (err) {
            console.error(`[POC Ingest] Failed ${filename}:`, err);
        }
    }
    } catch (err) {
        console.error(`[POC Ingest] FATAL ERROR:`, err);
    }
}

run();
