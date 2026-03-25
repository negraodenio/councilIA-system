import { createAdminClient } from '@/lib/supabase/admin';
import { getCouncilConfig, councilConfig, ModelConfig } from '@/config/council';
import { addEvent } from '@/lib/council/events';
import { redactPII } from '@/lib/privacy/redact';
import { apiOk, apiError } from '@/lib/api/error';
import OpenAI from "openai";
import { PERSONA_PROMPTS_V3_0, CONFLICT_MATRIX_V3_0 } from './prompts_v3_0';
import { PERSONA_PROMPTS_EMBRAPA, EMBRAPA_CONFLICT_MATRIX, PERSONA_NAMES_EMBRAPA, EMBRAPA_GLOBAL_LAYER, EMBRAPA_ROUNDS, EMBRAPA_JUDGE_PROTOCOL } from './prompts_embrapa';

const mistralClient = new OpenAI({
    apiKey: process.env.MISTRAL_API_KEY,
    baseURL: "https://api.mistral.ai/v1"
});

// ——— Telemetry stubs (v3.0 — replace with real implementations later) ———
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

        // Retry logic for 5xx errors or network issues
        if (attempt < 3) {
            const delay = Math.pow(2, attempt) * 1000; // 2s, 4s
            await new Promise(resolve => setTimeout(resolve, delay));
            return callModelWithRetry(config, messages, opts, attempt + 1);
        }

        // Final Fallback: If OpenRouter/SiliconFlow fails 3 times, try Gemini 2.0 Flash (usually extremely reliable)
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

// ——— Language Detection (v2.2 — Exclusive Word Scoring) ————————————————

function detectLanguage(text: string): string {
    const lower = text.toLowerCase();

    if (/[\u4e00-\u9fff]/.test(text)) return 'Chinese';
    if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return 'Japanese';
    if (/[\uac00-\ud7af]/.test(text)) return 'Korean';
    if (/[\u0600-\u06ff]/.test(text)) return 'Arabic';
    if (/[¿¡]/.test(text)) return 'Spanish';

    const langPatterns: Record<string, RegExp[]> = {
        Spanish: [
            /\bquiero\b/, /\bnecesito\b/, /\bpuedo\b/, /\bcómo\b/, /\bdónde\b/,
            /\bcuándo\b/, /\bqué\b/, /\btrabajo\b/, /\bdinero\b/, /\bnegocio\b/,
            /\btienda\b/, /\bvida\b/, /\bpintar\b/, /\bcuadros\b/, /\bsobrevivir\b/,
            /\bganarme\b/, /\bcreando\b/, /\bescultura\b/, /\bpintura\b/, /\bartesanías\b/,
            /\bhacer\b/, /\bpuede\b/, /\btambién\b/, /\bmucho\b/, /\bayuda\b/,
            /\bempresa\b/, /\bmercado\b/, /\bproducto\b/, /\bvender\b/, /\bidea\b/,
            /\bsería\b/, /\btener\b/, /\bbueno\b/, /\bmejor\b/, /\bpero\b/,
            /\besta\b/, /\beste\b/, /\besos\b/, /\besas\b/, /\bellos\b/,
            /\bnosotros\b/, /\busted\b/, /\bustedes\b/, /\bhay\b/, /\bestoy\b/,
            /\bsomos\b/, /\bson\b/, /\bser\b/, /\bestar\b/, /\bhemos\b/,
        ],
        Portuguese: [
            /\bquero\b/, /\bpreciso\b/, /\bposso\b/, /\bnão\b/, /\bsim\b/,
            /\btambém\b/, /\bnegócio\b/, /\bloja\b/, /\bdinheiro\b/, /\btrabalho\b/,
            /\bganhar\b/, /\bviver\b/, /\bquadros\b/, /\bsobreviver\b/,
            /\bcriando\b/, /\bescultura\b/, /\bartesanato\b/, /\bpintura\b/,
            /\bfazer\b/, /\bpode\b/, /\bmuito\b/, /\bajuda\b/,
            /\bempresa\b/, /\bmercado\b/, /\bproduto\b/, /\bvender\b/, /\bideia\b/,
            /\bseria\b/, /\bvoce\b/, /\bvocê\b/, /\bnós\b/, /\beles\b/,
            /\bestou\b/, /\bestá\b/, /\bisto\b/, /\bisso\b/, /\baquilo\b/,
            /\buma\b/, /\bumas\b/, /\bdos\b/, /\bdas\b/, /\bpelo\b/, /\bpela\b/,
            /\btenho\b/, /\btemos\b/, /\bsomos\b/, /\bsão\b/, /\bser\b/,
            /\bpara\b/, /\bcom\b/, /\bcomo\b/, /\bpor\b/, /\bmais\b/,
            /\baqui\b/, /\bsobre\b/, /\bmuita\b/, /\bdepois\b/, /\bantes\b/,
            /\bagora\b/, /\bsempre\b/, /\bnunca\b/, /\btudo\b/, /\bnada\b/,
            /\bcriar\b/, /\bpatos\b/, /\blagoa\b/, /\bparque\b/, /\bjamor\b/
        ],
        French: [
            /\bje\b/, /\bveux\b/, /\bouvrir\b/, /\bmagasin\b/, /\bentreprise\b/,
            /\bcomment\b/, /\bbeaucoup\b/, /\bbesoin\b/, /\btravailler\b/,
            /\bargent\b/, /\baffaire\b/, /\bpeinture\b/, /\bsculpture\b/,
            /\bsurvivre\b/, /\bgagner\b/, /\bcréer\b/, /\bvie\b/,
            /\bpourquoi\b/, /\bparce que\b/, /\baujourd'hui\b/, /\btoujours\b/,
            /\bnous\b/, /\bvous\b/, /\bleur\b/, /\bces\b/, /\bcette\b/,
            /\bêtre\b/, /\bavoir\b/, /\bfaire\b/, /\bdire\b/, /\baller\b/,
        ],
        German: [
            /\bich\b/, /\bwill\b/, /\beröffnen\b/, /\bladen\b/, /\bgeschäft\b/,
            /\bwie\b/, /\bkann\b/, /\bmachen\b/, /\bunternehmen\b/, /\bmarkt\b/,
            /\bgeld\b/, /\barbeit\b/, /\bmalerei\b/, /\bskulptur\b/,
            /\büberleben\b/, /\bverdienen\b/, /\bschaffen\b/, /\bleben\b/,
            /\bwarum\b/, /\bweil\b/, /\bheute\b/, /\bimmer\b/,
            /\bwir\b/, /\bihr\b/, /\bsie\b/, /\bdiese\b/, /\bdieses\b/,
            /\bsein\b/, /\bhaben\b/, /\bwerden\b/, /\bsollen\b/, /\bmüssen\b/,
        ],
        Italian: [
            /\bvoglio\b/, /\baprire\b/, /\bnegozio\b/, /\bazienda\b/,
            /\bcome\b/, /\bpuò\b/, /\bfare\b/, /\bimpresa\b/, /\bmercato\b/,
            /\bsoldi\b/, /\blavoro\b/, /\bpittura\b/, /\bscoltura\b/,
            /\bsopravvivere\b/, /\bguadagnare\b/, /\bcreare\b/, /\bvita\b/,
            /\bperché\b/, /\boggi\b/, /\bsempre\b/,
            /\bnoi\b/, /\bvoi\b/, /\bloro\b/, /\bquesto\b/, /\bquesto\b/,
            /\bessere\b/, /\bavere\b/, /\bandare\b/, /\bdovere\b/, /\bpotere\b/,
        ],
        Dutch: [
            /\bik\b/, /\bwil\b/, /\bopenen\b/, /\bwinkel\b/, /\bbedrijf\b/,
            /\bhoe\b/, /\bkan\b/, /\bmaken\b/, /\bondernemen\b/, /\bmarkt\b/,
            /\bgeld\b/, /\bwerk\b/, /\bschilderen\b/, /\bsculptuur\b/,
            /\boverleven\b/, /\bverdienen\b/, /\bcreëren\b/, /\bleven\b/,
        ],
    };

    const scores: Record<string, number> = {};
    for (const [lang, patterns] of Object.entries(langPatterns)) {
        scores[lang] = patterns.filter(p => p.test(lower)).length;
    }

    console.log('[detectLanguage] Scores:', JSON.stringify(scores), '| Input:', lower.substring(0, 80));

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const [bestLang, bestScore] = sorted[0];
    const [, secondScore] = sorted[1] || ['', 0];

    if (bestScore > 0 && bestScore > secondScore) return bestLang;

    if (bestScore > 0 && bestScore === secondScore) {
        if (scores['Spanish'] === bestScore && /[ñ¿¡]/.test(text)) return 'Spanish';
        if (scores['Portuguese'] === bestScore && /[ãõ]/.test(text)) return 'Portuguese';
        if (scores['French'] === bestScore && /[êèëùûœ«»]/.test(text)) return 'French';
        if (scores['German'] === bestScore && /[äöüß]/.test(text)) return 'German';
    }

    if (bestScore > 0) return bestLang;
    return 'English';
}

