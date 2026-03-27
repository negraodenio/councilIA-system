/**
 * Round 3: Synthesis (v7.3.1)
 * Final refinement before judgment
 */

import { RoundResult, PersonaResponse } from '../types';
import OpenAI from 'openai';
import { getSystemPrompt } from '../prompts';

const PERSONAS = [
  { id: 'visionary', name: 'Visionário / Inovação' },
  { id: 'technologist', name: 'Especialista Técnico / Cientista' },
  { id: 'devil', name: 'Auditor de Riscos / Crítico' },
  { id: 'marketeer', name: 'Adoção de Mercado / Operador' },
  { id: 'ethicist', name: 'Estrategista Regulatório / Ética' },
  { id: 'financier', name: 'Analista Financeiro / ROI' }
];

export async function executeRound3(
  proposal: string, 
  prevRound: RoundResult,
  docs: any[], 
  isEmbrapa: boolean = false
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

    return {
      persona: p.name,
      analysis: text,
      score: score,
      unrefuted_risks: [],
      kill_condition_triggered: text.toLowerCase().includes('kill condition') || text.toLowerCase().includes('no-go')
    };
  }));

  return { round: 3, responses };
}
