/**
 * JudgeService v7.3.1.2
 */

import { calculateAllScores } from './scoring';
import { validateOutput } from './validator';
import { 
  CouncilIAInput, 
  CouncilIAOutput, 
  CouncilIAEvent,
  ScoringInput,
  RoundResult,
  RoundTranscript,
} from '@/types/councilia-universal';
import { getSystemPrompt } from './prompts';
import { callLLM } from './provider';

export class JudgeService {
  
  async execute(
    rounds: RoundResult[], 
    input: CouncilIAInput,
    onEvent?: (event: CouncilIAEvent) => Promise<void>
  ): Promise<CouncilIAOutput> {
    const startTime = Date.now();
    
    // 1. Extract raw data for mathematical scoring
    const extraction = this.extractRoundData(rounds);
    
    // 2. Perform deterministic Scoring
    const scoringInput: ScoringInput = {
      personaScores: extraction.scores,
      evidenceDensity: extraction.evidenceDensity,
      unresolvedRisks: extraction.unresolvedRisks,
      validationStatus: extraction.validationStatus,
      domain: input.domain
    };
    
    const calculatedScores = calculateAllScores(scoringInput);
    
    // 3. Generate Structured Narrative via LLM Bridge
    const structured = await this.generateStructuredNarrative(
      rounds,
      calculatedScores,
      input
    );
    
    // 4. Assemble final Output
    const output: CouncilIAOutput = {
      metadata: this.generateMetadata(input, Date.now() - startTime),
      ...structured,
      fullTranscript: this.formatTranscript(rounds)
    };

    // --- TELEMETRY EMISSION ---
    if (onEvent) {
      await onEvent({
        type: 'judge_note',
        personaId: 'judge',
        payload: { text: structured.judgeRationale || 'Verdict rendered.', type: 'final_verdict' }
      });
    }
    
    // 5. Mandatory Validator Post-Check
    const validation = validateOutput(output);
    if (!validation.valid) {
      console.warn("[JudgeService] Validation failed. Activating Safe Mode Fallback.");
      return validation.fallback || output;
    }
    
    return output;
  }

  private extractRoundData(rounds: any[]) {
    const finalRound = rounds[rounds.length - 1];
    const responses = finalRound?.responses || [];
    const scores = responses.map((r: any) => r.score || 50);
    
    const r1Citations = (JSON.stringify(rounds[0]).match(/\[DOC#\d+\]/g) || []).length;
    const evidenceDensity: any = r1Citations >= 4 ? 'high' : r1Citations >= 2 ? 'moderate' : 'low';
    const unresolvedRisks = 0; // Simplified for this POC
    const validationStatus: any = 'complete';
    
    return { scores, evidenceDensity, unresolvedRisks, validationStatus };
  }

  private async generateStructuredNarrative(
    rounds: any[],
    scores: any,
    input: CouncilIAInput
  ): Promise<any> {
    const systemPrompt = getSystemPrompt(0, 'judge', input.domain === 'agro');
    const transcript = rounds.map(r => `ROUND ${r.round}:\n${r.responses.map((res: any) => `[${res.persona}]: ${res.analysis}`).join('\n')}`).join('\n\n');

    const result = await callLLM([
      { role: "system", content: systemPrompt },
      { role: "user", content: `PROPOSAL: ${input.proposal}\n\nTRANSCRIPT:\n${transcript}\n\nENGINE METRICS: Consensus=${scores.consensusStrength}%, VaR=${scores.var}%` }
    ], { temperature: 0.2, json: true });

    const parsed = JSON.parse(result || '{}');
    parsed.executiveVerdict.score = scores.meanScore;
    parsed.executiveVerdict.var.percentage = scores.var;
    return parsed;
  }

  private generateMetadata(input: CouncilIAInput, duration: number): any {
    return {
      sessionId: input.metadata?.sessionId || crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      protocolVersion: '7.3.1',
      executionTimeMs: duration,
      complianceFlags: ['LGPD_CONSENT_VALID'],
      retentionUntil: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString(),
      domain: input.domain
    };
  }

  private formatTranscript(rounds: any[]): RoundTranscript {
    return {
      round1: rounds[0] || {},
      round2: rounds[1] || {},
      round3: rounds[2] || {}
    };
  }
}
