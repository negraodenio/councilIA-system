/**
 * Compliance Guard Middleware
 * Verified pre-request compliance for jurisdiction and domain
 */

import { NextRequest, NextResponse } from 'next/server';
import { LGPDComplianceManager } from '@/lib/compliance/lgpd';
import { GDPRComplianceManager } from '@/lib/compliance/gdpr';
import { BCB4893Compliance } from '@/lib/compliance/bcb-4893';
import { AnvisaComplianceManager } from '@/lib/compliance/anvisa';

export interface ComplianceContext {
  jurisdiction: 'BR' | 'EU' | 'BR_EU' | 'GLOBAL';
  domain: 'agro' | 'healthcare' | 'finance' | 'general';
  dataSubjectRights: string[];
  retentionPeriod: number; // days
  internationalTransfer: boolean;
}

export async function complianceGuard(
  req: NextRequest,
  context: ComplianceContext
): Promise<NextResponse | null> {
  const errors: string[] = [];

  // 1. Check Consent ID
  const consentHeader = req.headers.get('x-consent-id');
  if (!consentHeader) {
    errors.push('Missing consent identifier (LGPD Art. 7 / GDPR Art. 6)');
  }

  // 2. AI Act Check (EU Jurisdiction)
  if (context.jurisdiction === 'EU' || context.jurisdiction === 'BR_EU') {
    const gdpr = new GDPRComplianceManager();
    const aiActClass = gdpr.classifyAIRisk(context.domain, 'ASSISTED');
    
    // In v7.0, High Risk requires a conformity assessment
    if (aiActClass.riskClass === 'HIGH_RISK' && !aiActClass.conformityAssessment) {
      errors.push('HIGH_RISK AI system requires conformity assessment (AI Act Art. 43)');
    }
  }

  // 3. BCB 4893 Check (Finance Domain)
  if (context.domain === 'finance') {
    const bcb = new BCB4893Compliance();
    const governance = await bcb.validateGovernance('institution', 'DECISION_SUPPORT');
    
    if (!governance.boardApproved) {
      errors.push('BCB 4893 Art. 3 - AI governance requires board approval');
    }
  }

  // 4. ANVISA Check (Healthcare Domain)
  if (context.domain === 'healthcare') {
    const anvisa = new AnvisaComplianceManager();
    const samd = anvisa.classifySAMd('DECISION_SUPPORT', 'MODERATE');
    
    if (samd.registrationRequired) {
      // In production, verify the specific registration ID
      const registration = req.headers.get('x-anvisa-registration');
      if (!registration) {
        errors.push(`ANVISA - Class ${samd.class} SaMD requires registration (RDC 185/2001)`);
      }
    }
  }

  // Return errors if any
  if (errors.length > 0) {
    return NextResponse.json(
      {
        success: false,
        error: 'Compliance check failed',
        violations: errors,
        timestamp: new Date().toISOString(),
        dpo_contact: 'dpo@councilia.com'
      },
      { status: 403 }
    );
  }

  return null; // All checks passed
}
