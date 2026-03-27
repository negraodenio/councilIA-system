import { CouncilIAInput, CouncilIAOutput } from '@/types/councilia-universal';
import { executeRound1 } from './rounds/round1';
import { executeRound2 } from './rounds/round2';
import { executeRound3 } from './rounds/round3';
import { JudgeService } from './judge';

export class CouncilIAEngine {
  private judge: JudgeService;

  constructor() {
    this.judge = new JudgeService();
  }

  /**
   * Main Execution Entry Point (v7.3.1)
   */
  async execute(input: CouncilIAInput): Promise<CouncilIAOutput> {
    const sessionId = input.metadata?.sessionId || crypto.randomUUID();
    console.log(`[Engine] Processing Session ${sessionId} in ${input.domain} domain.`);

    // --- DELIBERATION PIPELINE ---
    const r1 = await executeRound1(input.proposal, input.ragDocuments);
    const r2 = await executeRound2(input.proposal, r1, input.ragDocuments);
    const r3 = await executeRound3(input.proposal, r2, input.ragDocuments);

    // --- FINAL JUDGE: VERDICT & TRUTH SYNTHESIS ---
    const finalVerdict = await this.judge.execute(
      [r1, r2, r3], 
      input
    );

    return finalVerdict;
  }
}
