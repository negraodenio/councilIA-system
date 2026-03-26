/**
 * QStash Webhook Handler v7.1
 * Asynchronously processes CouncilIA rounds and stores the final result.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifySignature } from "@upstash/qstash/nextjs";
import { CouncilIAEngine } from '@/services/councilia/engine';
import { createClient } from '@supabase/supabase-js';

// Supabase Admin client for background writes
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function handler(req: any) {
  // QStash verifySignature wrapper uses NextApiHandler internally which has issues with NextRequest
  // We handle it as 'any' or use the body directly if verified.
  const body = req instanceof NextRequest ? await req.json() : req.body;
  
  if (body.type !== 'execute-councilia-session') {
    return NextResponse.json({ error: 'Unsupported task type' }, { status: 400 });
  }

  const { payload } = body;
  console.log(`[Webhook] Starting processing for session ${payload.session_id}...`);

  try {
    // 1. Initialize Engine
    const engine = new CouncilIAEngine({
      complianceMode: true,
      jurisdiction: payload.jurisdiction as any,
      auditLevel: 'FULL'
    });

    // 2. Execute 3-Round Protocol
    const result = await engine.execute(payload);

    // 3. Update Supabase with final result
    const { error } = await supabaseAdmin
      .from('councilia_reports')
      .update({
        status: 'COMPLETED',
        full_report: result,
        score: result.executive_verdict.score,
        verdict: result.executive_verdict.verdict,
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

// Wrap with QStash signature verification for security
export const POST = verifySignature(handler);
