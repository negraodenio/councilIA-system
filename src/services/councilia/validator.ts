/**
 * CouncilIA v7.3.1 — Validation Engine
 * 4 Inconsistency Guards + Automated Safe Mode Fallback.
 */

import type { 
  CouncilIAOutput, 
  ValidationResult, 
  ValidationError, 
  ValidationWarning,
  ValidationStrategy,
  ValidationErrorCode
} from '@/types/councilia-universal';

// ============================================
// CONSTANTS
// ============================================

const GUARDS = {
  CONSENSUS_SCORE: {
    code: 'LOGICAL_INCONSISTENCY' as ValidationErrorCode,
    message: 'High consensus (>90%) with low score (<70%) is logically impossible.'
  },
  DISSENT_CONSENSUS: {
    code: 'SCORING_BUG' as ValidationErrorCode,
    message: 'Low consensus (<80%) without documented dissent drivers indicates algorithm failure.'
  },
  VAR_SCORE: {
    code: 'HIGH_VAR_LOW_SCORE' as ValidationErrorCode,
    message: 'High VaR (>40%) with high score (>75%) indicates risk underestimation.'
  },
  EVIDENCE_CONFIDENCE: {
    code: 'LOW_EVIDENCE_HIGH_CONFIDENCE' as ValidationErrorCode,
    message: 'High confidence with low evidence density indicates fake confidence.'
  }
} as const;

// ============================================
// MAIN VALIDATION
// ============================================

export function validateOutput(
  output: CouncilIAOutput,
  strategy: ValidationStrategy = 'PASSED' // Default to Passed/Strict
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  // Execute all standard guards
  const guardResults = [
    runGuardConsensusScore(output),
    runGuardDissentConsensus(output),
    runGuardVarScore(output),
    runGuardEvidenceConfidence(output),
    runGuardEvidenceAudit(output),
    runGuardScoreRange(output)
  ];
  
  for (const result of guardResults) {
    if (result.type === 'ERROR') {
      errors.push({
        type: 'ERROR',
        code: result.code,
        message: result.message,
        field: result.field,
        severity: result.severity
      });
    }
  }
  
  return determineResult(output, errors, warnings, strategy);
}

// ============================================
// GUARDS
// ============================================

function runGuardConsensusScore(output: CouncilIAOutput): any {
  const { strengthPercentage } = output.consensusAnalysis;
  const { score } = output.executiveVerdict;
  
  // Logical Failure: High consensus on a "perfectly neutral" score (Hedging/Neutral Leak)
  if (strengthPercentage > 85 && (score >= 48 && score <= 52)) {
    return {
      type: 'ERROR',
      code: GUARDS.CONSENSUS_SCORE.code,
      message: 'Neural Leak detected: High consensus on a neutral score (50±2) indicates system hedging or lack of deliberation.',
      field: 'consensusAnalysis.strengthPercentage + executiveVerdict.score',
      severity: 'CRITICAL'
    };
  }
  return { type: 'PASS' };
}

function runGuardDissentConsensus(output: CouncilIAOutput): any {
  const { strengthPercentage, dissentDrivers } = output.consensusAnalysis;
  
  if (strengthPercentage < 80 && dissentDrivers.length === 0) {
    return {
      type: 'ERROR',
      code: GUARDS.DISSENT_CONSENSUS.code,
      message: GUARDS.DISSENT_CONSENSUS.message,
      field: 'consensusAnalysis.dissentDrivers',
      severity: 'CRITICAL'
    };
  }
  return { type: 'PASS' };
}

function runGuardVarScore(output: CouncilIAOutput): any {
  const { percentage: varPct } = output.executiveVerdict.var;
  const { score } = output.executiveVerdict;
  
  if (varPct > 40 && score > 75) {
    return {
      type: 'ERROR',
      code: GUARDS.VAR_SCORE.code,
      message: GUARDS.VAR_SCORE.message,
      field: 'executiveVerdict.var.percentage + executiveVerdict.score',
      severity: 'HIGH'
    };
  }
  return { type: 'PASS' };
}

