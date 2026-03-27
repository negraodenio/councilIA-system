/**
 * CouncilIA v7.3.1 — Scoring Engine
 * Deterministic mathematics for consensus, dissent, and Value at Risk (VaR).
 */

import type { 
  ScoringInput, 
  ScoringOutput, 
  EvidenceLevel,
  ValidationStatus,
  ConfidenceLevel,
  CouncilDomain 
} from '@/types/councilia-universal';

// ============================================
// CONSTANTS
// ============================================

const MAX_STDDEV = 50;                // Theoretical max (e.g., 3x0, 3x100)
const PERSONA_COUNT = 6;              // Always 6 personas for valid deliberation

// Domain-specific viability boosts (conservative thresholds)
const DOMAIN_VIABILITY_BOOST: Record<CouncilDomain, number> = {
  'general': 1.0,
  'agro': 0.95,       // Conservative (climate risk)
  'healthcare': 0.85, // Very conservative (lives at stake)
  'finance': 0.90,    // Conservative (financial system)
  'government': 0.95
};

// ============================================
// CONSENSUS CALCULATION
// ============================================

/**
 * Calculates consensus strength based on:
 * 1. Uniformity (low standard deviation)
 * 2. Mean viability (higher scores = more valuable alignment)
 * 
 * GUARD: Never 100% if mean < 70 (agreement on rejection).
 */
export function calculateConsensus(input: {
  scores: number[];
  domain: CouncilDomain;
}): number {
  validateScores(input.scores);
  
  const mean = calculateMean(input.scores);
  const stdDev = calculateStdDev(input.scores, mean);
  
  // Normalization: 0 = all identical, 1 = maximum dispersion
  const normalizedStd = Math.min(stdDev / MAX_STDDEV, 1);
  
  // Uniformity: inverse of deviation
  const uniformity = 1 - normalizedStd;
  
  // Viability: boost for high means, penalty for low ones
  const viabilityBoost = calculateViabilityBoost(mean, input.domain);
  
  // Base calculation
  let consensus = uniformity * 100 * viabilityBoost;
  
  // ANTI-FALSE-POSITIVE GUARD
  // If everyone agrees on rejection (mean < 70), cap consensus at 80%
  if (mean < 70 && consensus > 80) {
    consensus = 80;
  }
  
  // If dispersion is extremely high, consensus is capped at 60%
  if (normalizedStd > 0.5 && consensus > 60) {
    consensus = 60;
  }
  
  return Math.round(consensus);
}

/**
 * Dissent Range: difference between highest and lowest score
 */
export function calculateDissent(scores: number[]): number {
  validateScores(scores);
  return Math.max(...scores) - Math.min(...scores);
}

// ============================================
// VALUE AT RISK (VaR)
// ============================================

/**
 * Calculates critical failure probability based on:
 * - Expert dissent (misalignment)
 * - Unresolved critical risks (exposure)
 * - Evidence density (uncertainty)
 */
export function calculateVaR(input: {
  dissent: number;           // 0-100
  unresolvedRisks: number;   // 0-3
  evidenceDensity: EvidenceLevel;
  domain?: CouncilDomain;
}): number {
  // Map evidence density to risk weight (less evidence = more risk)
  const evidenceWeight = {
    'high': 0.2,      // 20% of component
    'moderate': 0.5,  // 50% of component
    'low': 0.8        // 80% of component
  }[input.evidenceDensity];
  
  // Component 1: Dissent risk (max 40%)
  const dissentComponent = (input.dissent / 100) * 40;
  
  // Component 2: Unresolved risks (max 40%)
  const riskComponent = (input.unresolvedRisks / 3) * 40;
  
  // Component 3: Evidence uncertainty (max 20%)
  const evidenceComponent = evidenceWeight * 20;
  
  let varScore = dissentComponent + riskComponent + evidenceComponent;
  
  // Sensitivity adjustment for high-stakes domains
  if (input.domain === 'healthcare' || input.domain === 'finance') {
    varScore = Math.min(100, varScore * 1.15); // +15% sensitivity
  }
  
  return Math.min(100, Math.round(varScore));
}

// ============================================
// CONFIDENCE LEVEL
// ============================================

export function calculateConfidence(input: {
  evidenceDensity: EvidenceLevel;
  validationStatus: ValidationStatus;
  unresolvedRisks: number;
  consensusStrength: number;
}): ConfidenceLevel {
  // HIGH: Optimal conditions
  if (
    input.evidenceDensity === 'high' &&
    input.validationStatus === 'complete' &&
    input.unresolvedRisks === 0 &&
    input.consensusStrength >= 80
  ) {
    return 'HIGH';
  }
  
  // LOW: Critical gaps
  if (
    input.evidenceDensity === 'low' ||
    input.validationStatus === 'none' ||
    input.unresolvedRisks >= 2 ||
    input.consensusStrength < 40
  ) {
    return 'LOW';
  }
  
  return 'MEDIUM';
}

// ============================================
// ORCHESTRATOR
// ============================================

export function calculateAllScores(input: ScoringInput): ScoringOutput {
  const mean = calculateMean(input.personaScores);
  const stdDev = calculateStdDev(input.personaScores, mean);
  
  const consensusStrength = calculateConsensus({
    scores: input.personaScores,
    domain: input.domain
  });
  
  const dissentRange = calculateDissent(input.personaScores);
  
  const varScore = calculateVaR({
    dissent: dissentRange,
    unresolvedRisks: input.unresolvedRisks,
    evidenceDensity: input.evidenceDensity,
    domain: input.domain
  });
  
  const confidence = calculateConfidence({
    evidenceDensity: input.evidenceDensity,
    validationStatus: input.validationStatus,
    unresolvedRisks: input.unresolvedRisks,
    consensusStrength
  });
  
  return {
    consensusStrength,
    dissentRange,
    var: varScore,
    confidence,
    meanScore: Math.round(mean),
    stdDev: Math.round(stdDev * 100) / 100
  };
}

// ============================================
// HELPERS
// ============================================

function validateScores(scores: number[]): void {
  if (scores.length !== PERSONA_COUNT) {
    throw new Error(`Exactly ${PERSONA_COUNT} persona scores required, got ${scores.length}`);
  }
  
  if (scores.some(s => s < 0 || s > 100 || !Number.isFinite(s))) {
    throw new Error('All scores must be between 0 and 100');
  }
}

function calculateMean(scores: number[]): number {
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

function calculateStdDev(scores: number[], mean: number): number {
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
  return Math.sqrt(variance);
}

function calculateViabilityBoost(mean: number, domain: CouncilDomain): number {
  const baseBoost = 0.5 + (0.5 * (mean / 100));
  const domainMultiplier = DOMAIN_VIABILITY_BOOST[domain] || 1.0;
  return baseBoost * domainMultiplier;
}