function langInstruction(lang: string): string {
    return `\n\nCRITICAL: You MUST respond entirely in ${lang}. All analysis, headings, bullet points, verdicts, and recommendations must be written in ${lang}. Do NOT use any other language than ${lang}.`;
}

function inferGeoContext(idea: string, lang: string): string {
    const lower = idea.toLowerCase();
    if (/\b(brasil|brazil|rio|sao paulo|favela|reais|acai|nordeste|bahia|minas|carioca|paulista)\b/.test(lower))
        return '\nGEOGRAPHIC CONTEXT: BRAZIL. Use R$ (BRL). Reference Brazilian regulations (LGPD, ANVISA, CVM).';
    if (/\b(portugal|lisboa|lisbon|porto|algarve|comporta|faro|coimbra|braga|sintra|cascais)\b/.test(lower))
        return '\nGEOGRAPHIC CONTEXT: PORTUGAL/EU. Use EUR. Reference EU/PT regulations (GDPR, ASAE).';
    if (/\b(united states|usa|california|silicon valley|new york)\b/.test(lower))
        return '\nGEOGRAPHIC CONTEXT: USA. Use USD. Reference US regulations (SEC, FDA, FTC).';
    if (/\b(dubai|abu dhabi|saudi|qatar|emirates)\b/.test(lower))
        return '\nGEOGRAPHIC CONTEXT: GCC. Use local currency (AED/SAR/QAR).';
    if (/\b(russia|moscow|moscou)\b/.test(lower))
        return '\nGEOGRAPHIC CONTEXT: RUSSIA. Use RUB.';
    if (/\b(europe|berlin|paris|madrid|barcelona|amsterdam|roma|rome|milan)\b/.test(lower))
        return '\nGEOGRAPHIC CONTEXT: EUROPE. Use EUR.';
    if (lang === 'Portuguese') return '\nGEOGRAPHIC CONTEXT: Portuguese detected. Infer Brazil R$ or Portugal EUR from context.';
    if (lang === 'Spanish') return '\nGEOGRAPHIC CONTEXT: Spanish detected. Use currency of the country mentioned.';
    return '';
}

// ——— v3.0 ACE Engine — Persona Cognitive Archetypes & Conflict Matrix ———
let PERSONA_PROMPTS = PERSONA_PROMPTS_V3_0;
let CONFLICT_MATRIX = CONFLICT_MATRIX_V3_0;

// ——— Prompt Builders (v3.0 ACE Engine) ———————————————————

function buildIdeaAnchor(idea: string): string {
    if (!idea) return '';
    const safeIdea = idea.length > 1500 ? idea.substring(0, 1500) + '...' : idea;
    return `\n\nCRITICAL ANCHOR (ANTI-HALLUCINATION): The original idea being evaluated is STRICTLY about:\n"${safeIdea}"\nIf the debate transcript or your analysis discusses features, target audiences, products, or business models NOT present in this original idea, you must discard them as HALLUCINATIONS and return to the core concept.`;
}

function buildRound1Prompt(persona: any, lang: string, idea: string = '', isEmbrapa: boolean = false): string {
    const cognitivePrompt = isEmbrapa ? PERSONA_PROMPTS_EMBRAPA[persona.id] : PERSONA_PROMPTS[persona.id] || '';
    const globalLayer = isEmbrapa ? EMBRAPA_GLOBAL_LAYER : '';
    const roundProtocol = isEmbrapa ? EMBRAPA_ROUNDS[1] : `ROUND 1 — THESIS (Delphi Method: independent expert evaluation)\n\nRULES:\n1. Provide structured analysis with clear sections.\n2. Maximum 300 words. Be substantive, not verbose.\n3. Focus ONLY on your expertise area.\n4. End with a clear VERDICT: score 0-100.`;

    return `${globalLayer}\n${cognitivePrompt}

YOUR ROLE ON THE COUNCIL: ${persona.role}
${inferGeoContext(idea, lang)}
${buildIdeaAnchor(idea)}

${roundProtocol}

OUTPUT FORMAT (MANDATORY):
## [Your Expertise Title]
### Key Analysis
- (2-4 substantive bullet points with evidence)
### Risk/Opportunity
- (1-2 critical points)
### Verdict: XX/100
(One sentence justification)

DATA INTEGRITY (CRITICAL):
- Do NOT fabricate citations. 
- NEVER invent author names or institutions.
- Mark estimates as [estimated].${langInstruction(lang)}`;
}

