'use client';

import React from 'react';
import Image from 'next/image';

export default function ScientificPage() {
  return (
    <div className="min-h-screen bg-[#0c0d1e] text-[#d1d5db] font-sans selection:bg-[#38bdf8]/30 overflow-x-hidden tech-grid">
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden border-b border-[#38bdf8]/10">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/scientific-bg.png" 
            alt="Scientific Background" 
            fill
            className="object-cover opacity-40 brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0c0d1e]/50 to-[#0c0d1e]"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/20 mb-6 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-[#38bdf8]"></div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#38bdf8] uppercase">Audit-Grade Protocol v7.3.1</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-[#38bdf8] to-[#d4a853] glow-text leading-[1.1]">
            Universal Decision System
          </h1>
          <p className="text-lg md:text-xl text-[#d1d5db]/80 max-w-2xl mx-auto leading-relaxed">
            From heuristic AI impressions to deterministic metrological deliberation. 
            The science of auditable truth in high-stakes environments.
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* Section 1: Executive Abstract */}
        <section className="mb-32">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="metric-label mb-2">Scientific Evolution</div>
              <h2 className="text-3xl font-bold text-white mb-6">The Decoupling of Logic and Narrative</h2>
              <p className="text-[#d1d5db]/70 mb-6 leading-relaxed">
                CouncilIA v7.3.1 solves the "hallucination gap" by strictly separating 
                the <strong>Mathematical Logic Layer</strong> from the <strong>Semantic Narrative Layer</strong>. 
                Values are calculated using ISO-standard statistical formulas before the narrative is generated.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-[#38bdf8]/5 border border-[#38bdf8]/10">
                  <span className="text-[#d4a853] font-bold">LEGACY (v7.2)</span>
                  <p className="text-sm">LLM generates text and scores simultaneously. Risk of logical contradictions.</p>
                </div>
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-[#38bdf8]/10 border border-[#38bdf8]/30">
                  <span className="text-[#38bdf8] font-bold">MODERN (v7.3.1)</span>
                  <p className="text-sm">Deterministic math Layer dictates the truth; LLM is restricted to rationale synthesis.</p>
                </div>
              </div>
            </div>
            <div className="glass-panel p-8 rounded-2xl border border-[#38bdf8]/20 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1">
                    <path d="M12 2v20M2 12h20M7.5 7.5l9 9M7.5 16.5l9-9" />
                  </svg>
               </div>
               <div className="metric-label mb-8">System Architecture</div>
               <div className="space-y-6">
                 <div className="flex items-center justify-between border-b border-white/5 pb-4">
                   <span>Input Pre-processing</span>
                   <span className="text-[10px] text-[#38bdf8]">RAG-Verified</span>
                 </div>
                 <div className="flex items-center justify-between border-b border-white/5 pb-4">
                   <span>Adversarial Deliberation</span>
                   <span className="text-[10px] text-[#38bdf8]">6 Personas / 3 Rounds</span>
                 </div>
                 <div className="flex items-center justify-between border-b border-white/5 pb-4">
                   <span>Metrological Scoring</span>
                   <span className="text-[10px] text-[#d4a853]">Deterministic Math</span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span>4-Guard Validation</span>
                   <span className="text-[10px] text-green-400">Safe-Mode Enabled</span>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* Section 2: Mathematical Foundations */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <div className="metric-label mb-2">Analytical Rigor</div>
            <h2 className="text-4xl font-bold text-white mb-4">The Mathematics of Consensus</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-10 rounded-2xl">
              <h3 className="text-xl font-bold text-[#38bdf8] mb-6 flex items-center">
                <span className="mr-3">Θ</span> Consensus Strength
              </h3>
              <p className="text-sm mb-8 text-[#d1d5db]/60">
                Measures the inverse variance across 6 specialized personas. 
                Alignment is calculated as a penalty on the standard deviation.
              </p>
              <div className="bg-black/30 p-6 rounded-xl font-mono text-sm border border-white/5 mb-6">
                <div className="text-[#38bdf8]">σ = sqrt(Σ(xi - μ)² / N)</div>
                <div className="text-[#d4a853]">Θ = max(0, 100 - (σ * 2))</div>
              </div>
              <ul className="text-xs space-y-2 text-[#d1d5db]/50">
                <li>• 100% = Absolute Alignment</li>
                <li>• &lt;40% = Flagged Weak Consensus</li>
              </ul>
            </div>

            <div className="glass-card p-10 rounded-2xl">
              <h3 className="text-xl font-bold text-[#d4a853] mb-6 flex items-center">
                <span className="mr-3">VaR</span> Value at Risk
              </h3>
              <p className="text-sm mb-8 text-[#d1d5db]/60">
                A multi-dimensional penalty function factoring dissent range, 
                unresolved risks, and evidence density.
              </p>
              <div className="bg-black/30 p-6 rounded-xl font-mono text-sm border border-white/5 mb-6">
                <div className="text-[#d4a853]">VaR = (Δ * wd) + (R * wr) + (E * we)</div>
              </div>
              <ul className="text-xs space-y-2 text-[#d1d5db]/50">
                <li>• Δ = Dissent Spread</li>
                <li>• R = Critical Risk Count</li>
                <li>• E = Evidence Citation Density</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: The 4-Guard Protoco */}
        <section className="mb-32">
          <div className="glass-panel p-12 rounded-3xl border border-white/10 tech-grid">
            <div className="max-w-3xl mx-auto text-center">
              <div className="metric-label mb-4">Failover Integrity</div>
              <h2 className="text-4xl font-bold text-white mb-8">The 4-Guard Security Layer</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {[
                  { label: 'Guard 1', title: 'Logic Sync', desc: 'Score vs Consensus alignment', color: '#38bdf8' },
                  { label: 'Guard 2', title: 'Neutral Check', desc: 'Detects pipeline stalling', color: '#d4a853' },
                  { label: 'Guard 3', title: 'Evidence Density', desc: 'Mandatory RAG verification', color: '#10b981' },
                  { label: 'Guard 4', title: 'Solo Bias', desc: 'Anomaly detection for personas', color: '#f43f5e' }
                ].map((g, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 text-left hover:border-white/20 transition-all">
                    <div className="text-[10px] font-bold uppercase mb-1" style={{ color: g.color }}>{g.label}</div>
                    <div className="text-sm font-bold text-white mb-2">{g.title}</div>
                    <div className="text-[10px] text-[#d1d5db]/40 leading-tight">{g.desc}</div>
                  </div>
                ))}
              </div>
              <div className="p-6 rounded-2xl bg-[#f43f5e]/10 border border-[#f43f5e]/20 text-[#f43f5e]">
                <p className="text-sm font-bold flex items-center justify-center">
                   <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                   </svg>
                   Failure of any guard triggers automated Safe Mode (NO-GO Default).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-20 border-t border-white/5">
           <div className="metric-label mb-6">Ready for Enterprise</div>
           <h2 className="text-4xl font-bold text-white mb-10">Deploy Hardened Intelligence Today.</h2>
           <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <a href="/dashboard" className="px-10 py-4 rounded-full bg-gradient-to-r from-[#38bdf8] to-[#2563eb] text-white font-bold hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all">
                Access Engine Console
              </a>
              <a href="/docs/COUNCILIA_V731_SCIENTIFIC_SPEC.md" className="px-10 py-4 rounded-full border border-white/20 text-white font-bold hover:bg-white/5 transition-all">
                Download Full Spec (EN)
              </a>
              <a href="/docs/COUNCILIA_V731_ESPECIFICACAO_CIENTIFICA.md" className="px-10 py-4 rounded-full border border-white/20 text-white font-bold hover:bg-white/5 transition-all">
                Download Full Spec (PT)
              </a>
           </div>
        </section>
      </main>

      <footer className="py-10 text-center border-t border-white/5 text-[10px] text-[#d1d5db]/30 tracking-widest uppercase">
        © 2026 CouncilIA Universal Decision System • Metrological Security Division
      </footer>
    </div>
  );
}
