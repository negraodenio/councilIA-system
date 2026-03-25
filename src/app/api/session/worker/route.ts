import { createAdminClient } from '@/lib/supabase/admin';
import { getCouncilConfig, councilConfig, ModelConfig } from '@/config/council';
import { addEvent } from '@/lib/council/events';
import { redactPII } from '@/lib/privacy/redact';
import { apiOk, apiError } from '@/lib/api/error';
import OpenAI from "openai";
import { PERSONA_PROMPTS_V3_0, CONFLICT_MATRIX_V3_0 } from './prompts_v3_0';
import { PERSONA_PROMPTS_EMBRAPA, EMBRAPA_CONFLICT_MATRIX, PERSONA_NAMES_EMBRAPA, EMBRAPA_GLOBAL_LAYER, EMBRAPA_ROUNDS, EMBRAPA_JUDGE_PROTOCOL, EMBRAPA_NARRATIVE } from './prompts_embrapa';

const mistralClient = new OpenAI({
    apiKey: process.env.MISTRAL_API_KEY,
    baseURL: "https://api.mistral.ai/v1"
});

// ——— Telemetry stubs ———
async function logAICall(data: Record<string, any>) {
    console.log('[telemetry] AI call:', data.layer, data.model, data.status, data.latency_ms + 'ms');
}
async function trackUsage(data: Record<string, any>) {
    console.log('[telemetry] Usage tracked:', data.tenant_id, data.validation_id);
}
async function triggerWebhook(data: Record<string, any>) {
    console.log('[telemetry] Webhook:', data.event, JSON.stringify(data.payload).substring(0, 100));
}

export const maxDuration = 800;

// ——— Model Callers ———————————————————

async function callOpenRouter(model: string, messages: any[], opts: { zdr?: boolean; maxTokens?: number; temperature?: number }) {
    const headers: Record<string, string> = {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://council.ai',
        'X-Title': 'CouncilIA',
    };
    const body: any = {
        model, messages,
        max_tokens: opts.maxTokens || 1024,
        temperature: opts.temperature ?? 0.7,
    };
    if (opts.zdr) {
        body.providers = { require_parameters: true };
        body.drop = ['openai'];
    }
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', { method: 'POST', headers, body: JSON.stringify(body) });
    if (!r.ok) {
        const errText = await r.text();
        throw new Error(`OpenRouter ${r.status}: ${errText}`);
    }
    return r.json();
}

async function callSiliconFlow(model: string, messages: any[], opts: { maxTokens?: number; temperature?: number }) {
    const r = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.SILICONFLOW_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model, messages,
            max_tokens: opts.maxTokens || 1024,
            temperature: opts.temperature ?? 0.7,
        }),
    });
    if (!r.ok) {
        const errText = await r.text();
        throw new Error(`SiliconFlow ${r.status}: ${errText}`);
    }
    return r.json();
}

async function callModelWithRetry(config: ModelConfig, messages: any[], opts: { zdr: boolean; maxTokens?: number; temperature?: number }, attempt = 1): Promise<any> {
    try {
        if (config.provider === 'siliconflow') {
            return await callSiliconFlow(config.model, messages, { maxTokens: opts.maxTokens, temperature: opts.temperature });
        }
        return await callOpenRouter(config.model, messages, { ...opts, temperature: opts.temperature });
    } catch (err: any) {
        console.error(`[callModel] Attempt ${attempt} failed for ${config.model}:`, err.message);
        if (attempt < 3) {
            const delay = Math.pow(2, attempt) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
            return callModelWithRetry(config, messages, opts, attempt + 1);
        }
        if (config.model !== 'google/gemini-2.0-flash-001') {
            console.warn(`[callModel] Final fallback to Gemini for ${config.model}`);
            return await callOpenRouter('google/gemini-2.0-flash-001', messages, opts);
        }
        throw err;
    }
}

async function callModel(config: ModelConfig, messages: any[], opts: { zdr: boolean; maxTokens?: number; temperature?: number }) {
    return callModelWithRetry(config, messages, opts);
}

function extractText(response: any, fallback: string): string {
    const msg = response?.choices?.[0]?.message;
    if (!msg) return fallback;
    return (msg.content || msg.reasoning_content || '').trim() || fallback;
}

// ——— Language Detection ————————————————————————————————

