'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

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
        <div className="min-h-screen bg-premium-bg text-premium-text font-body selection:bg-premium-accent/20 selection:text-premium-text antialiased">
            {/* Header */}
            <nav className="fixed top-0 w-full z-50 bg-premium-bg/80 backdrop-blur-md border-b border-black/[0.03]">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-premium-text flex items-center justify-center text-premium-bg shadow-lg shadow-black/10">
                            <span className="material-symbols-outlined text-[20px]">layers</span>
                        </div>
                        <div>
                            <h1 className="font-display font-black text-lg tracking-tight uppercase leading-none mb-1">CouncilIA</h1>
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-premium-muted">Strategic Intelligence Workspace</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-8">
                        <button onClick={() => router.push('/login')} className="text-sm font-bold text-premium-muted hover:text-premium-text transition-colors">
                            Sign In
                        </button>
                        <button onClick={() => router.push('/login')} className="premium-button premium-button-primary">
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="pt-40 pb-32 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-premium-accent/10 border border-premium-accent/20 rounded-full mb-8">
                        <span className="size-2 bg-premium-accent rounded-full animate-pulse"></span>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-premium-accent">Strategic Intelligence v14.0</span>
                    </div>
                    
                    <h1 className="text-6xl md:text-7xl font-black font-display tracking-tight text-premium-text mb-8 leading-[1.1]">
                        Simulate outcomes <br />
                        <span className="text-premium-muted">before you commit.</span>
                    </h1>
                    
                    <p className="text-xl text-premium-muted mb-12 max-w-2xl mx-auto leading-relaxed">
                        Explore strategic decisions through multiple AI perspectives, simulated risks, and organizational intelligence. No blind spots, just clarity.
                    </p>

                    {/* Interactive Prompt Box */}
                    <div className="max-w-2xl mx-auto mb-20">
                        <div className="premium-card p-2 flex flex-col md:flex-row gap-2">
                            <input 
                                type="text"
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && runPreview()}
                                placeholder="Should we expand to Brazil or Portugal first?"
                                className="flex-1 bg-transparent border-0 px-6 py-4 text-lg focus:ring-0 focus:outline-none placeholder:text-premium-muted/50"
                            />
                            <button 
                                onClick={runPreview}
                                disabled={loading || !idea.trim()}
                                className="premium-button premium-button-primary flex items-center justify-center gap-2 min-w-[180px] disabled:opacity-50"
                            >
                                {loading ? (
                                    <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>Run Simulation <span className="text-xl">→</span></>
                                )}
                            </button>
                        </div>
                        <p className="mt-4 text-[11px] font-bold uppercase tracking-widest text-premium-muted/60">
                            Try a lightweight simulation. No signup required.
                        </p>
                    </div>

                    {/* Preview Results */}
                    {previewResult && (
                        <div ref={resultRef} className="max-w-4xl mx-auto text-left mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                {previewResult.perspectives.map((p: any) => (
                                    <div key={p.id} className="premium-card p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-2xl">{p.emoji}</span>
                                            <span className="text-[11px] font-bold uppercase tracking-widest text-premium-muted">{p.name}</span>
                                        </div>
                                        <p className="text-sm leading-relaxed text-premium-text/80 italic">"{p.text}"</p>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="premium-card p-8 bg-white/50 backdrop-blur-sm border-premium-accent/20">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-3 py-1 bg-premium-accent text-white text-[10px] font-black uppercase tracking-widest rounded-full">Executive Verdict</span>
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm font-bold">Confidence:</span>
                                                <span className="text-sm font-black text-premium-accent">{previewResult.score}%</span>
                                            </div>
                                        </div>
                                        <p className="text-xl font-bold leading-tight text-premium-text">{previewResult.recommendation}</p>
                                    </div>
                                    <button 
                                        onClick={() => router.push('/login')}
                                        className="premium-button premium-button-primary bg-premium-accent hover:bg-premium-accent/90 px-8 py-4 text-base"
                                    >
                                        Unlock Full Council →
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Trust Logos / Social Proof */}
                    <div className="pt-20 border-t border-black/[0.03]">
                        <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-premium-muted/40 mb-12">Trusted by founders at</p>
                        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 grayscale opacity-30 hover:opacity-100 transition-opacity duration-500">
                            <span className="text-2xl font-black font-display tracking-tighter">STRATEGY.CO</span>
                            <span className="text-2xl font-black font-display tracking-tighter">NEXUS</span>
                            <span className="text-2xl font-black font-display tracking-tighter">AURA AI</span>
                            <span className="text-2xl font-black font-display tracking-tighter">LUCID</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Values Section */}
            <section className="bg-white py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-16">
                        <div>
                            <div className="size-12 bg-premium-bg rounded-2xl flex items-center justify-center mb-8">
                                <span className="material-symbols-outlined text-premium-accent">diversity_3</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Perspective-Driven UX</h3>
                            <p className="text-premium-muted leading-relaxed">Agents don't just answer questions. Multiple specialized perspectives debate, challenge, and refine your strategy to find the objective truth.</p>
                        </div>
                        <div>
                            <div className="size-12 bg-premium-bg rounded-2xl flex items-center justify-center mb-8">
                                <span className="material-symbols-outlined text-premium-secondary">memory</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Organizational Intelligence</h3>
                            <p className="text-premium-muted leading-relaxed">The 7th member of your council. Integrate your company's real numbers and historical context for simulations grounded in reality.</p>
                        </div>
                        <div>
                            <div className="size-12 bg-premium-bg rounded-2xl flex items-center justify-center mb-8">
                                <span className="material-symbols-outlined text-premium-text">verified</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Calm Intelligence</h3>
                            <p className="text-premium-muted leading-relaxed">No complexity, no noise. An interface designed for deep thinking and executive-level decision making.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-black/[0.03] text-center">
                <p className="text-[11px] font-bold uppercase tracking-widest text-premium-muted">
                    © 2026 CouncilIA — Strategic Intelligence for High-Stakes Decisions.
                </p>
            </footer>
        </div>
    );
}
