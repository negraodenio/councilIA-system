/**
 * LGPD - Lei 13.709/2018
 * Lei Geral de Proteção de Dados (Brazil)
 */

import { createHash, randomUUID } from 'crypto';

export interface LGPDConsent {
  id: string;
  userId: string;
  purposes: LGPDPurpose[];
  grantedAt: Date;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
  proofOfConsent: string; // Hash for non-repudiation
  withdrawnAt?: Date;
}

export type LGPDPurpose = 
  | 'DECISION_ANALYSIS'      // Analysis of proposals
  | 'AUDIT_TRAIL'            // Regulatory traceability
  | 'MODEL_IMPROVEMENT'      // System improvement (anonymized)
  | 'REGULATORY_COMPLIANCE'; // Legal obligation (ANVISA, BCB)

export type LGPDLegalBasis = 
  | 'CONSENTIMENTO'           // Art. 7, I
  | 'EXECUCAO_CONTRATO'       // Art. 7, II  
  | 'OBRIGACAO_LEGAL'         // Art. 7, IV (ANVISA, BCB)
  | 'INTERESSE_LEGITIMO'      // Art. 7, IX
  | 'PROTECAO_VIDA'           // Art. 7, X
  | 'INTERESSE_PUBLICO';      // Art. 7, IX (Scientific research)

export class LGPDComplianceManager {
  /**
   * Art. 9 - Consent must be free, informed, unequivocal
   */
  async requestConsent(
    userId: string, 
    purposes: LGPDPurpose[],
    metadata: { ip: string; userAgent: string }
  ): Promise<LGPDConsent> {
    const consent: LGPDConsent = {
      id: randomUUID(),
      userId,
      purposes,
      grantedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      ipAddress: this.hashIp(metadata.ip),
      userAgent: metadata.userAgent,
      proofOfConsent: this.generateProof(userId, purposes)
    };

    return consent;
  }

  /**
   * Validates if there's a legal basis for processing
   */
  validateLegalBasis(
    basis: LGPDLegalBasis,
    context: 'agro' | 'healthcare' | 'finance' | 'general'
  ): boolean {
    // Health data = requires consent or explicit legal obligation
    if (context === 'healthcare' && basis !== 'CONSENTIMENTO' && basis !== 'OBRIGACAO_LEGAL') {
      return false;
    }

    // Financial data = BCB 4893 requires additional governance
    if (context === 'finance') {
      return basis === 'OBRIGACAO_LEGAL' || basis === 'EXECUCAO_CONTRATO';
    }

    return true;
  }

  private hashIp(ip: string): string {
    const salt = process.env.IP_SALT || 'default-salt';
    return createHash('sha256').update(ip + salt).digest('hex');
  }

  private generateProof(userId: string, purposes: LGPDPurpose[]): string {
    return createHash('sha256')
      .update(`${userId}:${purposes.join(',')}:${Date.now()}`)
      .digest('hex');
  }

  async verifyConsent(consentId: string, userId: string, purposes: string[]): Promise<boolean> {
    // In production, check the database for this consentId and userId
    // For now, returning true to allow flow test
    return !!consentId && !!userId;
  }
}

export async function generateRIPD(processingActivity: string): Promise<string> {
  return `
RIPD - RELATÓRIO DE IMPACTO À PROTEÇÃO DE DADOS PESSOAIS
Atividade: ${processingActivity}
Data: ${new Date().toISOString()}
Controlador: CouncilIA / ia4all.eu
DPO: dpo@councilia.com

1. DESCRIÇÃO DO TRATAMENTO
   - Finalidade: Análise estruturada de decisões com IA
   - Base legal: Consentimento (Art. 7, I) + Obrigação legal (Art. 7, IV)
   - Dados: Propostas técnicas, documentos RAG, metadados de decisão

2. RISCOS IDENTIFICADOS
   - Risco: Violação de sigilo de propostas comerciais
   - Mitigação: Criptografia em trânsito e repouso, acesso por autenticação

3. MEDIDAS DE SEGURANÇA
   - Criptografia AES-256
   - Logs imutáveis
   - Acesso baseado em função (RBAC)

4. CONSULTA ANPD
   - Registro prévio: [EM PROCESSAMENTO]
  `;
}
