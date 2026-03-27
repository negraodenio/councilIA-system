/**
 * Round 2: Antithesis (v7.3.2 - High Availability)
 */

import { CouncilIAEvent, PersonaResponse, RoundResult } from '@/types/councilia-universal';
import { getSystemPrompt } from '../prompts';
import { callLLM } from '../provider';
import { executeWithTimeout } from '../utils';

const PERSONAS = [
  { id: 'visionary', name: 'Visionário / Inovação', emoji: '💡', embrapa: 'Visionário Embrapa' },
  { id: 'technologist', name: 'Especialista Técnico / Cientista', emoji: '🔬', embrapa: 'Cientista Analítico' },
  { id: 'devil', name: 'Auditor de Riscos / Crítico', emoji: '👺', embrapa: 'Auditor de Riscos ZARC' },
  { id: 'marketeer', name: 'Adoção de Mercado / Operador', emoji: '📈', embrapa: 'Analista de Mercado/Safra' },
  { id: 'ethicist', name: 'Estrategista Regulatório / Ética', emoji: '⚖️', embrapa: 'Gestor Ambiental/Ético' },
  { id: 'financier', name: 'Analista Financeiro / ROI', emoji: '💰', embrapa: 'Analista de Fomento (BNDES)' }
];

const PERSONA_TIMEOUT = 35000;

export async function executeRound2(
  proposal: string, 
  prevRound: RoundResult,
  docs: any[], 
  isEmbrapa: boolean = false,
  onEvent?: (event: CouncilIAEvent) => Promise<void>
): Promise<RoundResult> {
  const transcript = prevRound.responses.map(r => `[${r.persona}]: ${r.analysis}`).join('\n\n');
  
  const personaResults = await Promise.allSettled(PERSONAS.map(async (p) => {
    const pName = isEmbrapa ? p.embrapa : p.name;
    try {
      const systemPrompt = getSystemPrompt(2, p.id, isEmbrapa);
      const userPrompt = `PROPOSTA: ${proposal}\n\nRESULTADOS DA RODADA 1:\n${transcript}`;

      const text = await executeWithTimeout(
        callLLM([
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ], { temperature: 0.5, model: 'openai/gpt-4o-mini' }),
        PERSONA_TIMEOUT
      );

      if (onEvent) {
        await onEvent({
          type: 'model_msg',
          personaId: p.id,
          payload: { text, phase: 'r2', round: 2, persona: pName, emoji: p.emoji }
        });
      }

      return {
        persona: pName,
        analysis: text,
        score: 50,
        unrefuted_risks: [],
        kill_condition_triggered: false
      };
    } catch (err: any) {
      console.warn(`[Round2] High-Availability Fallback for ${p.id}:`, err.message);
      const fallbackText = `[ESTADO DE SEGURANÇA] ${pName} não pôde concluir a contestação a tempo. Mantendo registro de análise preliminar.`;

      if (onEvent) {
        await onEvent({
          type: 'model_msg',
          personaId: p.id,
          payload: { text: fallbackText, phase: 'r2', round: 2, persona: pName, emoji: p.emoji }
        });
      }

      return {
        persona: pName,
        analysis: fallbackText,
        score: 50,
        unrefuted_risks: [],
        kill_condition_triggered: false
      };
    }
  }));

  const responses = personaResults.map((r, i) => {
    if (r.status === 'fulfilled') return r.value;
    const p = PERSONAS[i];
    return {
      persona: isEmbrapa ? p.embrapa : p.name,
      analysis: 'Erro crítico de execução na persona. Fallback de emergência aplicado.',
      score: 50,
      unrefuted_risks: [],
      kill_condition_triggered: false
    };
  });

  return { round: 2, responses: responses as PersonaResponse[] };
}