function buildRound2AttackPrompt(persona: any, lang: string, idea: string = '', isEmbrapa: boolean = false): string {
    const conflict = isEmbrapa ? EMBRAPA_CONFLICT_MATRIX[persona.id] : CONFLICT_MATRIX[persona.id];
    const targetInstruction = conflict
        ? `\n\nPRIMARY ATTACK TARGET:\n${conflict.instruction}`
        : '';
    const globalLayer = isEmbrapa ? EMBRAPA_GLOBAL_LAYER : '';
    const roundProtocol = isEmbrapa ? EMBRAPA_ROUNDS[2] : `ROUND 2 — ANTITHESIS (Red Teaming + Adversarial Alignment). Your role: CRITICAL CHALLENGER.`;

    return `${globalLayer}\n\nROUND 2 — ${roundProtocol}\n${targetInstruction}

RULES:
1. PRIMARY ATTACK: Dismantle your primary target's core argument.
2. CITATION AUDIT (Embrapa Only): If they didn't cite a RAG source for a claim, point it out.
3. Maximum 300 words.${langInstruction(lang)}`;
}

function buildRound3DefensePrompt(persona: any, lang: string, idea: string = '', isEmbrapa: boolean = false): string {
    const globalLayer = isEmbrapa ? EMBRAPA_GLOBAL_LAYER : '';
    const roundProtocol = isEmbrapa ? EMBRAPA_ROUNDS[3] : `ROUND 3 — SYNTHESIS (Hegelian Dialectics + Consensus Protocol). Defend, concede, and REFINE.`;

    return `${globalLayer}\n\nROUND 3 — ${roundProtocol}

PROTOCOL:
1. CONCEDE: Name what your attacker got RIGHT.
2. REFINE: How does your original position CHANGE based on valid attacks?
3. FINAL SCORE: Update your score 0-100.${langInstruction(lang)}`;
}

// ——— v5.0 Extra Rounds ———

function buildRound4ConsensusPrompt(persona: any, lang: string, isEmbrapa: boolean = false): string {
    return `${EMBRAPA_GLOBAL_LAYER}\n\nROUND 4 — ${EMBRAPA_ROUNDS[4]}

Your goal is to reach a stable consensus with the others. Identify where you can align without sacrificing technical rigor.${langInstruction(lang)}`;
}

function buildRound5ScenarioPrompt(persona: any, lang: string, isEmbrapa: boolean = false): string {
    return `${EMBRAPA_GLOBAL_LAYER}\n\nROUND 5 — ${EMBRAPA_ROUNDS[5]}

Test the project against a catastrophic scenario (Climate shock, Logistics failure). How does it survive?${langInstruction(lang)}`;
}

function buildRound6ExecutionPrompt(persona: any, lang: string, isEmbrapa: boolean = false): string {
    return `${EMBRAPA_GLOBAL_LAYER}\n\nROUND 6 — ${EMBRAPA_ROUNDS[6]}

Provide the concrete roadmap: Regulatory steps, Pilot plan, and Funding strategy.${langInstruction(lang)}`;
}

