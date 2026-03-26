/**
 * GDPR - General Data Protection Regulation (EU) 2016/679
 * + AI Act (EU) 2024/1689 compliance hooks
 */

// GDPR Article 6 - Lawfulness of processing
export type GDPRLegalBasis = 
  | 'CONSENT'           // Art. 6(1)(a)
  | 'CONTRACT'          // Art. 6(1)(b)
  | 'LEGAL_OBLIGATION'  // Art. 6(1)(c)
  | 'VITAL_INTERESTS'   // Art. 6(1)(d)
  | 'PUBLIC_TASK'       // Art. 6(1)(e)
  | 'LEGITIMATE_INTEREST'; // Art. 6(1)(f)

// AI Act Article 6 - Risk classification
export type AIActRiskClass = 
  | 'PROHIBITED'           // Art. 5 - Prohibited
  | 'HIGH_RISK'            // Art. 6 - High risk (Health, Finance, Justice)
  | 'LIMITED_RISK'         // Art. 6 - Limited risk (Chatbots)
  | 'MINIMAL_RISK';        // Art. 6 - Minimal risk

export interface AIActCompliance {
  riskClass: AIActRiskClass;
  conformityAssessment?: boolean;
  ceMarking?: boolean;
  registrationEU?: string;
  transparencyObligations: string[];
  humanOversight: boolean;
}

export class GDPRComplianceManager {
  private dpoEmail = 'dpo@councilia.com';

  /**
   * Determines AI Act risk classification
   */
  classifyAIRisk(
    domain: 'agro' | 'healthcare' | 'government' | 'finance' | 'corporate' | 'general',
    autonomyLevel: 'ASSISTED' | 'AUTONOMOUS' | 'FULLY_AUTONOMOUS'
  ): AIActCompliance {
    // CouncilIA is "assisted" (human-in-the-loop)
    // This reduces risk classification
    const baseClassification: AIActCompliance = {
      riskClass: 'LIMITED_RISK',
      transparencyObligations: [
        'Inform user they are interacting with AI (Art. 52)',
        'Disclose decision logic in understandable format',
        'Enable human review of automated decisions'
      ],
      humanOversight: true
    };

    // Exceptions elevating to HIGH_RISK
    if (domain === 'healthcare' && autonomyLevel !== 'ASSISTED') {
      return {
        riskClass: 'HIGH_RISK',
        conformityAssessment: true,
        ceMarking: true,
        registrationEU: 'pending',
        transparencyObligations: [
          ...baseClassification.transparencyObligations,
          'Risk management system (Art. 9)',
          'Data governance (Art. 10)',
          'Technical documentation (Art. 11)',
          'Record-keeping (Art. 12)',
          'Human oversight by natural persons (Art. 14)'
        ],
        humanOversight: true
      };
    }

    if (domain === 'finance' && autonomyLevel === 'AUTONOMOUS') {
      return {
        riskClass: 'HIGH_RISK',
        conformityAssessment: true,
        ceMarking: true,
        registrationEU: 'pending',
        transparencyObligations: baseClassification.transparencyObligations,
        humanOversight: true
      };
    }

    return baseClassification;
  }

  /**
   * Art. 35 - Data Protection Impact Assessment (DPIA)
   */
  async generateDPIA(
    processingActivity: string,
    riskClass: AIActRiskClass
  ): Promise<string> {
    if (riskClass === 'HIGH_RISK') {
      return `
DPIA - DATA PROTECTION IMPACT ASSESSMENT
Activity: ${processingActivity}
Risk Class: ${riskClass} (AI Act Art. 6)
DPO: ${this.dpoEmail}

1. NECESSITY AND PROPORTIONALITY
   - Description: Multi-agent deliberation
   - Purpose: Structured decision support
   - Legal basis: Explicit consent + Human oversight

2. RISK ASSESSMENT
   - Rights: Potential automated decision bias
   - Mitigation: Adversarial checking, audit trails

3. MEASURES
   - Technical: Encryption, pseudonymization
   - Organizational: DPO appointed, staff training
      `;
    }

    return 'DPIA not required for LIMITED/MINIMAL risk processing';
  }

  /**
   * Art. 17 - Right to erasure
   */
  async handleErasureRequest(userId: string): Promise<{
    deleted: string[];
    retained: string[];
    reason: string;
  }> {
    // Placeholder logic for the erasure process
    return {
      deleted: [],
      retained: [],
      reason: 'Implementation pending database connection'
    };
  }
}
