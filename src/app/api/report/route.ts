import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { complianceGuard, ComplianceContext } from '@/middleware/compliance-guard';
import { LGPDComplianceManager } from '@/lib/compliance/lgpd';
import { auditLogger } from '@/lib/compliance/audit-logger';
import { CouncilIAEngine } from '@/services/councilia/engine';

// Rate limiter helper (In production, use process.env.REDIS_URL)
const getRateLimit = (jurisdiction: string, userId: string) => {
  // If no Redis, provide a mock
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    return { limit: async () => ({ success: true, remaining: 5 }) };
  }
  const redis = Redis.fromEnv();
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(jurisdiction === 'EU' ? 10 : 5, '1 m'),
  });
};

// Input Validation Schema v7.0
const CouncilIAInputSchema = z.object({
  proposal: z.string().min(50).max(50000),
  context: z.enum(['agro', 'healthcare', 'government', 'finance', 'corporate']),
  jurisdiction: z.enum(['BR', 'EU', 'BR_EU', 'GLOBAL']).default('BR'),
  rag_documents: z.array(z.object({
    id: z.string().uuid(),
    content: z.string().min(100).max(100000),
    source: z.string().min(3).max(200),
    type: z.enum(['regulatory', 'scientific', 'technical', 'case_study']),
    sensitivity: z.enum(['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED']).default('INTERNAL')
  })).min(1).max(50),
  consent: z.object({
    consentId: z.string().uuid(),
    purposes: z.array(z.enum([
      'DECISION_ANALYSIS',
      'AUDIT_TRAIL',
      'MODEL_IMPROVEMENT',
      'REGULATORY_COMPLIANCE'
    ])),
    grantedAt: z.string().datetime()
  }),
  metadata: z.object({
    user_id: z.string().uuid(),
    organization_id: z.string().uuid(),
    department: z.string().optional(),
    previous_session: z.string().uuid().optional(),
    tags: z.array(z.string()).max(10).optional()
  })
});

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value; },
          set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options }); },
          remove(name: string, options: any) { cookieStore.set({ name, value: '', ...options }); },
        },
      }
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Input Validation
    const rawBody = await req.json();
    const validation = CouncilIAInputSchema.safeParse(rawBody);
    
    if (!validation.success) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid input',
        details: validation.error.issues 
      }, { status: 400 });
    }

    const data = validation.data;
    const isAsync = req.nextUrl.searchParams.get('async') === 'true';

    // 3. COMPLIANCE GUARD v7.0
    const complianceContext: ComplianceContext = {
      jurisdiction: data.jurisdiction,
      domain: data.context,
      dataSubjectRights: ['ACCESS', 'RECTIFICATION', 'ERASURE', 'PORTABILITY'],
      retentionPeriod: data.context === 'healthcare' ? 2555 : 1825, // 7 vs 5 years
      internationalTransfer: data.jurisdiction === 'EU' || data.jurisdiction === 'BR_EU'
    };

    const complianceError = await complianceGuard(req, complianceContext);
    if (complianceError) return complianceError;

    // 4. Verify Specific Consent (LGPD/GDPR)
    const lgpd = new LGPDComplianceManager();
    const consentValid = await lgpd.verifyConsent(data.consent.consentId, user.id, data.consent.purposes);

    if (!consentValid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid or expired consent',
        action_required: 'Request new consent at /api/consent'
      }, { status: 403 });
    }

    // 5. Rate Limiting
    const ratelimit = getRateLimit(data.jurisdiction, user.id);
    const { success: rateOk, remaining } = await (ratelimit as any).limit(`${user.id}:${data.jurisdiction}`);
    
    if (!rateOk) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const sessionId = crypto.randomUUID();

    // 6. ASYNC DISPATCH (v7.1 Integration)
    if (isAsync) {
      const { dispatchCouncilIATask } = await import('@/lib/queue/councilia-task');
      
      // Initialize a "PENDING" report in Supabase
      await supabase.from('councilia_reports').insert({
        session_id: sessionId,
        user_id: user.id,
        status: 'PENDING',
        jurisdiction: data.jurisdiction,
        context: data.context,
        created_at: new Date().toISOString(),
        consent_id: data.consent.consentId
      });

      const { success: queued, messageId } = await dispatchCouncilIATask({
        session_id: sessionId,
        proposal: data.proposal,
        context: data.context,
        jurisdiction: data.jurisdiction,
        metadata: data.metadata,
        rag_documents: data.rag_documents
      });

      if (!queued) throw new Error('Failed to queue task');

      return NextResponse.json({
        success: true,
        session_id: sessionId,
        message: 'Analysis accepted and queued for processing (Asynchronous Mode)',
        status: 'PENDING',
        queue_msg_id: messageId
      }, { status: 202 });
    }

    // 7. SYNC EXECUTION (Original route logic)
    const engine = new CouncilIAEngine({
      complianceMode: true,
      jurisdiction: data.jurisdiction,
      auditLevel: 'FULL'
    });

    const startTime = Date.now();
    const result = await engine.execute({
      proposal: data.proposal,
      context: data.context as any,
      rag_documents: data.rag_documents,
      metadata: {
        ...data.metadata,
        user_id: user.id,
        compliance_context: complianceContext
      }
    });

    // 8. Store with Regulatory Retention Flags
    const retentionYears = ['healthcare', 'finance'].includes(data.context) ? 7 : 5;
    const retentionUntil = new Date();
    retentionUntil.setFullYear(retentionUntil.getFullYear() + retentionYears);
    
    await supabase.from('councilia_reports').insert({
      session_id: result.metadata.session_id,
      user_id: user.id,
      organization_id: data.metadata.organization_id,
      jurisdiction: data.jurisdiction,
      verdict: result.executive_verdict.verdict,
      score: result.executive_verdict.score,
      created_at: result.metadata.timestamp,
      full_report: result,
      consent_id: data.consent.consentId,
      regulatory_retention: true,
      retention_until: retentionUntil.toISOString(),
      lgpd_legal_basis: 'CONSENTIMENTO'
    });

    // 9. Log Compliance Event
    await auditLogger.record({
      type: 'PROCESSING_SUCCESS',
      userId: user.id,
      sessionId: result.metadata.session_id,
      timestamp: new Date()
    });

    return NextResponse.json({
      success: true,
      data: result,
      compliance: {
        jurisdiction: data.jurisdiction,
        lawful_basis: data.jurisdiction === 'EU' ? 'GDPR Art. 6(1)(a)' : 'LGPD Art. 7, I',
        retention_years: retentionYears,
        dpo_contact: 'dpo@councilia.com'
      }
    }, {
      headers: {
        'X-RateLimit-Remaining': String(remaining),
        'X-Consent-Id': data.consent.consentId
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
