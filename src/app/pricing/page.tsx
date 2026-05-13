import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/ui/Navbar";
import { Footer } from "@/ui/Footer";
import { PricingCards } from "./PricingCards";

export const metadata: Metadata = {
    title: "Pricing — CouncilIA",
    description: "Simple, transparent pricing. Start free with 2 sessions, scale when ready.",
};

export default function PricingPage() {
    return (
        <main className="bg-white text-neutral-900 min-h-screen">
            <Navbar />

            <section className="pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Simple, transparent pricing
                    </h1>
                    <p className="text-lg text-neutral-500 mb-16 max-w-2xl mx-auto">
                        Start with 2 free sessions. Upgrade when your decisions need the full
                        power of 7 AI models debating in real-time.
                    </p>

                    <Suspense fallback={<div className="h-96 flex items-center justify-center text-neutral-400">Loading plans...</div>}>
                        <PricingCards />
                    </Suspense>

                    {/* Section 3: Compare plans */}
                    <div className="mt-24 max-w-4xl mx-auto overflow-hidden">
                        <h2 className="text-3xl font-bold tracking-tight mb-12">Compare in detail</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-neutral-100">
                                        <th className="py-4 px-4 font-semibold text-neutral-900">Feature</th>
                                        <th className="py-4 px-4 font-semibold text-neutral-900 text-center">Free</th>
                                        <th className="py-4 px-4 font-semibold text-neutral-900 text-center">Founder</th>
                                        <th className="py-4 px-4 font-semibold text-neutral-900 text-center">Operator</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    <tr className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                                        <td className="py-4 px-4 text-neutral-600">Sessions/month</td>
                                        <td className="py-4 px-4 text-center font-medium">2</td>
                                        <td className="py-4 px-4 text-center font-medium">30</td>
                                        <td className="py-4 px-4 text-center font-medium">300</td>
                                    </tr>
                                    <tr className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                                        <td className="py-4 px-4 text-neutral-600">Cost per session</td>
                                        <td className="py-4 px-4 text-center text-neutral-400">—</td>
                                        <td className="py-4 px-4 text-center font-medium">€0.97</td>
                                        <td className="py-4 px-4 text-center font-medium">€0.33</td>
                                    </tr>
                                    <tr className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                                        <td className="py-4 px-4 text-neutral-600">7 AI models</td>
                                        <td className="py-4 px-4 text-center text-emerald-500 text-lg">{"\u2705"}</td>
                                        <td className="py-4 px-4 text-center text-emerald-500 text-lg">{"\u2705"}</td>
                                        <td className="py-4 px-4 text-center text-emerald-500 text-lg">{"\u2705"}</td>
                                    </tr>
                                    <tr className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                                        <td className="py-4 px-4 text-neutral-600">3-round debate</td>
                                        <td className="py-4 px-4 text-center text-emerald-500 text-lg">{"\u2705"}</td>
                                        <td className="py-4 px-4 text-center text-emerald-500 text-lg">{"\u2705"}</td>
                                        <td className="py-4 px-4 text-center text-emerald-500 text-lg">{"\u2705"}</td>
                                    </tr>
                                    <tr className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                                        <td className="py-4 px-4 text-neutral-600">Full PDF reports</td>
                                        <td className="py-4 px-4 text-center text-rose-500 text-lg">{"\u274C"}</td>
                                        <td className="py-4 px-4 text-center text-emerald-500 text-lg">{"\u2705"}</td>
                                        <td className="py-4 px-4 text-center text-emerald-500 text-lg">{"\u2705"}</td>
                                    </tr>
                                    <tr className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                                        <td className="py-4 px-4 text-neutral-600">Score evolution</td>
                                        <td className="py-4 px-4 text-center text-rose-500 text-lg">{"\u274C"}</td>
                                        <td className="py-4 px-4 text-center text-emerald-500 text-lg">{"\u2705"}</td>
                                        <td className="py-4 px-4 text-center text-emerald-500 text-lg">{"\u2705"}</td>
                                    </tr>
                                    <tr className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                                        <td className="py-4 px-4 text-neutral-600">Live streaming</td>
                                        <td className="py-4 px-4 text-center text-rose-500 text-lg">{"\u274C"}</td>
                                        <td className="py-4 px-4 text-center text-emerald-500 text-lg">{"\u2705"}</td>
                                        <td className="py-4 px-4 text-center text-emerald-500 text-lg">{"\u2705"}</td>
                                    </tr>
                                    <tr className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                                        <td className="py-4 px-4 text-neutral-600">Interject mid-debate</td>
                                        <td className="py-4 px-4 text-center text-rose-500 text-lg">{"\u274C"}</td>
                                        <td className="py-4 px-4 text-center text-emerald-500 text-lg">{"\u2705"}</td>
                                        <td className="py-4 px-4 text-center text-emerald-500 text-lg">{"\u2705"}</td>
                                    </tr>
                                    <tr className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                                        <td className="py-4 px-4 text-neutral-600">GitHub integration</td>
                                        <td className="py-4 px-4 text-center text-rose-500 text-lg">{"\u274C"}</td>
                                        <td className="py-4 px-4 text-center text-emerald-500 text-lg">{"\u2705"}</td>
                                        <td className="py-4 px-4 text-center text-emerald-500 text-lg">{"\u2705"}</td>
                                    </tr>
                                    <tr className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                                        <td className="py-4 px-4 text-neutral-600">Team sharing</td>
                                        <td className="py-4 px-4 text-center text-rose-500 text-lg">{"\u274C"}</td>
                                        <td className="py-4 px-4 text-center text-rose-500 text-lg">{"\u274C"}</td>
                                        <td className="py-4 px-4 text-center font-medium">5 members</td>
                                    </tr>
                                    <tr className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                                        <td className="py-4 px-4 text-neutral-600">API access</td>
                                        <td className="py-4 px-4 text-center text-rose-500 text-lg">{"\u274C"}</td>
                                        <td className="py-4 px-4 text-center text-rose-500 text-lg">{"\u274C"}</td>
                                        <td className="py-4 px-4 text-center text-emerald-500 text-lg">{"\u2705"}</td>
                                    </tr>
                                    <tr className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                                        <td className="py-4 px-4 text-neutral-600">SSO + audit logs</td>
                                        <td className="py-4 px-4 text-center text-rose-500 text-lg">{"\u274C"}</td>
                                        <td className="py-4 px-4 text-center text-rose-500 text-lg">{"\u274C"}</td>
                                        <td className="py-4 px-4 text-center text-emerald-500 text-lg">{"\u2705"}</td>
                                    </tr>
                                    <tr className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                                        <td className="py-4 px-4 text-neutral-600">Custom personas</td>
                                        <td className="py-4 px-4 text-center text-rose-500 text-lg">{"\u274C"}</td>
                                        <td className="py-4 px-4 text-center text-rose-500 text-lg">{"\u274C"}</td>
                                        <td className="py-4 px-4 text-center text-emerald-500 text-lg">{"\u2705"}</td>
                                    </tr>
                                    <tr className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                                        <td className="py-4 px-4 text-neutral-600">Priority support</td>
                                        <td className="py-4 px-4 text-center text-rose-500 text-lg">{"\u274C"}</td>
                                        <td className="py-4 px-4 text-center text-emerald-500 text-lg">{"\u2705"}</td>
                                        <td className="py-4 px-4 text-center text-emerald-500 text-lg">{"\u2705"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Social Proof */}
                    <div className="mt-20 py-8 border-y border-neutral-100">
                        <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-semibold mb-8">
                            Used by 200+ founders & strategists
                        </p>
                        <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 grayscale opacity-50">
                            <div className="font-bold text-neutral-900 text-xl tracking-tighter italic">LINDOS</div>
                            <div className="font-extrabold text-neutral-900 text-xl tracking-tight">KREATIVE</div>
                            <div className="font-black text-neutral-900 text-xl">SDR.ai</div>
                            <div className="font-bold text-neutral-900 text-xl tracking-widest">QUARTZ</div>
                        </div>
                    </div>

                    <div className="mt-16 max-w-2xl mx-auto">
                        <h2 className="font-semibold text-lg mb-6">Every plan includes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left text-sm">
                            <Feature text="7 different AI models per session" />
                            <Feature text="3-round adversarial debate" />
                            <Feature text="6 expert perspectives" />
                            <Feature text="Structured judicial verdict" />
                            <Feature text="Consensus score (0-100)" />
                            <Feature text="Multi-language support" />
                            <Feature text="EU data sovereignty routing" />
                            <Feature text="Actionable recommendations" />
                        </div>
                    </div>

                    <div className="mt-16 p-6 rounded-xl bg-neutral-50 border border-neutral-200 max-w-xl mx-auto text-left">
                        <h3 className="font-semibold mb-2">{"🔒"} Secure payments via Stripe</h3>
                        <p className="text-sm text-neutral-500 leading-relaxed">
                            All payments are processed by Stripe (PCI-DSS Level 1). We never see
                            or store your card details. Cancel anytime — no questions asked.
                            7-day refund policy for first-time subscribers.
                        </p>
                    </div>

                    {/* Section 1: Why this price? */}
                    <div className="mt-24 max-w-2xl mx-auto text-left">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tight mb-4">Why this price?</h2>
                            <p className="text-lg font-semibold text-neutral-900 mb-2">We believe in radical transparency.</p>
                            <p className="text-neutral-500">Continuous innovation isn{"'"}t free. Here{"'"}s how it works.</p>
                        </div>

                        <div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <div className="p-10 border-b border-neutral-50">
                                <h3 className="font-semibold mb-6 text-neutral-400 uppercase text-[10px] tracking-[0.2em]">Real cost per session</h3>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex flex-col">
                                            <span className="text-neutral-900 font-medium">6 Experts (Multi-Model)</span>
                                            <span className="text-neutral-400 text-xs text-[10px]">DeepSeek, Qwen, Mistral, Llama, Kimi, Gemini</span>
                                        </div>
                                        <span className="font-mono text-neutral-900">~€0.06</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex flex-col">
                                            <span className="text-neutral-900 font-medium">1 Head Judge</span>
                                            <span className="text-neutral-400 text-xs text-[10px]">GPT-4o 2024-08-06 (Latest)</span>
                                        </div>
                                        <span className="font-mono text-neutral-900">~€0.05</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex flex-col">
                                            <span className="text-neutral-900 font-medium">Infrastructure & Storage</span>
                                            <span className="text-neutral-400 text-xs text-[10px]">Sovereign routing & Zero Data Retention</span>
                                        </div>
                                        <span className="font-mono text-neutral-900">~€0.002</span>
                                    </div>
                                    <div className="pt-6 border-t border-neutral-50 flex justify-between items-center">
                                        <span className="font-bold text-lg">Total Baseline AI Cost</span>
                                        <span className="font-mono font-bold text-lg text-emerald-600">~€0.11</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-10 bg-neutral-50/50">
                                <h3 className="font-semibold mb-6 text-neutral-400 uppercase text-[10px] tracking-[0.2em]">Our margins</h3>
                                <div className="space-y-4 text-sm leading-relaxed">
                                    <p className="text-neutral-600">{"·"} <span className="font-mono text-neutral-900 font-semibold text-base">Founder: ~€0.97/session</span> → 89% funds development & support.</p>
                                    <p className="text-neutral-600">{"·"} <span className="font-mono text-neutral-900 font-semibold text-base">Operator: ~€0.66/session</span> → 67% funds enterprise features.</p>
                                </div>
                                <div className="mt-8 space-y-3">
                                    <p className="text-sm text-neutral-600">We don{"'"}t hide fees behind {"'"}contact sales.{"'"} We don{"'"}t train AI on your data. We don{"'"}t sell your information.</p>
                                    <p className="text-sm font-semibold text-neutral-900 italic">This is sustainable software, not a VC-funded growth trap.</p>
                                </div>
                                <div className="mt-8 flex items-center justify-between p-4 bg-white rounded-2xl border border-neutral-100">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">🛡️</span>
                                        <p className="text-xs text-neutral-500 font-medium">No hidden fees. No massive markups.</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900 text-white rounded-full scale-90 origin-right">
                                        <span className="text-[10px] font-bold uppercase tracking-wider">7-DAY REFUND</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Common questions */}
                    <div className="mt-24 max-w-2xl mx-auto text-left">
                        <h2 className="text-3xl font-bold tracking-tight mb-12 text-center">Common questions</h2>
                        <div className="space-y-8">
                            <FAQItem
                                q="What counts as one session?"
                                a="One complete 3-round debate + judicial verdict. Starting a new debate on a different topic counts as a new session. Re-running the same prompt counts as a new session."
                            />
                            <FAQItem
                                q="Can I upgrade or downgrade anytime?"
                                a="Yes. Changes apply at your next billing cycle. Downgrades keep your current plan until the period ends. You can manage everything via the Client Portal."
                            />
                            <FAQItem
                                q="What happens if I hit my limit?"
                                a="Free: Wait until next month. Founder: Upgrade to Operator or wait for reset. Operator: €0.60 per additional session, billed automatically at month end."
                            />
                            <FAQItem
                                q="Do unused sessions roll over?"
                                a="No. We reset monthly to keep pricing simple and sustainable. This allows us to maintain our radical transparency model."
                            />
                            <FAQItem
                                q="Is my data used to train AI models?"
                                a="Never. We use Zero Data Retention (ZDR) with supported providers (Mistral, OpenAI Azure, OpenRouter). Your debates are yours alone."
                            />
                            <FAQItem
                                q="Can I get a refund?"
                                a="First-time subscribers: 7-day full refund, no questions asked. After 7 days: prorated for unused time on the subscription."
                            />
                        </div>
                    </div>

                    {/* Section 4: Data & Privacy */}
                    <div className="mt-24 max-w-2xl mx-auto text-left py-12 px-8 bg-neutral-900 rounded-3xl text-white">
                        <h2 className="text-2xl font-bold mb-8">Your data stays yours</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-sm">
                            <div className="space-y-1">
                                <span className="text-neutral-400 uppercase text-[10px] tracking-widest font-bold">Storage</span>
                                <p>Supabase EU (Frankfurt)</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-neutral-400 uppercase text-[10px] tracking-widest font-bold">AI Providers</span>
                                <p>Mistral (France), Azure OpenAI (Netherlands), others via OpenRouter</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-neutral-400 uppercase text-[10px] tracking-widest font-bold">Encryption</span>
                                <p>At rest (AES-256) and in transit (TLS 1.3)</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-neutral-400 uppercase text-[10px] tracking-widest font-bold">Retention</span>
                                <p>Deleted 30 days after account closure</p>
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-1 pt-4 border-t border-neutral-700">
                                <span className="text-neutral-400 uppercase text-[10px] tracking-widest font-bold">GDPR Compliance</span>
                                <p>Full compliance, DPO: Denio Negrão (dpo@ia4all.eu)</p>
                            </div>
                        </div>
                        <div className="mt-10 flex gap-4 text-xs">
                            <a href="/privacy" className="text-neutral-400 hover:text-white underline underline-offset-4 transition">Read full Privacy Policy</a>
                            <a href="/terms" className="text-neutral-400 hover:text-white underline underline-offset-4 transition">Read Terms of Service</a>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

function FAQItem({ q, a }: { q: string; a: string }) {
    return (
        <div className="border-b border-neutral-100 pb-6">
            <h4 className="font-semibold text-neutral-900 mb-2">{q}</h4>
            <p className="text-sm text-neutral-500 leading-relaxed">{a}</p>
        </div>
    );
}

function Feature({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-2 text-neutral-600">
            <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            {text}
        </div>
    );
}