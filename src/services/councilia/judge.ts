/**
 * CouncilIA v7.3.1 — Judge Service
 * Orchestrates LLM synthesis using fixed deterministic metrics.
 */

import OpenAI from 'openai';
import { calculateAllScores } from '@/lib/scoring';
import { validateOutput } from './validator';
import type { 
  CouncilIAInput, 
  CouncilIAOutput, 
  ScoringInput,
  RoundTranscript,
  ConfidenceLevel,
  EvidenceLevel,
  ValidationStatus
} from '@/types/councilia-universal';

export class JudgeService {
  private openai: OpenAI;
  
  constructor(apiKey?: string) {
    this.openai = new OpenAI({ 
      apiKey: apiKey || process.env.OPENAI_API_KEY 
    });
  }

  async execute(
    rounds: any[], // Full round history
    input: CouncilIAInput
  ): Promise<CouncilIAOutput> {
    const startTime = Date.now();
    
    // 1. Extract raw data from rounds for mathematical scoring
    const extraction = this.extractRoundData(rounds);
    
    // 2. Perform deterministic Scoring (Metrological Layer)
    const scoringInput: ScoringInput = {
      personaScores: extraction.scores,
      evidenceDensity: extraction.evidenceDensity,
      unresolvedRisks: extraction.unresolvedRisks,
      validationStatus: extraction.validationStatus,
      domain: input.domain
    };
    
    const calculatedScores = calculateAllScores(scoringInput);
    
    // 3. Generate Structured Narrative via LLM (Semantic Layer)
    // We provide the scores as FIXED values the LLM cannot change.
    const structured = await this.generateStructuredNarrative(
      rounds,
      calculatedScores,
      input
    );
    
    // 4. Assemble final CouncilIA Output
    const output: CouncilIAOutput = {
      metadata: this.generateMetadata(input, Date.now() - startTime),
      ...structured,
      fullTranscript: this.formatTranscript(rounds)
    };
    
    // 5. Mandatory Validator Post-Check
    const validation = validateOutput(output);
    
    if (!validation.valid) {
      console.warn("[JudgeService] Validation failed. Activating Safe Mode Fallback.");
      return validation.fallback || output; // Use fallback if available
    }
    
    return output;
  }

  // ============================================
  // DATA EXTRACTION
  // ============================================
  
  private extractRoundData(rounds: any[]) {
    // We assume the last round (Synthesis) contains the final per-persona reflections
    const finalRound = rounds[rounds.length - 1];
    const responses = finalRound?.responses || [];
    
    // Mandate 6 scores. If missing, this will trigger an error in calculateAllScores.
    const scores = responses.map((r: any) => {
      if (typeof r.score !== 'number' && !r.score) {
        throw new Error(`Missing score for persona: ${r.persona}`);
      }
      return r.score;
    });

    if (scores.length !== 6) {
      // If we don't have exactly 6, we're in a "Neutral Leak" or "Broken Pipeline" state
      throw new Error(`Invalid persona count: expected 6, got ${scores.length}.`);
    }
    
    // Calculate evidence density based on RAG citations in Round 1
    const r1Citations = (JSON.stringify(rounds[0]).match(/\[DOC#\d+\]/g) || []).length;
    const evidenceDensity: EvidenceLevel = r1Citations >= 4 ? 'high' : r1Citations >= 2 ? 'moderate' : 'low';
    
    // Count unresolved risks (OPEN status) from the final synthesis
    const unresolvedRisks = (finalRound?.synthesis?.criticalRisks || []).filter((risk: any) => risk.status === 'OPEN').length;
    
    // Validation status based on whether synthesis successfully reconciled conflicts
    const validationStatus: ValidationStatus = finalRound?.synthesis?.reconciled ? 'complete' : 'partial';
    
    return { scores, evidenceDensity, unresolvedRisks, validationStatus };
  }

  // ============================================
  // LLM ORCHESTRATION
  // ============================================
  
  private async generateStructuredNarrative(
    rounds: any[],
    scores: any,
    input: CouncilIAInput
  ): Promise<Omit<CouncilIAOutput, 'metadata' | 'fullTranscript'>> {
    
    const systemPrompt = `You are CouncilIA Judge v7.3.1. Generate a structured decision report.
    
    STRICT METROLOGICAL RULES:
    1. Use the PRE-CALCULATED metrics provided. Do NOT recalculate.
    2. Consensus Strength: ${scores.consensusStrength}%
    3. VaR (Value at Risk): ${scores.var}%
    4. Confidence: ${scores.confidence}
    5. Mean Score: ${scores.meanScore}
    
    FORBIDDEN:
    - Hallucinating systems like "SISAC" or "Passaporte do Solo" unless explicitly in RAG.
    - Providing a score different from ${scores.meanScore}.
    - Claiming High Confidence if the engine says ${scores.confidence}.
    
    OUTPUT SCHEMA: Must comply with v7.3.1 Universal Schema (JSON).`;

    const userPrompt = `PROPOSAL: ${input.proposal}
    DELIBERATION HISTORY: ${JSON.stringify(rounds)}
    
    ENGINE CALCULATIONS:
    - Consensus: ${scores.consensusStrength}%
    - Dissent Range: ${scores.dissentRange}pts
    - VaR: ${scores.var}%
    - Confidence: ${scores.confidence}
    
    Generate the Executive Verdict, Critical Risks (exactly 3), Consensus Analysis, Evidence Audit (with excerpts), and Smart Action Plan (exactly 3 actions).`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const parsed = JSON.parse(response.choices[0].message.content || '{}');
    
    // Force-inject deterministic metrics to ensure LLM compliance
    parsed.executiveVerdict.score = scores.meanScore;
    parsed.executiveVerdict.var.percentage = scores.var;
    parsed.executiveVerdict.confidence.level = scores.confidence;
    parsed.consensusAnalysis.strengthPercentage = scores.consensusStrength;
    
    return parsed;
  }

  // ============================================
  // HELPERS
  // ============================================

  private generateMetadata(input: CouncilIAInput, duration: number): any {
    return {
      sessionId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      protocolVersion: '7.3.1',
      executionTimeMs: duration,
      complianceFlags: [input.jurisdiction === 'BR' ? 'LGPD_CONSENT_VALID' : 'GDPR_LAWFUL_BASIS'],
      retentionUntil: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString()
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
