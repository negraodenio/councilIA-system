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
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden border-b border-[#38bdf8]/10 pt-16">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/scientific-bg.png" 
            alt="Scientific Background" 
            fill
            className="object-cover opacity-30 brightness-50 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0c0d1e]/50 to-[#0c0d1e]"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/20 mb-6 font-mono">
            <div className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse"></div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#38bdf8] uppercase">Scientific Foundation v6.1</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-[#38bdf8] to-[#d1d5db] leading-[1.1] uppercase italic">
            Evidence-Based <br/> Decision Architecture
          </h1>
          <p className="text-lg md:text-xl text-[#d1d5db]/60 max-w-2xl mx-auto leading-relaxed font-light">
            CouncilIA operationalizes research from multi-agent systems, decision science, and human-AI interaction into a structured deliberation platform.
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-24 relative z-10">
        
        <div className="mb-20 p-8 rounded-3xl bg-[#38bdf8]/5 border border-[#38bdf8]/20 text-center">
          <p className="text-xl text-[#38bdf8] font-medium leading-relaxed italic">
            "Our approach is scientifically grounded, not scientifically proven. We extend established principles into auditable decision processes for high-stakes environments."
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 gap-16">
          
          <section>
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-4xl font-black text-[#38bdf8] opacity-20">01</span>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Multi-Agent Deliberation</h2>
            </div>
            <p className="text-lg text-slate-400 mb-6 leading-relaxed">
              Research demonstrates that multi-instance LLM deliberation (Shaikh et al., 2025) achieves superior accuracy in high-stakes clinical exams by correcting errors that majority voting would miss.
            </p>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 font-medium text-sm text-[#38bdf8]">
              Key Insight: Structured deliberation reduces systematic error compared to single-model outputs.
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-4xl font-black text-[#38bdf8] opacity-20">02</span>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Adversarial Reasoning</h2>
            </div>
            <p className="text-lg text-slate-400 mb-6 leading-relaxed">
              Inspired by research on cooperative competition (Ellemers et al., PNAS 2020), where structured conflict improves theory-building. CouncilIA operationalizes this through intentional role tension across personas.
            </p>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 font-medium text-sm text-[#38bdf8]">
              Key Insight: Controlled disagreement surfaces hidden risks.
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-4xl font-black text-[#38bdf8] opacity-20">03</span>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Iterative Deliberation</h2>
            </div>
            <p className="text-lg text-slate-400 mb-6 leading-relaxed">
              Empirical observations suggest diminishing returns beyond a limited number of structured reasoning rounds. CouncilIA adopts a precise 3-round protocol: Thesis, Antithesis, and Synthesis.
            </p>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 font-medium text-sm text-[#38bdf8]">
              Key Insight: More iteration does not necessarily improve decisions.
            </div>
          </section>

        </div>

        {/* Technical Section */}
        <section className="mt-32 pt-32 border-t border-white/10">
          <h2 className="text-4xl font-black text-white mb-12 uppercase italic tracking-tighter">Technical Implementation</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-[32px] bg-slate-900/50 border border-white/5">
              <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-widest text-[#38bdf8]">Decision Metrics</h3>
              <ul className="space-y-4">
                <li className="flex justify-between border-b border-white/5 pb-2 text-sm">
                  <span>Dissent Range</span>
                  <span className="text-white font-mono">0–100</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2 text-sm">
                  <span>Consensus Strength</span>
                  <span className="text-white font-mono">σ %</span>
                </li>
                <li className="flex justify-between pb-2 text-sm">
                  <span>Evidence Density</span>
                  <span className="text-white font-mono">High/Low</span>
                </li>
              </ul>
            </div>
            <div className="p-8 rounded-[32px] bg-slate-900/50 border border-white/5">
              <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-widest text-[#d4a853]">Risk Modeling (VaR)</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Higher divergence across personas indicates higher uncertainty. Our VaR-inspired model estimates exposure based on unresolved contradictions and evidence gaps.
              </p>
            </div>
          </div>
        </section>

        {/* Limitations Section */}
        <section className="mt-32 p-12 rounded-[48px] bg-red-500/5 border border-red-500/20">
          <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">System Limitations & Hard Truths</h2>
          <ul className="space-y-4 text-sm text-slate-400 list-disc list-inside">
            <li>Dependent on input quality (Garbage In → Structured Garbage Out)</li>
            <li>Does not guarantee correctness or replacement of domain experts</li>
            <li>Cannot validate real-world outcomes without empirical testing</li>
            <li>Regulatory interpretations may vary by jurisdiction</li>
          </ul>
        </section>

        {/* Final Statement */}
        <section className="mt-32 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-12 tracking-tighter uppercase italic">
            What We Do Not Claim
          </h2>
          <div className="flex flex-wrap justify-center gap-4 mb-20 text-xs font-mono font-bold">
            <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full">❌ AI REPLACES HUMANS</span>
            <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full">❌ UNIVERSAL PROVEN ACCURACY</span>
            <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full">❌ ELIMINATION OF RISK</span>
          </div>
          <p className="text-xl text-slate-300 font-medium mb-12">
            We structure decisions. Humans remain accountable.
          </p>
          <Link href="/dashboard" className="inline-block px-12 py-5 rounded-full bg-[#38bdf8] text-[#0c0d1e] font-black uppercase tracking-widest text-sm hover:scale-105 transition-all">
            Access Dashboard
          </Link>
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
      `}</style>
    </div>
  );
}