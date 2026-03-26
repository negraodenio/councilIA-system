import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/ui/Navbar";
import { Footer } from "@/ui/Footer";

export const metadata: Metadata = {
    title: "Methodology — CouncilIA",
    description: "The scientific foundation behind CouncilIA. Discover how we use adversarial collaboration and multi-agent systems to de-risk high-stakes decisions.",
};

export default function MethodologyPage() {
    return (
        <main className="bg-[#020617] text-slate-100 min-h-screen font-sans relative overflow-x-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 tech-grid pointer-events-none opacity-20 z-0"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>

            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6 z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6 font-mono text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                        v6.1 PRO FINAL — Scientific Foundation
                    </div>
                    <h1 className="text-5xl md:text-7xl font-sans font-black tracking-tighter mb-8 uppercase italic">
                        Evidence-Based <span className="text-cyan-400">Architecture</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
                        CouncilIA operationalizes research from multi-agent systems and decision science into a structured deliberation platform. 
                        Our approach is <strong>scientifically grounded, not scientifically proven.</strong>
                    </p>
                </div>
            </section>

            {/* Scientific Pillars */}
            <section className="relative pb-32 px-6 z-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <MethodologyCard 
                        id="01"
                        title="Multi-Agent Deliberation"
                        paper="Shaikh et al. (PLOS 2025)"
                        cite="https://doi.org/10.1371/journal.pdig.0000721"
                        icon="hub"
                        color="#06b6d4"
                        description="Multi-instance LLM deliberation achieves 97% accuracy in high-stakes clinical exams. CouncilIA extends this by replacing identical instances with specialized personas for cognitive diversity."
                    />

                    <MethodologyCard 
                        id="02"
                        title="Adversarial Reasoning"
                        paper="Ellemers et al. (PNAS 2020)"
                        cite="https://doi.org/10.1073/pnas.1913936117"
                        icon="balance"
                        color="#ec4899"
                        description="Inspired by research on 'Adversarial Alignment' where structured conflict improves theory-building. CouncilIA operationalizes this through intentional role tension and forced challenges."
                    />

                    <MethodologyCard 
                        id="03"
                        title="Independent Perspectives"
                        paper="Distributed Multi-Agent Systems"
                        cite="#"
                        icon="groups"
                        color="#8b5cf6"
                        description="Based on game-theoretic principles where independent agents optimize domain-specific criteria. This improves decision robustness by surfacing risks that single-model outputs miss."
                    />

                    <MethodologyCard 
                        id="04"
                        title="Iterative Deliberation"
                        paper="3-Round Optimization"
                        cite="#"
                        icon="refresh"
                        color="#f59e0b"
                        description="Empirical data suggests diminishing returns beyond a limited round count. CouncilIA adopts a strict Thesis → Antithesis → Synthesis protocol for maximum efficiency."
                    />

                    <MethodologyCard 
                        id="05"
                        title="Human-AI Governance"
                        paper="Amershi et al. (CHI 2019)"
                        cite="https://doi.org/10.1145/3290605.3300233"
                        icon="shield_person"
                        color="#10b981"
                        description="Implementation of Microsoft Research G11 (Explainability) and G17 (Human Control) guidelines. AI structures decisions, but humans remain final and accountable."
                    />

                    <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 flex flex-col items-center justify-center text-center shadow-xl">
                        <h3 className="text-2xl font-bold mb-4 text-white">Audit-Ready Protocol</h3>
                        <p className="text-cyan-100 text-sm mb-8">Ready to transform opinions into auditable decision documents?</p>
                        <Link href="/login" className="px-8 py-3 bg-white text-cyan-600 font-bold rounded-lg hover:bg-cyan-50 transition-colors uppercase tracking-widest text-xs">
                            Start Session
                        </Link>
                    </div>
                </div>
            </section>

            {/* Technical Implementation */}
            <section className="relative pb-32 px-6 z-10 border-t border-white/5 pt-32">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-3xl font-black mb-8 uppercase tracking-tight text-white">Technical Implementation</h2>
                        <div className="space-y-8">
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <h4 className="text-cyan-400 font-mono text-xs uppercase tracking-widest font-black mb-2">Deliberation Trace System</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    CouncilIA produces a structured decision trace: argument isolation, evidence mapping (RAG), and refinement logs. 
                                    This enables complete auditability by regulatory bodies.
                                </p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <h4 className="text-cyan-400 font-mono text-xs uppercase tracking-widest font-black mb-2">VaR-Inspired Risk Modeling</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Decision uncertainty is quantified through agent disagreement and evidence gaps. 
                                    High Dissent = High Uncertainty = Mandatory Human Review.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h2 className="text-3xl font-black mb-8 uppercase tracking-tight text-white">Decision Metrics</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <MetricBox title="Dissent Range" value="0–100" desc="Variance between expert outputs" />
                            <MetricBox title="Consensus Strength" value="%" desc="Arguments surviving all rounds" />
                            <MetricBox title="Evidence Density" value="Cites" desc="Citations per critical claim" />
                            <MetricBox title="Audit Score" value="0–100" desc="Adherence to regulatory RAG" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 3-Round Protocol Table */}
            <section className="relative pb-32 px-6 z-10 overflow-hidden">
                <div className="max-w-4xl mx-auto rounded-3xl bg-slate-900/50 border border-white/10 p-12 backdrop-blur-md">
                    <h2 className="text-3xl font-black mb-12 text-center uppercase tracking-widest italic text-white">The 3-Round Protocol</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-sans">
                            <thead className="border-b border-white/10 text-cyan-400 text-[10px] uppercase font-bold tracking-widest">
                                <tr>
                                    <th className="pb-6 w-1/4">Round</th>
                                    <th className="pb-6">Purpose</th>
                                    <th className="pb-6">Output</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                                <tr>
                                    <td className="py-8 font-black text-white">R1: Thesis</td>
                                    <td className="py-8">Independent expert evaluation</td>
                                    <td className="py-8">Domain-specific analysis + Evidence</td>
                                </tr>
                                <tr>
                                    <td className="py-8 font-black text-white">R2: Antithesis</td>
                                    <td className="py-8">Structured adversarial critique</td>
                                    <td className="py-8">Unrefuted risks + Direct challenges</td>
                                </tr>
                                <tr>
                                    <td className="py-8 font-black text-white">R3: Synthesis</td>
                                    <td className="py-8">Evidence-based refinement</td>
                                    <td className="py-8">Decision document + Action plan</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Limitations & Forbidden Section */}
            <section className="relative pb-32 px-6 z-10">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-10 rounded-3xl border border-red-500/20 bg-red-500/5">
                        <h3 className="text-lg font-bold text-red-400 uppercase mb-6 tracking-widest">System Limitations</h3>
                        <ul className="space-y-4 text-xs text-slate-400 list-disc list-inside">
                            <li>Dependent on input quality (Garbage In → Structured Garbage Out)</li>
                            <li>Does not guarantee correctness; only de-risks process</li>
                            <li>Does not replace domain experts or regulatory sign-off</li>
                            <li>Cannot validate outcome without empirical testing</li>
                        </ul>
                    </div>
                    <div className="p-10 rounded-3xl border border-white/10 bg-white/5">
                        <h3 className="text-lg font-bold text-white uppercase mb-6 tracking-widest">What We Do Not Claim</h3>
                        <ul className="space-y-4 text-xs text-slate-400">
                            <li className="flex items-center gap-2">❌ AI replaces human decision-making</li>
                            <li className="flex items-center gap-2">❌ Universally proven accuracy</li>
                            <li className="flex items-center gap-2">❌ Elimination of risk</li>
                        </ul>
                        <p className="mt-8 text-[10px] font-mono text-slate-500 italic uppercase">
                            &quot;We structure decisions. Humans remain accountable.&quot;
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

