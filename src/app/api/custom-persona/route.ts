import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET — List user's custom personas
export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: personas, error } = await supabase
        .from("custom_personas")
        .select(`
            *,
            custom_persona_documents(id, filename, file_type, chunk_count, status, created_at)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ personas: personas || [] });
}

// POST — Create a new custom persona
export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, role, description, color, emoji } = body;

        console.log(`[Custom Persona API] Create attempt by user ${user.id}`, { name, role });

        if (!name || !role) {
            return NextResponse.json({ error: "Name and role are required" }, { status: 400 });
        }

        // Get tenant_id from user metadata or profiles
        const { data: profile, error: profileErr } = await supabase
            .from("profiles")
            .select("tenant_id")
            .eq("id", user.id)
            .single();

        if (profileErr) {
            console.error("[Custom Persona API] Profile fetch error:", profileErr);
        }

        const tenantId = profile?.tenant_id || user.id;
        console.log(`[Custom Persona API] Using tenantId: ${tenantId}`);

        // Check plan limits (free users cannot create custom personas)
        const { data: existing, error: countErr } = await supabase
            .from("custom_personas")
            .select("id")
            .eq("user_id", user.id);

        if (countErr) {
            console.error("[Custom Persona API] Count check error:", countErr);
            return NextResponse.json({ error: "Database error checking limits" }, { status: 500 });
        }

        const count = existing?.length || 0;
        console.log(`[Custom Persona API] Current persona count: ${count}`);

        // Get subscription for gating
        const { data: sub } = await supabase
            .from("subscriptions")
            .select("plan")
            .eq("tenant_id", tenantId)
            .maybeSingle();

        const plan = (sub?.plan || 'free').toLowerCase();

        if (plan !== 'team' && plan !== 'unlimited') {
            return NextResponse.json({
                error: "Custom Experts are exclusive to the Team plan. Please upgrade to create your own.",
                code: 'UPGRADE_REQUIRED'
            }, { status: 403 });
        }

        if (count >= 10) { // Limit for Team plan
            return NextResponse.json({ error: "Maximum personas reached for your plan (limit: 10)" }, { status: 403 });
        }

        const { data: persona, error } = await supabase
            .from("custom_personas")
            .insert({
                tenant_id: tenantId,
                user_id: user.id,
                name,
                role: role || "Internal Strategic Advisor",
                description: description || "",
                color: color || "#6366f1",
                emoji: emoji || "🏢",
            })
            .select()
            .single();

        if (error) {
            console.error("[Custom Persona API] Insert error:", error);
            return NextResponse.json({ error: `Failed to insert persona: ${error.message}` }, { status: 500 });
        }

        console.log(`[Custom Persona API] Successfully created persona: ${persona.id}`);
        return NextResponse.json({ persona }, { status: 201 });

    } catch (err: any) {
        console.error("[Custom Persona API] Fatal error:", err);
        return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
    }
}

// DELETE — Delete a persona by ID (cascades to docs + embeddings)
export async function DELETE(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const personaId = searchParams.get("id");

    if (!personaId) {
        return NextResponse.json({ error: "Persona ID required" }, { status: 400 });
    }

    const { error } = await supabase
        .from("custom_personas")
        .delete()
        .eq("id", personaId)
        .eq("user_id", user.id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Persona and all associated data deleted" });
}
