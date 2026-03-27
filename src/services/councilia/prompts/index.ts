// src/services/councilia/prompts/index.ts
import { PERSONA_PROMPTS_V3_0 } from '@/app/api/session/worker/prompts_v3_0';
import { 
  PERSONA_PROMPTS_EMBRAPA, 
  EMBRAPA_GLOBAL_LAYER, 
  EMBRAPA_ROUNDS, 
  EMBRAPA_JUDGE_PROTOCOL, 
  EMBRAPA_NARRATIVE 
} from '@/app/api/session/worker/prompts_embrapa';

export const PROTOCOL_VERSION = '7.3.1';

export function getSystemPrompt(round: number, personaId: string, isEmbrapa: boolean, lang: string = 'Portuguese') {
  const prompts = isEmbrapa ? PERSONA_PROMPTS_EMBRAPA : PERSONA_PROMPTS_V3_0;
  let cognitivePrompt = prompts[personaId] || '';
  
  if (personaId === 'judge' && isEmbrapa) {
    cognitivePrompt = EMBRAPA_JUDGE_PROTOCOL;
  }

  const globalLayer = isEmbrapa ? EMBRAPA_GLOBAL_LAYER : '';
  const narrative = isEmbrapa ? EMBRAPA_NARRATIVE : '';
  
  const roundInstructions = isEmbrapa 
    ? EMBRAPA_ROUNDS[round] 
    : getStandardRoundInstruction(round);

  const jsonSchema = personaId === 'judge' ? `
    RESPONSE MUST BE VALID JSON:
    {
      "judgeRationale": "PARECER TÉCNICO DECISIVO (Portuguese). 
                         RULES:
                         1. DIRECT ANSWERS: Responda exatamente COMO resolver o dilema técnico.
                         2. INLINE CITATIONS: Use citações [SOURCE: ...] DENTRO do fluxo do texto (ex: 'Conforme RDC 166/2017 [SOURCE: RDC 166/2017]...').
                         3. DECISION RULES: 
                            - Casos limítrofes: Adote 'Zona de Ambiguidade' equivalente à 'Incerteza Expandida (k=2)' para não penalizar o produtor.
                            - Conflito de Labs: Prevalece laboratório acreditado (PEP), salvo evidência de 'vício de amostragem'.
                         4. STRUCTURE: 
                            ### 1. DECISÃO IMEDIATA
                            ### 2. SÍNTESE TÉCNICA (Analise CV% e Reprodutibilidade)
                            ### 3. FONTES E REFERÊNCIAS (Lista auditada)",
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

  return `${narrative}\n${globalLayer}\n${cognitivePrompt}\n\n${roundInstructions}\n\n${jsonSchema}\n\nRESPOND ENTIRELY IN ${lang.toUpperCase()}.`;
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
