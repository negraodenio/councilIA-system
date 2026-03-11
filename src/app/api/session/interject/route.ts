import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const payload = await req.json();
        const { runId, message } = payload;

        if (!runId || !message) {
            return NextResponse.json({ error: 'Missing runId or message' }, { status: 400 });
        }

        const supabase = createAdminClient();

        // Optional: Verify the run exists and belongs to the user, but for now we just insert the event
        const { error } = await supabase.from('debate_events').insert({
            run_id: runId,
            event_type: 'model_msg',
            model: 'Founder',
            payload: {
                text: message,
                round: 0, // 0 denotes out-of-band user intervention
                persona: 'Founder'
            }
        });

        if (error) {
            console.error('[Interject API] Supabase Insert Error:', error);
            return NextResponse.json({ error: 'Failed to insert interjection' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('[Interject API] Exception:', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
