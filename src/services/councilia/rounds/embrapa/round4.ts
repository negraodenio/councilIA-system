/**
 * Round 4: Consensus (Embrapa Elite)
 */

import { RoundResult, PersonaResponse } from '../../types';
import OpenAI from 'openai';
import { getSystemPrompt } from '../../prompts';

const PERSONAS = [
  { id: 'visionary', name: 'Gestor de Inovação' },
  { id: 'technologist', name: 'Cientista Analítico' },
  { id: 'devil', name: 'Auditor de Qualidade' },
  { id: 'marketeer', name: 'Transferência de Tecnologia' },
  { id: 'ethicist', name: 'Estrategista Regulatório' },
  { id: 'financier', name: 'Analista Financeiro' }
];

export async function executeRound4(
  proposal: string, 
  prevRound: RoundResult,
  docs: any[]
): Promise<RoundResult> {
  const openai = new OpenAI();
  const transcript = prevRound.responses.map(r => `[${r.persona}]: ${r.analysis}`).join('\n\n');
  
  const responses: PersonaResponse[] = await Promise.all(PERSONAS.map(async (p) => {
    const systemPrompt = getSystemPrompt(4, p.id, true); // isEmbrapa = true
    const userPrompt = `PROPOSTA: ${proposal}\n\nTRANSCRITO R3:\n${transcript}\n\nCONVIRJA OU DECLARE O CONFLITO COMO IRRECONCILIÁVEL.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.2
    });

    return {
      persona: p.name,
      analysis: response.choices[0].message.content || '',
      score: 50,
      unrefuted_risks: [],
      kill_condition_triggered: false
    };
  }));

  return { round: 4, responses };
}
