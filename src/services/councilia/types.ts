/**
 * CouncilIA Core Type Definitions v7.1
 */

export type CouncilIAContext = 'healthcare' | 'government' | 'finance' | 'corporate' | 'general';

export interface PersonaResponse {
  persona: string;
  analysis: string;
  score: number;
  unrefuted_risks: string[];
  kill_condition_triggered: boolean;
}

export interface RoundResult {
  round: number;
  responses: PersonaResponse[];
}

export interface CouncilIAVerdict {
  executive_verdict: {
    verdict: 'GO' | 'NO-GO' | 'CONDITIONAL';
    score: number;
    confidence: {
      level: 'LOW' | 'MEDIUM' | 'HIGH';
      evidence_density: 'Sparse' | 'Satisfactory' | 'High';
    };
    var: {
      percentage: number;
      drivers: string[];
    };
  };
  evidence_audit: {
    high_confidence: Array<{ source: string; supports: string }>;
    unsupported: Array<{ claim: string; issue: string; flag: 'HALLUCINATION' | 'ASSUMPTION' | 'OUTDATED' }>;
  };
  metadata: {
    session_id: string;
    timestamp: string;
    protocol_version: string;
  };
}

export interface EngineConfig {
  complianceMode: boolean;
  jurisdiction: 'BR' | 'EU' | 'BR_EU' | 'GLOBAL';
  auditLevel: 'MINIMAL' | 'FULL';
}
