/**
 * QStash Webhook Handler v7.1
 * Asynchronously processes CouncilIA rounds and stores the final result.
 */

import { NextResponse } from 'next/server';
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { CouncilIAEngine } from '@/services/councilia/engine';
import { createClient } from '@supabase/supabase-js';

// Supabase Admin client for background writes
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function handler(req: any) {
  // Use any for req to avoid complex NextRequest/Request mismatches in the HOF
  const body = await req.json();
  
  if (body.type !== 'execute-councilia-session') {
    return NextResponse.json({ error: 'Unsupported task type' }, { status: 400 });
  }

  const { payload } = body;
  console.log(`[Webhook] Starting processing for session ${payload.session_id}...`);

  try {
    // 1. Initialize Engine (v7.3.1)
    const engine = new CouncilIAEngine();

    // 2. Execute Universal Deliberation
    const result = await engine.execute({
      proposal: payload.proposal,
      domain: (payload.domain as any) || 'general',
      jurisdiction: (payload.jurisdiction as any) || 'BR',
      ragDocuments: payload.rag_documents || [],
      metadata: {
        userId: payload.metadata?.user_id || 'system_async',
        organizationId: payload.metadata?.organization_id || 'default',
        sessionId: payload.session_id,
        consent: {
          consentId: `ASYNC_CONSENT_${payload.session_id}`,
          grantedAt: new Date().toISOString(),
          purposes: ['DECISION_ANALYSIS', 'REGULATORY_COMPLIANCE']
        }
      }
    });

    // 3. Update Supabase with final result (v7.3.1 Mapping)
    const { error } = await supabaseAdmin
      .from('councilia_reports')
      .update({
        status: 'COMPLETED',
        full_report: result,
        score: result.executiveVerdict.score,
        verdict: result.executiveVerdict.verdict,
        completed_at: new Date().toISOString()
      })
      .eq('session_id', payload.session_id);

    if (error) throw error;

    console.log(`[Webhook] Session ${payload.session_id} completed successfully.`);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(`[Webhook] Error processing session ${payload.session_id}:`, error);
    
    // Log failure to Supabase
    await supabaseAdmin
      .from('councilia_reports')
      .update({ 
        status: 'FAILED',
        error_log: error instanceof Error ? error.message : 'Unknown error'
      })
      .eq('session_id', payload.session_id);

    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}

// Wrap with QStash signature verification for security (App Router version)
export const POST = verifySignatureAppRouter(handler);
export const runtime = 'edge'; // Optional but good for QStash callbacks
