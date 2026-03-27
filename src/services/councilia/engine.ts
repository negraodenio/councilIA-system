import { CouncilIAInput, CouncilIAOutput, CouncilIAEvent, RoundResult } from '@/types/councilia-universal';
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
   * Standard 3-round deliberation protocol (Thesis -> Antithesis -> Synthesis).
   */
  async execute(
    input: CouncilIAInput, 
    onEvent?: (event: CouncilIAEvent) => Promise<void>
  ): Promise<CouncilIAOutput> {
    const sessionId = input.metadata?.sessionId || crypto.randomUUID();
    const isEmbrapa = input.domain === 'agro' || (input as any).is_embrapa;
    
    console.log(`[Engine] Processing Session ${sessionId} in ${input.domain} domain. protocol=v7.3.1`);

    // --- DELIBERATION PIPELINE (Refined to 3 Rounds per POC requirements) ---
    const r1 = await executeRound1(input.proposal, input.ragDocuments, isEmbrapa, onEvent);
    const r2 = await executeRound2(input.proposal, r1, input.ragDocuments, isEmbrapa, onEvent);
    const r3 = await executeRound3(input.proposal, r2, input.ragDocuments, isEmbrapa, onEvent);

    // --- FINAL JUDGE: VERDICT & TRUTH SYNTHESIS ---
    if (onEvent) {
      await onEvent({ type: 'system_status', personaId: 'system', payload: { msg: '⚖️ Juiz v7.3.1 Iniciando Veredito Final...' } });
    }
    
    const finalVerdict = await this.judge.execute(
      [r1, r2, r3], 
      input,
      onEvent
    );

    if (onEvent) {
      await onEvent({ type: 'system_status', personaId: 'system', payload: { msg: '✅ Veredito Concluído. Gerando Relatório...' } });
    }

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