function buildJudgePrompt(lang: string, idea: string = '', isEmbrapa: boolean = false): string {
    const structureEs = `
## 🏛️ CouncilIA — Veredicto Final

### Puntuación de Consenso: [XX/100]

### 📊 Resumen Ejecutivo
(2-3 frases capturando la esencia)

### ✅ Puntos Fuertes
- (3-4 puntos con evidencias específicas del debate)

### 👤 Impacto de la Intervención del Fundador (SÓLO SI HUBO INTERVENCIÓN)
- (Resuma lo que dijo el fundador en medio del debate y cómo esto obligó al consejo a cambiar de dirección)

### ⚠️ Riesgos Críticos
- (3-4 puntos — enfoque en ataques NO REFUTADOS)

### 💡 Recomendaciones Estratégicas
1. (Recomendación accionable)
2. (Recomendación accionable)
3. (Recomendación accionable)

### 🎯 Recomendación Final
(Una de: AVANZAR | AVANZAR CON CONDICIONES | PIVOTAR | NO AVANZAR)
(1 párrafo explicando por qué)

### 📈 Nivel de Confianza
(ALTO / MEDIO / BAJO y por qué)`;

    const structurePt = `
## 🏛️ CouncilIA — Veredicto Final

### Pontuação de Consenso: [XX/100]

### 📊 Resumo Executivo
(2-3 frases capturando a essência)

### ✅ Pontos Fortes
- (3-4 pontos com evidências específicas do debate)

### 👤 Impacto da Intervenção do Fundador (SÓ SE HOUVE INTERVENÇÃO)
- (Resuma o que o fundador disse a meio do debate e como isso forçou o conselho a mudar de rumo)

### ⚠️ Riscos Críticos
- (3-4 pontos — foco nos ataques NÃO REFUTADOS)

### 💡 Recomendações Estratégicas
1. (Recomendação acionável)
2. (Recomendação acionável)
3. (Recomendação acionável)

### 🎯 Recomendação Final
(Uma de: AVANÇAR | AVANÇAR COM CONDIÇÕES | PIVOTAR | NÃO AVANÇAR)
(1 parágrafo explicando porquê)

### 📈 Nível de Confiança
(ALTO / MÉDIO / BAIXO e porquê)`;

    const structureFr = `
## 🏛️ CouncilIA — Verdict Final

### Score de Consensus: [XX/100]

### 📊 Résumé Exécutif
(2-3 phrases capturant l'essentiel)

### ✅ Points Forts
- (3-4 points avec preuves spécifiques du débat)

### 👤 Impact de l'Intervention du Fondateur (SEULEMENT S'IL Y EN A EU UNE)
- (Résumez ce que le fondateur a dit au milieu du débat et comment cela a forcé le conseil à changer de direction)

### ⚠️ Risques Critiques
- (3-4 points — focus sur les attaques NON RÉFUTÉES)

### 💡 Recommandations Stratégiques
1. (Recommandation actionnable)
2. (Recommandation actionnable)
3. (Recommandation actionnable)

### 🎯 Recommandation Finale
(Une de: AVANCER | AVANCER AVEC CONDITIONS | PIVOTER | NE PAS AVANCER)
(1 paragraphe expliquant pourquoi)

### 📈 Niveau de Confiance
(ÉLEVÉ / MOYEN / FAIBLE et pourquoi)`;

    const structureDe = `
## 🏛️ CouncilIA — Endgültiges Urteil

### Konsens-Score: [XX/100]

### 📊 Zusammenfassung
(2-3 Sätze, die das Wesentliche erfassen)

### ✅ Stärken
- (3-4 Punkte mit spezifischen Belegen aus der Debatte)

### 👤 Auswirkungen der Gründerintervention (NUR WENN ES EINE GAB)
- (Fassen Sie zusammen, was der Gründer mitten in der Debatte gesagt hat und wie dies den Rat zu einem Kurswechsel zwang)

### ⚠️ Kritische Risiken
- (3-4 Punkte — Fokus auf UNWIDERLEGTE Angriffe)

### 💡 Strategische Empfehlungen
1. (Umsetzbare Empfehlung)
2. (Umsetzbare Empfehlung)
3. (Umsetzbare Empfehlung)

### 🎯 Endgültige Empfehlung
(Eine von: FORTFAHREN | BEDINGT FORTFAHREN | UMSTEUERN | NICHT FORTFAHREN)
(1 Absatz mit Begründung)

### 📈 Konfidenzniveau
(HOCH / MITTEL / NIEDRIG und warum)`;

    const structureIt = `
## 🏛️ CouncilIA — Verdetto Finale

### Punteggio di Consenso: [XX/100]

### 📊 Riepilogo Esecutivo
(2-3 frasi che catturano l'essenza)

### ✅ Punti di Forza
- (3-4 punti con prove specifiche dal dibattito)

### 👤 Impatto dell'Intervento del Fondatore (SOLO SE C'È STATO)
- (Riassumi ciò che ha detto il fondatore nel mezzo del dibattito e come questo ha costretto il consiglio a cambiare direzione)

### ⚠️ Rischi Critici
- (3-4 punti — focus sugli attacchi NON CONFUTATI)

### 💡 Raccomandazioni Strategiche
1. (Raccomandazione attuabile)
2. (Raccomandazione attuabile)
3. (Raccomandazione attuabile)

### 🎯 Raccomandazione Finale
(Una di: PROCEDERE | PROCEDERE CON CONDIZIONI | CAMBIARE ROTTA | NON PROCEDERE)
(1 paragrafo con spiegazione)

### 📈 Livello di Fiducia
(ALTO / MEDIO / BASSO e perché)`;

    const structureEn = `
## 🏛️ CouncilIA Final Verdict

### Consensus Score: [XX/100]

### 📊 Executive Summary
(2-3 sentences capturing the essence)

### ✅ Key Strengths
- (3-4 bullet points with specific evidence from the debate)

### 👤 Founder Intervention Impact (ONLY IF APPLICABLE)
- (Summarize what the founder interjected mid-debate and how it forced the council to pivot their analysis)

### ⚠️ Critical Risks
- (3-4 bullet points — focus on UNREFUTED attacks)

### 💡 Strategic Recommendations
1. (Actionable recommendation)
2. (Actionable recommendation)
3. (Actionable recommendation)

### 🎯 Final Recommendation
(One of: STRONG GO | CONDITIONAL GO | PIVOT SUGGESTED | DO NOT PROCEED)
(1 paragraph explaining why)

### 📈 Confidence Level
(HIGH / MEDIUM / LOW and why)`;

    const structureMap: Record<string, string> = {
        Spanish: structureEs,
        Portuguese: structurePt,
        French: structureFr,
        German: structureDe,
        Italian: structureIt,
    };

    const structure = structureMap[lang] || structureEn;

    return `You are the CHIEF JUDGE of CouncilIA.
Strictly adhering to Amershi et al. (CHI 2019) Guidelines for Human-AI Interaction and Nash Equilibrium principles for adversarial consensus.

JUDGE PROTOCOL (Scientific Moat):
- G11: MAKE CLEAR WHY the system reached this verdict. Cite specific evidence from the 3 rounds.
- NASH EQUILIBRIUM: Identify the point of optimal convergence where experts with opposing biases (e.g., Visionary vs. Auditor) find a common technical ground.
- KAESBERG (2025): Validate the 3-round protocol. Ensure the synthesis accounts for the decay of noise vs. signal across rounds.
- RAG ANCHORING (TECHNICAL RIGOR): You MUST base your points on the technical evidence and documents provided. Cite specific norms (e.g., ISO, RDC), numbers, or directives from the experts' analysis that were pulled from the RAG context. This is crucial for credibility.

You have observed a 3-round adversarial debate (ACE Engine — Adversarial Consensus Engine) 
between 6 expert personas, each with different cognitive frameworks and natural biases.

YOUR TASK: Deliver the definitive technical verdict. 

STRATEGIC SIGNALING (EXECUTIVE):
You must decide on a Strategic Signal:
- SINAL VERDE (Strong Go): No unrefuted technical/financial kill arguments.
- SINAL AMARELO (Conditional Go): Significant risks identified but manageable via recommendations.
- SINAL VERMELHO (Stop/Pivot): Structural flaws or regulatory "kill" arguments were not refuted.

BEFORE WRITING YOUR VERDICT, internally analyze:
1. The 3 strongest surviving arguments (with expert names and which round they held up through).
2. The 2 most devastating UNREFUTED attacks from Round 2.
3. Any critical concessions made in Round 3 that fundamentally changed an expert's position.
4. THE FOUNDER'S INTERVENTION (if present): Did the Founder interject mid-debate? How did it change the consensus?
5. NASH POINT: Where do the Technologist and the Visionary agree?
Base your entire verdict on this evidence hierarchy.

WEIGHTING GUIDE:
- ADVOCACY: If an expert gives a <30 score and their attack wasn't CONCEDED or REFUTED convincingly, the final score MUST stay low.
- COHERENCE: If the Visionary (80+) and Technologist (20-) are in deep conflict, the score should reflect the highest risk, not the average.
- ACE ENGINE: We are NOT here to be nice. We are here to prevent wastage of resources on bad ideas.

STRUCTURE YOUR RESPONSE EXACTLY AS:
${structure}

RULES:
1. Base verdict STRICTLY on debate evidence AND the original idea. 
2. An unrefuted technical or financial 'kill' argument should drop the consensus below 40.
3. Keep the tone elite, adversarial, and high-stakes.
4. Maximum 600 words.
5. Reference specific experts by name when citing evidence.${buildIdeaAnchor(idea)}${langInstruction(lang)}`;
}

