/**
 * Round 3: Synthesis (v7.3.2 - High Availability)
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

export async function executeRound3(
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
      const systemPrompt = getSystemPrompt(3, p.id, isEmbrapa);
      const userPrompt = `PROPOSTA: ${proposal}\n\nTRANSCRITO DO CONFLITO (RODADA 2):\n${transcript}\n\nREALIZE SUA SÍNTESE FINAL E ATUALIZE SEU SCORE.`;

      const text = await executeWithTimeout(
        callLLM([
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ], { temperature: 0.3, model: 'openai/gpt-4o-mini' }),
        PERSONA_TIMEOUT
      );

      const scoreMatch = text.match(/Score:?\s*\[?(\d{1,3})\]?/i) || text.match(/(\d{1,3})\/100/);
      const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 50;

      if (onEvent) {
        await onEvent({
          type: 'model_msg',
          personaId: p.id,
          payload: { text, phase: 'r3', round: 3, persona: pName, emoji: p.emoji }
        });
      }

      return {
        persona: pName,
        analysis: text,
        score: score,
        unrefuted_risks: [],
        kill_condition_triggered: text.toLowerCase().includes('kill condition') || text.toLowerCase().includes('no-go')
      };
    } catch (err: any) {
      console.warn(`[Round3] High-Availability Fallback for ${p.id}:`, err.message);
      const fallbackText = `[ESTADO DE SEGURANÇA] ${pName} entrou em modo de reserva técnica devido à latência. Score nominal: 50.`;

      if (onEvent) {
        await onEvent({
          type: 'model_msg',
          personaId: p.id,
          payload: { text: fallbackText, phase: 'r3', round: 3, persona: pName, emoji: p.emoji }
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

  return { round: 3, responses: responses as PersonaResponse[] };
}