function detectLanguage(text: string): string {
    const lower = text.toLowerCase();
    if (/[\u4e00-\u9fff]/.test(text)) return 'Chinese';
    if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return 'Japanese';
    if (/[\uac00-\ud7af]/.test(text)) return 'Korean';
    if (/[\u0600-\u06ff]/.test(text)) return 'Arabic';
    if (/[¿¡]/.test(text)) return 'Spanish';

    const langPatterns: Record<string, RegExp[]> = {
        Spanish: [/\bquiero\b/, /\bnecesito\b/, /\bpuedo\b/, /\bcómo\b/],
        Portuguese: [/\bquero\b/, /\bpreciso\b/, /\bposso\b/, /\btambém\b/, /\bnegócio\b/],
        French: [/\bje\b/, /\bveux\b/, /\bbienvenue\b/],
        German: [/\bich\b/, /\bwill\b/, /\bwilkommen\b/],
        Italian: [/\bvoglio\b/, /\bfaccio\b/],
    };

    const scores: Record<string, number> = {};
    for (const [lang, patterns] of Object.entries(langPatterns)) {
        scores[lang] = patterns.filter(p => p.test(lower)).length;
    }

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const [bestLang, bestScore] = sorted[0];
    if (bestScore > 0) return bestLang;
    return 'English';
}

function langInstruction(lang: string): string {
    return `\n\nCRITICAL: You MUST respond entirely in ${lang}.`;
}

function inferGeoContext(idea: string, lang: string): string {
    const lower = idea.toLowerCase();
    if (/\b(brasil|brazil|rio|sao paulo|reais|agro)\b/.test(lower))
        return '\nGEOGRAPHIC CONTEXT: BRAZIL. Reference MAPA, ANVISA, INMETRO, and Plano Safra.';
    return '';
}

// ——— Persona Cognitive Archetypes & Conflict Matrix ———
let PERSONA_PROMPTS = PERSONA_PROMPTS_V3_0;
let CONFLICT_MATRIX = CONFLICT_MATRIX_V3_0;

// ——— Prompt Builders (Scientific Auditor Engine) ———————————————————

function buildIdeaAnchor(idea: string): string {
    if (!idea) return '';
    const safeIdea = idea.length > 1500 ? idea.substring(0, 1500) + '...' : idea;
    return `\n\nCRITICAL ANCHOR: Evaluate only this idea: "${safeIdea}". Discard hallucinations.`;
}

function buildRound1Prompt(persona: any, lang: string, idea: string = '', isEmbrapa: boolean = false): string {
    const cognitivePrompt = isEmbrapa ? PERSONA_PROMPTS_EMBRAPA[persona.id] : PERSONA_PROMPTS[persona.id] || '';
    const globalLayer = isEmbrapa ? EMBRAPA_GLOBAL_LAYER : '';
    const roundProtocol = isEmbrapa ? EMBRAPA_ROUNDS[1] : `ROUND 1 — THESIS. Provide substantitve analysis. Score 0-100.`;
    const narrative = isEmbrapa ? EMBRAPA_NARRATIVE : '';

    return `${narrative}\n${globalLayer}\n${cognitivePrompt}\n\nROLE: ${persona.role}\n${inferGeoContext(idea, lang)}\n${buildIdeaAnchor(idea)}\n\n${roundProtocol}${langInstruction(lang)}`;
}

function buildRound2AttackPrompt(persona: any, lang: string, idea: string = '', isEmbrapa: boolean = false): string {
    const conflict = isEmbrapa ? EMBRAPA_CONFLICT_MATRIX[persona.id] : CONFLICT_MATRIX[persona.id];
    const targetInstruction = conflict ? `\n\nATTACK TARGET: ${conflict.instruction}` : '';
    const roundProtocol = isEmbrapa ? EMBRAPA_ROUNDS[2] : `ROUND 2 — ANTITHESIS. Challenge the others.`;
    return `${isEmbrapa ? EMBRAPA_GLOBAL_LAYER : ''}\n\n${roundProtocol}${targetInstruction}${langInstruction(lang)}`;
}

function buildRound3DefensePrompt(persona: any, lang: string, idea: string = '', isEmbrapa: boolean = false): string {
    const roundProtocol = isEmbrapa ? EMBRAPA_ROUNDS[3] : `ROUND 3 — SYNTHESIS. Concede, Refine, Update score.`;
    return `${isEmbrapa ? EMBRAPA_GLOBAL_LAYER : ''}\n\n${roundProtocol}${langInstruction(lang)}`;
}

