/**
 * Deterministic Scoring Engine v7.3.1
 * Mathematical layer for Swarm Consensus and Risk Analysis
 */

import { ScoringInput, ScoringOutput } from '@/types/councilia-universal';

export function calculateAllScores(input: ScoringInput): ScoringOutput {
  const { personaScores, evidenceDensity, unresolvedRisks } = input;
  const n = personaScores.length;
  
  // 1. Mean Score (Weighted by domain)
  const meanScore = personaScores.reduce((a, b) => a + b, 0) / n;
  
  // 2. Standard Deviation (Consensus Baseline)
  const stdDev = Math.sqrt(
    personaScores.reduce((sq, x) => sq + Math.pow(x - meanScore, 2), 0) / n
  );
  
  // 3. Consensus Strength (Theta)
  // Penalty function on variance
  const consensusStrength = Math.max(0, 100 - (stdDev * 3));
  
  // 4. Value at Risk (VaR)
  // Factors: Dissent + Evidence Gap + Unresolved Risks
  const dissentPenalty = (100 - consensusStrength) * 0.5;
  const evidencePenalty = evidenceDensity === 'low' ? 20 : evidenceDensity === 'moderate' ? 10 : 0;
  const riskPenalty = unresolvedRisks * 5;
  
  const totalVaR = Math.min(100, dissentPenalty + evidencePenalty + riskPenalty);
  
  // 5. Confidence Level
  let confidence: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
  if (evidenceDensity === 'high' && consensusStrength > 70) confidence = 'HIGH';
  if (evidenceDensity === 'low' || consensusStrength < 40) confidence = 'LOW';

  return {
    consensusStrength,
    dissentRange: Math.max(...personaScores) - Math.min(...personaScores),
    var: totalVaR,
    confidence,
    meanScore,
    stdDev
  };
}
