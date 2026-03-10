"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const plans = [
    {
        name: "Free",
        price: "0",
        period: "",
        description: "Test your first idea",
        features: [
            "2 free sessions / month",
            "All 7 AI models",
            "3-round debate",
            "Basic report",
        ],
        cta: "Start debating",
        href: "/login",
        highlighted: false,
        priceId: null,
    },
    {
        name: "Pro",
        price: "29",
        period: "/month",
        unitPrice: "€0.97 per session",
        description: "For founders & consultants",
        features: [
            "30 sessions / month",
            "Full PDF reports",
            "Score tracking",
            "Priority processing (2x faster)",
            "Everything in Free",
        ],
        cta: "Start Pro",
        href: null,
        highlighted: true,
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "price_1T2xyY4Rc5FoCe67ImTxzsb8",
    },
    {
        name: "Team",
        price: "99",
        period: "/month",
        description: "For teams & agencies",
        features: [
            "300 sessions / month",
            "Overage: €0.30/session",
            "All 7 AI models",
            "3-round debate",
            "Full PDF reports",
            "Score evolution charts",
            "Priority processing",
            "Team sharing (up to 5)",
            "API access",
            "GitHub integration",
        ],
        cta: "Start Team",
        href: null,
        highlighted: false,
        priceId: process.env.NEXT_PUBLIC_STRIPE_TEAM_PRICE_ID || "price_1T2xzO4Rc5FoCe67UCL3pseJ",
    },
];

export function PricingCards() {
    const [loading, setLoading] = useState<string | null>(null);
    const [isAnnual, setIsAnnual] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Handle automatic checkout if coming back from login
    useEffect(() => {
        const checkoutPlan = searchParams.get("checkout");
        if (checkoutPlan) {
            const plan = plans.find(p => p.name.toLowerCase() === checkoutPlan.toLowerCase());
            if (plan && plan.priceId) {
                // Find and trigger checkout, but delay slightly to ensure session is loaded
                const timer = setTimeout(() => {
                    handleCheckout(plan.priceId!, plan.name);
                    // Remove query params but stay on page
                    const newUrl = window.location.pathname;
                    window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
                }, 1000);
                return () => clearTimeout(timer);
            }
        }
    }, [searchParams]);

    const activePlans = plans.map(plan => ({
        ...plan,
        displayPrice: isAnnual ? Math.round(parseInt(plan.price) * 0.8) : plan.price,
        period: isAnnual ? "/month (billed annually)" : "/month"
    }));

    async function handleCheckout(priceId: string, planName: string) {
        setLoading(planName);
        try {
            const res = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ priceId, planName: planName.toLowerCase() }),
            });

            if (res.status === 401) {
                // Redirect to login if not authenticated
                router.push(`/login?redirect=/pricing&checkout=${planName.toLowerCase()}`);
                return;
            }

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert(data.error || "Something went wrong.");
            }
        } catch {
            alert("Something went wrong.");
        } finally {
            setLoading(null);
        }
    }

    return (
        <div className="space-y-12">
            {/* Toggle - Hidden until annual plans are configured
            <div className="flex items-center justify-center gap-4">
                <span className={`text-sm ${!isAnnual ? "text-neutral-900 font-semibold" : "text-neutral-400"}`}>Monthly</span>
                <button
                    onClick={() => setIsAnnual(!isAnnual)}
                    className="relative w-12 h-6 rounded-full bg-neutral-100 border border-neutral-200 transition-colors focus:outline-none"
                >
                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-neutral-900 transition-transform ${isAnnual ? "translate-x-6" : ""}`} />
                </button>
                <div className="flex items-center gap-2">
                    <span className={`text-sm ${isAnnual ? "text-neutral-900 font-semibold" : "text-neutral-400"}`}>Annual</span>
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        2 Months free
                    </span>
                </div>
            </div>
            */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {activePlans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`rounded-2xl p-8 text-left flex flex-col ${plan.highlighted
                            ? "border-2 border-neutral-900 shadow-lg relative"
                            : "border border-neutral-200"
                            }`}
                    >
                        {plan.highlighted && (
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-xs px-4 py-1 rounded-full">
                                Most popular
                            </span>
                        )}

                        <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                        <p className="text-sm text-neutral-400 mb-4">{plan.description}</p>

                        <div className="mb-6">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold">{"\u20AC"}{plan.displayPrice}</span>
                                <span className="text-neutral-400 text-sm">{plan.period}</span>
                            </div>
                            {plan.unitPrice && (
                                <div className="text-xs text-emerald-600 font-medium mt-1">
                                    {plan.unitPrice}
                                </div>
                            )}
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                            {plan.features.map((f) => (
                                <li key={f} className="flex items-center gap-2 text-sm text-neutral-600">
                                    <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    {f}
                                </li>
                            ))}
                        </ul>

                        {plan.href ? (
                            <a
                                href={plan.href}
                                className={`block text-center py-3 rounded-lg text-sm font-medium transition ${plan.highlighted
                                    ? "bg-neutral-900 text-white hover:bg-neutral-800"
                                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                                    }`}
                            >
                                {plan.cta}
                            </a>
                        ) : (
                            <button
                                onClick={() => plan.priceId && handleCheckout(plan.priceId, plan.name)}
                                disabled={loading === plan.name || !plan.priceId}
                                className={`block w-full text-center py-3 rounded-lg text-sm font-medium transition disabled:opacity-50 ${plan.highlighted
                                    ? "bg-neutral-900 text-white hover:bg-neutral-800"
                                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                                    }`}
                            >
                                {loading === plan.name ? "Redirecting..." : plan.priceId ? plan.cta : "Coming soon"}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}