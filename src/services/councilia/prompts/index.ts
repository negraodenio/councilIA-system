// src/services/councilia/prompts/index.ts
import { PERSONA_PROMPTS_V3_0 } from '@/app/api/session/worker/prompts_v3_0';

export const PROTOCOL_VERSION = '12.0.0';

export function getSystemPrompt(round: number, personaId: string, lang: string = 'Portuguese') {
  const prompts = PERSONA_PROMPTS_V3_0;
  let cognitivePrompt = prompts[personaId] || '';
  
  const roundInstructions = getStandardRoundInstruction(round);

  const jsonSchema = personaId === 'judge' ? `
    RESPONSE MUST BE VALID JSON:
    {
      "decisaoImediata": "RESUMO DA DECISÃO (Apenas conteúdo, SEM títulos). 
                         RULES: 
                         - Resolva conflito (Acreditado ISO 17025/PEP > Não-acreditado).
                         - Resolva solo limítrofe via Incerteza Expandida (k=2) e Guard-bands.
                         - PROIBIDO incluir '1. Decisão Imediata' no texto.",
      "sinteseTecnica": "CONSTRUÇÃO CIENTÍFICA (Apenas conteúdo, SEM títulos). 
                         RULES:
                         - Analise CV% e reprodutibilidade (ISO 5725).
                         - Use citações [SOURCE: Norma].
                          - Use citações [SOURCE: Norma].
                          - PROIBIDO incluir '2. Síntese Técnica' no texto.",
       "fontesEvidencia": "LISTA DE NORMAS (Apenas nomes, SEM títulos).",
       "executiveVerdict": {
         "verdict": "GO|CONDITIONAL|NO-GO",
         "verdictEmoji": "🟢|🟡|🔴",
         "score": 0-100,
         "scoreBreakdown": { "technical": 0, "regulatory": 0, "economic": 0, "social": 0 },
         "confidence": { "level": "HIGH|MEDIUM|LOW", "evidenceDensity": "high|moderate|low", "validationStatus": "string" },
         "var": { "percentage": 0, "drivers": ["string"], "interpretation": "string" }
       },
       "criticalRisks": [ { "id": 1, "name": "string", "violates": "string", "evidence": "string", "impact": "string", "mitigation": "string", "status": "OPEN" } ],
       "consensusAnalysis": { "strengthPercentage": 0, "strengthLabel": "string", "dissentDrivers": ["string"], "interpretation": "string" },
       "evidenceAudit": { "highConfidence": ["string"], "mediumConfidence": ["string"], "unsupported": ["string"] },
       "actionPlan": { "actions": [ { "id": "1", "name": "string", "owner": "string", "deadline": "string" } ] },
       "decisionRule": { "proceedOnlyIf": ["string"], "otherwise": "string" }
    }
  ` : '';

  return `${cognitivePrompt}\n\n${roundInstructions}\n\n${jsonSchema}\n\nRESPOND ENTIRELY IN ${lang.toUpperCase()}.`;
}

function getStandardRoundInstruction(round: number): string {
  switch(round) {
    case 1: return "ROUND 1 — THESIS. Provide substantive analysis. Score 0-100.";
    case 2: return "ROUND 2 — ANTITHESIS. Challenge the others. Identify gaps.";
    case 3: return "ROUND 3 — SYNTHESIS. Concede, Refine, Update score.";
    case 0: return "FINAL VERDICT — You are the Supreme Institutional Judge. Provide a STERN, STRATEGIC 'PARECER TÉCNICO PROFISSIONAL' (Technical Opinion). Synthesize the debate into a high-authority JSON verdict. This text will be used for board-level decision support and sales auditing. No conversational filler.";
    default: return "DELIBERATION PHASE. Analyze and evaluate.";
  }
}
