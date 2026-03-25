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
        <main className="bg-deep-blue text-slate-100 min-h-screen font-body relative overflow-x-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 tech-grid pointer-events-none opacity-20 z-0"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>

            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6 z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
                        <span className="material-symbols-outlined text-[14px] text-indigo-400">verified</span>
                        <span className="text-[11px] font-mono font-bold text-indigo-300 uppercase tracking-widest">Academic Validation Moat</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight mb-8">
                        The Science of <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-indigo-400">De-Risking</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
                        One AI model is prone to bias. Our architecture leverages a diverse council of agents, 
                        pitting specialized personas against each other in a multi-round adversarial protocol.
                    </p>
                </div>
            </section>

            {/* Scientific Pillars */}
            <section className="relative pb-32 px-6 z-10">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Pillar 1: Clinical Precision */}
                    <MethodologyCard 
                        id="01"
                        title="Clinical Precision"
                        paper="Shaikh et al. (PLOS 2025)"
                        cite="https://doi.org/10.1371/journal.pdig.0000721"
                        icon="medical_services"
                        color="#3B82F6"
                        description="Framework validates 97% accuracy in high-stakes clinical exams (Step 1). The 5-agent deliberation protocol corrects 53% of errors that majority voting would commit. CouncilIA evolves this via specialized personas."
                        impact="53% Error Correction vs Voting"
                    />

                    {/* Pillar 2: Adversarial Alignment */}
                    <MethodologyCard 
                        id="02"
                        title="Adversarial Alignment"
                        paper="Ellemers et al. (PNAS 2020)"
                        cite="https://doi.org/10.1073/pnas.1913936117"
                        icon="balance"
                        color="#A855F7"
                        description="Based on 'Adversarial alignment enables competing models to engage in cooperative theory building'. Our Persona engine uses these rules to reframe competition into a cooperative search for truth."
                        impact="Kahneman-Based Alignment"
                    />

                    {/* Pillar 3: Rational Multi-Agent Systems */}
                    <MethodologyCard 
                        id="03"
                        title="Rational Multi-Agent Systems"
                        paper="MpFL (NeurIPS 2025)"
                        cite="https://arxiv.org/abs/2501.08263"
                        icon="hub"
                        color="#10B981"
                        description="Multiplayer Federated Learning where clients are rational players with individual utility functions. Convergence to equilibrium is mathematically proven, mirroring our Collective Intelligence Engine."
                        impact="Proven Rational Equilibrium"
                    />

                    {/* Pillar 4: Consensus vs. Majority Voting */}
                    <MethodologyCard 
                        id="04"
                        title="Consensus vs. Majority Voting"
                        paper="Kaesberg et al. (ACL Findings 2025)"
                        cite="#"
                        icon="query_stats"
                        color="#F59E0B"
                        description="Determines that 3 rounds (CouncilIA protocol) optimize decision quality. Note: DOI pending — ACL Anthology publication expected Q3 2025."
                        impact="3-Round Protocol Validation"
                    />

                    {/* Pillar 5: Human-AI Control */}
                    <MethodologyCard 
                        id="05"
                        title="Sovereign Override & Clarity"
                        paper="Amershi et al. (CHI 2019)"
                        cite="https://doi.org/10.1145/3290605.3300233"
                        icon="shield_person"
                        color="#EC4899"
                        description="Microsoft Research guidelines for Human-AI interaction. We strictly implement G11 (Explaning system rationale) and G17 (Global User Control) via the Sovereign Override feature."
                        impact="Guidelines G11 & G17 Compliant"
                    />

                    {/* CTA Card */}
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 flex flex-col items-center justify-center text-center shadow-[0_20px_50px_rgba(79,70,229,0.3)]">
                        <h3 className="text-2xl font-bold mb-4 text-white">Ready to test the science?</h3>
                        <p className="text-indigo-100 text-sm mb-8">Start your first council session and see the methodology in action.</p>
                        <Link href="/login" className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors uppercase tracking-widest text-xs">
                            Start Session
                        </Link>
                    </div>
                </div>
            </section>

            {/* Technical Context Section */}
            <section className="relative pb-32 px-6 z-10">
                <div className="max-w-4xl mx-auto rounded-3xl bg-white/5 border border-white/10 p-8 md:p-12 backdrop-blur-md">
                    <h2 className="text-3xl font-display font-black mb-8 underline decoration-indigo-500/50">Engine Specifications</h2>
                    
                    <div className="space-y-12">
                        <div>
                            <h4 className="text-indigo-400 font-mono text-xs uppercase tracking-widest font-black mb-4">01. The Synthesis Topography</h4>
                            <p className="text-slate-300 leading-relaxed">
                                Our dashboard utilizes real-time tracking of dissent range and neural alignment. 
                                This isn't just visualization; it's a topographical map of the Council's decision-space. 
                                We measure the "Frictional Force" between persona-clusters to identify hidden risks.
                            </p>
                        </div>
                        
                        <div>
                            <h4 className="text-indigo-400 font-mono text-xs uppercase tracking-widest font-black mb-4">02. Value at Risk (VaR) Modeling</h4>
                            <p className="text-slate-300 leading-relaxed">
                                Inspired by financial risk management, we quantify the probability of a "System Failure" 
                                (hallucination or logical breakdown) based on the divergence of Expert responses. 
                                Higher dissent = Higher VaR.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                            <p className="text-sm font-bold text-indigo-300 italic">
                                "We don't just provide an AI answer. We provide a bulletproof, academically defensible process for human decision-making."
                            </p>
                        </div>
                    </div>

                    {/* Round-by-Round Breakdown */}
                    <div className="mt-20 border-t border-white/10 pt-20">
                        <h2 className="text-3xl font-display font-black mb-12 text-center">The 3-Round Protocol</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div className="space-y-4 p-6">
                                <div className="text-indigo-400 font-mono text-2xl font-bold">R1</div>
                                <h4 className="font-bold uppercase tracking-widest text-xs">Adversarial Opening</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Agents isolate variables. The Devil&apos;s Advocate is given primary authority to find &quot;Instant Failure&quot; points.
                                </p>
                            </div>
                            <div className="space-y-4 p-6 border-x border-white/5">
                                <div className="text-indigo-400 font-mono text-2xl font-bold">R2</div>
                                <h4 className="font-bold uppercase tracking-widest text-xs">Cross-Examination</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Agents must address the specific dissent points raised in R1. Majority voting is disabled; logic must be defended.
                                </p>
                            </div>
                            <div className="space-y-4 p-6">
                                <div className="text-indigo-400 font-mono text-2xl font-bold">R3</div>
                                <h4 className="font-bold uppercase tracking-widest text-xs">Recursive Synthesis</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    The Arbitrator filters for argument density. Only the points that survived R1/R2 are included in the final verdict.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

function MethodologyCard({ id, title, paper, cite, icon, color, description, impact }: {
    id: string; title: string; paper: string; cite: string; icon: string; color: string; description: string; impact: string;
}) {
    return (
        <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:translate-y-[-4px] flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div 
                    className="size-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}
                >
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
                <span className="font-mono text-xs text-slate-600 font-black group-hover:text-slate-400 transition-colors">PILLAR {id}</span>
            </div>
            
            <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">{title}</h3>
            <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider mb-6 font-bold">{paper}</p>
            
            <p className="text-sm text-slate-400 leading-relaxed mb-8 flex-grow">
                {description}
            </p>

            <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Real-World Impact</span>
                    <span className="text-[10px] font-bold py-1 px-2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{impact}</span>
                </div>
                {cite !== "#" && (
                    <a 
                        href={cite} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 font-mono flex items-center gap-1 transition-colors"
                    >
                        Read Publication <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                    </a>
                )}
            </div>
        </div>
    );
}