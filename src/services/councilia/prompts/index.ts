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
  const cognitivePrompt = prompts[personaId] || '';
  const globalLayer = isEmbrapa ? EMBRAPA_GLOBAL_LAYER : '';
  const narrative = isEmbrapa ? EMBRAPA_NARRATIVE : '';
  
  const roundInstructions = isEmbrapa 
    ? EMBRAPA_ROUNDS[round] 
    : getStandardRoundInstruction(round);

  return `${narrative}\n${globalLayer}\n${cognitivePrompt}\n\n${roundInstructions}\n\nRESPOND ENTIRELY IN ${lang.toUpperCase()}.`;
}

function getStandardRoundInstruction(round: number): string {
  switch(round) {
    case 1: return "ROUND 1 — THESIS. Provide substantive analysis. Score 0-100.";
    case 2: return "ROUND 2 — ANTITHESIS. Challenge the others. Identify gaps.";
    case 3: return "ROUND 3 — SYNTHESIS. Concede, Refine, Update score.";
    case 0: return "FINAL VERDICT — You are the Supreme Judge. synthesize the debate into a STERN, STRATEGIC JSON verdict. No conversational filler.";
    default: return "DELIBERATION PHASE. Analyze and evaluate.";
  }
}
