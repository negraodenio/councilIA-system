export default function Home() {
    return (
        <main className="bg-space-black text-slate-100 font-body selection:bg-neon-lime selection:text-black pt-20 pb-0">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 border-b border-panel-blue bg-space-black/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-neon-cyan/10 rounded-lg flex items-center justify-center border border-neon-cyan/30 shadow-[0_0_15px_rgba(0,240,255,0.2)] shrink-0 overflow-hidden">
                            <span className="material-symbols-outlined text-neon-cyan font-bold select-none">account_tree</span>
                        </div>
                        <span className="text-xl font-black tracking-tighter uppercase font-display">Council<span className="text-neon-cyan">IA</span></span>
                    </div>
                    <nav className="hidden md:flex items-center gap-8 font-display" aria-label="Main navigation">
                        <a className="text-sm font-medium hover:text-neon-cyan transition-colors" href="#how-it-works" aria-label="Learn how CouncilIA works">How it works</a>
                        <a className="text-sm font-medium hover:text-neon-cyan transition-colors" href="#the-council" aria-label="Meet the AI Council">The Council</a>
                        <a className="text-sm font-medium hover:text-neon-cyan transition-colors" href="#use-cases" aria-label="Explore use cases">Use cases</a>
                        <a className="text-sm font-medium hover:text-neon-cyan transition-colors" href="/pricing">Pricing</a>
                        <a className="text-sm font-medium hover:text-neon-cyan transition-colors" href="/methodology">Methodology</a>
                    </nav>
                    <a href="/login" role="button" aria-label="Start Free Session" className="bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:bg-neon-cyan hover:text-black hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                        Start Free Session
                    </a>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative py-24 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-neon-cyan/5 blur-[120px] rounded-full"></div>
                </div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan text-[10px] font-bold uppercase tracking-[0.2em] mb-10 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
                        </span>
                        Built on peer-reviewed adversarial reasoning research
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black leading-[1] mb-8 tracking-tighter font-display uppercase">
                        Make High-Stakes Decisions<br />
                        <span className="bg-gradient-to-r from-neon-cyan via-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                            You Can Defend.
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                        Validate strategy, risk, and execution in 15 minutes — before you commit. CouncilIA replaces weeks of meetings with a structured adversarial engine, delivering audit-ready consensus and measurable stability.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 font-display">
                        <a href="/login" role="button" aria-label="Validate Your Next Decision" className="w-full sm:w-auto px-8 py-4 bg-neon-cyan text-black rounded-xl font-bold text-lg hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all text-center">
                            Validate Your Next Decision
                        </a>
                        <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 border border-[rgba(0,240,255,0.2)] bg-[#121235]/40 hover:bg-[#121235]/60 rounded-xl font-bold text-lg transition-all text-center text-neon-cyan">
                            Watch Protocol Demo
                        </a>
                    </div>
                    <p className="mt-8 text-xs font-mono text-slate-500 uppercase tracking-widest">
                        FREE 7 DAYS • NO CREDIT CARD REQUIRED • CANCEL ANYTIME
                    </p>
                </div>

                {/* ── Real Client Testimonial ── */}
                <div className="max-w-3xl mx-auto mt-20">
                    <p className="text-center text-[10px] font-mono uppercase tracking-[0.3em] mb-8 text-neon-cyan/60">Trusted by decision-makers</p>
                    <div className="relative p-8 rounded-2xl border border-neon-cyan/20 bg-panel-blue/30 backdrop-blur-sm shadow-[0_0_40px_rgba(0,240,255,0.05)]">
                        {/* Quote mark */}
                        <span className="absolute top-6 left-8 text-6xl text-neon-cyan/10 font-serif leading-none select-none">&ldquo;</span>
                        <div className="relative z-10">
                            <p className="text-lg md:text-xl text-slate-200 leading-relaxed italic font-light mb-6 pl-4">
                                &ldquo;I use CouncilIA to make the most critical decisions in my clinic.
                                In 15 minutes, I had a complete view of the risks and opportunities in the
                                expansion I was considering. It&apos;s like having a board of directors available
                                at any time — no scheduling meetings, no expensive consultants.&rdquo;
                            </p>
                            <div className="flex items-center gap-4 pl-4">
                                {/* Photo placeholder — replace src with actual photo when available */}
                                <div className="size-12 rounded-full bg-gradient-to-br from-neon-cyan/30 to-blue-500/30 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan font-black text-lg shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
                                    {/* REPLACE_WITH_PHOTO: <img src="/testimonials/client-dental.jpg" alt="Dr. ..." className="size-12 rounded-full object-cover" /> */}
                                    DR
                                </div>
                                <div>
                                    <p className="font-bold text-white text-sm">Dentist — Dental Clinic</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Brazil · Verified Client ✓</p>
                                </div>
                                <div className="ml-auto flex items-center gap-1">
                                    {[1,2,3,4,5].map(i => (
                                        <span key={i} className="text-neon-cyan text-sm">★</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="text-center mt-6 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                        Use case: Dental clinic expansion · Strategic next-steps analysis
                    </p>
                </div>
            </section>

            {/* Value Block: From Opinion to Verified Decision */}
            <section className="py-24 px-6 border-t border-white/5 bg-panel-blue/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tight font-display text-white">From Opinion to Verified Decision.</h2>
                        <p className="text-[#c4c4ff] max-w-2xl mx-auto">CouncilIA replaces weeks of meetings and subjective opinions with a structured, adversarial decision system.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 px-4 lg:px-0">
                        {/* Before */}
                        <div className="p-10 bg-red-950/10 border border-red-500/20 rounded-3xl md:rounded-r-none relative group overflow-hidden">
                            <div className="absolute top-4 right-4 text-red-500/20 font-black text-2xl font-display">⚠️ BEFORE</div>
                            <h3 className="text-xl font-bold mb-8 text-red-400 uppercase tracking-tighter">Opinion-Based Decisions</h3>
                            <ul className="space-y-4 text-slate-400 text-sm">
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-red-500/50 text-lg">close</span>
                                    Weeks of recursive meetings
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-red-500/50 text-lg">close</span>
                                    Conflicting or biased opinions
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-red-500/50 text-lg">close</span>
                                    No clear accountability trail
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-red-500/50 text-lg">close</span>
                                    Decisions based on intuition
                                </li>
                            </ul>
                        </div>

                        {/* Engine */}
                        <div className="p-10 bg-neon-cyan/5 border-x border-neon-cyan/20 border-y-2 border-y-neon-cyan/50 relative group glow-cyan z-10">
                            <div className="absolute top-4 right-4 text-neon-cyan/20 font-black text-2xl font-display">⚙️ ENGINE</div>
                            <h3 className="text-xl font-bold mb-8 text-neon-cyan uppercase tracking-tighter">CouncilIA Protocol</h3>
                            <ul className="space-y-4 text-slate-200 text-sm">
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-neon-cyan text-lg">check</span>
                                    15-minute structured analysis
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-neon-cyan text-lg">check</span>
                                    Adversarial expert deliberation
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-neon-cyan text-lg">check</span>
                                    Deterministic decision scoring
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-neon-cyan text-lg">check</span>
                                    Full HMAC signed audit replay
                                </li>
                            </ul>
                            <div className="mt-10 pt-10 border-t border-neon-cyan/20">
                                <p className="text-[10px] font-mono text-neon-cyan uppercase tracking-widest leading-relaxed">
                                    REPLACING 3 WEEKS OF STRATEGY WORK WITH 15 MINUTES OF VALIDATED INTEL.
                                </p>
                            </div>
                        </div>

                        {/* After */}
                        <div className="p-10 bg-green-950/10 border border-green-500/20 rounded-3xl md:rounded-l-none relative group overflow-hidden">
                            <div className="absolute top-4 right-4 text-green-500/20 font-black text-2xl font-display">✅ AFTER</div>
                            <h3 className="text-xl font-bold mb-8 text-green-400 uppercase tracking-tighter">Verified Outcomes</h3>
                            <ul className="space-y-4 text-slate-400 text-sm">
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-green-500/50 text-lg">check_circle</span>
                                    Clear GO / NO-GO verdict
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-green-500/50 text-lg">check_circle</span>
                                    De-biased confidence score
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-green-500/50 text-lg">check_circle</span>
                                    Concrete risk mitigation plan
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-green-500/50 text-lg">check_circle</span>
                                    Decisions you can defend
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Built For Section */}
            <section className="py-20 px-6 border-t border-white/5 bg-space-black">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="md:w-1/3">
                        <h2 className="text-3xl font-black uppercase tracking-tight font-display mb-4">Designed for<br /><span className="text-neon-cyan">High-Stakes Validation.</span></h2>
                        <p className="text-slate-400 text-sm">CouncilIA is not a chat tool. It is critical decision infrastructure built for those who own the outcome.</p>
                    </div>
                    <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-panel-blue/20 border border-white/5 hover:border-neon-cyan/30 transition-all">
                            <span className="material-symbols-outlined text-neon-cyan mb-4">rocket_launch</span>
                            <h4 className="font-bold mb-2">Founders</h4>
                            <p className="text-[11px] text-slate-500 uppercase tracking-widest font-mono">Making strategic bets on product & pivot</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-panel-blue/20 border border-white/5 hover:border-orange-500/30 transition-all">
                            <span className="material-symbols-outlined text-orange-500 mb-4">settings_suggest</span>
                            <h4 className="font-bold mb-2">Operators</h4>
                            <p className="text-[11px] text-slate-500 uppercase tracking-widest font-mono">Scaling execution without blind spots</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-panel-blue/20 border border-white/5 hover:border-purple-500/30 transition-all">
                            <span className="material-symbols-outlined text-purple-500 mb-4">account_balance_wallet</span>
                            <h4 className="font-bold mb-2">Investors</h4>
                            <p className="text-[11px] text-slate-500 uppercase tracking-widest font-mono">Validating capital allocation & risk</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Metrology / Scientific Proof Section */}
            <section className="py-24 px-6 border-y border-[rgba(0,240,255,0.1)] bg-panel-blue/5">
                <div className="max-w-7xl mx-auto">
                    <p className="text-center text-[10px] font-bold text-neon-cyan tracking-[0.3em] uppercase mb-16">Measured Improvements in Decision Stability & Consistency</p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                        <div className="text-center space-y-2 group">
                            <h3 className="text-xl font-black text-white font-display">Audit Hardened</h3>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-tight">HMAC Hash-Chaining v14.0</p>
                        </div>
                        <div className="text-center space-y-2 group">
                            <h3 className="text-xl font-black text-white font-display">Zero Bias</h3>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-tight">Adversarial Consensus Engine</p>
                        </div>
                        <div className="text-center space-y-2 group">
                            <h3 className="text-xl font-black text-white font-display">Verifiable</h3>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-tight">Full Lineage Replay</p>
                        </div>
                        <div className="text-center space-y-2 group">
                            <h3 className="text-xl font-black text-white font-display">Consistency</h3>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-tight">Measured Benchmark Stability</p>
                        </div>
                        <div className="text-center space-y-2 group">
                            <h3 className="text-xl font-black text-white font-display">Protocol</h3>
                            <p className="text-[10px] font-bold text-neon-cyan uppercase tracking-widest leading-tight">3-Round Adversarial Scan</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Live Demo/Preview */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="glass-card rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.1)]">
                    <div className="p-6 border-b border-[rgba(0,240,255,0.2)] flex items-center justify-between bg-panel-blue/50">
                        <div className="flex items-center gap-4">
                            <div className="px-3 py-1 bg-neon-magenta/10 text-neon-magenta text-[10px] font-black uppercase rounded tracking-tighter flex items-center gap-1.5">
                                <span className="size-1.5 bg-neon-magenta rounded-full"></span> LIVE SESSION
                            </div>
                            <h2 className="text-sm font-mono text-[#c4c4ff]/90 tracking-widest uppercase">REAL SESSION — ENTERPRISE M&A DECISION ($12M ACQUISITION)</h2>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Policy Version</span>
                                <span className="text-[10px] font-bold text-neon-cyan">v14.0.0 (Hardened)</span>
                            </div>
                            <div className="flex gap-1.5">
                                <div className="size-3 rounded-full bg-red-500/40"></div>
                                <div className="size-3 rounded-full bg-yellow-500/40"></div>
                                <div className="size-3 rounded-full bg-green-500/40"></div>
                            </div>
                        </div>
                    </div>

                    {/* v14 Audit Proof Card: High Visibility */}
                    <div className="bg-space-black/80 border-b border-neon-cyan/20 p-4 px-6 flex flex-wrap items-center justify-between gap-6 backdrop-blur-md">
                        <div className="flex gap-8">
                            <div>
                                <p className="text-[8px] font-mono text-slate-500 uppercase tracking-[0.2em] mb-1">Decision ID</p>
                                <p className="text-xs font-black text-white font-display">#A214-X92-2026</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-mono text-slate-500 uppercase tracking-[0.2em] mb-1">Audit Signature (HMAC-256)</p>
                                <p className="text-xs font-mono text-neon-cyan">8f3a9c...7d21b4</p>
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-[8px] font-mono text-slate-500 uppercase tracking-[0.2em] mb-1">Consensus Stability</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div className="w-[88%] h-full bg-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.5)]"></div>
                                    </div>
                                    <span className="text-[10px] font-bold text-white">0.88</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-[10px] font-bold uppercase rounded-lg hover:bg-neon-cyan hover:text-black transition-all">
                                <span className="material-symbols-outlined text-[14px]">replay</span> Replay Decision
                            </button>
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-white/10 transition-all">
                                <span className="material-symbols-outlined text-[14px]">download</span> Download Report
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                        {/* Debate Feed */}
                        <div className="lg:col-span-8 p-6 space-y-6 h-[500px] overflow-y-auto custom-scrollbar border-r border-[rgba(0,240,255,0.2)]">
                            {/* Visionary */}
                            <div className="flex gap-4">
                                <div className="size-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/30">
                                    <span className="material-symbols-outlined text-orange-500 text-sm">lightbulb</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-orange-500 tracking-widest uppercase">VISIONARY</p>
                                    <div className="p-4 bg-panel-blue/40 rounded-xl rounded-tl-none border border-[rgba(0,240,255,0.1)] text-sm leading-relaxed text-[#c4c4ff]">
                                        The NRR on Project Horizon is 112%. Acquiring this competitor now removes the only threat to our Enterprise dominance. It&apos;s a defensive land-grab with 5x ROI.
                                    </div>
                                </div>
                            </div>
                            {/* Devil's Advocate */}
                            <div className="flex gap-4">
                                <div className="size-10 rounded-lg bg-neon-magenta/10 flex items-center justify-center shrink-0 border border-neon-magenta/30">
                                    <span className="material-symbols-outlined text-neon-magenta text-sm">gavel</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-neon-magenta tracking-widest uppercase">DEVIL&apos;S ADVOCATE</p>
                                    <div className="p-4 bg-panel-blue/40 rounded-xl rounded-tl-none border border-[rgba(0,240,255,0.1)] text-sm leading-relaxed text-[#c4c4ff]">
                                        Unit economics don&apos;t clear. Their CAC is skyrocketing and the tech stack is legacy. You aren&apos;t buying growth; you&apos;re buying a technical debt anchor.
                                    </div>
                                </div>
                            </div>
                            {/* The 7th Expert (HIGHLIGHTED) */}
                            <div className="flex gap-4 relative">
                                <div className="absolute -inset-2 bg-indigo-500/5 rounded-2xl blur-lg animate-pulse pointer-events-none"></div>
                                <div className="size-10 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.3)] relative z-10">
                                    <span className="material-symbols-outlined text-indigo-400 text-sm">psychology</span>
                                </div>
                                <div className="space-y-1 relative z-10">
                                    <div className="flex items-center gap-2">
                                        <p className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase font-display">THE 7th EXPERT</p>
                                        <span className="px-1 py-0.5 bg-indigo-500 text-[6px] font-black text-white rounded uppercase tracking-tighter">Proprietary Training</span>
                                    </div>
                                    <div className="p-4 bg-indigo-500/10 rounded-xl rounded-tl-none border border-indigo-500/30 text-sm leading-relaxed text-indigo-100 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                                        &quot;Based on **Market Correlation Overlays**, similar acquisitions in this vertical fail 70-90% of the time (HBR, 2020). Suggesting a 20% holdback based on churn thresholds.&quot;
                                    </div>
                                </div>
                            </div>
                            {/* Tech Lead */}
                            <div className="flex gap-4">
                                <div className="size-10 rounded-lg bg-neon-cyan/10 flex items-center justify-center shrink-0 border border-neon-cyan/30">
                                    <span className="material-symbols-outlined text-neon-cyan text-sm">memory</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-neon-cyan tracking-widest uppercase">TECH LEAD</p>
                                    <div className="p-4 bg-panel-blue/40 rounded-xl rounded-tl-none border border-[rgba(0,240,255,0.1)] text-sm leading-relaxed text-[#c4c4ff]">
                                        Code audit suggests modular overlap. We can sunset their legacy engine in 4 months, migrating users to our core infrastructure. Feasibility is green.
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Verdict Sidebar */}
                        <div className="lg:col-span-4 bg-panel-blue/20 p-8 flex flex-col justify-center items-center text-center">
                            <div className="mb-8 relative">
                                <svg className="size-40 rotate-[-90deg]">
                                    <circle className="text-[rgba(0,240,255,0.1)]" cx="80" cy="80" fill="none" r="70" stroke="currentColor" strokeWidth="12"></circle>
                                    <circle className="text-neon-lime transition-all duration-1000 shadow-[0_0_20px_rgba(175,255,51,0.5)]" cx="80" cy="80" fill="none" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset="310" strokeWidth="12"></circle>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black font-display text-neon-lime tracking-tighter">72</span>
                                    <div className="text-[8px] text-[#00f0ff]/70 font-mono tracking-widest mt-1 uppercase flex flex-col items-center">
                                        <span>Consensus Score</span>
                                        <span className="text-[6px] opacity-70 border-t border-neon-cyan/20 pt-1 mt-1 max-w-[120px]">Sci-Audit v12.4.0 Elite</span>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-4 font-display uppercase tracking-tight">Verdict: <span className="text-neon-lime">Audit Approved</span></h3>
                            <p className="text-[10px] font-mono text-slate-500 uppercase mb-4 tracking-tighter">Stability Index: 0.88 | Sci-Var: 11.4%</p>
                            <ul className="text-sm text-[#c4c4ff] leading-relaxed mb-6 text-left space-y-2 list-disc list-inside bg-space-black/40 p-4 rounded-xl border border-[rgba(0,240,255,0.1)] shadow-inner">
                                <li><strong>Advantage:</strong> Defensive moat against vertical competitors.</li>
                                <li><strong>Mitigation:</strong> 20% holdback for churn protection.</li>
                                <li><strong>Action Item:</strong> Finalize technical due diligence on stack.</li>
                            </ul>
                            
                            {/* Tension Map Visualization (MINI) */}
                            <div className="w-full mb-8 space-y-3">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Tension Map</span>
                                    <span className="text-[8px] font-bold text-neon-cyan animate-pulse">LIVE</span>
                                </div>
                                <div className="h-16 bg-space-black/60 rounded-lg border border-white/5 flex items-end justify-around p-2 gap-1 overflow-hidden relative group">
                                    <div className="absolute top-0 left-0 w-full h-px bg-white/5"></div>
                                    <div className="h-[60%] w-3 bg-orange-500/40 border-t border-orange-500 rounded-t-sm animate-[pulse_2s_infinite]"></div>
                                    <div className="h-[85%] w-3 bg-neon-magenta/40 border-t border-neon-magenta rounded-t-sm animate-[pulse_3s_infinite]"></div>
                                    <div className="h-[40%] w-3 bg-indigo-500/40 border-t border-indigo-500 rounded-t-sm animate-[pulse_2.5s_infinite]"></div>
                                    <div className="h-[70%] w-3 bg-neon-cyan/40 border-t border-neon-cyan rounded-t-sm animate-[pulse_1.5s_infinite]"></div>
                                    <div className="h-[55%] w-3 bg-neon-lime/40 border-t border-neon-lime rounded-t-sm animate-[pulse_4s_infinite]"></div>
                                    {/* Scanline overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent h-4 animate-[scan_2s_linear_infinite] pointer-events-none"></div>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-neon-cyan text-black rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all transform active:scale-95">
                                Download Analysis Report
                            </button>
                        </div>
                    </div>
                </div>

                {/* Enterprise Governance Feature Block */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <div className="size-12 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-neon-cyan">verified_user</span>
                        </div>
                        <h4 className="font-bold text-white uppercase tracking-tighter">Immutable Logs</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">Cryptographic hash-chaining (HMAC-SHA256) ensures tamper-proof audit trails for legal and regulatory compliance.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="size-12 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-neon-cyan">history_edu</span>
                        </div>
                        <h4 className="font-bold text-white uppercase tracking-tighter">Decision Replay</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">Reconstruct every deliberation round, thought process, and adversarial pivot with full data lineage.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="size-12 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-neon-cyan">policy</span>
                        </div>
                        <h4 className="font-bold text-white uppercase tracking-tighter">Policy Versioning</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">Run decisions against snapshots of your company policies to ensure long-term governance alignment.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="size-12 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-neon-cyan">lan</span>
                        </div>
                        <h4 className="font-bold text-white uppercase tracking-tighter">Tenant Isolation</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">Secure, multi-tenant architecture with Row-Level Security (RLS) for enterprise-grade data privacy.</p>
                    </div>
                </div>
            </section>

            {/* Outcome Gallery Section */}
            <section className="py-20 px-6 max-w-7xl mx-auto border-t border-[rgba(0,240,255,0.1)]">
                <div className="text-center mb-16">
                    <p className="text-[10px] font-bold text-neon-cyan tracking-[0.3em] uppercase mb-4">Proof of Work</p>
                    <h2 className="text-4xl font-black mb-4 uppercase tracking-tight font-display">Outcome Gallery</h2>
                    <p className="text-[#c4c4ff] max-w-2xl mx-auto">
                        We don&apos;t sell basic chat logs. We sell verifiable decision intelligence. Here is the final output our 
                        clients actually receive—scientifically validated Decision Lineage.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Case 1: FinTech EU */}
                    <div className="group rounded-2xl border border-[rgba(0,240,255,0.1)] bg-panel-blue/10 overflow-hidden hover:border-amber-400/40 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(251,191,36,0.1)]">
                        <div className="h-48 bg-[#0a0f1e] p-6 relative flex flex-col justify-between overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-2xl rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="relative z-10 flex justify-between items-start">
                                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[9px] font-black uppercase rounded tracking-widest border border-amber-500/30">Prevented</span>
                                <span className="text-2xl font-black text-white font-display">€12M</span>
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-white font-bold leading-tight mb-2">FinTech (EU) — M&A Target Audit</h3>
                                <div className="h-1.5 w-full bg-space-black/80 rounded-full overflow-hidden flex">
                                    <div className="h-full bg-amber-400 w-[54%] shadow-[0_0_10px_rgba(251,191,36,0.5)]"></div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-xs text-[#c4c4ff] mb-4 line-clamp-2 leading-relaxed">
                                Prevented a €12M overpayment in a SaaS acquisition by identifying legacy tech debt anchors that single-agent LLMs missed.
                            </p>
                            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-mono text-amber-400">
                                <span>View Decision Lineage</span>
                                <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </div>
                        </div>
                    </div>

                    {/* Case 2: Healthcare BR */}
                    <div className="group rounded-2xl border border-[rgba(0,240,255,0.1)] bg-panel-blue/10 overflow-hidden hover:border-green-400/40 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(74,222,128,0.1)]">
                        <div className="h-48 bg-[#0a0f1e] p-6 relative flex flex-col justify-between overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-2xl rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="relative z-10 flex justify-between items-start">
                                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[9px] font-black uppercase rounded tracking-widest border border-green-500/30">Validated</span>
                                <span className="text-2xl font-black text-white font-display">$2M</span>
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-white font-bold leading-tight mb-2">Healthcare (BR) — Expansion Strategy</h3>
                                <div className="h-1.5 w-full bg-space-black/80 rounded-full overflow-hidden flex">
                                    <div className="h-full bg-green-400 w-[88%] shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-xs text-[#c4c4ff] mb-4 line-clamp-2 leading-relaxed">
                                Validated a $2M expansion strategy by de-biasing territorial assumptions through adversarial market simulation.
                            </p>
                            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-mono text-green-400">
                                <span>View Audit Trail</span>
                                <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </div>
                        </div>
                    </div>

                    {/* Case 3: Logistics Pivot */}
                    <div className="group rounded-2xl border border-[rgba(0,240,255,0.1)] bg-panel-blue/10 overflow-hidden hover:border-red-400/40 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(248,113,113,0.1)]">
                        <div className="h-48 bg-[#0a0f1e] p-6 relative flex flex-col justify-between overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-2xl rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="relative z-10 flex justify-between items-start">
                                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[9px] font-black uppercase rounded tracking-widest border border-red-500/30">Aborted</span>
                                <span className="text-2xl font-black text-white font-display">REJECTED</span>
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-white font-bold leading-tight mb-2">Logistics Hub — Operational Pivot</h3>
                                <div className="h-1.5 w-full bg-space-black/80 rounded-full overflow-hidden flex">
                                    <div className="h-full bg-red-500 w-[21%] shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-xs text-[#c4c4ff] mb-4 line-clamp-2 leading-relaxed">
                                Identified critical flaws in a high-risk logistics pivot before executive execution, saving 14 months of wasted development.
                            </p>
                            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-mono text-red-400">
                                <span>See Report</span>
                                <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Score & HUD Explanation Section */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="glass-card p-10 rounded-3xl border border-white/5 bg-panel-blue/10">
                        <h3 className="text-2xl font-black mb-6 font-display uppercase tracking-tight text-neon-cyan">The Consensus Score</h3>
                        <p className="text-[#c4c4ff] leading-relaxed mb-8">
                            Unlike simple averages, a CouncilIA Score represents <strong>Consensus Stability</strong>. 
                            It measures how many strategic assumptions survived under adversarial pressure across our 3-round protocol.
                        </p>
                        <div className="space-y-4">
                            <div className="flex gap-4 p-4 rounded-xl bg-black/40 border border-white/5">
                                <span className="text-neon-lime font-black">80+</span>
                                <p className="text-xs text-slate-400">High Consensus. The strategy is robust against all primary attack vectors. Low implementation risk.</p>
                            </div>
                            <div className="flex gap-4 p-4 rounded-xl bg-black/40 border border-white/5 opacity-60">
                                <span className="text-yellow-500 font-black">60-79</span>
                                <p className="text-xs text-slate-400">Moderate Risk. Strategic holes detected. Requires specific mitigations (Vaccines) identified in the report.</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black mb-6 font-display uppercase tracking-tight text-white">Adversarial Telemetry</h3>
                        <p className="text-[#c4c4ff] leading-relaxed mb-6">
                            The **Tension Map** visualizes the frictional gap between two neural clusters in real-time. We don&apos;t just simulate experts; we measure the cognitive load of their disagreement.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 rounded-2xl bg-orange-500/5 border border-orange-500/20">
                                <h4 className="text-orange-500 font-black text-xs uppercase mb-2">Velocity Cluster</h4>
                                <p className="text-[10px] text-slate-400">Pushed by Visionary/Marketeer agents. Focuses on growth, TAM expansion, and category creation.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-neon-magenta/5 border border-neon-magenta/20">
                                <h4 className="text-neon-magenta font-black text-xs uppercase mb-2">Stability Cluster</h4>
                                <p className="text-[10px] text-slate-400">Pushed by Advocate/Ethics agents. Focuses on risk management, tech debt, and unit economics.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-24 px-6 bg-panel-blue/20" id="how-it-works">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black mb-4 uppercase tracking-tight font-display">The Protocol</h2>
                        <p className="text-[#c4c4ff] font-mono text-sm tracking-widest uppercase">Verified Adversarial Deliberation</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-2xl border border-[rgba(0,240,255,0.1)] bg-space-black relative group">
                            <span className="text-6xl font-black text-neon-cyan/5 absolute top-4 right-8 group-hover:text-neon-cyan/20 transition-colors font-display">R1</span>
                            <div className="size-12 rounded-lg bg-neon-cyan/10 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-neon-cyan">gavel</span>
                            </div>
                            <h3 className="text-xl font-bold mb-4 font-display uppercase tracking-tight">Adversarial Opening</h3>
                            <p className="text-[#c4c4ff] text-sm leading-relaxed font-body">Agents isolate the "instant failure" assumptions in your business model or strategy document before the turn begins.</p>
                        </div>
                        <div className="p-8 rounded-2xl border border-neon-cyan/40 bg-space-black relative group glow-cyan">
                            <span className="text-6xl font-black text-neon-cyan/5 absolute top-4 right-8 group-hover:text-neon-cyan/30 transition-colors font-display">R2</span>
                            <div className="size-12 rounded-lg bg-neon-cyan/20 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-neon-cyan">forum</span>
                            </div>
                            <h3 className="text-xl font-bold mb-4 font-display uppercase tracking-tight">Cross-Examination</h3>
                            <p className="text-[#c4c4ff] text-sm leading-relaxed font-body">Witness real-time adversarial deliberation. Agents must address dissent points raised in R1. Majority voting is disabled.</p>
                        </div>
                        <div className="p-8 rounded-2xl border border-[rgba(0,240,255,0.1)] bg-space-black relative group">
                            <span className="text-6xl font-black text-neon-cyan/5 absolute top-4 right-8 group-hover:text-neon-cyan/20 transition-colors font-display">R3</span>
                            <div className="size-12 rounded-lg bg-neon-cyan/10 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-neon-cyan">fact_check</span>
                            </div>
                            <h3 className="text-xl font-bold mb-4 font-display uppercase tracking-tight">Recursive Audit</h3>
                            <p className="text-[#c4c4ff] text-sm leading-relaxed font-body">Only arguments that survived R1/R2 are synthesized by the Arbitrator into the final executive audit and decision lineage.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Council Section */}
            <section className="py-24 px-6 max-w-7xl mx-auto" id="the-council">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
                    <div className="max-w-xl">
                        <h2 className="text-4xl font-black mb-4 uppercase tracking-tight font-display">The Council</h2>
                        <p className="text-[#c4c4ff]">Each agent is trained on specific decision-making frameworks and adversarial logic.</p>
                    </div>
                    <div className="text-neon-cyan font-mono text-sm">STATUS: ALL AGENTS ACTIVE</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Visionary */}
                    <div className="p-6 rounded-2xl border border-[rgba(0,240,255,0.1)] bg-panel-blue/40 hover:border-orange-500/50 transition-all group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-10 rounded bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                                <span className="material-symbols-outlined text-orange-500 text-xl group-hover:text-black">flare</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm font-display">Visionary</h4>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Growth First</p>
                            </div>
                        </div>
                        <p className="text-xs text-[#c4c4ff] leading-relaxed font-body">&quot;First principles analysis applied to category creation. I audit for radical scale and Blue Ocean defensibility.&quot;</p>
                    </div>
                    {/* Technologist */}
                    <div className="p-6 rounded-2xl border border-[rgba(0,240,255,0.1)] bg-panel-blue/40 hover:border-neon-cyan/50 transition-all group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-10 rounded bg-neon-cyan/10 flex items-center justify-center group-hover:bg-neon-cyan transition-colors">
                                <span className="material-symbols-outlined text-neon-cyan text-xl group-hover:text-black">terminal</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm font-display">Technologist</h4>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Efficiency</p>
                            </div>
                        </div>
                        <p className="text-xs text-[#c4c4ff] leading-relaxed font-body">&quot;Systems architecture audit. I identify scaling walls, technical debt, and feasibility based on immutable laws.&quot;</p>
                    </div>
                    {/* Devil's Advocate */}
                    <div className="p-6 rounded-2xl border border-[rgba(0,240,255,0.1)] bg-panel-blue/40 hover:border-neon-magenta/50 transition-all group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-10 rounded bg-neon-magenta/10 flex items-center justify-center group-hover:bg-neon-magenta transition-colors">
                                <span className="material-symbols-outlined text-neon-magenta text-xl group-hover:text-black">skull</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm font-display">Advocate</h4>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Destruction</p>
                            </div>
                        </div>
                        <p className="text-xs text-[#c4c4ff] leading-relaxed font-body">&quot;Pre-Mortem protocol (Klein, 2007). My directive is Forensic destruction of your ego and your logic.&quot;</p>
                    </div>
                    {/* Market Analyst */}
                    <div className="p-6 rounded-2xl border border-[rgba(0,240,255,0.1)] bg-panel-blue/40 hover:border-neon-lime/50 transition-all group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-10 rounded bg-neon-lime/10 flex items-center justify-center group-hover:bg-neon-lime transition-colors">
                                <span className="material-symbols-outlined text-neon-lime text-xl group-hover:text-black">query_stats</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm font-display">Market Analyst</h4>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Saturation</p>
                            </div>
                        </div>
                        <p className="text-xs text-[#c4c4ff] leading-relaxed font-body">&quot;Customer Psychology and Distribution audit. I identify 'Crossing the Chasm' barriers and fatigue markers.&quot;</p>
                    </div>
                    {/* Ethics & Risk */}
                    <div className="p-6 rounded-2xl border border-[rgba(0,240,255,0.1)] bg-panel-blue/40 hover:border-purple-500/50 transition-all group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-10 rounded bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                                <span className="material-symbols-outlined text-purple-500 text-xl group-hover:text-black">security</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm font-display">Ethics &amp; Risk</h4>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Sustainability</p>
                            </div>
                        </div>
                        <p className="text-xs text-[#c4c4ff] leading-relaxed font-body">&quot;Regulatory theory and Social risk auditing. I identify legal landmines and analyze long-term sustainability.&quot;</p>
                    </div>
                    {/* Financial Strategist */}
                    <div className="p-6 rounded-2xl border border-[rgba(0,240,255,0.1)] bg-panel-blue/40 hover:border-yellow-500/50 transition-all group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-10 rounded bg-yellow-500/10 flex items-center justify-center group-hover:bg-yellow-500 transition-colors">
                                <span className="material-symbols-outlined text-yellow-500 text-xl group-hover:text-black">monetization_on</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm font-display">Finance</h4>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Liquidity</p>
                            </div>
                        </div>
                        <p className="text-xs text-[#c4c4ff] leading-relaxed font-body">&quot;Unit economics audit. I map the burn rate against reality to find the true Margin of Safety.&quot;</p>
                    </div>
                    {/* The Custom Expert */}
                    <div className="p-6 rounded-2xl border-2 border-indigo-500/40 bg-indigo-500/5 hover:border-indigo-500 transition-all group relative overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                        <div className="absolute -right-4 -top-4 size-24 bg-indigo-500/10 blur-2xl rounded-full group-hover:bg-indigo-500/20 transition-colors"></div>
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="size-10 rounded bg-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                                <span className="material-symbols-outlined text-indigo-400 text-xl group-hover:text-black">psychology</span>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-sm font-display uppercase tracking-tight text-indigo-100">Private Board Member</h4>
                                    <span className="px-1.5 py-0.5 bg-indigo-500 text-[8px] font-black text-white rounded uppercase tracking-tighter">Hardened Context</span>
                                </div>
                                <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-black">Proprietary Knowledge</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed font-medium mb-6 relative z-10">
                            Train a dedicated agent on your company&apos;s internal financials and strategic roadmap. Let your private board member defend your reality against the council.
                        </p>
                        <a href="/login" className="inline-flex items-center gap-2 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-colors relative z-10">
                            Configure Your Board Member <span className="material-symbols-outlined text-[12px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </a>
                    </div>
                    {/* The Judge */}
                    <div className="p-6 rounded-2xl border border-neon-cyan/50 bg-neon-cyan/5 group relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-8xl text-neon-cyan">verified</span>
                        </div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-10 rounded bg-neon-cyan flex items-center justify-center">
                                <span className="material-symbols-outlined text-black text-xl">account_balance</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-neon-cyan font-display">The Arbitrator (Protocol OS 3.0)</h4>
                                <p className="text-[10px] text-neon-cyan/70 uppercase tracking-widest font-black">Synthesis Hub</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-100 leading-relaxed max-w-lg font-body">Integrating multiple high-reasoning models with adversarial weighting, The Arbitrator synthesizes conflicting data into a single, de-biased strategic recommendation.</p>
                    </div>
                </div>
            </section>

            {/* Methodology Section */}
            <section className="py-24 px-6 bg-deep-blue border-y border-[rgba(0,240,255,0.1)] overflow-hidden" id="methodology">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-16 items-center">
                        <div className="md:w-1/2">
                            <h2 className="text-4xl font-black mb-8 uppercase tracking-tight font-display text-neon-cyan">Scientific Validation Protocol</h2>
                            <div className="space-y-8">
                                <div className="flex gap-6">
                                    <div className="shrink-0 flex flex-col items-center">
                                        <div className="size-8 rounded-full bg-neon-cyan text-black flex items-center justify-center font-bold text-xs uppercase">01</div>
                                        <div className="w-px h-full bg-[rgba(0,240,255,0.2)] my-2"></div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-2 font-display">Multi-Agent Deliberation</h4>
                                        <p className="text-sm text-[#c4c4ff]">Using 5 agents to correct 53% of bias errors that standard majority-voting systems commit (PLOS 2025).</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="shrink-0 flex flex-col items-center">
                                        <div className="size-8 rounded-full border border-[rgba(0,240,255,0.3)] text-neon-cyan flex items-center justify-center font-bold text-xs uppercase">02</div>
                                        <div className="w-px h-full bg-[rgba(0,240,255,0.2)] my-2"></div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-2 font-display">Adversarial Theory Building</h4>
                                        <p className="text-sm text-[#c4c4ff]">Competing models engage in cooperative search for truth rather than simple pattern matching (PNAS 2020).</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="shrink-0 flex flex-col items-center">
                                        <div className="size-8 rounded-full border border-[rgba(0,240,255,0.3)] text-neon-cyan flex items-center justify-center font-bold text-xs uppercase">03</div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-2 font-display">Rational Equilibrium</h4>
                                        <p className="text-sm text-[#c4c4ff]">Proprietary MpFL Engine ensures mathematical convergence to a stable, communication-efficient consensus (NeurIPS 2025).</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2 relative min-h-[500px] flex items-center justify-center">
                            {/* Grid Background */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] rounded-full [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"></div>

                            {/* Connecting lines */}
                            <svg className="absolute inset-0 w-full h-full -z-10 pointer-events-none opacity-20">
                                {/* Center to Agents */}
                                <line x1="50%" y1="50%" x2="50%" y2="15%" stroke="#00f0ff" strokeWidth="1" strokeDasharray="4 4" />
                                <line x1="50%" y1="50%" x2="85%" y2="30%" stroke="#00f0ff" strokeWidth="1" strokeDasharray="4 4" />
                                <line x1="50%" y1="50%" x2="85%" y2="70%" stroke="#00f0ff" strokeWidth="1" strokeDasharray="4 4" />
                                <line x1="50%" y1="50%" x2="50%" y2="85%" stroke="#00f0ff" strokeWidth="1" strokeDasharray="4 4" />
                                <line x1="50%" y1="50%" x2="15%" y2="70%" stroke="#00f0ff" strokeWidth="1" strokeDasharray="4 4" />
                                <line x1="50%" y1="50%" x2="15%" y2="30%" stroke="#00f0ff" strokeWidth="1" strokeDasharray="4 4" />
                            </svg>

                            {/* Central Hub */}
                            <div className="relative z-10 size-32 rounded-full bg-[#0a0a1f] border border-slate-700/50 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                                {/* Progress Ring */}
                                <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
                                    <circle cx="64" cy="64" r="60" fill="none" stroke="#1a1a3a" strokeWidth="4" />
                                    <circle cx="64" cy="64" r="60" fill="none" stroke="#00f0ff" strokeWidth="4" strokeDasharray="377" strokeDashoffset="260" className="animate-pulse" />
                                </svg>
                                <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-br from-[#c084fc] to-[#00f0ff] font-display">25</span>
                                <span className="text-[10px] text-slate-400 font-bold tracking-widest mt-1">SYNC</span>
                            </div>

                            {/* Agent 1: Market Analyst (Top) */}
                            <div className="absolute top-[5%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 hover:scale-105 transition-transform cursor-default">
                                <div className="size-12 rounded-full border border-green-500/30 bg-[#0a0a1f] flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                                    <span className="material-symbols-outlined shrink-0 select-none text-green-500 text-xl">query_stats</span>
                                </div>
                                <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-green-500/20 text-[10px] font-bold text-slate-200 shadow-xl">Market Analyst</div>
                                <div className="bg-black/80 backdrop-blur-md border border-green-500/20 px-3 py-1.5 rounded-lg text-[8px] text-green-400/80 font-mono w-32 truncate text-center opacity-80 shadow-xl">"TAM Analysis: eBay..."</div>
                            </div>

                            {/* Agent 2: Technologist (Top-Right) */}
                            <div className="absolute top-[20%] right-[2%] flex flex-col items-center gap-2 hover:scale-105 transition-transform cursor-default">
                                <div className="size-12 rounded-full border border-cyan-500/30 bg-[#0a0a1f] flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                                    <span className="material-symbols-outlined shrink-0 select-none text-cyan-500 text-xl">terminal</span>
                                </div>
                                <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-500/20 text-[10px] font-bold text-slate-200 shadow-xl">Technologist</div>
                                <div className="bg-black/80 backdrop-blur-md border border-cyan-500/20 px-3 py-1.5 rounded-lg text-[8px] text-cyan-400/80 font-mono w-32 truncate text-center opacity-80 shadow-xl">"### PRIMARY ATTACK..."</div>
                            </div>

                            {/* Agent 3: Finance (Bottom-Right) - ACTIVE GLOW */}
                            <div className="absolute bottom-[20%] right-[2%] flex flex-col items-center gap-2 hover:scale-105 transition-transform cursor-default z-20">
                                <div className="relative size-14 rounded-full border-2 border-yellow-500/80 bg-[#0a0a1f] flex items-center justify-center shadow-[0_0_40px_rgba(234,179,8,0.5)]">
                                    <div className="absolute inset-0 rounded-full border-[3px] border-yellow-400 opacity-50 animate-ping"></div>
                                    <span className="material-symbols-outlined shrink-0 select-none text-yellow-500 text-2xl drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]">monetization_on</span>
                                </div>
                                <div className="bg-black/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-yellow-500 text-xs font-bold text-white shadow-[0_4px_15px_rgba(0,0,0,0.5)]">Finance</div>
                                <div className="bg-black/90 backdrop-blur-md border border-yellow-500/40 px-3 py-2 rounded-lg text-[9px] text-yellow-300 font-mono w-36 truncate text-center shadow-xl">"Crafting argument..."</div>
                            </div>

                            {/* Agent 4: Ethics (Bottom) */}
                            <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 hover:scale-105 transition-transform cursor-default">
                                <div className="size-12 rounded-full border border-purple-500/30 bg-[#0a0a1f] flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                                    <span className="material-symbols-outlined shrink-0 select-none text-purple-500 text-xl">security</span>
                                </div>
                                <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-purple-500/20 text-[10px] font-bold text-slate-200 shadow-xl">Ethics & Risk</div>
                                <div className="bg-black/80 backdrop-blur-md border border-purple-500/20 px-3 py-1.5 rounded-lg text-[8px] text-purple-400/80 font-mono w-32 truncate text-center opacity-80 shadow-xl">"Regulatory & Compl..."</div>
                            </div>

                            {/* Agent 5: Advocate (Bottom-Left) - ACTIVE GLOW */}
                            <div className="absolute bottom-[20%] left-[2%] flex flex-col items-center gap-2 hover:scale-105 transition-transform cursor-default z-20">
                                <div className="relative size-14 rounded-full border-2 border-[#ff00e5]/80 bg-[#0a0a1f] flex items-center justify-center shadow-[0_0_40px_rgba(255,0,229,0.5)]">
                                    <div className="absolute inset-0 rounded-full border-[3px] border-[#ff00e5] opacity-30 animate-pulse"></div>
                                    <span className="material-symbols-outlined shrink-0 select-none text-[#ff00e5] text-2xl drop-shadow-[0_0_10px_rgba(255,0,229,0.8)]">skull</span>
                                </div>
                                <div className="bg-black/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#ff00e5] text-xs font-bold text-white shadow-[0_4px_15px_rgba(0,0,0,0.5)]">Advocate</div>
                                <div className="bg-black/90 backdrop-blur-md border border-[#ff00e5]/40 px-3 py-2 rounded-lg text-[9px] text-[#ff00e5] font-mono w-36 text-center shadow-xl leading-relaxed whitespace-normal min-h-[30px] flex items-center justify-center">"Challenging 📊 Market Analysis: The..."</div>
                            </div>

                            {/* Agent 6: Visionary (Top-Left) */}
                            <div className="absolute top-[20%] left-[2%] flex flex-col items-center gap-2 hover:scale-105 transition-transform cursor-default">
                                <div className="size-12 rounded-full border border-orange-500/30 bg-[#0a0a1f] flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                                    <span className="material-symbols-outlined shrink-0 select-none text-orange-500 text-xl">flare</span>
                                </div>
                                <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-orange-500/20 text-[10px] font-bold text-slate-200 shadow-xl">Visionary</div>
                                <div className="bg-black/80 backdrop-blur-md border border-orange-500/20 px-3 py-1.5 rounded-lg text-[8px] text-orange-400/80 font-mono w-32 truncate text-center opacity-80 shadow-xl">"Market Potential Ana..."</div>
                            </div>
                            {/* Agent 7: Custom Expert (Orbiting) */}
                            <div className="absolute top-1/2 left-1/2 z-30 animate-[spin_20s_linear_infinite]">
                                <div className="absolute -left-6 top-[-180px] animate-[spin_20s_linear_infinite_reverse] flex flex-col items-center gap-2 hover:scale-105 transition-transform cursor-default">
                                    <div className="size-12 rounded-full border border-indigo-500/50 bg-[#0a0a1f] flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                                        <span className="material-symbols-outlined shrink-0 select-none text-indigo-500 text-xl">psychology</span>
                                    </div>
                                    <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-indigo-500/30 text-[10px] font-bold text-slate-200 shadow-xl whitespace-nowrap">Custom Expert</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* Testimonials / Social Proof (Textual) */}
            <section className="py-24 px-6 bg-space-black relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="p-10 rounded-3xl bg-panel-blue/10 border border-white/5 relative">
                            <span className="material-symbols-outlined text-4xl text-neon-cyan/20 absolute top-8 right-8">format_quote</span>
                            <p className="text-xl text-white font-medium mb-8 leading-relaxed italic">
                                &quot;CouncilIA erased the echo-chamber effect in our board meetings. The adversarial protocol forced us to confront the exact logic flaw that would have killed our Series B.&quot;
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-slate-400">person</span>
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-white">Chief Strategy Officer</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Tier 1 FinTech ($2B AUM)</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-10 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 relative">
                            <span className="material-symbols-outlined text-4xl text-indigo-500/20 absolute top-8 right-8">format_quote</span>
                            <p className="text-xl text-white font-medium mb-8 leading-relaxed italic">
                                &quot;The 7th Expert integration let us debate our proprietary technical roadmap against 6 world-class personas. It&apos;s like having a McKinsey team on a 15-minute loop.&quot;
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-slate-400">person</span>
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-white">Founder &amp; CEO</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Enterprise AI Unicorn</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Proprietary Intelligence / The 7th Agent Section */}
            <section className="py-24 px-6 overflow-hidden bg-space-black relative border-t border-indigo-500/10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-6 font-display">
                            The 7th Protocol
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] font-display">
                            Your Private AI<br />
                            <span className="text-indigo-400">Board Member.</span>
                        </h2>
                        <p className="text-xl text-slate-300 font-medium leading-relaxed mb-10 max-w-xl">
                            Train a dedicated agent on your internal financials, strategy decks, and customer insights. Let your private board member defend your company&apos;s reality inside the adversarial loop.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex items-center gap-4 group">
                                <div className="size-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:border-indigo-500 transition-colors">
                                    <span className="material-symbols-outlined text-indigo-400">description</span>
                                </div>
                                <div>
                                    <p className="text-sm font-black text-white uppercase tracking-tight">Strategy Docs</p>
                                    <p className="text-[10px] text-slate-500">PDF, TXT, Markdown</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="size-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:border-indigo-500 transition-colors">
                                    <span className="material-symbols-outlined text-indigo-400">groups</span>
                                </div>
                                <div>
                                    <p className="text-sm font-black text-white uppercase tracking-tight">Customer Insights</p>
                                    <p className="text-[10px] text-slate-500">Feedback & Research</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="glass-card rounded-3xl p-1 border-indigo-500/30 bg-indigo-500/5 relative overflow-hidden group hover:border-indigo-500 transition-all duration-500 shadow-2xl">
                            <div className="p-8 bg-space-black/40 backdrop-blur-sm rounded-[22px]">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-lg bg-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                                            <span className="material-symbols-outlined text-black">psychology</span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Active Intelligence</p>
                                            <p className="text-sm font-bold text-white">The 7th Expert</p>
                                        </div>
                                    </div>
                                    <div className="px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-[8px] font-black text-green-400 uppercase tracking-tighter animate-pulse">
                                        Processing Context
                                    </div>
                                </div>
                                <div className="space-y-4 mb-8">
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 italic text-sm text-slate-300 leading-relaxed font-body">
                                        &quot;Based on our internal strategy docs, this move risk diluting the brand premium. My analysis suggests staying in the Corporate segment...&quot;
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="h-1.5 w-12 bg-indigo-500 rounded-full"></div>
                                        <div className="h-1.5 w-24 bg-white/10 rounded-full"></div>
                                        <div className="h-1.5 w-8 bg-white/10 rounded-full"></div>
                                    </div>
                                </div>
                                <a href="/login" className="w-full py-4 bg-indigo-500 text-white rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] transition-all transform group-hover:scale-[1.02] active:scale-95">
                                    Onboard Your Board Member
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section: Efficiency Arbitrage Overhaul */}
            <section className="py-24 px-6 max-w-7xl mx-auto" id="pricing">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-cyan/20 bg-neon-cyan/5 text-neon-cyan text-[10px] font-bold uppercase tracking-widest mb-6">Efficiency Arbitrage</div>
                    <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight font-display text-white">Choose Your Velocity.</h2>
                    <p className="text-[#c4c4ff] max-w-xl mx-auto text-lg">Replace weeks of strategic work with a 15-minute validated decision. Infrastructure built for scale.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Starter */}
                    <div className="p-8 rounded-2xl border border-white/5 bg-panel-blue/10 flex flex-col hover:border-white/20 transition-all">
                        <h3 className="font-bold text-lg mb-2 font-display uppercase tracking-widest text-[#c4c4ff]">Founder</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-black font-display text-white">€29</span>
                            <span className="text-slate-500 text-sm">/mo</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-grow mb-10">
                            <li className="flex items-center gap-3 text-xs text-slate-300">
                                <span className="material-symbols-outlined text-neon-cyan text-sm">verified</span>
                                5 Validated Decisions / mo
                            </li>
                            <li className="flex items-center gap-3 text-xs text-slate-300">
                                <span className="material-symbols-outlined text-neon-cyan text-sm">verified</span>
                                All 6 Expert Personas
                            </li>
                            <li className="flex items-center gap-3 text-xs text-slate-300">
                                <span className="material-symbols-outlined text-neon-cyan text-sm">verified</span>
                                Immutable Audit Signature
                            </li>
                        </ul>
                        <a href="/login" className="w-full py-3 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-center hover:bg-white/5 transition-all">Start Validation</a>
                    </div>

                    {/* Pro */}
                    <div className="p-8 rounded-2xl border-2 border-neon-cyan/40 bg-neon-cyan/5 flex flex-col relative glow-cyan scale-105 z-10">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-neon-cyan text-black text-[10px] font-black uppercase rounded-full shadow-[0_0_20px_rgba(0,240,255,0.4)]">Most Strategic</div>
                        <h3 className="font-bold text-lg mb-2 font-display uppercase tracking-widest text-neon-cyan">Operator</h3>
                        <div className="flex items-baseline gap-1 mb-6 text-white">
                            <span className="text-4xl font-black font-display">€199</span>
                            <span className="text-slate-500 text-sm">/mo</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-grow mb-10">
                            <li className="flex items-center gap-3 text-xs text-white">
                                <span className="material-symbols-outlined text-neon-cyan text-sm">verified</span>
                                30 Validated Decisions / mo
                            </li>
                            <li className="flex items-center gap-3 text-xs text-white">
                                <span className="material-symbols-outlined text-neon-cyan text-sm">verified</span>
                                Private Board Member (v14)
                            </li>
                            <li className="flex items-center gap-3 text-xs text-white">
                                <span className="material-symbols-outlined text-neon-cyan text-sm">verified</span>
                                Full Traceable Decision Replay
                            </li>
                            <li className="flex items-center gap-3 text-xs text-white">
                                <span className="material-symbols-outlined text-neon-cyan text-sm">verified</span>
                                Export API & Webhooks
                            </li>
                        </ul>
                        <a href="/login" className="w-full py-4 bg-neon-cyan text-black rounded-xl text-xs font-black uppercase tracking-[0.2em] text-center shadow-[0_0_30px_rgba(0,240,255,0.2)] hover:shadow-[0_0_50px_rgba(0,240,255,0.4)] transition-all">Start Scaling</a>
                    </div>

                    {/* Enterprise */}
                    <div className="p-8 rounded-2xl border border-white/5 bg-[#121235]/40 flex flex-col hover:border-white/20 transition-all">
                        <h3 className="font-bold text-lg mb-2 font-display uppercase tracking-widest text-slate-400">Enterprise</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-black font-display text-white">Custom</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-grow mb-10">
                            <li className="flex items-center gap-3 text-xs text-slate-400">
                                <span className="material-symbols-outlined text-neon-cyan text-sm">verified</span>
                                Custom Governance Protocols
                            </li>
                            <li className="flex items-center gap-3 text-xs text-slate-400">
                                <span className="material-symbols-outlined text-neon-cyan text-sm">verified</span>
                                SSO & Multi-tenant Isolation
                            </li>
                            <li className="flex items-center gap-3 text-xs text-slate-400">
                                <span className="material-symbols-outlined text-neon-cyan text-sm">verified</span>
                                Dedicated Science Calibration
                            </li>
                            <li className="flex items-center gap-3 text-xs text-slate-400">
                                <span className="material-symbols-outlined text-neon-cyan text-sm">verified</span>
                                Liability-grade Audit Access
                            </li>
                        </ul>
                        <a href="mailto:denio@councilia.system" className="w-full py-3 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-center hover:bg-white/5 transition-all">Contact Governance Team</a>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-neon-cyan/5 blur-[120px] rounded-full -translate-y-1/2"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-neon-cyan/60 mb-4">Consultants charge €50,000. CouncilIA Elite costs €29.</p>
                    <h2 className="text-4xl md:text-6xl font-black mb-6 font-display uppercase leading-tight">
                        Your Decision Infrastructure<br />
                        <span className="text-neon-cyan">is audit-ready.</span>
                    </h2>
                    <p className="text-lg text-slate-400 mb-4 max-w-xl mx-auto">Make your next strategic decision with a peer-reviewed adversarial engine designed to identify risks before they happen.</p>
                    <p className="text-sm text-amber-400 font-mono mb-10 flex items-center justify-center gap-2">
                        <span className="size-2 bg-amber-400 rounded-full animate-pulse inline-block"></span>
                        Enterprise Grade Security · HMAC-SHA256 Signed · Audit Traceable
                    </p>
                    <a href="/login" className="inline-block px-12 py-5 bg-gradient-to-r from-neon-cyan to-blue-500 text-black rounded-2xl font-black text-xl hover:shadow-[0_0_40px_rgba(0,240,255,0.4)] transition-all transform hover:-translate-y-1 active:scale-95">
                        Validate Your Next High-Stakes Decision →
                    </a>
                    <p className="mt-6 text-[10px] text-slate-600 font-mono uppercase tracking-widest">Scientific Protocol v14.0 · Immutable Decision Lineage · Deterministic Scoring</p>
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
                            <a aria-label="Visit our website" className="text-slate-500 hover:text-neon-cyan transition-colors" href="#"><span className="material-symbols-outlined select-none" aria-hidden="true">public</span></a>
                            <a aria-label="Send us an email" className="text-slate-500 hover:text-neon-cyan transition-colors" href="#"><span className="material-symbols-outlined select-none" aria-hidden="true">mail</span></a>
                        </div>
                    </div>
                    <nav aria-label="Footer Platform Links">
                        <h5 className="font-bold text-sm mb-6 uppercase tracking-widest text-[#c4c4ff] font-display">Platform</h5>
                        <ul className="space-y-4">
                            <li><a className="text-sm text-slate-500 hover:text-neon-cyan transition-colors" href="#how-it-works" aria-label="Footer link to Process">Process</a></li>
                            <li><a className="text-sm text-slate-500 hover:text-neon-cyan transition-colors" href="#the-council" aria-label="Footer link to The Council">The Council</a></li>
                            <li><a className="text-sm text-slate-500 hover:text-neon-cyan transition-colors" href="/methodology" aria-label="Footer link to Methodology">Methodology</a></li>
                            <li><a className="text-sm text-slate-500 hover:text-neon-cyan transition-colors" href="/pricing" aria-label="Footer link to Pricing">Pricing</a></li>
                        </ul>
                    </nav>
                    <nav aria-label="Footer Resources Links">
                        <h5 className="font-bold text-sm mb-6 uppercase tracking-widest text-[#c4c4ff] font-display">Resources</h5>
                        <ul className="space-y-4">
                            <li><a className="text-sm text-slate-500 hover:text-neon-cyan transition-colors" href="#" aria-label="Documentation">Documentation</a></li>
                            <li><a className="text-sm text-slate-500 hover:text-neon-cyan transition-colors" href="#" aria-label="Case Studies">Case Studies</a></li>
                            <li><a className="text-sm text-slate-500 hover:text-neon-cyan transition-colors" href="#" aria-label="Research Papers">Research Papers</a></li>
                            <li><a className="text-sm text-slate-500 hover:text-neon-cyan transition-colors" href="#" aria-label="API Reference">API Reference</a></li>
                        </ul>
                    </nav>
                    <nav aria-label="Footer Legal and Support Links">
                        <h5 className="font-bold text-sm mb-6 uppercase tracking-widest text-[#c4c4ff] font-display">Legal &amp; Support</h5>
                        <ul className="space-y-4">
                            <li><a className="text-sm text-slate-500 hover:text-neon-cyan transition-colors" href="mailto:support@councilia.com" aria-label="Email Support">support@councilia.com</a></li>
                            <li><a className="text-sm text-slate-500 hover:text-neon-cyan transition-colors" href="/privacy" aria-label="Privacy Policy">Privacy Policy</a></li>
                            <li><a className="text-sm text-slate-500 hover:text-neon-cyan transition-colors" href="/cookies" aria-label="Cookies Policy">Cookies Policy</a></li>
                            <li><a className="text-sm text-slate-500 hover:text-neon-cyan transition-colors" href="/terms" aria-label="Terms of Service">Terms of Service</a></li>
                            <li><a className="text-sm text-slate-500 hover:text-neon-cyan transition-colors" href="/security" aria-label="Data Security">Data Security</a></li>
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