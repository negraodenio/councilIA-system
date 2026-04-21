import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Methodology — CouncilIA Scientific Protocol",
    description: "Explore the scientific foundations of CouncilIA's AI-DOS. Learn about Adversarial Consensus, Multi-Agent Deliberation, and Deterministic Governance.",
};

export default function MethodologyPage() {
    return (
        <main className="bg-space-black text-slate-100 font-body selection:bg-neon-lime selection:text-black pt-20 pb-0 tech-grid">
            {/* Header (Consolidation) */}
            <header className="fixed top-0 w-full z-50 border-b border-panel-blue bg-space-black/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="size-10 bg-neon-cyan/10 rounded-lg flex items-center justify-center border border-neon-cyan/30 shadow-[0_0_15px_rgba(0,240,255,0.2)] shrink-0 overflow-hidden">
                            <span className="material-symbols-outlined text-neon-cyan font-bold select-none">account_tree</span>
                        </div>
                        <span className="text-xl font-black tracking-tighter uppercase font-display">Council<span className="text-neon-cyan">IA</span></span>
                    </a>
                    <nav className="hidden md:flex items-center gap-8 font-display" aria-label="Main navigation">
                        <a className="text-sm font-medium hover:text-neon-cyan transition-colors" href="/#how-it-works">How it works</a>
                        <a className="text-sm font-medium hover:text-neon-cyan transition-colors" href="/#the-council">The Council</a>
                        <a className="text-sm font-medium hover:text-neon-cyan transition-colors" href="/pricing">Pricing</a>
                        <a className="text-sm font-medium text-neon-cyan transition-colors line-through decoration-neon-cyan/30" href="/methodology">Methodology</a>
                    </nav>
                    <a href="/login" role="button" className="bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:bg-neon-cyan hover:text-black shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                        Start Free Session
                    </a>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative py-32 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-neon-cyan/10 blur-[120px] rounded-full"></div>
                </div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan text-[10px] font-bold uppercase tracking-[0.2em] mb-10 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
                        Scientific Protocol v14.0.0
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-8 tracking-tighter font-display uppercase">
                        A Decision Architecture<br />
                        <span className="bg-gradient-to-r from-neon-cyan via-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                            You Can Defend.
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
                        CouncilIA transforms complex decisions into structured, auditable processes — combining multi-agent reasoning, adversarial analysis, and deterministic validation.
                    </p>
                </div>
            </section>

            {/* Scientific Foundation */}
            <section className="py-24 px-6 relative border-t border-white/5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/5 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-6">Foundational Theory</div>
                        <h2 className="text-4xl md:text-5xl font-black mb-8 uppercase font-display leading-tight">Grounded in research.<br />Built for real decisions.</h2>
                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                            CouncilIA operationalizes established principles from **Multi-Agent Systems (MAS)**, Decision Science, and Human-AI Interaction into a structured decision framework.
                        </p>
                        <div className="p-6 rounded-2xl border border-white/5 bg-panel-blue/20 backdrop-blur-sm italic text-slate-300 text-sm border-l-4 border-l-neon-cyan">
                            &quot;Our approach is scientifically grounded, not universally proven. We extend validated concepts into auditable decision processes designed for high-stakes environments.&quot;
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="p-8 rounded-2xl glass-card hover:border-neon-cyan/40 transition-all">
                            <h4 className="text-neon-cyan font-black text-xs uppercase tracking-widest mb-4">Core Framework</h4>
                            <p className="text-xl font-bold mb-4 font-display text-white italic">&quot;Independence reduces systemic bias.&quot;</p>
                            <p className="text-sm text-slate-500 leading-relaxed">Implementing **Bayesian Truth Serum (BTS)** proxies to identify surprisingly common answers and filter for true expert consensus vs. stochastic parrots.</p>
                        </div>
                        <div className="p-8 rounded-2xl glass-card hover:border-purple-500/40 transition-all">
                            <h4 className="text-purple-400 font-black text-xs uppercase tracking-widest mb-4">Adversarial Pressure</h4>
                            <p className="text-xl font-bold mb-4 font-display text-white italic">&quot;Tension reveals hidden risk.&quot;</p>
                            <p className="text-sm text-slate-500 leading-relaxed">Leveraging **Adversarial Consensus Engine (ACE)** protocols to stress-test conclusions against edge-case risk vectors.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Principles Grid */}
            <section className="py-24 px-6 bg-[#0a0a1a]/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase font-display text-white">Three Pillars of Rigor.</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">More reasoning is not always better — structured reasoning is.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Principle 01 */}
                        <div className="p-10 rounded-3xl border border-white/5 bg-panel-blue/10 flex flex-col hover:bg-panel-blue/20 transition-all border-t-4 border-t-neon-cyan">
                            <div className="text-4xl font-black font-display text-neon-cyan/20 mb-6">01</div>
                            <h3 className="text-xl font-black mb-4 uppercase font-display text-white">Multi-Agent Deliberation</h3>
                            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                                Research indicates that multi-instance LLM deliberation can outperform single-model outputs. CouncilIA applies structured independence across agents to prevent early convergence.
                            </p>
                            <div className="mt-auto pt-6 border-t border-white/5">
                                <span className="text-[10px] font-mono text-neon-cyan uppercase tracking-widest">Outcome: Reduced Blind Spots</span>
                            </div>
                        </div>

                        {/* Principle 02 */}
                        <div className="p-10 rounded-3xl border border-white/5 bg-panel-blue/10 flex flex-col hover:bg-panel-blue/20 transition-all border-t-4 border-t-purple-500">
                            <div className="text-4xl font-black font-display text-purple-500/20 mb-6">02</div>
                            <h3 className="text-xl font-black mb-4 uppercase font-display text-white">Adversarial Reasoning</h3>
                            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                                Inspired by **Game Theory** models, we introduce deliberate tension between expert personas. Each argument must survive adversarial pressure before being considered valid.
                            </p>
                            <div className="mt-auto pt-6 border-t border-white/5">
                                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">Outcome: Early Risk Exposure</span>
                            </div>
                        </div>

                        {/* Principle 03 */}
                        <div className="p-10 rounded-3xl border border-white/5 bg-panel-blue/10 flex flex-col hover:bg-panel-blue/20 transition-all border-t-4 border-t-blue-500">
                            <div className="text-4xl font-black font-display text-blue-500/20 mb-6">03</div>
                            <h3 className="text-xl font-black mb-4 uppercase font-display text-white">Structured Iteration</h3>
                            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                                A fixed three-stage protocol: **Thesis** (Independent Analysis), **Antithesis** (Adversarial Challenge), and **Synthesis** (Refined Conclusion).
                            </p>
                            <div className="mt-auto pt-6 border-t border-white/5">
                                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Outcome: Efficient Convergence</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Decision System Layer */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan text-[10px] font-bold uppercase tracking-widest mb-6">Operational Layer</div>
                            <h2 className="text-4xl md:text-5xl font-black mb-8 uppercase font-display leading-tight">From Reasoning<br />to Hardened Verdict.</h2>
                            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                CouncilIA does not stop at analysis. A deterministic decision layer evaluates outputs using measurable signals. This ensures decisions are not narrative-driven, but rule-based.
                            </p>
                            <div className="space-y-4">
                                {[
                                    { label: 'GO', status: 'Robust Decision', color: 'text-green-400' },
                                    { label: 'ESCALATE', status: 'Further Validation Required', color: 'text-amber-400' },
                                    { label: 'NO-GO', status: 'High Risk / Instability Detected', color: 'text-red-400' },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-[#121235]/40 group hover:border-white/20 transition-all">
                                        <span className={`font-black font-display ${item.color}`}>{item.label}</span>
                                        <span className="text-xs text-slate-500 uppercase tracking-widest">{item.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-1/2 w-full">
                            <div className="p-8 rounded-3xl border border-white/10 bg-panel-blue/40 relative glow-cyan">
                                <div className="text-center mb-8 border-b border-white/10 pb-6">
                                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-neon-cyan mb-2">Decision Metrics</h4>
                                    <p className="text-[10px] text-slate-500 uppercase font-mono">Measurable Signals — Not Abstract Scores</p>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    {[
                                        { label: 'Confidence Score', value: '0.92', desc: 'Proxy for reliability', icon: 'verified' },
                                        { label: 'Variance Score', value: '0.14', desc: 'Uncertainty level', icon: 'query_stats' },
                                        { label: 'Evidence Strength', value: '8/10', desc: 'Argument support', icon: 'description' },
                                        { label: 'Consensus Level', value: 'High', desc: 'Adversarial survival', icon: 'group' },
                                    ].map((metric) => (
                                        <div key={metric.label} className="p-4 rounded-xl border border-white/5 bg-black/20">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="material-symbols-outlined text-[14px] text-neon-cyan">{metric.icon}</span>
                                                <span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">{metric.label}</span>
                                            </div>
                                            <div className="text-xl font-black text-white mb-1">{metric.value}</div>
                                            <div className="text-[8px] text-slate-600 uppercase font-mono">{metric.desc}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 p-4 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20">
                                    <p className="text-[10px] text-neon-cyan/80 font-mono text-center leading-relaxed">
                                        SIGNALS ARE COMBINED INTO A FINAL DECISION VERDICT, NOT AVERAGED INTO A BLACK-BOX SCORE.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Audit & Governance */}
            <section className="py-24 px-6 border-t border-white/5 bg-space-black relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase font-display text-white">Built for Accountability.</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                            Every decision is fully traceable, reproducible, and verifiable. CouncilIA provides the infrastructure for **Adversarial Auditability**.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { title: 'Decision Lineage', desc: 'Complete trace of who said what, and why across all rounds.', icon: 'flowsheet' },
                            { title: 'Policy Versioning', desc: 'Track active rules and constraints during the decision cycle.', icon: 'policy' },
                            { title: 'Replay Capability', desc: 'Re-run and verify outcomes with the exact same starting context.', icon: 'history' },
                            { title: 'Immutable Audit', desc: 'HMAC-SHA256 signed structure for data integrity.', icon: 'shield' },
                        ].map((item) => (
                            <div key={item.title} className="p-8 rounded-2xl border border-white/5 bg-panel-blue/10 hover:border-neon-cyan/20 transition-all">
                                <div className="size-10 bg-neon-cyan/10 rounded-lg flex items-center justify-center border border-neon-cyan/20 mb-6">
                                    <span className="material-symbols-outlined text-neon-cyan text-lg">{item.icon}</span>
                                </div>
                                <h4 className="font-bold text-white mb-3 uppercase tracking-tight text-sm">{item.title}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed font-light">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Practice vs Theory */}
            <section className="py-24 px-6 border-y border-white/5 bg-panel-blue/5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-3xl font-black mb-8 uppercase font-display text-white italic">What This Means in Practice</h2>
                        <div className="space-y-6">
                            {[
                                { old: 'Extended Meetings', new: 'Structured Adversarial Analysis' },
                                { old: 'Conflicting Biased Opinions', new: 'Measurable Consensus Stability' },
                                { old: 'Unclear Accountability', new: 'Complete Decision Lineage' },
                                { old: 'Narrative-Driven Decisions', new: 'Audit-Ready Infrastructure' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 group">
                                    <div className="flex-1 p-4 rounded-xl bg-red-950/10 border border-red-500/10 text-[10px] text-red-500/60 uppercase tracking-widest line-through">
                                        {item.old}
                                    </div>
                                    <span className="material-symbols-outlined text-slate-700 text-sm">arrow_forward</span>
                                    <div className="flex-1 p-4 rounded-xl bg-green-950/10 border border-green-500/10 text-[10px] text-green-400/80 uppercase tracking-widest font-bold">
                                        {item.new}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-black mb-8 uppercase font-display text-white italic">Risk Visibility Layer</h2>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            CouncilIA models risk based on unresolved contradictions, weak evidence, and high disagreement across agents. The system does not eliminate risk — it exposes it before action is taken.
                        </p>
                        <div className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                            <h4 className="text-amber-500 font-black text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[14px]">warning</span>
                                Human-in-the-Loop Constraint
                            </h4>
                            <p className="text-xs text-slate-400 font-light leading-relaxed">
                                &quot;CouncilIA is designed for **Decision Support**, not decision replacement. Output quality depends on input quality. Humans remain responsible for the final execution.&quot;
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Disclaimer & Limitations */}
            <section className="py-24 px-6 bg-black">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl font-black mb-4 uppercase font-display text-white">Ethical Boundaries & Limitations.</h2>
                        <p className="text-slate-600 text-sm uppercase tracking-[0.2em] font-mono">Transparency is our core currency.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border border-white/5 p-12 rounded-3xl bg-[#050510]">
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-[#c4c4ff] mb-6 underline">System Boundaries</h4>
                            <ul className="space-y-4">
                                {[
                                    'Does not replace domain expertise',
                                    'Accuracy is benchmark-dependent',
                                    'No guarantee of real-world outcomes',
                                    'Jurisdiction-specific limitations apply'
                                ].map(li => (
                                    <li key={li} className="text-[11px] text-slate-500 flex items-center gap-2">
                                        <span className="size-1.5 bg-slate-700 rounded-full"></span>
                                        {li}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-red-900 mb-6 underline">What We Do Not Claim</h4>
                            <ul className="space-y-4">
                                {[
                                    'Total elimination of uncertainty',
                                    'Replacement of human judgment',
                                    'Absolute or universal truth'
                                ].map(li => (
                                    <li key={li} className="text-[11px] text-slate-700 flex items-center gap-2">
                                        <span className="size-1.5 bg-red-950 rounded-full"></span>
                                        {li}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA / Whitepaper Download */}
            <section className="py-32 px-6 relative bg-gradient-to-b from-space-black to-[#050510]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-black mb-8 font-display uppercase tracking-tighter">
                        CouncilIA does not make decisions for you.
                    </h2>
                    <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-light">
                        It ensures the decisions you make are tested, structured, and defensible — before you commit.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <a href="mailto:gov@councilia.system?subject=Request: Governance Partnership" className="w-full sm:w-auto px-10 py-5 bg-neon-cyan text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all">
                            Talk to Governance Team
                        </a>
                        <button className="w-full sm:w-auto px-10 py-5 border border-white/20 hover:bg-white/5 rounded-2xl font-black text-sm uppercase tracking-widest text-slate-300 transition-all flex items-center justify-center gap-3">
                            <span className="material-symbols-outlined text-sm">download</span>
                            Download Whitepaper (PDF)
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-space-black border-t border-[rgba(0,240,255,0.1)] py-16 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-8 bg-neon-cyan/10 border border-[rgba(0,240,255,0.3)] rounded flex items-center justify-center shrink-0 overflow-hidden">
                                <span className="material-symbols-outlined text-neon-cyan text-sm font-bold select-none">account_tree</span>
                            </div>
                            <span className="text-lg font-black tracking-tighter uppercase font-display">Council<span className="text-neon-cyan">IA</span></span>
                        </div>
                        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                            Part of the Antigravity Ecosystem. Built in Lisbon, Portugal for high-stakes decision validation.
                        </p>
                        <div className="flex gap-4">
                            <a aria-label="Visit our website" className="text-slate-500 hover:text-neon-cyan transition-colors" href="#"><span className="material-symbols-outlined select-none">public</span></a>
                            <a aria-label="Send us an email" className="text-slate-500 hover:text-neon-cyan transition-colors" href="#"><span className="material-symbols-outlined select-none">mail</span></a>
                        </div>
                    </div>
                    <nav aria-label="Footer Platform Links">
                        <h5 className="font-bold text-sm mb-6 uppercase tracking-widest text-[#c4c4ff] font-display">Platform</h5>
                        <ul className="space-y-4">
                            <li><a className="text-sm text-slate-500 hover:text-neon-cyan transition-colors" href="/#how-it-works">Process</a></li>
                            <li><a className="text-sm text-slate-500 hover:text-neon-cyan transition-colors" href="/#the-council">The Council</a></li>
                            <li><a className="text-sm text-slate-500 hover:text-neon-cyan transition-colors text-white" href="/methodology">Methodology</a></li>
                            <li><a className="text-sm text-slate-500 hover:text-neon-cyan transition-colors" href="/pricing">Pricing</a></li>
                        </ul>
                    </nav>
                    <nav aria-label="Footer Resources Links">
                        <h5 className="font-bold text-sm mb-6 uppercase tracking-widest text-[#c4c4ff] font-display">Resources</h5>
                        <ul className="space-y-4">
                            <li><a className="text-sm text-slate-500 hover:text-neon-cyan transition-colors" href="#">Documentation</a></li>
                            <li><a className="text-sm text-slate-500 hover:text-neon-cyan transition-colors" href="#">Case Studies</a></li>
                            <li><a className="text-sm text-slate-500 hover:text-neon-cyan transition-colors" href="#">Research Papers</a></li>
                            <li><a className="text-sm text-slate-500 hover:text-neon-cyan transition-colors" href="#">API Reference</a></li>
                        </ul>
                    </nav>
                    <nav aria-label="Footer Legal and Support Links">
                        <h5 className="font-bold text-sm mb-6 uppercase tracking-widest text-[#c4c4ff] font-display">Legal &amp; Support</h5>
                        <ul className="space-y-4">
                            <li><a className="text-sm text-slate-500 hover:text-neon-cyan transition-colors" href="mailto:support@councilia.com">support@councilia.com</a></li>
                            <li><a className="text-sm text-slate-500 hover:text-neon-cyan transition-colors" href="/privacy">Privacy Policy</a></li>
                            <li><a className="text-sm text-slate-500 hover:text-neon-cyan transition-colors" href="/cookies">Cookies Policy</a></li>
                            <li><a className="text-sm text-slate-500 hover:text-neon-cyan transition-colors" href="/terms">Terms of Service</a></li>
                            <li><a className="text-sm text-slate-500 hover:text-neon-cyan transition-colors" href="/security">Data Security</a></li>
                        </ul>
                    </nav>
                </div>
                <div className="max-w-7xl mx-auto border-t border-[rgba(0,240,255,0.1)] mt-16 pt-8 text-center text-slate-600 text-[10px] uppercase tracking-widest font-bold font-mono">
                    © {new Date().getFullYear()} Antigravity Labs. All rights reserved.
                </div>
            </footer>
        </main>
    );
}