function buildRound4ConsensusPrompt(persona: any, lang: string, isEmbrapa: boolean = false): string {
    return `${EMBRAPA_GLOBAL_LAYER}\n\n${EMBRAPA_ROUNDS[4]}${langInstruction(lang)}`;
}

function buildRound5ScenarioPrompt(persona: any, lang: string, isEmbrapa: boolean = false): string {
    return `${EMBRAPA_GLOBAL_LAYER}\n\n${EMBRAPA_ROUNDS[5]}${langInstruction(lang)}`;
}

function buildRound6ExecutionPrompt(persona: any, lang: string, isEmbrapa: boolean = false): string {
    return `${EMBRAPA_GLOBAL_LAYER}\n\n${EMBRAPA_ROUNDS[6]}${langInstruction(lang)}`;
}

function buildJudgePrompt(lang: string, idea: string = '', isEmbrapa: boolean = false): string {
    const structureEs = `
## 🏛️ CouncilIA — Veredicto Final

### Puntuación de Consenso: [XX/100]

### 📊 Resumen Ejecutivo
(Crítico, estratégico, auditado)

### ✅ Puntos Fuertes & Moat Científico
- (Pruebas RAG específicas)

### 👤 Impacto del Fundador (Si aplica)
- (Resumen de la intervención)

### ⚠️ Matriz de Riesgo (Risk Matrix)
- [TÉCNICO]: (Probabilidad/Impacto)
- [REGULATORIO]: (Probabilidad/Impacto)
- [ECONÓMICO]: (Probabilidad/Impacto)

### 💡 Recomendaciones Estratégicas
1. (Acción inmediata)

### 🎯 Recomendación Final
(GO | CONDITIONAL | NO-GO)

### 📈 Nivel de Confianza
(ALTO / MEDIO / BAJO)`;

    const structurePt = `
## 🏛️ CouncilIA — Veredito Final

### Pontuação de Consenso: [XX/100]

### 📊 Resumo Executivo (C-Level)
(2-3 frases capturando a essência estratégica)

### ✅ Pontos Fortes & Moat Científico
- (3-4 pontos com evidências RAG específicas)

### 👤 Impacto do Fundador (Se aplicável)
- (Resuma o que o fundador mudou no debate)

### ⚠️ Quadro de Riscos (Risk Matrix)
- [TÉCNICO]: (Probabilidade/Impacto)
- [REGULATÓRIO]: (Probabilidade/Impacto)
- [ECONÔMICO]: (Probabilidade/Impacto)
- [ADOÇÃO]: (Probabilidade/Impacto)

### 💡 Recomendações Estratégicas
1. (Próximo passo técnico)
2. (Próximo passo regulatório)

### 🎯 Recomendação Final
(AVANÇAR | CONDICIONAL | NÃO AVANÇAR)

### 📈 Nível de Confiança (Evidence Audit)
(ALTO / MÉDIO / BAIXO)`;

    const structureEn = `
## 🏛️ CouncilIA Final Verdict

### Consensus Score: [XX/100]

### 📊 Executive Summary
(High-level strategic briefing)

### ✅ Key Strengths & Scientific Moat
- (Specific RAG-backed evidence)

### 👤 Founder Impact
- (How the intervention pivoted the swarm)

### ⚠️ Risk Matrix
- [TECHNICAL]: (Risk assessment)
- [REGULATORY]: (Compliance roadmap)
- [ECONOMICS]: (ROI hurdles)

### 💡 Strategic Recommendations
1. (Execution milestone)

### 🎯 Final Recommendation
(GO | CONDITIONAL | NO-GO)

### 📈 Confidence Level
(HIGH / MEDIUM / LOW)`;

    const structureMap: Record<string, string> = { Spanish: structureEs, Portuguese: structurePt };
    const structure = structureMap[lang] || structureEn;
    const protocolText = isEmbrapa ? EMBRAPA_JUDGE_PROTOCOL : `Deliver a Nash Equilibrium verdict based on the debate.`;

    return `${isEmbrapa ? EMBRAPA_NARRATIVE : ''}\n${protocolText}\n\nSTRUCTURE:\n${structure}${buildIdeaAnchor(idea)}${langInstruction(lang)}`;
}

