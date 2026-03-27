/**
 * CouncilIA v12.0.0 — Scoring Engine (Elite Metrology)
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

const MAX_STDDEV = 50;
const PERSONA_COUNT = 6;

// ============================================
// WEIGHTING ENGINE
// ============================================

function getPersonaWeight(id: string): number {
  const technicalRoles = ['technologist', 'auditor', 'cientista', 'cientista_embrapa', 'especialista', 'researcher'];
  const isTechnical = technicalRoles.some(role => id.toLowerCase().includes(role));
  return isTechnical ? 1.5 : 1.0;
}

// ============================================
// CORE METRICS
// ============================================

export function calculateAllScores(input: ScoringInput): ScoringOutput {
  const { personaScores, personaIds, evidenceDensity, unresolvedRisks, domain } = input;
  
  if (personaScores.length !== personaIds.length) {
    throw new Error('Mismatched scores and persona IDs');
  }

  const weights = personaIds.map(id => getPersonaWeight(id));
  const sumWeights = weights.reduce((a, b) => a + b, 0);

  // 1. Weighted Mean
  const weightedMean = personaScores.reduce((sum, score, i) => sum + (score * weights[i]), 0) / sumWeights;

  // 2. Weighted Standard Deviation
  const variance = personaScores.reduce((sum, x, i) => sum + (weights[i] * Math.pow(x - weightedMean, 2)), 0) / sumWeights;
  const stdDev = Math.sqrt(variance);

  // 3. Consensus Strength (Theta)
  // Inverse of variability, calibrated for v12.0
  const normalizedStd = Math.min(stdDev / MAX_STDDEV, 1);
  const uniformity = 1 - normalizedStd;
  
  // Viability boost based on domain and mean quality
  const viabilityMultiplier = 0.5 + (0.5 * (weightedMean / 100));
  let consensusStrength = uniformity * 100 * viabilityMultiplier;

  // Guard: Agreement on low quality is capped
  if (weightedMean < 65 && consensusStrength > 75) {
    consensusStrength = 75;
  }

  // 4. Value at Risk (VaR)
  const dissentRange = Math.max(...personaScores) - Math.min(...personaScores);
  const dissentPenalty = (dissentRange / 100) * 45;
  const riskPenalty = (unresolvedRisks / 3) * 40;
  const evidencePenalty = { 'high': 0, 'moderate': 10, 'low': 25 }[evidenceDensity];

  let varScore = dissentPenalty + riskPenalty + evidencePenalty;
  if (domain === 'agro') varScore *= 1.1; // Agro-specific sensitivity

  // 5. Confidence Level
  let confidence: ConfidenceLevel = 'MEDIUM';
  if (evidenceDensity === 'high' && consensusStrength >= 75 && unresolvedRisks === 0) {
    confidence = 'HIGH';
  } else if (evidenceDensity === 'low' || consensusStrength < 45 || unresolvedRisks >= 2) {
    confidence = 'LOW';
  }

  return {
    consensusStrength: Math.round(consensusStrength),
    dissentRange: Math.round(dissentRange),
    var: Math.min(100, Math.round(varScore)),
    confidence,
    meanScore: Math.round(weightedMean),
    stdDev: parseFloat(stdDev.toFixed(2))
  };
}
