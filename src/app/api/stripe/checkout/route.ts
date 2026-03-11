import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2026-01-28.clover" as any,
    });
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "Please log in first" },
                { status: 401 }
            );
        }

        const { priceId, planName } = await req.json();

        if (!priceId) {
            return NextResponse.json(
                { error: "Price ID is required" },
                { status: 400 }
            );
        }

        // Check if user already has a Stripe customer ID and get tenant_id
        const { data: profile } = await supabase
            .from("profiles")
            .select("stripe_customer_id, tenant_id")
            .eq("id", user.id)
            .single();

        let customerId = profile?.stripe_customer_id;
        const tenantId = profile?.tenant_id || '00000000-0000-0000-0000-000000000000';

        // Create Stripe customer if needed
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email!,
                metadata: { supabase_user_id: user.id, tenant_id: tenantId },
            });
            customerId = customer.id;

            // Save customer ID to profile
            await supabase
                .from("profiles")
                .update({ stripe_customer_id: customerId })
                .eq("id", user.id);
        }

        // Create checkout session
        const origin = req.headers.get("origin") || "https://www.councilia.com";

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: "subscription",
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${origin}/dashboard?checkout=success`,
            cancel_url: `${origin}/pricing?checkout=cancelled`,
            metadata: {
                supabase_user_id: user.id,
                tenant_id: tenantId,
                plan: planName || 'pro'
            },
            subscription_data: {
                metadata: {
                    supabase_user_id: user.id,
                    tenant_id: tenantId,
                    plan: planName || 'pro'
                },
            },
            allow_promotion_codes: true,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: unknown) {
        console.error("Stripe checkout error:", error);
        const message = error instanceof Error ? error.message : "Internal error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