// ——— Score Extraction ———————————————————
function extractScoresFromResults(results: { id: string; text: string }[]): number {
    const scores: number[] = [];
    for (const r of results) {
        const m = r.text.match(/SCORE:\s*\[?(\d{1,3})\]?/i) || r.text.match(/(\d{1,3})\/100/);
        if (m) { const n = parseInt(m[1], 10); if (n >= 0 && n <= 100) scores.push(n); }
    }
    return scores.length === 0 ? 50 : Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

// ——— Main Worker ———————————————————

export async function POST(req: Request) {
    console.log('[Worker] v5.0 Elite — Engine starting');
    let body: any = {};
    try {
        body = await req.json() || {};
        const { validationId, runId, tenant_id, user_id, idea, region, sensitivity, customPersonaId } = body;

        if (!runId || !idea) return apiError('Missing params', 400);

        const supabase = createAdminClient();
        const lang = detectLanguage(idea);

        let isEmbrapa = false;
        try {
            const { data: { user } } = await supabase.auth.admin.getUserById(user_id);
            if (user?.email === 'embrapa@embrapa.com') {
                isEmbrapa = true;
                PERSONA_PROMPTS = PERSONA_PROMPTS_EMBRAPA;
                CONFLICT_MATRIX = EMBRAPA_CONFLICT_MATRIX;
                await addEvent(supabase, runId, 'system', null, { msg: '🏛️ Embrapa v5.0 Master Engine Initiated. Adversarial Audit Mode: ON.' });
            }
        } catch (err) { console.error('[Worker] Auth error:', err); }

        const { redacted: ideaRedacted } = redactPII(idea);
        const config = getCouncilConfig(region, sensitivity);
        const personas = Object.values(councilConfig.personas);

        // Round 1
        const round1Results = await Promise.all(personas.map(async (p) => {
            const assigned = config.assign[p.id as keyof typeof config.assign];
            const out = await callModel(assigned, [{ role: 'system', content: buildRound1Prompt(p, lang, ideaRedacted, isEmbrapa) }, { role: 'user', content: ideaRedacted }], { zdr: config.judge.zdr });
            const text = extractText(out, '');
            await addEvent(supabase, runId, 'model_msg', p.id, { text, phase: 'r1', round: 1, persona: isEmbrapa ? PERSONA_NAMES_EMBRAPA[p.id] : p.name, emoji: p.emoji });
            return { id: p.id, emoji: p.emoji, name: p.name, text };
        }));

        // Round 2
        const transcriptR1 = round1Results.map(r => `[${r.name}]: ${r.text}`).join('\n\n');
        const round2Results = await Promise.all(personas.map(async (p) => {
            const assigned = config.assign[p.id as keyof typeof config.assign];
            const out = await callModel(assigned, [{ role: 'system', content: buildRound2AttackPrompt(p, lang, ideaRedacted, isEmbrapa) }, { role: 'user', content: transcriptR1 }], { zdr: config.judge.zdr });
            const text = extractText(out, '');
            await addEvent(supabase, runId, 'model_msg', p.id, { text, phase: 'r2', round: 2, persona: isEmbrapa ? PERSONA_NAMES_EMBRAPA[p.id] : p.name, emoji: p.emoji });
            return { id: p.id, emoji: p.emoji, name: p.name, text };
        }));

        // Round 3
        const transcriptR2 = round2Results.map(r => `[${r.name}]: ${r.text}`).join('\n\n');
        const round3Results = await Promise.all(personas.map(async (p) => {
            const assigned = config.assign[p.id as keyof typeof config.assign];
            const out = await callModel(assigned, [{ role: 'system', content: buildRound3DefensePrompt(p, lang, ideaRedacted, isEmbrapa) }, { role: 'user', content: transcriptR2 }], { zdr: config.judge.zdr });
            const text = extractText(out, '');
            await addEvent(supabase, runId, 'model_msg', p.id, { text, phase: 'r3', round: 3, persona: isEmbrapa ? PERSONA_NAMES_EMBRAPA[p.id] : p.name, emoji: p.emoji });
            return { id: p.id, emoji: p.emoji, name: p.name, text };
        }));

        // Extra Rounds
        let transcriptExtra = "";
        let round4Results: any[] = [];
        let round5Results: any[] = [];
        let round6Results: any[] = [];

        if (isEmbrapa) {
            const transcriptR3 = round3Results.map(r => `[${r.name}]: ${r.text}`).join('\n\n');
            round4Results = await Promise.all(personas.map(async (p) => {
                const out = await callModel(config.assign[p.id as keyof typeof config.assign], [{ role: 'system', content: buildRound4ConsensusPrompt(p, lang, true) }, { role: 'user', content: transcriptR3 }], { zdr: config.judge.zdr });
                const text = extractText(out, '');
                await addEvent(supabase, runId, 'model_msg', p.id, { text, phase: 'r4', round: 4, persona: PERSONA_NAMES_EMBRAPA[p.id], emoji: p.emoji });
                return { id: p.id, name: PERSONA_NAMES_EMBRAPA[p.id], emoji: p.emoji, text };
            }));
            const transcriptR4 = round4Results.map(r => `[${r.name}]: ${r.text}`).join('\n\n');
            round5Results = await Promise.all(personas.map(async (p) => {
                const out = await callModel(config.assign[p.id as keyof typeof config.assign], [{ role: 'system', content: buildRound5ScenarioPrompt(p, lang, true) }, { role: 'user', content: transcriptR4 }], { zdr: config.judge.zdr });
                const text = extractText(out, '');
                await addEvent(supabase, runId, 'model_msg', p.id, { text, phase: 'r5', round: 5, persona: PERSONA_NAMES_EMBRAPA[p.id], emoji: p.emoji });
                return { id: p.id, name: PERSONA_NAMES_EMBRAPA[p.id], emoji: p.emoji, text };
            }));
            const transcriptR5 = round5Results.map(r => `[${r.name}]: ${r.text}`).join('\n\n');
            round6Results = await Promise.all(personas.map(async (p) => {
                const out = await callModel(config.assign[p.id as keyof typeof config.assign], [{ role: 'system', content: buildRound6ExecutionPrompt(p, lang, true) }, { role: 'user', content: transcriptR5 }], { zdr: config.judge.zdr });
                const text = extractText(out, '');
                await addEvent(supabase, runId, 'model_msg', p.id, { text, phase: 'r6', round: 6, persona: PERSONA_NAMES_EMBRAPA[p.id], emoji: p.emoji });
                return { id: p.id, name: PERSONA_NAMES_EMBRAPA[p.id], emoji: p.emoji, text };
            }));
            transcriptExtra = `\n\n=== R4-R6 EXECUTION ===\n${round6Results.map(r => `[${r.name}]: ${r.text}`).join('\n')}`;
        }

        // Judge
        const fullTranscript = `=== Swarm Deliberation ===\n${transcriptR1}\n\n${transcriptR2}\n\n${round3Results.map(r => `[${r.name}]: ${r.text}`).join('\n\n')}${transcriptExtra}`;
        const judgeOut = await callModel({ provider: 'openrouter', model: config.judge.primary }, [{ role: 'system', content: buildJudgePrompt(lang, ideaRedacted, isEmbrapa) }, { role: 'user', content: fullTranscript }], { zdr: config.judge.zdr, maxTokens: 2000, temperature: 0.2 });
        const judgeText = extractText(judgeOut, 'Judge error');
        const score = (judgeText.match(/(\d{1,3})\/100/)?.[1] || extractScoresFromResults(round3Results));

        await addEvent(supabase, runId, 'judge_note', 'Auditores Embrapa', { text: judgeText, type: 'final_verdict' });
        await supabase.from('validations').update({ 
            status: 'complete', 
            consensus_score: Number(score), 
            full_result: { 
                lang, 
                protocol: isEmbrapa ? 'v5.0_ELITE' : 'v3.0', 
                judge: judgeText, 
                round1: round1Results, 
                round2: round2Results, 
                round3: round3Results,
                round4: round4Results,
                round5: round5Results,
                round6: round6Results,
                is_embrapa: isEmbrapa 
            } 
        }).eq('id', validationId);
        await supabase.from('debate_runs').update({ status: 'complete' }).eq('id', runId);

        return apiOk({ runId, validationId, score });
    } catch (error: any) { console.error('[Worker] Fatal:', error); return apiError(error.message, 500); }
}
