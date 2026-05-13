import type { Metadata } from "next";
import { Navbar } from "@/ui/Navbar";
import { Footer } from "@/ui/Footer";
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Methodology — CouncilIA Scientific Protocol",
    description: "Explore the scientific foundations of CouncilIA's AI-DOS. Learn about Adversarial Consensus, Multi-Agent Deliberation, and Deterministic Governance.",
};

export default function MethodologyPage() {
    return (
        <main className="bg-bg text-text min-h-screen relative overflow-hidden">
            {/* Grid Background */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-40 pb-24 px-6 z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal/20 bg-teal-dim text-teal text-[10px] font-bold uppercase tracking-widest mb-10">
                        Scientific Protocol v14.0.0
                    </div>
                    <h1 className="text-5xl md:text-8xl font-extrabold font-syne tracking-tighter mb-8 leading-[0.95]">
                        Decision Architecture.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal to-indigo">
                            Scientifically Defensible.
                        </span>
                    </h1>
                    <p className="text-xl text-muted-2 max-w-2xl mx-auto leading-relaxed font-light">
                        CouncilIA transforms complex strategic bets into structured, auditable processes — combining multi-agent reasoning, adversarial analysis, and deterministic validation.
                    </p>
                </div>
            </section>

            {/* Scientific Foundation */}
            <section className="py-32 px-6 relative z-10 border-t border-border">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo/20 bg-indigo-dim text-indigo text-[10px] font-bold uppercase tracking-widest mb-8">Foundational Theory</div>
                        <h2 className="text-4xl md:text-5xl font-extrabold font-syne tracking-tighter mb-8 leading-tight text-text">Grounded in research.<br />Built for reality.</h2>
                        <p className="text-muted-2 text-lg mb-10 leading-relaxed font-light">
                            CouncilIA operationalizes established principles from **Multi-Agent Systems (MAS)**, Decision Science, and Human-AI Interaction into a hardened strategic framework.
                        </p>
                        <div className="p-8 rounded-2xl border border-border bg-surface-2 italic text-muted-2 text-sm border-l-2 border-l-teal leading-relaxed font-light">
                            "Our approach is scientifically grounded, not universally proven. We extend validated concepts into auditable decision processes designed for high-stakes executive environments."
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="premium-card p-10 hover:border-teal/30 transition-all">
                            <h4 className="text-teal font-bold text-[10px] uppercase tracking-widest mb-4">Core Framework</h4>
                            <p className="text-2xl font-extrabold font-syne tracking-tight mb-4 italic text-text">"Independence reduces systemic bias."</p>
                            <p className="text-sm text-muted font-light leading-relaxed">Implementing **Bayesian Truth Serum (BTS)** proxies to identify surprisingly common answers and filter for true expert consensus vs. stochastic parrots.</p>
                        </div>
                        <div className="premium-card p-10 hover:border-indigo/30 transition-all">
                            <h4 className="text-indigo font-bold text-[10px] uppercase tracking-widest mb-4">Adversarial Pressure</h4>
                            <p className="text-2xl font-extrabold font-syne tracking-tight mb-4 italic text-text">"Tension reveals hidden risk."</p>
                            <p className="text-sm text-muted font-light leading-relaxed">Leveraging **Adversarial Consensus Engine (ACE)** protocols to stress-test conclusions against edge-case risk vectors in real-time.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Pillars */}
            <section className="py-32 px-6 bg-surface relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-5xl md:text-7xl font-extrabold font-syne tracking-tighter mb-6 text-text uppercase">Three Pillars of Rigor.</h2>
                        <p className="text-muted-2 max-w-2xl mx-auto font-light text-lg">More reasoning is not always better — structured reasoning is.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Pillar 
                            num="01" 
                            title="Multi-Agent Deliberation" 
                            desc="Research indicates that multi-instance LLM deliberation can outperform single-model outputs. CouncilIA applies structured independence across agents to prevent early convergence." 
                            outcome="Reduced Blind Spots"
                            color="teal"
                        />
                        <Pillar 
                            num="02" 
                            title="Adversarial Reasoning" 
                            desc="Inspired by Game Theory models, we introduce deliberate tension between expert personas. Each argument must survive adversarial pressure before being considered valid." 
                            outcome="Early Risk Exposure"
                            color="indigo"
                        />
                        <Pillar 
                            num="03" 
                            title="Structured Iteration" 
                            desc="A fixed three-stage protocol: Thesis (Independent Analysis), Antithesis (Adversarial Challenge), and Synthesis (Refined Conclusion)." 
                            outcome="Efficient Convergence"
                            color="text"
                        />
                    </div>
                </div>
            </section>

            {/* Decision System Layer */}
            <section className="py-32 px-6 relative z-10 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-20 items-center">
                        <div className="lg:w-1/2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal/20 bg-teal-dim text-teal text-[10px] font-bold uppercase tracking-widest mb-8">Operational Layer</div>
                            <h2 className="text-4xl md:text-5xl font-extrabold font-syne tracking-tighter mb-8 leading-tight text-text">From Deliberation<br />to Hardened Verdict.</h2>
                            <p className="text-muted-2 text-lg mb-10 leading-relaxed font-light">
                                CouncilIA does not stop at analysis. A deterministic decision layer evaluates agent outputs using measurable signals. This ensures decisions are not narrative-driven, but rule-based.
                            </p>
                            <div className="space-y-4">
                                <VerdictRow label="GO" status="Robust Decision" color="teal" />
                                <VerdictRow label="CONDITIONAL" status="Further Validation Required" color="indigo" />
                                <VerdictRow label="NO-GO" status="High Risk Detected" color="red-400" />
                            </div>
                        </div>
                        <div className="lg:w-1/2 w-full">
                            <div className="premium-card p-12 relative overflow-hidden bg-surface-2">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-teal opacity-[0.03] blur-3xl"></div>
                                <div className="text-center mb-10 border-b border-border pb-8">
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-teal mb-2">Simulation Metrics</h4>
                                    <p className="text-[10px] text-muted uppercase font-light">Measurable Signals — Not Subjective Scores</p>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <Metric label="Confidence Score" value="0.92" sub="Reliability proxy" />
                                    <Metric label="Variance Score" value="0.14" sub="Uncertainty level" />
                                    <Metric label="Evidence Strength" value="8/10" sub="Argument support" />
                                    <Metric label="Consensus Level" value="High" sub="Stability index" />
                                </div>
                                <div className="mt-12 p-5 rounded-xl bg-bg border border-border">
                                    <p className="text-[10px] text-teal/80 font-bold uppercase tracking-widest text-center leading-relaxed">
                                        SIGNALS ARE COMBINED INTO A FINAL DECISION VERDICT, NOT AVERAGED INTO A BLACK-BOX SCORE.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Audit & Governance */}
            <section className="py-32 px-6 border-t border-border bg-bg relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-5xl md:text-7xl font-extrabold font-syne tracking-tighter mb-6 text-text uppercase">Audit Ready.</h2>
                        <p className="text-muted-2 max-w-2xl mx-auto text-lg leading-relaxed font-light">
                            Every decision is fully traceable, reproducible, and verifiable. CouncilIA provides the infrastructure for adversarial accountability.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <AuditItem title="Decision Lineage" desc="Complete trace of every deliberation round and expert pivot." />
                        <AuditItem title="Policy Versioning" desc="Track active rules and constraints during the decision cycle." />
                        <AuditItem title="Replay Capability" desc="Re-run and verify outcomes with the exact same starting context." />
                        <AuditItem title="Immutable Audit" desc="HMAC-SHA256 signed structure for cryptographically verified integrity." />
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-40 px-6 relative z-10 text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-5xl md:text-7xl font-extrabold font-syne tracking-tighter mb-10 text-text leading-[0.95]">
                        CouncilIA does not decide for you.
                    </h2>
                    <p className="text-xl text-muted-2 mb-16 max-w-2xl mx-auto font-light">
                        It ensures the decisions you make are tested, structured, and defensible — before you commit capital or reputation.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/login" className="premium-button px-10 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest">
                            Start Simulation
                        </Link>
                        <button className="px-10 py-5 border border-border-hover hover:bg-surface-2 rounded-2xl font-bold text-sm uppercase tracking-widest text-text transition-all">
                            Talk to Governance Team
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

function Pillar({ num, title, desc, outcome, color }: any) {
    return (
        <div className="premium-card p-10 flex flex-col hover:bg-surface-2/50 transition-all border-t-2" style={{ borderTopColor: color === 'teal' ? 'var(--teal)' : color === 'indigo' ? 'var(--indigo)' : 'var(--text)' }}>
            <div className="text-4xl font-extrabold font-syne text-muted/20 mb-8">{num}</div>
            <h3 className="text-2xl font-extrabold font-syne mb-5 uppercase tracking-tighter text-text">{title}</h3>
            <p className="text-muted-2 text-sm mb-10 leading-relaxed font-light">{desc}</p>
            <div className="mt-auto pt-6 border-t border-border">
                <span className="text-[10px] font-bold text-teal uppercase tracking-widest">{outcome}</span>
            </div>
        </div>
    );
}

function VerdictRow({ label, status, color }: any) {
    return (
        <div className="flex items-center justify-between p-5 rounded-2xl border border-border bg-surface-2 group hover:border-border-hover transition-all">
            <span className={`font-extrabold font-syne tracking-tight text-${color}`}>{label}</span>
            <span className="text-[10px] text-muted font-bold uppercase tracking-widest">{status}</span>
        </div>
    );
}

function Metric({ label, value, sub }: any) {
    return (
        <div className="p-6 rounded-2xl border border-border bg-bg">
            <div className="text-[9px] font-bold uppercase text-muted tracking-widest mb-3">{label}</div>
            <div className="text-3xl font-extrabold font-syne text-text mb-2 tracking-tighter">{value}</div>
            <div className="text-[9px] text-muted uppercase font-light tracking-widest">{sub}</div>
        </div>
    );
}

function AuditItem({ title, desc }: any) {
    return (
        <div className="premium-card p-8 hover:border-teal/20 transition-all">
            <h4 className="font-extrabold font-syne text-text mb-4 uppercase tracking-tighter text-lg">{title}</h4>
            <p className="text-xs text-muted-2 leading-relaxed font-light">{desc}</p>
        </div>
    );
}