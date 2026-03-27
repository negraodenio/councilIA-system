/**
 * Round 1: Thesis (v7.3.1.8 - Anti-Deadlock)
 */

import { CouncilIAEvent, PersonaResponse, RoundResult } from '@/types/councilia-universal';
import { getSystemPrompt } from '../prompts';
import { callLLM } from '../provider';

const PERSONAS = [
  { id: 'visionary', name: 'Visionário / Inovação', emoji: '💡', embrapa: 'Visionário Embrapa' },
  { id: 'technologist', name: 'Especialista Técnico / Cientista', emoji: '🔬', embrapa: 'Cientista Analítico' },
  { id: 'devil', name: 'Auditor de Riscos / Crítico', emoji: '👺', embrapa: 'Auditor de Riscos ZARC' },
  { id: 'marketeer', name: 'Adoção de Mercado / Operador', emoji: '📈', embrapa: 'Analista de Mercado/Safra' },
  { id: 'ethicist', name: 'Estrategista Regulatório / Ética', emoji: '⚖️', embrapa: 'Gestor Ambiental/Ético' },
  { id: 'financier', name: 'Analista Financeiro / ROI', emoji: '💰', embrapa: 'Analista de Fomento (BNDES)' }
];

export async function executeRound1(
  proposal: string, 
  docs: any[], 
  isEmbrapa: boolean = false,
  onEvent?: (event: CouncilIAEvent) => Promise<void>
): Promise<RoundResult> {
  const personaResults = await Promise.allSettled(PERSONAS.map(async (p) => {
    try {
      const systemPrompt = getSystemPrompt(1, p.id, isEmbrapa);
      const userPrompt = `PROPOSTA PARA ANÁLISE: ${proposal}\n\nCONTEXTO RAG: ${JSON.stringify(docs)}`;

      const text = await callLLM([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ], { temperature: 0.4, model: 'openai/gpt-4o-mini' });

      const scoreMatch = text.match(/Score:?\s*\[?(\d{1,3})\]?/i) || text.match(/(\d{1,3})\/100/);
      const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 50;
      const pName = isEmbrapa ? p.embrapa : p.name;

      if (onEvent) {
        await onEvent({
          type: 'model_msg',
          personaId: p.id,
          payload: { text, phase: 'r1', round: 1, persona: pName, emoji: p.emoji }
        });
      }

      return {
        persona: pName,
        analysis: text,
        score: score,
        unrefuted_risks: [],
        kill_condition_triggered: text.toLowerCase().includes('kill condition') || text.toLowerCase().includes('no-go')
      };
    } catch (err) {
      const pName = isEmbrapa ? p.embrapa : p.name;
      console.warn(`[Round1] Persona ${p.id} failed:`, err);
      return {
        persona: pName,
        analysis: "Análise postergada devido à latência técnica do especialista. (Modo de Segurança)",
        score: 50,
        unrefuted_risks: [],
        kill_condition_triggered: false
      };
    }
  }));

  const responses = personaResults.map(r => r.status === 'fulfilled' ? r.value : {
    persona: 'Especialista Indisponível',
    analysis: 'Erro na deliberação do especialista.',
    score: 50,
    unrefuted_risks: [],
    kill_condition_triggered: false
  });

  return { round: 1, responses: responses as PersonaResponse[] };
}
