/**
 * Round 2: Antithesis (v7.3.1)
 */

import { RoundResult, PersonaResponse } from '../types';
import { getSystemPrompt } from '../prompts';
import { CouncilIAEvent } from '@/types/councilia-universal';
import { callLLM } from '../provider';

const PERSONAS = [
  { id: 'visionary', name: 'Visionário / Inovação', emoji: '💡', embrapa: 'Visionário Embrapa' },
  { id: 'technologist', name: 'Especialista Técnico / Cientista', emoji: '🔬', embrapa: 'Cientista Analítico' },
  { id: 'devil', name: 'Auditor de Riscos / Crítico', emoji: '👺', embrapa: 'Auditor de Riscos ZARC' },
  { id: 'marketeer', name: 'Adoção de Mercado / Operador', emoji: '📈', embrapa: 'Analista de Mercado/Safra' },
  { id: 'ethicist', name: 'Estrategista Regulatório / Ética', emoji: '⚖️', embrapa: 'Gestor Ambiental/Ético' },
  { id: 'financier', name: 'Analista Financeiro / ROI', emoji: '💰', embrapa: 'Analista de Fomento (BNDES)' }
];

export async function executeRound2(
  proposal: string, 
  prevRound: RoundResult,
  docs: any[], 
  isEmbrapa: boolean = false,
  onEvent?: (event: CouncilIAEvent) => Promise<void>
): Promise<RoundResult> {
  const transcript = prevRound.responses.map(r => `[${r.persona}]: ${r.analysis}`).join('\n\n');
  
  const responses: PersonaResponse[] = await Promise.all(PERSONAS.map(async (p) => {
    const systemPrompt = getSystemPrompt(2, p.id, isEmbrapa);
    const userPrompt = `PROPOSTA: ${proposal}\n\nRESULTADOS DA RODADA 1:\n${transcript}`;

    const text = await callLLM([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ], { temperature: 0.5 });

    const pName = isEmbrapa ? p.embrapa : p.name;

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
  }));

  return { round: 2, responses };
}
