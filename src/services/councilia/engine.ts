import { CouncilIAInput, CouncilIAOutput, CouncilIAEvent } from '@/types/councilia-universal';
import { executeRound1 } from './rounds/round1';
import { executeRound2 } from './rounds/round2';
import { executeRound3 } from './rounds/round3';
import { JudgeService } from './judge';
import { verifyAuditHash } from '@/lib/security/audit';

export class CouncilIAEngine {
  private judge: JudgeService;

  constructor() {
    this.judge = new JudgeService();
  }

  /**
   * Main Execution Entry Point (v12.0.0)
   * Standard 3-round deliberation protocol (Thesis -> Antithesis -> Synthesis).
   */
  async execute(
    input: CouncilIAInput, 
    onEvent?: (event: CouncilIAEvent) => Promise<void>
  ): Promise<CouncilIAOutput> {
    const sessionId = input.metadata?.sessionId || `run_${Date.now()}`;

    // --- GLOBAL ENGINE WATCHDOG (Limit: 180s) ---
    const watchdog = setTimeout(() => {
      throw new Error('ENGINE_DEADLOCK: Deliberation exceeded 180s safety window.');
    }, 180000);

    try {
      console.log(`[Engine] Processing Session ${sessionId} in ${input.domain} domain. protocol=v12.0.0`);

      // --- DELIBERATION PIPELINE (v7.3.1.8 - Anti-Deadlock) ---
      const r1 = await executeRound1(input.proposal, input.ragDocuments, onEvent);
      const r2 = await executeRound2(input.proposal, r1, input.ragDocuments, onEvent);
      const r3 = await executeRound3(input.proposal, r2, input.ragDocuments, onEvent);

      // --- FINAL JUDGE: VERDICT & TRUTH SYNTHESIS ---
      if (onEvent) {
        await onEvent({ type: 'system_status', personaId: 'system', payload: { msg: '⚖️ Juiz v12.0.0 Iniciando Veredito Final...' } });
      }
      
      const finalVerdict = await this.judge.execute(
        [r1, r2, r3], 
        input,
        onEvent
      );

      if (onEvent) {
        await onEvent({ type: 'system_status', personaId: 'system', payload: { msg: '✅ Veredito Concluído. Gerando Relatório...' } });
      }

      // Final synchronization delay for UI consistency
      if (onEvent) {
        await onEvent({ type: 'system_status', personaId: 'system', payload: { msg: '🏁 Finalizando Protocolo de Auditoria e Sincronização...' } });
        await new Promise(r => setTimeout(r, 1500));
      }

      // v14 Audit Verification: Verify signature integrity
      await verifyAuditHash(
        finalVerdict.metadata.auditSignature,
        { decision: finalVerdict.decisaoImediata, score: finalVerdict.executiveVerdict?.score, metrics: finalVerdict.scientificAudit },
        input.metadata?.previousHash || ''
      );

      // Ensure metadata is correctly passed for UI validation
      finalVerdict.metadata = {
        ...finalVerdict.metadata,
        sessionId,
        protocolVersion: '14.0.0',
        domain: input.domain
      };

      return finalVerdict;
    } finally {
      clearTimeout(watchdog);
    }
  }
}
