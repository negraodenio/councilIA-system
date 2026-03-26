/**
 * CouncilIA v7.1 - Core Orchestrator
 * Implements the 3-Round Adversarial Protocol
 */

import { EngineConfig, CouncilIAVerdict, RoundResult } from './types';
import { executeRound1 } from './rounds/round1';
import { executeRound2 } from './rounds/round2';
import { executeRound3 } from './rounds/round3';
import { JudgeService } from './judge';

export class CouncilIAEngine {
  private judge: JudgeService;

  constructor(private config: EngineConfig) {
    this.judge = new JudgeService();
  }

  /**
   * Main Execution Entry Point
   */
  async execute(input: {
    proposal: string;
    context: string;
    rag_documents: any[];
    metadata?: any;
  }): Promise<CouncilIAVerdict> {
    const sessionId = input.metadata?.session_id || crypto.randomUUID();
    console.log(`[Engine] Processing Session ${sessionId} in ${this.config.jurisdiction} context.`);

    // --- ROUND 1: THESIS (Isolated Multi-Agent Analysis) ---
    // 6 specialized personas analyze the proposal in parallel
    const r1: RoundResult = await executeRound1(input.proposal, input.rag_documents);

    // --- ROUND 2: ANTITHESIS (Adversarial Attack) ---
    // Reponses are paired for fixed conflict (Attacker vs Defender)
    const r2: RoundResult = await executeRound2(input.proposal, r1, input.rag_documents);

    // --- ROUND 3: SYNTHESIS (Refinement) ---
    // Consolidation of unrefuted points and final synthesis
    const r3: RoundResult = await executeRound3(input.proposal, r2, input.rag_documents);

    // --- FINAL JUDGE: VERDICT ---
    // Strict JSON generation with VaR and Evidence Audit
    const finalVerdict = await this.judge.execute(
      input.proposal, 
      [r1, r2, r3], 
      this.config.jurisdiction
    );

    return {
      ...finalVerdict,
      metadata: {
        session_id: sessionId,
        timestamp: new Date().toISOString(),
        protocol_version: '7.1'
      }
    };
  }
}
