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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan text-xs font-bold uppercase tracking-widest mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
                        </span>
                        DECISION INTELLIGENCE // OS 3.0
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black leading-[1] mb-8 tracking-tighter font-display uppercase">
                        6 AI Experts Debate Your Strategy.<br />
                        <span className="bg-gradient-to-r from-neon-cyan via-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                            While You Watch.
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                        Get a board-level decision in 15 minutes — not 3 weeks of meetings. Our Adversarial Consensus Engine (ACE) uses peer-reviewed science from Johns Hopkins & Stanford to eliminate bias and find the truth.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 font-display">
                        <a href="/login" role="button" aria-label="Start Free Session" className="w-full sm:w-auto px-8 py-4 bg-neon-cyan text-black rounded-xl font-bold text-lg hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all text-center">
                            Start Free Decision
                        </a>
                        <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 border border-[rgba(0,240,255,0.2)] bg-[#121235]/40 hover:bg-[#121235]/60 rounded-xl font-bold text-lg transition-all text-center text-neon-cyan">
                            Watch 2-Min Demo
                        </a>
                    </div>
                    <p className="mt-8 text-xs font-mono text-slate-500 uppercase tracking-widest">
                        FREE 7 DAYS • NO CREDIT CARD REQUIRED • CANCEL ANYTIME
                    </p>
                </div>
            </section>

            {/* Scientific Proof Section */}
            <section className="py-12 px-6 border-y border-[rgba(0,240,255,0.1)] bg-panel-blue/5">
                <div className="max-w-7xl mx-auto">
                    <p className="text-center text-[10px] font-bold text-neon-cyan tracking-[0.3em] uppercase mb-10">Validated by 4 Peer-Reviewed Studies</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-black text-white font-display">97% Precision</h3>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-tight">PLOS Digital Health 2025</p>
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-black text-white font-display">Bias Erased</h3>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-tight">PNAS (Adversarial Alignment)</p>
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-black text-white font-display">Consensus Opt.</h3>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-tight">ACL Findings 2025 (Kaesberg)</p>
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-black text-white font-display">Surgical Accuracy</h3>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-tight">COLING 2025 (Shaikh et al.)</p>
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
                                <span className="size-1.5 bg-neon-magenta rounded-full"></span> LIVE
                            </div>
                            <h2 className="text-sm font-mono text-[#c4c4ff]/70 tracking-widest uppercase">SESSION #0214: Cold Email Tool for Solo Founders ($99/mo)</h2>
                        </div>
                        <div className="flex gap-1.5">
                            <div className="size-3 rounded-full bg-red-500/40"></div>
                            <div className="size-3 rounded-full bg-yellow-500/40"></div>
                            <div className="size-3 rounded-full bg-green-500/40"></div>
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
                                        Solo founders are drowning in low-quality tools. A premium $99/mo solution that actually guarantees deliverability is a blue ocean. High friction means high retention.
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
                                        Delusional. Solo founders have a $0 budget for &quot;premium&quot; email. Instantly and Lemlist own the $30-$50 tier. You&apos;re pricing yourself into a graveyard.
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
                                        &quot;According to our **Internal Benchmarking Data (SaaS Index 2024)**, solo founders convert 3x better at higher price points if setup time is reduced by 80%. Our proprietary 'Warm-up 2.0' logic bypasses the latest Google/Yahoo spam filters.&quot;
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
                                        Warm-up 2.0 verified. If the deliverability delta is &gt;15%, the $99 price point is technically justifiable. Moving to deployment validation.
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
                                    <span className="text-[10px] text-[#00f0ff]/70 font-mono tracking-widest mt-1">FINAL SCORE</span>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-4 font-display uppercase tracking-tight">Judge Verdict: <span className="text-neon-lime">Strategic Approval</span></h3>
                            <ul className="text-sm text-[#c4c4ff] leading-relaxed mb-8 text-left space-y-2 list-disc list-inside bg-space-black/40 p-4 rounded-xl border border-[rgba(0,240,255,0.1)] shadow-inner">
                                <li><strong>Advantage:</strong> Proprietary Warm-up logic is defensible.</li>
                                <li><strong>Mitigation:</strong> High-ticket solo founder niche exists.</li>
                                <li><strong>Action Item:</strong> Focus MVP on setup speed (Cold-to-Live).</li>
                            </ul>
                            <button className="w-full py-4 bg-neon-cyan text-black rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all transform active:scale-95">
                                Download Analysis Report
                            </button>
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
                            <span className="text-6xl font-black text-neon-cyan/5 absolute top-4 right-8 group-hover:text-neon-cyan/20 transition-colors font-display">01</span>
                            <div className="size-12 rounded-lg bg-neon-cyan/10 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-neon-cyan">upload_file</span>
                            </div>
                            <h3 className="text-xl font-bold mb-4 font-display uppercase tracking-tight">Submit Your Move</h3>
                            <p className="text-[#c4c4ff] text-sm leading-relaxed font-body">Input your strategy, M&A hypothesis, or launch plan. The Council prepares for surgical dissection.</p>
                        </div>
                        <div className="p-8 rounded-2xl border border-neon-cyan/40 bg-space-black relative group glow-cyan">
                            <span className="text-6xl font-black text-neon-cyan/5 absolute top-4 right-8 group-hover:text-neon-cyan/30 transition-colors font-display">02</span>
                            <div className="size-12 rounded-lg bg-neon-cyan/20 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-neon-cyan">forum</span>
                            </div>
                            <h3 className="text-xl font-bold mb-4 font-display uppercase tracking-tight">Watch 6 Experts Debate</h3>
                            <p className="text-[#c4c4ff] text-sm leading-relaxed font-body">Witness real-time adversarial deliberation. Intervene anytime to pivot the discussion and challenge the AI&apos;s logic.</p>
                        </div>
                        <div className="p-8 rounded-2xl border border-[rgba(0,240,255,0.1)] bg-space-black relative group">
                            <span className="text-6xl font-black text-neon-cyan/5 absolute top-4 right-8 group-hover:text-neon-cyan/20 transition-colors font-display">03</span>
                            <div className="size-12 rounded-lg bg-neon-cyan/10 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-neon-cyan">fact_check</span>
                            </div>
                            <h3 className="text-xl font-bold mb-4 font-display uppercase tracking-tight">Actionable Verdict</h3>
                            <p className="text-[#c4c4ff] text-sm leading-relaxed font-body">Not just a score. Get a detailed board-level report with specific next steps and risk mitigation strategies.</p>
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
                        <p className="text-xs text-[#c4c4ff] leading-relaxed font-body">&quot;Market density and Saturation analysis. I audit for consumer fatigue and 'Crossing the Chasm' barriers.&quot;</p>
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
                        <p className="text-xs text-[#c4c4ff] leading-relaxed font-body">&quot;Regulatory theory and Social impact auditing. I map the moral landmines and long-term sustainability.&quot;</p>
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
                                    <h4 className="font-bold text-sm font-display uppercase tracking-tight text-indigo-100">Your Specialist</h4>
                                    <span className="px-1.5 py-0.5 bg-indigo-500 text-[8px] font-black text-white rounded uppercase tracking-tighter">Enterprise</span>
                                </div>
                                <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-black">Proprietary Training</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed font-medium mb-6 relative z-10">
                            Train a 7th agent on your company&apos;s internal data. Upload strategy docs, research, and financial data. Your dedicated expert defends YOUR priorities alongside the council.
                        </p>
                        <a href="/login" className="inline-flex items-center gap-2 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-colors relative z-10">
                            Create Your 7th Agent <span className="material-symbols-outlined text-[12px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
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
                                <h4 className="font-bold text-sm text-neon-cyan font-display">The Arbitrator (GPT-4o)</h4>
                                <p className="text-[10px] text-neon-cyan/70 uppercase tracking-widest font-black">Final Verdict</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-100 leading-relaxed max-w-lg font-body">Powered by GPT-4o with custom logic chains, The Judge synthesizes adversarial data into a cohesive, non-biased final recommendation.</p>
                    </div>
                </div>
            </section>

            {/* Methodology Section */}
            <section className="py-24 px-6 bg-deep-blue border-y border-[rgba(0,240,255,0.1)] overflow-hidden" id="methodology">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-16 items-center">
                        <div className="md:w-1/2">
                            <h2 className="text-4xl font-black mb-8 uppercase tracking-tight font-display text-neon-cyan">Our Validation Framework</h2>
                            <div className="space-y-8">
                                <div className="flex gap-6">
                                    <div className="shrink-0 flex flex-col items-center">
                                        <div className="size-8 rounded-full bg-neon-cyan text-black flex items-center justify-center font-bold text-xs">1</div>
                                        <div className="w-px h-full bg-[rgba(0,240,255,0.2)] my-2"></div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-2 font-display">Target Surface Construction</h4>
                                        <p className="text-sm text-[#c4c4ff]">Applying G11 Guidelines to isolate key assumptions, creating a forensic map for council dissection.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="shrink-0 flex flex-col items-center">
                                        <div className="size-8 rounded-full border border-[rgba(0,240,255,0.3)] text-neon-cyan flex items-center justify-center font-bold text-xs">2</div>
                                        <div className="w-px h-full bg-[rgba(0,240,255,0.2)] my-2"></div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-2 font-display">Shaikh-Mode Deliberation</h4>
                                        <p className="text-sm text-[#c4c4ff]">Agents engage in adversarial alignment (PNAS 2020), identifying logic flaws with clinical precision.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="shrink-0 flex flex-col items-center">
                                        <div className="size-8 rounded-full border border-[rgba(0,240,255,0.3)] text-neon-cyan flex items-center justify-center font-bold text-xs">3</div>
                                        <div className="w-px h-full bg-[rgba(0,240,255,0.2)] my-2"></div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-2 font-display">Synthetical Filtering</h4>
                                        <p className="text-sm text-[#c4c4ff]">3 rounds of noise-to-signal refinement. Weaker arguments are conceded until an equilibrium is reached.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="shrink-0 flex flex-col items-center">
                                        <div className="size-8 rounded-full border border-[rgba(0,240,255,0.3)] text-neon-cyan flex items-center justify-center font-bold text-xs">4</div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-2 font-display">Weighted Judicial Verdict</h4>
                                        <p className="text-sm text-[#c4c4ff]">Calculation of Strategic Margin and Value at Risk (VaR) based on Surviving Argument Density.</p>
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



            {/* Proprietary Intelligence / The 7th Agent Section */}
            <section className="py-24 px-6 overflow-hidden bg-space-black relative border-t border-indigo-500/10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-6 font-display">
                            The 7th Protocol
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] font-display">
                            Your Internal Data.<br />
                            <span className="text-indigo-400">The 7th Expert.</span>
                        </h2>
                        <p className="text-xl text-slate-300 font-medium leading-relaxed mb-10 max-w-xl">
                            Train a 7th agent on your company&apos;s internal data. Your strategy docs, your customer insights, your past decisions — all debating alongside the council.
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
                                    Hire Your 7th Expert
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Simple Pricing Component Section */}
            <section className="py-24 px-6 max-w-7xl mx-auto" id="pricing">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black mb-4 uppercase tracking-tight font-display">Straightforward Pricing</h2>
                    <p className="text-[#c4c4ff] max-w-xl mx-auto">Choose the tier that matches your decision-making velocity.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Starter */}
                    <div className="p-8 rounded-2xl border border-[rgba(0,240,255,0.1)] bg-panel-blue/10 flex flex-col">
                        <h3 className="font-bold text-lg mb-2 font-display">Starter</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-black font-display text-white">$49</span>
                            <span className="text-slate-500 text-sm">/mo</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-grow">
                            <li className="flex items-center gap-3 text-sm text-[#c4c4ff]">
                                <span className="material-symbols-outlined text-neon-cyan text-lg">check_circle</span>
                                5 decisions / month
                            </li>
                            <li className="flex items-center gap-3 text-sm text-[#c4c4ff]">
                                <span className="material-symbols-outlined text-neon-cyan text-lg">check_circle</span>
                                All 6 Expert Personas
                            </li>
                            <li className="flex items-center gap-3 text-sm text-[#c4c4ff]">
                                <span className="material-symbols-outlined text-neon-cyan text-lg">check_circle</span>
                                Full Debate Transcript
                            </li>
                        </ul>
                        <a href="/login" className="w-full py-3 border border-[rgba(0,240,255,0.2)] rounded-xl font-bold hover:bg-panel-blue transition-all text-center text-neon-cyan font-display text-sm">Get Started</a>
                    </div>
                    {/* Professional */}
                    <div className="p-8 rounded-2xl border-2 border-neon-cyan/50 bg-panel-blue/20 flex flex-col relative shadow-[0_0_30px_rgba(0,240,255,0.1)]">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-neon-cyan text-black text-[10px] font-black uppercase rounded-full tracking-widest">Enterprise Ready</div>
                        <h3 className="font-bold text-lg mb-2 text-neon-cyan font-display">Professional</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-black font-display text-white">$197</span>
                            <span className="text-slate-500 text-sm">/mo</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-grow">
                            <li className="flex items-center gap-3 text-sm text-[#c4c4ff]">
                                <span className="material-symbols-outlined text-neon-cyan text-lg">check_circle</span>
                                <strong>Unlimited</strong> Decisions
                            </li>
                            <li className="flex items-center gap-3 text-sm text-[#c4c4ff]">
                                <span className="material-symbols-outlined text-neon-cyan text-lg">check_circle</span>
                                <strong>The 7th Expert</strong> (Your Data)
                            </li>
                            <li className="flex items-center gap-3 text-sm text-[#c4c4ff]">
                                <span className="material-symbols-outlined text-neon-cyan text-lg">check_circle</span>
                                Real-time Intervention
                            </li>
                            <li className="flex items-center gap-3 text-sm text-[#c4c4ff]">
                                <span className="material-symbols-outlined text-neon-cyan text-lg">check_circle</span>
                                Exportable PDF Reports
                            </li>
                        </ul>
                        <a href="/login" className="w-full py-3 bg-neon-cyan text-black rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] font-display text-sm hover:scale-105 active:scale-95 text-center">Start Professional</a>
                    </div>
                    {/* Enterprise */}
                    <div className="p-8 rounded-2xl border border-[rgba(0,240,255,0.1)] bg-purple-500/5 flex flex-col">
                        <h3 className="font-bold text-lg mb-2 font-display uppercase tracking-tight text-purple-300">Enterprise</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-black font-display text-white">$997</span>
                            <span className="text-slate-500 text-sm">/mo</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-grow">
                            <li className="flex items-center gap-3 text-sm text-[#c4c4ff]">
                                <span className="material-symbols-outlined text-purple-400 text-lg">verified</span>
                                <strong>Surgical Mode™</strong> Accuracy
                            </li>
                            <li className="flex items-center gap-3 text-sm text-[#c4c4ff]">
                                <span className="material-symbols-outlined text-purple-400 text-lg">verified</span>
                                Custom Model Onboarding
                            </li>
                            <li className="flex items-center gap-3 text-sm text-[#c4c4ff]">
                                <span className="material-symbols-outlined text-purple-400 text-lg">verified</span>
                                Full API & SSO Access
                            </li>
                            <li className="flex items-center gap-3 text-sm text-[#c4c4ff]">
                                <span className="material-symbols-outlined text-purple-400 text-lg">verified</span>
                                Dedicated Strategy Manager
                            </li>
                        </ul>
                        <a href="/login" className="w-full py-3 border border-purple-500/30 bg-purple-500/10 rounded-xl font-bold hover:bg-purple-500/20 transition-all text-purple-300 font-display text-sm text-center">Contact Sales</a>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-neon-cyan/5 blur-[120px] rounded-full -translate-y-1/2"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black mb-8 font-display uppercase">Ready to validate your next big move?</h2>
                    <p className="text-xl text-slate-400 mb-12">Start your 7-day free trial. No credit card required.</p>
                    <a href="/login" className="inline-block px-12 py-5 bg-gradient-to-r from-neon-cyan to-blue-500 text-black rounded-2xl font-black text-xl hover:shadow-[0_0_40px_rgba(0,240,255,0.4)] transition-all transform hover:-translate-y-1 active:scale-95">
                        Start Free Session Now →
                    </a>
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