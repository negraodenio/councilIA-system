import { CouncilIAInput, CouncilIAOutput } from '@/types/councilia-universal';
import { executeRound1 } from './rounds/round1';
import { executeRound2 } from './rounds/round2';
import { executeRound3 } from './rounds/round3';
import { executeRound4 } from './rounds/embrapa/round4';
import { executeRound5 } from './rounds/embrapa/round5';
import { executeRound6 } from './rounds/embrapa/round6';
import { JudgeService } from './judge';

export class CouncilIAEngine {
  private judge: JudgeService;

  constructor() {
    this.judge = new JudgeService();
  }

  /**
   * Main Execution Entry Point (v7.3.1)
   * Standard 3-round deliberation protocol (Thesis -> Antithesis -> Synthesis).
   */
  async execute(input: CouncilIAInput): Promise<CouncilIAOutput> {
    const sessionId = input.metadata?.sessionId || crypto.randomUUID();
    const isEmbrapa = input.domain === 'agro' || (input as any).is_embrapa;
    
    console.log(`[Engine] Processing Session ${sessionId} in ${input.domain} domain. protocol=v7.3.1`);

    // --- DELIBERATION PIPELINE (Refined to 3 Rounds per POC requirements) ---
    const r1 = await executeRound1(input.proposal, input.ragDocuments, isEmbrapa);
    const r2 = await executeRound2(input.proposal, r1, input.ragDocuments, isEmbrapa);
    const r3 = await executeRound3(input.proposal, r2, input.ragDocuments, isEmbrapa);

    // --- FINAL JUDGE: VERDICT & TRUTH SYNTHESIS ---
    const finalVerdict = await this.judge.execute(
      [r1, r2, r3], 
      input
    );

    // Ensure metadata is correctly passed for UI validation (Truth-First)
    finalVerdict.metadata = {
      ...finalVerdict.metadata,
      sessionId,
      protocolVersion: '7.3.1',
      domain: input.domain,
      is_embrapa: isEmbrapa
    };

    return finalVerdict;
  }
}