function MetricBox({ title, value, desc }: { title: string; value: string; desc: string }) {
    return (
        <div className="p-6 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all group">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1 group-hover:text-cyan-400 transition-colors uppercase">{title}</div>
            <div className="text-2xl font-black text-white mb-2">{value}</div>
            <p className="text-[9px] text-slate-600 uppercase tracking-tighter leading-tight uppercase">{desc}</p>
        </div>
    );
}

function MethodologyCard({ id, title, paper, cite, icon, color, description }: {
    id: string; title: string; paper: string; cite: string; icon: string; color: string; description: string;
}) {
    return (
        <div className="group p-8 rounded-3xl bg-slate-900/40 border border-white/10 hover:border-cyan-500/30 transition-all hover:translate-y-[-4px] flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div 
                    className="size-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}
                >
                    <span className="material-symbols-outlined shrink-0 select-none">{icon}</span>
                </div>
                <span className="font-mono text-[10px] text-slate-600 font-black group-hover:text-cyan-400/50 transition-colors uppercase tracking-widest">Pillar {id}</span>
            </div>
            
            <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors uppercase">{title}</h3>
            <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider mb-6 font-bold">{paper}</p>
            
            <p className="text-sm text-slate-500 leading-relaxed mb-8 flex-grow">
                {description}
            </p>

            <div className="mt-auto pt-6 border-t border-white/5">
                {cite !== "#" ? (
                    <a 
                        href={cite} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 transition-colors uppercase tracking-widest font-bold"
                    >
                        Read Publication <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                    </a>
                ) : (
                    <span className="text-[10px] text-slate-600 font-mono italic uppercase tracking-widest">Technical Spec v6.1</span>
                )}
            </div>
        </div>
    );
}