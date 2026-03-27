'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from "@/ui/Navbar";
import { Footer } from "@/ui/Footer";

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-[#0c0d1e] text-[#d1d5db] font-sans selection:bg-[#38bdf8]/30 overflow-x-hidden tech-grid relative">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[70vh] flex items-center justify-center overflow-hidden border-b border-[#38bdf8]/10 pt-16">
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
          <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-[#38bdf8] to-[#d4a853] glow-text leading-[1.1] uppercase italic">
            Scientific <br/> Methodology
          </h1>
          <p className="text-lg md:text-2xl text-[#d1d5db]/80 max-w-2xl mx-auto leading-relaxed font-light">
            From heuristic AI impressions to deterministic metrological deliberation. 
            The science of auditable truth in high-stakes environments.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        
        {/* Section 1: Executive Abstract */}
        <section className="mb-40">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-[#38bdf8] uppercase tracking-widest mb-4">Systems Evolution</div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight uppercase tracking-tighter italic">Decoupling <br/><span className="text-[#38bdf8]">Logic and Narrative</span></h2>
              <p className="text-xl text-[#d1d5db]/70 mb-10 leading-relaxed font-light">
                CouncilIA v7.3.1 solves the "hallucination gap" by strictly separating the 
                **Mathematical Logic Layer** from the **Semantic Narrative Layer**. 
                Baseline metrics are calculated via ISO-standard statistical formulas before any text is generated.
              </p>
              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-start space-x-6 p-6 rounded-2xl bg-white/5 border border-white/10 group hover:border-[#38bdf8]/30 transition-all">
                  <div className="size-10 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 font-bold text-xs shrink-0">V6</div>
                  <div>
                    <h4 className="text-white font-bold mb-1 uppercase text-sm tracking-widest">LEGACY (v6.x)</h4>
                    <p className="text-sm text-slate-500">LLM generates text and scores simultaneously. High risk of logical contradiction.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-6 p-6 rounded-2xl bg-[#38bdf8]/10 border border-[#38bdf8]/30 group hover:border-[#38bdf8] transition-all">
                  <div className="size-10 rounded-lg bg-[#38bdf8] flex items-center justify-center text-[#0c0d1e] font-bold text-xs shrink-0">V7</div>
                  <div>
                    <h4 className="text-[#38bdf8] font-bold mb-1 uppercase text-sm tracking-widest">PRO HARDENED (v7.3.1)</h4>
                    <p className="text-sm text-slate-300">Deterministic calculation fixes the initial truth; the LLM is restricted to rationale synthesis.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-b from-slate-900/80 to-slate-900/40 p-12 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
                  <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="0.5">
                    <path d="M12 2v20M2 12h20M7.5 7.5l9 9M7.5 16.5l9-9" />
                  </svg>
               </div>
               <div className="text-[10px] font-mono text-[#38bdf8] uppercase tracking-[0.3em] font-black mb-12">System Architecture Protocol</div>
               <div className="space-y-10">
                 <div className="flex items-center justify-between border-b border-white/5 pb-6">
                   <span className="text-lg font-bold text-white uppercase tracking-tight">Input Pre-processing</span>
                   <span className="px-3 py-1 bg-[#38bdf8]/20 rounded text-[10px] font-black text-[#38bdf8]">RAG-VERIFIED</span>
                 </div>
                 <div className="flex items-center justify-between border-b border-white/5 pb-6">
                   <span className="text-lg font-bold text-white uppercase tracking-tight">Adversarial Deliberation</span>
                   <span className="px-3 py-1 bg-[#d4a853]/20 rounded text-[10px] font-black text-[#d4a853]">6 PERSONAS</span>
                 </div>
                 <div className="flex items-center justify-between border-b border-white/5 pb-6">
                   <span className="text-lg font-bold text-white uppercase tracking-tight">Metrological Scoring</span>
                   <span className="px-3 py-1 bg-white/10 rounded text-[10px] font-black text-white">HARD-CODED</span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-lg font-bold text-white uppercase tracking-tight">4-Guard Validation</span>
                   <span className="px-3 py-1 bg-green-500/20 rounded text-[10px] font-black text-green-400">ACTIVATED</span>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* Section 2: Mathematical Foundations */}
        <section className="mb-40">
          <div className="text-center mb-20">
            <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-[#d4a853] uppercase tracking-[0.4em] mb-4">Analytical Rigor</div>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter italic">The Mathematics of <span className="text-[#d4a853]">Consensus</span></h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            <div className="bg-slate-900/50 p-12 rounded-[32px] border border-white/5 hover:border-[#38bdf8]/30 transition-all">
              <h3 className="text-3xl font-black text-[#38bdf8] mb-8 flex items-center uppercase italic tracking-tighter">
                <span className="mr-4 text-5xl">Θ</span> Consensus Strength
              </h3>
              <p className="text-lg mb-10 text-[#d1d5db]/60 leading-relaxed font-light">
                Measures the inverse variance across 6 specialized personas. 
                Alignment is calculated as a penalty on the standard deviation of scores.
              </p>
              <div className="bg-black/40 p-8 rounded-2xl font-mono text-lg border border-[#38bdf8]/20 mb-8 shadow-inner">
                <div className="text-[#38bdf8]/50 text-xs mb-2 uppercase tracking-widest font-bold">Protocol Pseudo-code</div>
                <div className="text-[#38bdf8]">σ = sqrt(Σ(xi - μ)² / N)</div>
                <div className="text-[#d4a853]">Θ = max(0, 100 - (σ * 2.5))</div>
              </div>
              <ul className="grid grid-cols-2 gap-4">
                <li className="p-4 rounded-xl bg-white/5 text-[10px] uppercase font-black text-slate-500 tracking-widest">100% = Absolute Alignment</li>
                <li className="p-4 rounded-xl bg-white/5 text-[10px] uppercase font-black text-slate-500 tracking-widest">&lt;40% = Weak Consensus</li>
              </ul>
            </div>

            <div className="bg-slate-900/50 p-12 rounded-[32px] border border-white/5 hover:border-[#d4a853]/30 transition-all">
              <h3 className="text-3xl font-black text-[#d4a853] mb-8 flex items-center uppercase italic tracking-tighter">
                <span className="mr-4 text-5xl">VaR</span> Value at Risk
              </h3>
              <p className="text-lg mb-10 text-[#d1d5db]/60 leading-relaxed font-light">
                A multi-dimensional penalty function factoring in impact depth, 
                unmitigated risks, and evidence density.
              </p>
              <div className="bg-black/40 p-8 rounded-2xl font-mono text-lg border border-[#d4a853]/20 mb-8 shadow-inner">
                <div className="text-[#d4a853]/50 text-xs mb-2 uppercase tracking-widest font-bold">Exposure Formula</div>
                <div className="text-[#d4a853]">VaR = (Δ * wd) + (R * wr) + (E * we)</div>
              </div>
              <ul className="grid grid-cols-2 gap-4">
                <li className="p-4 rounded-xl bg-white/5 text-[10px] uppercase font-black text-slate-500 tracking-widest">Δ = Dissent Spread</li>
                <li className="p-4 rounded-xl bg-white/5 text-[10px] uppercase font-black text-slate-500 tracking-widest">E = RAG Density</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: The 4-Guard Protocol */}
        <section className="mb-40">
          <div className="bg-gradient-to-br from-indigo-950 to-slate-950 p-16 rounded-[48px] border border-white/10 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 tech-grid opacity-10"></div>
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-green-400 uppercase tracking-[0.5em] mb-8">Failover Integrity Layer</div>
              <h2 className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tighter uppercase italic">The <span className="text-[#38bdf8]">4-Guard</span> Protocol</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {[
                  { label: 'Guard 1', title: 'Logic Sync', desc: 'Verifies Score vs Consensus alignment', color: '#38bdf8' },
                  { label: 'Guard 2', title: 'Neutral Leak', desc: 'Detects hedging towards neutrality (50/100)', color: '#d4a853' },
                  { label: 'Guard 3', title: 'RAG Anchor', desc: 'Mandatory source validation protocols', color: '#10b981' },
                  { label: 'Guard 4', title: 'Solo Bias', desc: 'Detects single-persona opinion anomalies', color: '#f43f5e' }
                ].map((g, i) => (
                  <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/10 text-left hover:border-white/20 transition-all hover:bg-white/10">
                    <div className="text-[10px] font-mono font-black uppercase mb-3 tracking-widest" style={{ color: g.color }}>{g.label}</div>
                    <div className="text-lg font-black text-white mb-3 uppercase tracking-tight">{g.title}</div>
                    <p className="text-xs text-[#d1d5db]/40 leading-relaxed font-medium">{g.desc}</p>
                  </div>
                ))}
              </div>

              <div className="p-8 rounded-[32px] bg-red-500/10 border border-red-500/30 text-red-400">
                <p className="text-lg font-black flex items-center justify-center uppercase tracking-tight">
                   <svg className="size-8 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                   </svg>
                   Failure of any guard triggers Safe Mode (REJECTED DUE TO INCONSISTENCY).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-20 border-t border-white/10">
           <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-white/40 uppercase tracking-[0.5em] mb-12">Universal Audit Council</div>
           <h2 className="text-5xl md:text-8xl font-black text-white mb-20 tracking-tighter uppercase italic leading-[0.9]">Hardened Decision <br/>Intelligence.</h2>
           
           <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Link href="/dashboard" className="w-full md:w-auto px-12 py-5 rounded-full bg-gradient-to-r from-[#38bdf8] to-[#2563eb] text-[#0c0d1e] font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-[0_20px_40px_rgba(56,189,248,0.3)]">
                Access Dashboard
              </Link>
              <Link href="/docs/COUNCILIA_V731_SCIENTIFIC_SPEC.md" className="w-full md:w-auto px-12 py-5 rounded-full border border-white/20 text-white font-black uppercase tracking-widest text-sm hover:bg-white/5 transition-all">
                Download Spec (PDF/MD)
              </Link>
           </div>
        </section>
      </main>

      <Footer />
      
      <style jsx>{`
        .tech-grid {
          background-image: 
            linear-gradient(to right, rgba(56, 189, 248, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(56, 189, 248, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .glow-text {
          filter: drop-shadow(0 0 20px rgba(56, 189, 248, 0.3));
        }
      `}</style>
    </div>
  );
}