// ——— Score Extraction Utility (v3.0 — Supports SCORE: [X] and X/100) —————
function extractScoresFromResults(results: { id: string; text: string }[]): number {
    const scores: number[] = [];
    for (const r of results) {
        // v3.0 format: SCORE: [85] or SCORE: 85
        const v3Match = r.text.match(/SCORE:\s*\[?(\d{1,3})\]?/i);
        if (v3Match) {
            const num = parseInt(v3Match[1], 10);
            if (num >= 0 && num <= 100) {
                scores.push(num);
                continue;
            }
        }
        
        // v2.3 format: 85/100
        const v2Match = r.text.match(/(\d{1,3})\/100/g);
        if (v2Match && v2Match.length > 0) {
            const lastMatch = v2Match[v2Match.length - 1];
            const num = parseInt(lastMatch.replace('/100', ''), 10);
            if (num >= 0 && num <= 100) scores.push(num);
        }
    }
    if (scores.length === 0) return 50;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

// ——— Main Worker (v3.0 ACE Engine) ———————————————————

export async function POST(req: Request) {
    console.log('[Worker] v3.0 — ACE Engine (Adversarial Consensus Engine) starting');
    let body: any = {};
    try {
        body = await req.json() || {};
        const { validationId, runId, tenant_id, user_id, idea, region, sensitivity, useCustomExpert, customPersonaId } = body;

        console.log(`[Worker] Started for run ${runId}, theme: ${idea}, customExpert: ${useCustomExpert}, personaId: ${customPersonaId}`);

        if (!runId || !idea) {
            console.error('[Worker] Missing required params:', { runId, idea: !!idea });
            return apiError('Missing params', 400);
        }

        const supabase = createAdminClient();

        console.log(`[Worker] Starting run ${runId} for idea: ${idea.substring(0, 50)}...`);
        const lang = detectLanguage(idea);
        console.log(`[Worker] Detected language: ${lang}`);
        await addEvent(supabase, runId, 'lang', null, { lang });

        await addEvent(supabase, runId, 'system', null, {
            msg: '🏛️ ACE Engine v3.0 — Adversarial Consensus Engine Initiated\n📚 Hegelian Dialectics · Delphi Method · Red Teaming · Pre-Mortem · Game Theory',
        });

        const { redacted: ideaRedacted, hadPII } = redactPII(idea);
        if (hadPII) {
            await addEvent(supabase, runId, 'system', null, { msg: '🔒 PII detected and redacted.' });
        }

        // --- Embrapa POC Mode Detection ---
        let isEmbrapa = false;
        try {
            const { data: { user: userData } } = await supabase.auth.admin.getUserById(user_id);
            if (userData?.email === 'embrapa@embrapa.com') {
                isEmbrapa = true;
                PERSONA_PROMPTS = PERSONA_PROMPTS_EMBRAPA;
                CONFLICT_MATRIX = EMBRAPA_CONFLICT_MATRIX;
                await addEvent(supabase, runId, 'system', null, { 
                    msg: '🌿 Embrapa POC Mode Active: Loading specialized agricultural research and analytical validation personas.' 
                });
            }
        } catch (err) {
            console.error('[Worker] User lookup error:', err);
        }

        // --- RAG: Vector Search for Context Injection ---
        let contextSnippets = "";
        try {
            await addEvent(supabase, runId, 'system', null, { msg: '🧠 Memory Engine: Activating Vector Search over Codebase...' });
            const embeddingRes = await mistralClient.embeddings.create({
                model: "mistral-embed",
                input: ideaRedacted,
            });
            const queryEmbedding = embeddingRes.data[0].embedding;

            // Only search for repos belonging to this user
            const { data: chunks, error: matchErr } = await supabase.rpc('match_repo_chunks', {
                query_embedding: queryEmbedding,
                match_count: 3,
                // filter_repo_id: We can leave null to search ALL user repos, RLS protects data.
            });

            if (!matchErr && chunks && chunks.length > 0) {
                await addEvent(supabase, runId, 'system', null, { msg: `🔍 Memory Engine: Injected ${chunks.length} hyper-relevant code files into the debate.` });
                contextSnippets = "\n\n=== VERIFIED CODEBASE CONTEXT (RAG MEMORY) ===\nThe following code snippets from the user's database are highly relevant to their query. Use them to ground your technical analysis:\n" +
                    chunks.map((c: any) => `\nFile: ${c.file_path}\n${c.chunk_content}\n---\n`).join('');
            } else {
                await addEvent(supabase, runId, 'system', null, { msg: `🧠 Memory Engine: No relevant code context found for this input.` });
            }
        } catch (err) {
            console.error("[Worker] Memory Engine Error:", err);
        }
        // ------------------------------------------------

        // ══════ CUSTOM EXPERT PERSONA (7th Member) ══════
        let customPersona: any = null;
        let customPersonaContext = '';
        try {
            if (user_id && useCustomExpert !== false && customPersonaId) {
                const { data: cp } = await supabase
                    .from('custom_personas')
                    .select('*')
                    .eq('id', customPersonaId)
                    .eq('user_id', user_id)
                    .single();

                if (cp && cp.document_count > 0) {
                    customPersona = cp;
                    await addEvent(supabase, runId, 'system', null, {
                        msg: `🏢 Custom Expert "${cp.name}" activated — querying internal knowledge base...`,
                    });

                    // RAG query for custom persona context
                    try {
                        const embRes = await mistralClient.embeddings.create({
                            model: 'mistral-embed',
                            input: ideaRedacted,
                        });
                        const qEmb = embRes.data[0].embedding;

                        const { data: personaChunks } = await supabase.rpc('match_persona_chunks', {
                            query_embedding: qEmb,
                            p_persona_id: cp.id,
                            match_count: 5,
                        });

                        if (personaChunks && personaChunks.length > 0) {
                            customPersonaContext = '\n\n=== INTERNAL COMPANY DATA (CONFIDENTIAL) ===\n' +
                                personaChunks.map((c: any) => c.chunk_content).join('\n---\n') +
                                '\n=== END INTERNAL DATA ===';
                            await addEvent(supabase, runId, 'system', null, {
                                msg: `📄 Injected ${personaChunks.length} internal documents into ${cp.name}'s context.`,
                            });
                        }
                    } catch (ragErr) {
                        console.error('[Worker] Custom Persona RAG Error:', ragErr);
                    }
                }
            }
        } catch (cpErr) {
            console.error('[Worker] Custom Persona lookup error:', cpErr);
        }

        const config = getCouncilConfig(region, sensitivity);
        const personas = Object.values(councilConfig.personas);

        // If custom persona exists, add it to the persona array
        if (customPersona) {
            personas.push({
                id: 'custom_expert',
                name: customPersona.name,
                role: customPersona.role || 'Internal Strategic Advisor',
                emoji: customPersona.emoji || '🏢',
                c: customPersona.color || '#6366f1',
                dn: customPersona.name,
            } as any);

            // Add custom model assignment
            (config.assign as any)['custom_expert'] = config.assign['visionary'];
        }

        // ══════ ROUND 1: THESIS (Delphi Method) ══════
        await addEvent(supabase, runId, 'system', null, {
            msg: '📋 ROUND 1 · THESIS — Independent Expert Analysis\n📚 Framework: Delphi Method (RAND Corp, 1963) — Isolated evaluation before cross-examination',
        });

        // 🌿 Embrapa Knowledge Base RAG mapping
        const EMBRAPA_HUBS: Record<string, string> = {
            visionary:    '00000000-0000-0000-0000-0b61e2024003',
            technologist: '00000000-0000-0000-0000-0b61e2024001',
            devil:        '00000000-0000-0000-0000-0b61e2024002',
            ethicist:     '00000000-0000-0000-0000-0b61e2024004',
            marketeer:    '00000000-0000-0000-0000-0b61e2024004',
            financier:    '00000000-0000-0000-0000-0b61e2024002',
        };

        const round1Results = await Promise.all(
            personas.map(async (p) => {
                const t0 = Date.now();
                
                // --- Technical Persona-Specific RAG for Embrapa ---
                let personaEmbrapaContext = "";
                if (isEmbrapa && EMBRAPA_HUBS[p.id]) {
                    try {
                        const embRes = await mistralClient.embeddings.create({
                            model: 'mistral-embed',
                            input: ideaRedacted,
                        });
                        const qEmb = embRes.data[0].embedding;

                        const { data: kChunks } = await supabase.rpc('match_persona_chunks', {
                            query_embedding: qEmb,
                            p_persona_id: EMBRAPA_HUBS[p.id],
                            match_count: 5,
                        });

                        if (kChunks && kChunks.length > 0) {
                            personaEmbrapaContext = "\n\n=== PROTOCOLOS TÉCNICOS ESPECÍFICOS (EVIDÊNCIA RAG) ===\n" +
                                kChunks.map((c: any) => c.chunk_content).join('\n---\n') +
                                "\n=== FIM DA EVIDÊNCIA ===";
                        }
                    } catch (err) {
                        console.error('[Worker] Persona-specific RAG error:', err);
                    }
                }

                try {
                    const assigned = config.assign[p.id as keyof typeof config.assign];
                    const messages = [
                        {
                            role: 'system', content: p.id === 'custom_expert'
                                ? `You are ${customPersona?.name || 'Custom Expert'}, ${customPersona?.role || 'Internal Strategic Advisor'}.
${customPersona?.description || 'You represent the company\'s internal perspective and argue using real internal data.'}

You have access to CONFIDENTIAL INTERNAL COMPANY DATA provided below. Use it to argue with SPECIFIC numbers, dates, and facts from the company's own documents.

RULES:
1. ALWAYS cite specific data from the INTERNAL COMPANY DATA when making claims.
2. If the internal data contradicts other experts, say so explicitly.
3. Your perspective is unique: you know what the company ACTUALLY has (resources, numbers, capabilities).
4. Score the idea 0-100 based on internal feasibility, not just market theory.
5. Maximum 300 words.

Provide your analysis in this format:
## ${customPersona?.name || 'Custom Expert'} Analysis
**Internal Assessment Score: [X]/100**
${customPersonaContext}${langInstruction(lang)}`
                                : buildRound1Prompt(p, lang, ideaRedacted)
                        },
                        { role: 'user', content: `Analyze this objective from your expert perspective:\n\n"${ideaRedacted}"${contextSnippets}${personaEmbrapaContext}` },
                    ];

                    const out = await callModel(assigned, messages, { zdr: config.judge.zdr, maxTokens: 1024, temperature: 0.7 });
                    const text = extractText(out, `Analysis complete by ${p.name}.`);

                    const expertName = isEmbrapa && PERSONA_NAMES_EMBRAPA[p.id] ? PERSONA_NAMES_EMBRAPA[p.id] : p.name;
                    await addEvent(supabase, runId, 'model_msg', p.id, {
                        text, phase: 'round1_analysis', round: 1, persona: expertName, emoji: p.emoji,
                    });

                    await logAICall({
                        validation_id: validationId, tenant_id, layer: 'swarm_r1',
                        provider: assigned.provider, model: assigned.model,
                        latency_ms: Date.now() - t0, status: 'ok',
                    });

                    return { id: p.id, name: p.name, emoji: p.emoji, text };
                } catch (err: any) {
                    console.error(`[R1] ${p.id}:`, err.message);
                    await addEvent(supabase, runId, 'error', p.id, { msg: `R1 failed: ${err.message}` });
                    return { id: p.id, name: p.name, emoji: p.emoji, text: `[Error: ${err.message}]` };
                }
            })
        );

        const r1Avg = extractScoresFromResults(round1Results);
        await addEvent(supabase, runId, 'consensus', null, { coreSync: r1Avg, global: Math.round(r1Avg * 0.7), phase: 'after_round_1' });

        // Fetch any mid-debate Founder interventions before R2
        const getFounderIntel = async () => {
            const { data: founderEvents } = await supabase
                .from('debate_events')
                .select('payload')
                .eq('run_id', runId)
                .eq('model', 'Founder')
                .order('ts', { ascending: true });

            if (founderEvents && founderEvents.length > 0) {
                return founderEvents.map(e => `[🧔 Founder / User]: ${(e.payload as any)?.text}`).join('\n\n');
            }
            return '';
        };

        let founderIntelR2 = await getFounderIntel();
        let transcriptR1 = round1Results.map((r) => `[${r.emoji} ${r.name}]: ${r.text}`).join('\n\n');

        if (founderIntelR2) {
            transcriptR1 += `\n\n=== FOUNDER / USER INTERVENTION ===\n${founderIntelR2}\n===================================`;
        }

        // ══════ ROUND 2: ANTITHESIS (Red Teaming + Dialectical Inquiry) ══════
        await addEvent(supabase, runId, 'system', null, {
            msg: '⚔️ ROUND 2 · ANTITHESIS — Cross-Examination & Stress-Testing\n📚 Framework: Red Teaming (CIA/NSA) + Mason\'s Dialectical Inquiry (1969)\n🎯 Each expert has a PRIMARY ATTACK TARGET based on natural conflict of interest',
        });

        const round2Results = await Promise.all(
            personas.map(async (p) => {
                const t0 = Date.now();
                try {
                    const assigned = config.assign[p.id as keyof typeof config.assign];
                    const messages = [
                        {
                            role: 'system', content: p.id === 'custom_expert'
                                ? `You are ${customPersona?.name || 'Custom Expert'}, ${customPersona?.role || 'Internal Strategic Advisor'}.
You are cross-examining the other experts using REAL INTERNAL DATA.

Your ATTACK PROTOCOL:
1. Find where other experts made ASSUMPTIONS that your internal data DISPROVES.
2. Challenge unrealistic projections with your actual company numbers.
3. Identify opportunities that only someone with internal knowledge would see.
4. Maximum 250 words.
${customPersonaContext}${langInstruction(lang)}`
                                : buildRound2AttackPrompt(p, lang, ideaRedacted)
                        },
                        { role: 'user', content: `Original idea: "${ideaRedacted}"\n\n=== ROUND 1 ANALYSES ===\n${transcriptR1}\n\nExecute your attack protocol. Primary target first, then secondary scan.` },
                    ];

                    const out = await callModel(assigned, messages, { zdr: config.judge.zdr, maxTokens: 900, temperature: 0.5 });
                    const text = extractText(out, `Challenge complete by ${p.name}.`);

                    const expertName = isEmbrapa && PERSONA_NAMES_EMBRAPA[p.id] ? PERSONA_NAMES_EMBRAPA[p.id] : p.name;
                    await addEvent(supabase, runId, 'model_msg', p.id, {
                        text, phase: 'round2_attack', round: 2, persona: expertName, emoji: p.emoji,
                    });

                    await logAICall({
                        validation_id: validationId, tenant_id, layer: 'swarm_r2',
                        provider: assigned.provider, model: assigned.model,
                        latency_ms: Date.now() - t0, status: 'ok',
                    });

                    return { id: p.id, name: p.name, emoji: p.emoji, text };
                } catch (err: any) {
                    console.error(`[R2] ${p.id}:`, err.message);
                    return { id: p.id, name: p.name, emoji: p.emoji, text: `[Error: ${err.message}]` };
                }
            })
        );

        const r2Avg = extractScoresFromResults(round2Results);
        const r2Consensus = Math.round((r1Avg + r2Avg) / 2);
        await addEvent(supabase, runId, 'consensus', null, { coreSync: r2Consensus, global: Math.round(r2Consensus * 0.85), phase: 'after_round_2' });

        let founderIntelR3 = await getFounderIntel();
        let transcriptR2 = round2Results.map((r) => `[${r.emoji} ${r.name}]: ${r.text}`).join('\n\n');

        if (founderIntelR3) {
            transcriptR2 += `\n\n=== FOUNDER / USER INTERVENTION ===\n${founderIntelR3}\n===================================`;
        }

        // ══════ ROUND 3: SYNTHESIS (Hegelian Dialectics) ══════
        await addEvent(supabase, runId, 'system', null, {
            msg: '🟢 ROUND 3 · SYNTHESIS — Concession, Refinement & Convergence\n📚 Framework: Hegelian Dialectics (1807) — Refined truth emerges from thesis + antithesis',
        });

        const round3Results = await Promise.all(
            personas.map(async (p) => {
                const t0 = Date.now();
                try {
                    const assigned = config.assign[p.id as keyof typeof config.assign];
                    const myR1 = round1Results.find((r) => r.id === p.id)?.text || '';
                    const attacksOnMe = round2Results
                        .filter((r) => r.id !== p.id && r.text.toLowerCase().includes(p.name.toLowerCase()))
                        .map((r) => `[${r.emoji} ${r.name}]: ${r.text}`)
                        .join('\n\n');

                    const messages = [
                        { role: 'system', content: buildRound3DefensePrompt(p, lang, ideaRedacted) },
                        {
                            role: 'user',
                            content: `Original idea: "${ideaRedacted}"\n\nYOUR ROUND 1 ANALYSIS:\n${myR1}\n\nATTACKS AGAINST YOU:\n${attacksOnMe || 'No direct attacks.'}\n\nALL ROUND 2 CHALLENGES:\n${transcriptR2}\n\nExecute synthesis protocol: Concede → Refine → Final Score.`,
                        },
                    ];

                    const out = await callModel(assigned, messages, { zdr: config.judge.zdr, maxTokens: 800, temperature: 0.3 });
                    const text = extractText(out, `Defense complete by ${p.name}.`);

                    const expertName = isEmbrapa && PERSONA_NAMES_EMBRAPA[p.id] ? PERSONA_NAMES_EMBRAPA[p.id] : p.name;
                    await addEvent(supabase, runId, 'model_msg', p.id, {
                        text, phase: 'round3_defense', round: 3, persona: expertName, emoji: p.emoji,
                    });

                    await logAICall({
                        validation_id: validationId, tenant_id, layer: 'swarm_r3',
                        provider: assigned.provider, model: assigned.model,
                        latency_ms: Date.now() - t0, status: 'ok',
                    });

                    return { id: p.id, name: p.name, emoji: p.emoji, text };
                } catch (err: any) {
                    console.error(`[R3] ${p.id}:`, err.message);
                    return { id: p.id, name: p.name, emoji: p.emoji, text: `[Error: ${err.message}]` };
                }
            })
        );

        const r3Avg = extractScoresFromResults(round3Results);
        const r3Consensus = Math.round((r1Avg + r2Consensus + r3Avg) / 3);
        await addEvent(supabase, runId, 'consensus', null, { coreSync: r3Consensus, global: Math.round(r3Consensus * 0.9), phase: 'after_round_3', protocol: 'ACE_v3.0' });

        // ——— EMBRAPA v5.0 Extra Rounds ———
        let transcriptExtra = "";
        let finalExecutionData: any = null;
        let round4Results: any[] = [];
        let round5Results: any[] = [];
        let round6Results: any[] = [];

        if (isEmbrapa) {
            await addEvent(supabase, runId, 'system', null, {
                msg: '🧬 PROTOCOLO v5.0 ATIVADO: Iniciando Rondas de Consenso, Cenários e Execução...',
            });

            // Round 4: Consensus
            round4Results = await Promise.all(personas.map(async (p) => {
                const assigned = config.assign[p.id as keyof typeof config.assign];
                const out = await callModel(assigned, [{ role: 'system', content: buildRound4ConsensusPrompt(p, lang, true) }, { role: 'user', content: `Refine consensus based on:\n\n${transcriptR3}` }], { zdr: config.judge.zdr });
                const text = extractText(out, '');
                const expertName = PERSONA_NAMES_EMBRAPA[p.id] || p.name;
                await addEvent(supabase, runId, 'model_msg', p.id, { text, phase: 'round4_consensus', round: 4, persona: expertName, emoji: p.emoji });
                return { id: p.id, name: expertName, text };
            }));

            // Round 5: Scenario
            const transcriptR4 = round4Results.map(r => `[${r.name}]: ${r.text}`).join('\n\n');
            round5Results = await Promise.all(personas.map(async (p) => {
                const assigned = config.assign[p.id as keyof typeof config.assign];
                const out = await callModel(assigned, [{ role: 'system', content: buildRound5ScenarioPrompt(p, lang, true) }, { role: 'user', content: `Test consensus against scenarios:\n\n${transcriptR4}` }], { zdr: config.judge.zdr });
                const text = extractText(out, '');
                const expertName = PERSONA_NAMES_EMBRAPA[p.id] || p.name;
                await addEvent(supabase, runId, 'model_msg', p.id, { text, phase: 'round5_scenario', round: 5, persona: expertName, emoji: p.emoji });
                return { id: p.id, name: expertName, text };
            }));

            // Round 6: Execution
            const transcriptR5 = round5Results.map(r => `[${r.name}]: ${r.text}`).join('\n\n');
            round6Results = await Promise.all(personas.map(async (p) => {
                const assigned = config.assign[p.id as keyof typeof config.assign];
                const out = await callModel(assigned, [{ role: 'system', content: buildRound6ExecutionPrompt(p, lang, true) }, { role: 'user', content: `Provide execution roadmap based on scenarios:\n\n${transcriptR5}` }], { zdr: config.judge.zdr });
                const text = extractText(out, '');
                const expertName = PERSONA_NAMES_EMBRAPA[p.id] || p.name;
                await addEvent(supabase, runId, 'model_msg', p.id, { text, phase: 'round6_execution', round: 6, persona: expertName, emoji: p.emoji });
                return { id: p.id, name: expertName, text };
            }));

            transcriptExtra = `\n\n=== ROUND 4: CONSENSUS ===\n${transcriptR4}\n\n=== ROUND 5: SCENARIOS ===\n${transcriptR5}\n\n=== ROUND 6: EXECUTION ROADMAP ===\n${round6Results.map(r => `[${r.name}]: ${r.text}`).join('\n\n')}`;
            finalExecutionData = round6Results;
        }

        // ══════ JUDGE: Nash Equilibrium Verdict ══════
        let founderIntelFinal = await getFounderIntel();
        const transcriptR3 = round3Results.map((r) => `[${r.emoji} ${r.name}]: ${r.text}`).join('\n\n');

        let fullTranscript = `=== ROUND 1: THESIS ===\n${transcriptR1}\n\n=== ROUND 2: ATTACK ===\n${transcriptR2}\n\n=== ROUND 3: SYNTHESIS ===\n${transcriptR3}${transcriptExtra}`;

        if (founderIntelFinal) {
            fullTranscript += `\n\n=== FOUNDER / USER INTERVENTION ===\n${founderIntelFinal}\n===================================`;
        }

        await addEvent(supabase, runId, 'system', null, {
            msg: isEmbrapa ? '⚖️ VEREDITO CIENTÍFICO FINAL — Auditoria de Evidências v5.0' : '⚖️ VERDICT · NASH EQUILIBRIUM — Judge Deliberating',
        });

        let finalScore = 0;

        try {
            const judgeModel: ModelConfig = { provider: 'openrouter', model: config.judge.primary };
            const judgeMessages = [
                { role: 'system', content: buildJudgePrompt(lang, ideaRedacted, isEmbrapa) },
                { role: 'user', content: `Deliver your verdict on:\n\n"${ideaRedacted}"\n\nFULL SCIENTIFIC DEBATE (${isEmbrapa ? '6' : '3'} rounds):\n\n${fullTranscript}` },
            ];

            const judgeOut = await callModel(judgeModel, judgeMessages, { zdr: config.judge.zdr, maxTokens: 2000, temperature: 0.2 });
            const judgeText = extractText(judgeOut, 'Judge deliberation complete.');

            const scoreMatch = judgeText.match(/(\d{1,3})\/100/);
            finalScore = scoreMatch ? Math.min(parseInt(scoreMatch[1]), 100) : 50;

            await addEvent(supabase, runId, 'judge_note', isEmbrapa ? 'Auditores de Ciência Embrapa' : 'judge', {
                text: judgeText, type: 'final_verdict', consensusDelta: finalScore,
            });

            await supabase.from('validations').update({
                status: 'complete', consensus_score: finalScore,
                full_result: {
                    lang,
                    protocol: isEmbrapa ? 'EMBRAPA_v5.0' : 'ACE_v3.0',
                    judge: judgeText, 
                    round1: round1Results,
                    round2: round2Results, 
                    round3: round3Results,
                    round4: isEmbrapa ? round4Results : null,
                    round5: isEmbrapa ? round5Results : null,
                    round6: isEmbrapa ? round6Results : null,
                    is_embrapa: isEmbrapa
                },
            }).eq('id', validationId);

            await trackUsage({ tenant_id, validation_id: validationId });
            await triggerWebhook({
                tenant_id, event: 'debate.complete',
                payload: { validation_id: validationId, consensus_score: finalScore, rounds: 3, models_used: 7, protocol: 'ACE_v3.0' },
            });
        } catch (err: any) {
            console.error('[Judge] Primary failed:', err.message);

            try {
                const fbModel: ModelConfig = { provider: 'openrouter', model: config.judge.fallback };
                const fbMessages = [
                    { role: 'system', content: buildJudgePrompt(lang, ideaRedacted) },
                    { role: 'user', content: `Verdict on:\n"${ideaRedacted}"\n\n${fullTranscript}` },
                ];
                const fbOut = await callModel(fbModel, fbMessages, { zdr: config.judge.zdr, maxTokens: 1500, temperature: 0.2 });
                const fbText = extractText(fbOut, 'Fallback judge complete.');
                const sm = fbText.match(/(\d{1,3})\/100/);
                finalScore = sm ? Math.min(parseInt(sm[1]), 100) : 50;

                await addEvent(supabase, runId, 'judge_note', isEmbrapa ? 'Specialized Agent Judge' : 'judge', {
                    text: fbText, type: 'final_verdict_fallback', consensusDelta: finalScore,
                });
            } catch (fbErr: any) {
                console.error('[Judge] Fallback also failed:', fbErr.message);
                await addEvent(supabase, runId, 'error', isEmbrapa ? 'Specialized Agent Judge' : 'judge', {
                    msg: `Both judges failed: ${err.message} | ${fbErr.message}`,
                });
            }

            await supabase.from('validations').update({
                status: 'complete', consensus_score: finalScore,
                full_result: { lang, protocol: 'ACE_v3.0', judge: `Error: ${err.message}`, round1: round1Results, round2: round2Results, round3: round3Results },
            }).eq('id', validationId);
        }

        // ══════ COMPLETE ══════
        await addEvent(supabase, runId, 'complete', null, {
            validationId, consensus_score: finalScore, status: 'complete', protocol: 'ACE_v3.0',
        });
        await supabase.from('debate_runs').update({ status: 'complete' }).eq('id', runId);

        console.log(`[Worker] ✅ ${runId} complete. Score: ${finalScore}/100 | Lang: ${lang} | Engine: ACE_v3.0`);
        return apiOk({ runId, validationId, score: finalScore });
    } catch (error: any) {
        console.error('[Worker] Fatal:', error);
        
        // Ensure the database reflects the failure so it doesn't stay "Pending" indefinitely
        try {
            if (body?.validationId || body?.runId) {
                const supabase = createAdminClient();
                if (body.validationId) await supabase.from('validations').update({ status: 'error' }).eq('id', body.validationId);
                if (body.runId) await supabase.from('debate_runs').update({ status: 'error' }).eq('id', body.runId);
            }
        } catch (dbErr) {
            console.error('[Worker] Emergency status update failed:', dbErr);
        }

        return apiError(error.message, 500);
    }
}





