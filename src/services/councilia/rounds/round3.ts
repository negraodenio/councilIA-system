/**
 * Round 3: Synthesis (v7.3.1)
 * Final refinement before judgment
 */

import { RoundResult, PersonaResponse } from '../types';
import OpenAI from 'openai';
import { getSystemPrompt } from '../prompts';
import { CouncilIAEvent } from '@/types/councilia-universal';

const PERSONAS = [
  { id: 'visionary', name: 'Visionário / Inovação', emoji: '💡', embrapa: 'Visionário Embrapa' },
  { id: 'technologist', name: 'Especialista Técnico / Cientista', emoji: '🔬', embrapa: 'Cientista Analítico' },
  { id: 'devil', name: 'Auditor de Riscos / Crítico', emoji: '👺', embrapa: 'Auditor de Riscos ZARC' },
  { id: 'marketeer', name: 'Adoção de Mercado / Operador', emoji: '📈', embrapa: 'Analista de Mercado/Safra' },
  { id: 'ethicist', name: 'Estrategista Regulatório / Ética', emoji: '⚖️', embrapa: 'Gestor Ambiental/Ético' },
  { id: 'financier', name: 'Analista Financeiro / ROI', emoji: '💰', embrapa: 'Analista de Fomento (BNDES)' }
];

export async function executeRound3(
  proposal: string, 
  prevRound: RoundResult,
  docs: any[], 
  isEmbrapa: boolean = false,
  onEvent?: (event: CouncilIAEvent) => Promise<void>
): Promise<RoundResult> {
  const openai = new OpenAI();
  const transcript = prevRound.responses.map(r => `[${r.persona}]: ${r.analysis}`).join('\n\n');
  
  const responses: PersonaResponse[] = await Promise.all(PERSONAS.map(async (p) => {
    const systemPrompt = getSystemPrompt(3, p.id, isEmbrapa);
    const userPrompt = `PROPOSTA: ${proposal}\n\nTRANSCRITO DO CONFLITO (RODADA 2):\n${transcript}\n\nREALIZE SUA SÍNTESE FINAL E ATUALIZE SEU SCORE.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3
    });

    const text = response.choices[0].message.content || 'Erro na deliberação.';
    const scoreMatch = text.match(/Score:?\s*\[?(\d{1,3})\]?/i) || text.match(/(\d{1,3})\/100/);
    const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 50;
    const pName = isEmbrapa ? p.embrapa : p.name;

    // --- TELEMETRY EMISSION ---
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
  }));

  return { round: 3, responses };
}
