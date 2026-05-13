'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LandingPage() {
    const router = useRouter();
    const [idea, setIdea] = useState('');
    const [loading, setLoading] = useState(false);
    const [previewResult, setPreviewResult] = useState<any>(null);
    const resultRef = useRef<HTMLDivElement>(null);

    const runPreview = async () => {
        if (!idea.trim() || loading) return;
        setLoading(true);
        setPreviewResult(null);
        try {
            const res = await fetch('/api/session/preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idea })
            });
            const data = await res.json();
            if (data.ok) {
                setPreviewResult(data.data);
                setTimeout(() => {
                    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-premium-bg text-premium-text font-body selection:bg-premium-accent/20 selection:text-premium-text antialiased scroll-smooth">
            {/* Subtle Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-premium-accent/5 blur-[120px] rounded-full"></div>
                <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-premium-secondary/5 blur-[120px] rounded-full"></div>
            </div>

            {/* Header */}
            <nav className="fixed top-0 w-full z-50 bg-premium-bg/40 backdrop-blur-xl border-b border-black/[0.02]">
                <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4 group cursor-pointer">
                        <div className="size-10 rounded-xl bg-premium-text flex items-center justify-center text-premium-bg shadow-lg shadow-black/10 group-hover:scale-110 transition-all duration-500">
                            <span className="material-symbols-outlined text-[20px]">layers</span>
                        </div>
                        <div>
                            <h1 className="font-display font-black text-lg tracking-tight uppercase leading-none mb-1 group-hover:text-premium-accent transition-colors">CouncilIA</h1>
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-premium-muted">Strategic Intelligence Workspace</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-10">
                        <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.3em] text-premium-muted hover:text-premium-text transition-all">
                            Sign In
                        </Link>
                        <Link href="/login" className="premium-button px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-premium-accent/10">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 pt-48 pb-32 px-8">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-black/[0.02] border border-black/[0.05] rounded-full mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <span className="size-1.5 bg-premium-accent rounded-full animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.6)]"></span>
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-premium-muted">Strategic Engine v14.0 — Ready</span>
                    </div>
                    
                    <h1 className="text-7xl md:text-8xl font-black font-display tracking-tighter text-premium-text mb-10 leading-[0.95] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                        Simulate the <br />
                        <span className="text-premium-muted italic font-light">future of your business.</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-premium-muted mb-16 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                        A proprietary intelligence layer for founders and executives. Explore strategic decisions through specialized AI perspectives and organizational context.
                    </p>

                    {/* Interactive Prompt Box */}
                    <div className="max-w-3xl mx-auto mb-24 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
                        <div className="premium-card p-2 flex flex-col md:flex-row gap-2 bg-white/60 backdrop-blur-md shadow-2xl shadow-black/5 hover:border-premium-accent/20 transition-all duration-700">
                            <input 
                                type="text"
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && runPreview()}
                                placeholder="Describe a strategic objective or dilemma..."
                                className="flex-1 bg-transparent border-0 px-8 py-5 text-xl focus:ring-0 focus:outline-none placeholder:text-premium-muted/30 font-display"
                            />
                            <button 
                                onClick={runPreview}
                                disabled={loading || !idea.trim()}
                                className="premium-button px-10 py-5 text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {loading ? (
                                    <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>Run Simulation <span className="material-symbols-outlined text-[18px]">bolt</span></>
                                )}
                            </button>
                        </div>
                        <div className="mt-6 flex justify-center gap-8">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-premium-muted/40">No registration required for preview</p>
                            <span className="text-premium-muted/20 text-[9px]">•</span>
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-premium-muted/40">Anonymous & Private</p>
                        </div>
                    </div>

                    {/* Preview Results */}
                    {previewResult && (
                        <div ref={resultRef} className="max-w-5xl mx-auto text-left mb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                                {previewResult.perspectives.map((p: any, idx: number) => (
                                    <div key={p.id} className="premium-card p-10 bg-white/80 backdrop-blur-sm group hover:-translate-y-2 transition-all duration-500" style={{ transitionDelay: `${idx * 100}ms` }}>
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="size-12 rounded-2xl bg-premium-bg flex items-center justify-center text-2xl shadow-sm border border-black/[0.03]">
                                                {p.emoji}
                                            </div>
                                            <div>
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-premium-muted">{p.name}</h3>
                                                <div className="h-[1px] w-4 bg-premium-accent mt-1"></div>
                                            </div>
                                        </div>
                                        <p className="text-lg leading-relaxed text-premium-text/80 italic font-display">"{p.text}"</p>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="premium-card p-12 bg-premium-text text-white border-none shadow-2xl shadow-premium-accent/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-premium-accent/20 blur-[80px] rounded-full -mr-32 -mt-32"></div>
                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className="px-4 py-1.5 bg-premium-accent text-white text-[9px] font-black uppercase tracking-[0.4em] rounded-full">Executive Verdict</span>
                                            <div className="h-px w-8 bg-white/20"></div>
                                            <span className="text-[10px] font-bold text-white/60 tracking-widest uppercase">Confidence: {previewResult.score}%</span>
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight leading-tight mb-4">
                                            {previewResult.recommendation}
                                        </h2>
                                    </div>
                                    <button 
                                        onClick={() => router.push('/login')}
                                        className="premium-button bg-white text-premium-text hover:bg-premium-bg px-12 py-5 text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-white/10"
                                    >
                                        Unlock Full Council →
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Trust Logos */}
                    <div className="pt-24 border-t border-black/[0.02]">
                        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-premium-muted/30 mb-16">Trusted by strategic leaders at</p>
                        <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24 opacity-30">
                            {['STRATEGY', 'NEXUS', 'AURA', 'LUCID', 'VORTEX'].map(logo => (
                                <span key={logo} className="text-2xl font-black font-display tracking-tighter hover:opacity-100 transition-opacity cursor-default">{logo}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Values Section */}
            <section className="bg-white/40 backdrop-blur-md py-40 px-8 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-24">
                        <div className="group">
                            <div className="size-16 bg-premium-bg rounded-2xl flex items-center justify-center mb-10 shadow-sm border border-black/[0.03] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                <span className="material-symbols-outlined text-premium-accent text-3xl">diversity_3</span>
                            </div>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-premium-text mb-6">Perspective Synthesis</h3>
                            <p className="text-premium-muted leading-relaxed text-sm">Specialized AI perspectives debate, challenge, and refine your objective to reach a high-confidence strategic synthesis.</p>
                        </div>
                        <div className="group">
                            <div className="size-16 bg-premium-bg rounded-2xl flex items-center justify-center mb-10 shadow-sm border border-black/[0.03] group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                                <span className="material-symbols-outlined text-premium-secondary text-3xl">memory</span>
                            </div>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-premium-text mb-6">Internal Intelligence</h3>
                            <p className="text-premium-muted leading-relaxed text-sm">Integrate your proprietary data, financials, and historical context to ground every simulation in your specific organizational reality.</p>
                        </div>
                        <div className="group">
                            <div className="size-16 bg-premium-bg rounded-2xl flex items-center justify-center mb-10 shadow-sm border border-black/[0.03] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                <span className="material-symbols-outlined text-premium-text text-3xl">verified</span>
                            </div>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-premium-text mb-6">Calm Intelligence</h3>
                            <p className="text-premium-muted leading-relaxed text-sm">An editorial interface designed for deep focus. No noise, no friction—just clarity for the world's most important decisions.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-40 px-8 relative z-10 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-5xl font-black font-display tracking-tight mb-10">Stop guessing. <br /><span className="text-premium-muted italic font-light">Start simulating.</span></h2>
                    <Link href="/login" className="premium-button px-12 py-6 text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-premium-accent/20">
                        Initialize Your Workspace
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-black/[0.02] text-center relative z-10">
                <div className="flex items-center justify-center gap-4 mb-8">
                     <div className="size-8 rounded-lg bg-premium-text flex items-center justify-center text-premium-bg">
                        <span className="material-symbols-outlined text-[16px]">layers</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">CouncilIA</span>
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-premium-muted/40">
                    Strategic Intelligence Workspace — v14.0.0
                </p>
                <div className="mt-8 flex justify-center gap-10">
                    <Link href="#" className="text-[8px] font-black uppercase tracking-widest text-premium-muted/30 hover:text-premium-text transition-colors">Privacy Policy</Link>
                    <Link href="#" className="text-[8px] font-black uppercase tracking-widest text-premium-muted/30 hover:text-premium-text transition-colors">Terms of Service</Link>
                    <Link href="#" className="text-[8px] font-black uppercase tracking-widest text-premium-muted/30 hover:text-premium-text transition-colors">Strategic Ethics</Link>
                </div>
            </footer>
        </div>
    );
}
