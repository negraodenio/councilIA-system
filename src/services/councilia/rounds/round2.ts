/**
 * Round 2: Antithesis (v7.3.1)
 * Adversarial cross-examination
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

export async function executeRound2(
  proposal: string, 
  prevRound: RoundResult,
  docs: any[], 
  isEmbrapa: boolean = false
): Promise<RoundResult> {
  const openai = new OpenAI();
  const transcript = prevRound.responses.map(r => `[${r.persona}]: ${r.analysis}`).join('\n\n');
  
  const responses: PersonaResponse[] = await Promise.all(PERSONAS.map(async (p) => {
    const systemPrompt = getSystemPrompt(2, p.id, isEmbrapa);
    const userPrompt = `PROPOSTA: ${proposal}\n\nRESULTADOS DA RODADA 1:\n${transcript}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.5
    });

    const text = response.choices[0].message.content || 'Erro na deliberação.';
    return {
      persona: p.name,
      analysis: text,
      score: 50, // Scores are refined in Round 3
      unrefuted_risks: [],
      kill_condition_triggered: false
    };
  }));

  return { round: 2, responses };
}
