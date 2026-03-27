/**
 * Round 1: Thesis (v7.3.1)
 * Parallel analysis by 6 specialized personas
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

export async function executeRound1(
  proposal: string, 
  docs: any[], 
  isEmbrapa: boolean = false
): Promise<RoundResult> {
  const openai = new OpenAI();
  
  const responses: PersonaResponse[] = await Promise.all(PERSONAS.map(async (p) => {
    const systemPrompt = getSystemPrompt(1, p.id, isEmbrapa);
    const userPrompt = `PROPOSTA PARA ANÁLISE: ${proposal}\n\nCONTEXTO RAG: ${JSON.stringify(docs)}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.4
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

  return { round: 1, responses };
}