function runGuardEvidenceConfidence(output: CouncilIAOutput): any {
  const { evidenceDensity, level: confidenceLevel } = output.executiveVerdict.confidence;
  
  if (evidenceDensity === 'low' && confidenceLevel === 'HIGH') {
    return {
      type: 'ERROR',
      code: GUARDS.EVIDENCE_CONFIDENCE.code,
      message: GUARDS.EVIDENCE_CONFIDENCE.message,
      field: 'executiveVerdict.confidence',
      severity: 'HIGH'
    };
  }
  return { type: 'PASS' };
}

function runGuardEvidenceAudit(output: CouncilIAOutput): any {
  const { highConfidence, mediumConfidence } = output.evidenceAudit;
  
  if (highConfidence.length === 0 && mediumConfidence.length === 0) {
    return {
      type: 'ERROR',
      code: 'MISSING_EVIDENCE' as ValidationErrorCode,
      message: 'No evidence citations found. Output may be hallucinated.',
      field: 'evidenceAudit',
      severity: 'HIGH'
    };
  }
  return { type: 'PASS' };
}

function runGuardScoreRange(output: CouncilIAOutput): any {
  const { score } = output.executiveVerdict;
  if (score < 0 || score > 100 || !Number.isInteger(score)) {
    return {
      type: 'ERROR',
      code: 'INVALID_RANGE' as ValidationErrorCode,
      message: `Score ${score} outside valid range [0, 100].`,
      field: 'executiveVerdict.score',
      severity: 'CRITICAL'
    };
  }
  return { type: 'PASS' };
}

// ============================================
// RESULT DETERMINATION
// ============================================

function determineResult(
  output: CouncilIAOutput,
  errors: ValidationError[],
  warnings: ValidationWarning[],
  strategy: ValidationStrategy
): ValidationResult {
  const criticalErrors = errors.filter(e => e.severity === 'CRITICAL');
  
  if (criticalErrors.length > 0) {
    return {
      valid: false,
      output: null,
      fallback: generateSafeModeOutput(output, errors),
      errors,
      warnings,
      strategy: 'FALLBACK_APPLIED'
    };
  }
  
  return {
    valid: true,
    output,
    fallback: null,
    errors: [],
    warnings,
    strategy: 'PASSED'
  };
}

// ============================================
// SAFE MODE FALLBACK
// ============================================

export function generateSafeModeOutput(
  failedOutput: CouncilIAOutput,
  errors: ValidationError[]
): CouncilIAOutput {
  return {
    ...failedOutput,
    executiveVerdict: {
      ...failedOutput.executiveVerdict,
      verdict: 'NO-GO',
      verdictEmoji: '🔴',
      score: Math.min(failedOutput.executiveVerdict.score, 39),
      confidence: {
        level: 'LOW',
        evidenceDensity: 'low',
        expertDisagreement: 'significant',
        validationStatus: 'none'
      },
      var: {
        percentage: 100,
        drivers: [
          'System validation failure',
          'Output consistency check failed'
        ],
        interpretation: 'System could not generate consistent output. Manual review mandatory.'
      }
    },
    criticalRisks: [
      {
        id: 1,
        name: 'System Validation Failure',
        violates: 'Internal consistency protocol v7.3.1',
        evidence: errors.map(e => e.message).join('; '),
        impact: 'Automated decision support unavailable. Risk of incorrect assessment.',
        mitigation: 'Regenerate with simplified input or escalate to human analyst.',
        status: 'OPEN'
      },
      ...failedOutput.criticalRisks.slice(1, 4)
    ] as any,
    consensusAnalysis: {
      strengthPercentage: 0,
      strengthLabel: 'WEAK',
      dissentDrivers: [],
      irreconcilablePoint: 'System could not reach consensus due to validation failure.',
      interpretation: 'Technical failure prevented structured decision. Conservative NO-GO issued.'
    },
    judgeRationale: 'VEREDITO DE SEGURANÇA: O sistema aplicou o protocolo de auditoria determinística devido a inconsistências na convergência do swarm. Por precaução institucional, recomenda-se uma revisão manual antes de prosseguir com a implementação estratégica.',
    decisionRule: {
      proceedOnlyIf: ['Manual validation by qualified analyst'],
      otherwise: 'Do not proceed with automated assessment.'
    }
  };
}
