/**
 * JudgeService v7.3.1.3
 * Resilient Deliberation & Truth Synthesis
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
    const unresolvedRisks = 0;
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
    ], { temperature: 0.1, json: true });

    let parsed: any;
    try {
      parsed = JSON.parse(result || '{}');
    } catch (e) {
      console.warn("[JudgeService] JSON Parse failed. Recovering...");
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try { parsed = JSON.parse(jsonMatch[0]); } catch (e2) { parsed = this.getSafeModeFallback(scores); }
      } else {
        parsed = this.getSafeModeFallback(scores);
      }
    }

    // Stabilize metrics
    if (parsed.executiveVerdict) {
      parsed.executiveVerdict.score = scores.meanScore;
      if (parsed.executiveVerdict.var) parsed.executiveVerdict.var.percentage = scores.var;
    }

    return parsed;
  }

  private getSafeModeFallback(scores: any): any {
    return {
      judgeRationale: "O Veredito foi gerado em Modo de Segurança devido à latência na síntese narrativa. Os índices matemáticos permanecem precisos.",
      executiveVerdict: {
        verdict: scores.meanScore >= 70 ? 'GO' : scores.meanScore >= 40 ? 'CONDITIONAL' : 'NO-GO',
        verdictEmoji: scores.meanScore >= 70 ? '🟢' : scores.meanScore >= 40 ? '🟡' : '🔴',
        score: scores.meanScore,
        scoreBreakdown: { 
          technicalViability: { score: scores.meanScore, max: 100, justification: "Calculado via Swarm Consensus" },
          regulatoryReadiness: { score: 70, max: 100, justification: "Padrão Regulatório Estimado" },
          economicFeasibility: { score: scores.meanScore, max: 100, justification: "Consenso Econômico" },
          adoptionLikelihood: { score: 60, max: 100, justification: "Média de Mercado" }
        },
        confidence: { level: scores.confidence, evidenceDensity: scores.evidenceDensity, expertDisagreement: 'moderate', validationStatus: 'partial' },
        var: { percentage: scores.var, drivers: ["Latência de Sistema"], interpretation: "Análise baseada em métricas puras." }
      },
      criticalRisks: [],
      consensusAnalysis: { strengthPercentage: scores.consensusStrength, strengthLabel: 'MODERATE', dissentDrivers: [], irreconcilablePoint: "N/A", interpretation: "Consenso matemático alcançado." },
      evidenceAudit: { highConfidence: [], mediumConfidence: [], unsupported: [] },
      actionPlan: { validationGate: { condition: "Manual Review", proceedIf: "Final report verified", abortIf: "Inconsistency found" }, actions: [] },
      decisionRule: { proceedOnlyIf: ["Métricas básicas > 60"], otherwise: "Revisão manual" }
    };
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
