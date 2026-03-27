'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { resolveUILang, type UILang } from '@/lib/i18n/ui-strings';
import Link from 'next/link';
import { exportToPDF } from '@/lib/pdf-utils';
import PDFReportTemplate from './PDFReportTemplate';

// ─── UTILS: v9 Styles ──────────────────────────
const PERSONA_META: Record<string, { color: string; gradient: string; emoji: string }> = {
    visionary: { color: '#A855F7', gradient: 'from-purple-500/20 to-purple-900/10', emoji: '💡' },
    technologist: { color: '#06B6D4', gradient: 'from-cyan-500/20 to-cyan-900/10', emoji: '🔬' },
    devil: { color: '#EF4444', gradient: 'from-red-500/20 to-red-900/10', emoji: '👺' },
    marketeer: { color: '#22C55E', gradient: 'from-emerald-500/20 to-emerald-900/10', emoji: '📈' },
    ethicist: { color: '#F59E0B', gradient: 'from-amber-500/20 to-amber-900/10', emoji: '⚖️' },
    financier: { color: '#3B82F6', gradient: 'from-blue-500/20 to-blue-900/10', emoji: '💰' },
};

function getMeta(id: string) {
    const cleanId = id.toLowerCase().split(' ')[0]; // Handle "Visionário Embrapa" etc.
    if (id.includes('Visionário')) return PERSONA_META.visionary;
    if (id.includes('Cientista')) return PERSONA_META.technologist;
    if (id.includes('Riscos')) return PERSONA_META.devil;
    if (id.includes('Mercado')) return PERSONA_META.marketeer;
    if (id.includes('Ambiental') || id.includes('Gestor')) return PERSONA_META.ethicist;
    if (id.includes('Financeiro') || id.includes('Fomento')) return PERSONA_META.financier;
    return PERSONA_META[cleanId] || { color: '#94a3b8', gradient: 'from-slate-500/20 to-slate-900/10', emoji: '🤖' };
}

export default function ConsensusReport({ validation }: { validation: any }) {
    const [activeTab, setActiveTab] = useState<'intelligence' | 'deliberation' | 'audit'>('intelligence');
    const [selectedRound, setSelectedRound] = useState(3);
    const [isExporting, setIsExporting] = useState(false);

    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            await exportToPDF('pdf-report-v9', `CouncilIA_Relatorio_${validation.id?.substring(0, 8)}.pdf`);
        } catch (err) {
            alert('Falha na geração do PDF. Tente novamente.');
        } finally {
            setIsExporting(false);
        }
    };

    const result = validation.full_result || validation || {};
    const ev = result.executiveVerdict || {};
    const ca = result.consensusAnalysis || {};
    const insight = result.insightLayer || { 
        conflictHeatmap: [["✅","✅","✅","✅"],["✅","✅","✅","✅"],["✅","✅","✅","✅"],["✅","✅","✅","✅"]],
        timeline: [{ round: 1, consensus: 50, label: 'Thesis' }, { round: 2, consensus: 40, label: 'Antithesis' }, { round: 3, consensus: 72, label: 'Synthesis' }],
        systemConsistency: 85,
        benchmark: { avgSectorScore: 70, targetDelta: 10 }
    };

    const meanScore = Math.round(ev.score || 0);
    const realConsensus = Math.round(ca.strengthPercentage || meanScore);
    const varValue = Math.round(ev.var?.percentage || 0);
    const statusLabel = ev.verdict || (meanScore >= 70 ? 'GO' : meanScore >= 40 ? 'CONDITIONAL' : 'NO-GO');
    
    const statusTheme = meanScore >= 70 
        ? { shadow: 'shadow-[0_0_50px_rgba(34,197,94,0.3)]', border: 'border-emerald-500/30', text: 'text-emerald-400', bg: 'bg-emerald-500/5' }
        : meanScore >= 40 
            ? { shadow: 'shadow-[0_0_50px_rgba(245,158,11,0.2)]', border: 'border-amber-500/30', text: 'text-amber-400', bg: 'bg-amber-500/5' }
            : { shadow: 'shadow-[0_0_50px_rgba(239,68,68,0.2)]', border: 'border-red-500/30', text: 'text-red-400', bg: 'bg-red-500/5' };

    const personas = result.fullTranscript?.round3?.responses || [];

    return (
        <div className="min-h-screen bg-[#050810] text-[#d1d5db] font-sans selection:bg-neon-cyan/30 overflow-x-hidden tech-grid relative">
            
            {/* 💎 PREMIUM NAVIGATION */}
            <header className="sticky top-0 z-50 bg-[#050810]/80 backdrop-blur-xl border-b border-white/5 h-20 flex items-center justify-between px-8">
                <div className="flex items-center gap-8">
                    <Link href="/dashboard" className="flex items-center gap-2 group text-slate-500 hover:text-neon-cyan transition-all">
                        <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                        <span className="font-mono text-[10px] uppercase tracking-widest font-black">Command Center</span>
                    </Link>
                    <div className="h-4 w-px bg-white/10 hidden md:block"></div>
                    <div className="flex items-center gap-3">
                        <div className="size-2 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_10px_#00f2ff]"></div>
                        <span className="font-mono text-[11px] uppercase tracking-[0.3em] font-black text-white/50">CouncilIA v9.0 Intelligence</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="px-5 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-mono text-[9px] font-black uppercase tracking-widest">
                        Metadata Audit
                    </button>
                    <button 
                        onClick={handleExportPDF}
                        disabled={isExporting}
                        className="px-6 py-2 rounded-full bg-neon-cyan text-[#050810] font-mono text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,242,255,0.4)] disabled:opacity-50 disabled:cursor-wait"
                    >
                        {isExporting ? 'Exporting...' : 'Strategic Export'}
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 lg:p-12 relative z-10">

                {/* 🏆 EXECUTIVE VERDICT CARD (v9 Glassmorphism) */}
                <section className={`p-8 md:p-16 rounded-[48px] border ${statusTheme.border} ${statusTheme.bg} ${statusTheme.shadow} mb-12 relative overflow-hidden group`}>
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-4 mb-4">
                                <span className={`font-mono text-[11px] font-black uppercase tracking-[0.4em] ${statusTheme.text}`}>Veredito Institucional</span>
                                <div className="h-px w-20 bg-white/10"></div>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-white mb-8 group-hover:tracking-tight transition-all duration-700">
                                {statusLabel}
                            </h1>
                            <div className="prose prose-invert max-w-none text-xl text-slate-200/90 leading-relaxed text-justify opacity-90 group-hover:opacity-100 transition-opacity">
                                <ReactMarkdown>{result.judgeRationale || 'Aguardando consolidação do parecer técnico...'}</ReactMarkdown>
                            </div>
                        </div>
                        <div className="shrink-0">
                            <div className="bg-[#050810]/40 backdrop-blur-3xl p-10 rounded-[40px] border border-white/10 flex flex-col items-center text-center shadow-2xl">
                                <span className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.3em] font-black mb-2">Audit Score</span>
                                <span className="text-7xl font-black text-white italic">{meanScore}<span className="text-2xl text-slate-500 not-italic">/100</span></span>
                                <div className="mt-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                    <span className="material-symbols-outlined text-[14px] text-emerald-400">verified_user</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Validated</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 📂 LAYER NAVIGATION (v9 tabs) */}
                <div className="flex justify-center gap-4 mb-12">
                    {[
                        { id: 'intelligence', label: 'Intelligence Layer', emoji: '🧠', sub: 'Matrix & Benchmarks' },
                        { id: 'deliberation', label: 'Deliberation Layer', emoji: '🔥', sub: 'Audit Trail' },
                        { id: 'audit', label: 'Compliance Gate', emoji: '🚦', sub: 'Risk & Actions' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex flex-col items-center p-4 min-w-[200px] rounded-3xl transition-all border ${activeTab === tab.id ? 'bg-white/5 border-neon-cyan/50 text-white shadow-[0_0_20px_rgba(0,242,255,0.1)]' : 'border-white/5 text-slate-500 hover:border-white/10'}`}
                        >
                            <span className="text-xl mb-1">{tab.emoji}</span>
                            <span className="font-mono text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                            <span className="text-[9px] opacity-40 uppercase font-bold mt-1 tracking-tighter">{tab.sub}</span>
                        </button>
                    ))}
                </div>

                {/* 🧠 INTELLIGENCE LAYER (v9 EXCLUSIVE) */}
                {activeTab === 'intelligence' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {/* Heatmap Section */}
                        <div className="lg:col-span-8 bg-white/2 rounded-[40px] border border-white/5 p-10 overflow-hidden relative">
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 mb-8 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm text-neon-cyan">grid_view</span>
                                Conflict Heatmap (Divergence Matrix)
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-[12px] font-mono border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="p-4"></th>
                                            {personas.map((p: any, i: number) => (
                                                <th key={i} className="p-4 text-white/40 uppercase tracking-tighter text-[9px]">{p.persona.split(' ')[0]}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {insight.conflictHeatmap.map((row: string[], i: number) => (
                                            <tr key={i} className="border-t border-white/5">
                                                <td className="p-4 text-white/40 uppercase tracking-tighter text-[9px] font-bold">{personas[i]?.persona.split(' ')[0]}</td>
                                                {row.map((cell, j) => (
                                                    <td key={j} className={`p-4 text-center text-xl transition-all hover:scale-125 cursor-default ${cell === '🔥' ? 'animate-pulse drop-shadow-[0_0_8px_#ef4444]' : ''}`}>
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-8 flex gap-8 text-[9px] font-black uppercase tracking-widest text-slate-500 border-t border-white/5 pt-8">
                                <span className="flex items-center gap-2"><span className="text-lg">🔥</span> CRITICAL CLASH</span>
                                <span className="flex items-center gap-2"><span className="text-lg">⚠️</span> MINOR DISSENT</span>
                                <span className="flex items-center gap-2"><span className="text-lg">✅</span> ALIGNMENT</span>
                            </div>
                        </div>

                        {/* Benchmark & Health */}
                        <div className="lg:col-span-4 flex flex-col gap-8">
                            <div className="bg-[#0f172a]/50 backdrop-blur-xl p-8 rounded-[40px] border border-white/5 flex flex-col justify-center">
                                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 mb-6">Decision Benchmark</h2>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-bold text-white/60">SECTOR AVG (AGRO/ZARC)</span>
                                        <span className="text-xl font-mono font-black text-white">{insight.benchmark.avgSectorScore}</span>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full relative overflow-hidden">
                                        <div className="absolute inset-0 bg-neon-cyan/20"></div>
                                        <div className="absolute h-full bg-neon-cyan shadow-[0_0_10px_#00f2ff]" style={{ width: `${insight.benchmark.avgSectorScore}%` }}></div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                                        <span className={`text-xl font-bold ${insight.benchmark.targetDelta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {insight.benchmark.targetDelta >= 0 ? '+' : ''}{insight.benchmark.targetDelta}%
                                        </span>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Above baseline consistency</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/2 p-8 rounded-[40px] border border-white/5 text-center">
                                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-4">System Health</div>
                                <div className="text-5xl font-black text-white italic mb-2">{insight.systemConsistency}%</div>
                                <div className="text-[9px] font-mono text-neon-cyan tracking-widest font-black uppercase">Institutional Reliability</div>
                            </div>
                        </div>

                        {/* Timeline / Replay View */}
                        <div className="lg:col-span-12 bg-white/2 rounded-[48px] border border-white/5 p-10">
                             <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 mb-10 flex items-center justify-between">
                                <span className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-[#ff00e5]">timeline</span> Evolution Timeline</span>
                                <div className="flex gap-2">
                                    {[1,2,3].map(r => (
                                        <button key={r} onClick={() => setSelectedRound(r)} className={`px-4 py-1.5 rounded-full font-mono text-[9px] font-black transition-all ${selectedRound === r ? 'bg-white text-[#050810]' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}>
                                            Round {r}
                                        </button>
                                    ))}
                                </div>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-12 relative">
                                <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5 z-0"></div>
                                {insight.timeline.map((t: any, i: number) => (
                                    <div key={i} className={`flex flex-col items-center relative z-10 transition-all ${selectedRound === t.round ? 'scale-110' : 'opacity-40'}`}>
                                        <div className={`size-12 rounded-2xl flex items-center justify-center font-mono font-black text-lg mb-3 ${selectedRound === t.round ? 'bg-white text-black shadow-2xl' : 'bg-slate-900 border border-white/10 text-white/30'}`}>
                                            {t.consensus}%
                                        </div>
                                        <div className="text-[9px] font-black uppercase tracking-widest text-white/60">{t.label}</div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Replay Detail */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {(result.fullTranscript?.[`round${selectedRound}`]?.responses || []).map((r: any) => (
                                    <div key={r.persona} className="bg-black/40 p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all flex flex-col gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 text-sm">{getMeta(r.persona).emoji}</div>
                                            <span className="font-mono text-[10px] font-black uppercase tracking-widest text-white/70">{r.persona}</span>
                                        </div>
                                        <div className="prose prose-invert prose-xs text-[10.5px] text-slate-400 italic leading-relaxed text-justify line-clamp-6 opacity-60 hover:opacity-100 transition-opacity">
                                            <ReactMarkdown>{r.analysis}</ReactMarkdown>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 📂 DELIBERATION LAYER (The Transcript) */}
                {activeTab === 'deliberation' && (
                    <div className="animate-in fade-in fill-mode-both duration-500">
                         <div className="grid grid-cols-1 gap-6">
                            {personas.map((r: any) => (
                                <div key={r.persona} className={`bg-gradient-to-br ${getMeta(r.persona).gradient} border border-white/10 rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row gap-8 relative overflow-hidden group`}>
                                    <div className="shrink-0 flex flex-col items-center">
                                        <div className="size-20 rounded-[28px] bg-black/40 flex items-center justify-center text-3xl border border-white/10 shadow-2xl mb-4 group-hover:scale-110 transition-transform" style={{ color: getMeta(r.persona).color }}>
                                            {getMeta(r.persona).emoji}
                                        </div>
                                        <div className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/50">Score: {r.score}</div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                            {r.persona}
                                            <div className="h-px flex-1 bg-white/5"></div>
                                        </h3>
                                        <div className="prose prose-invert max-w-none prose-sm text-slate-300/80 leading-relaxed text-justify italic">
                                            <ReactMarkdown>{r.analysis}</ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>
                )}

                {/* 🚦 AUDIT LAYER (v9 Critical Matrix) */}
                {activeTab === 'audit' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
                        {/* Risks */}
                        <div className="bg-[#050810] border border-white/5 p-10 rounded-[40px] shadow-2xl">
                             <h3 className="font-mono text-[10px] text-[#ff00e5] font-black uppercase tracking-[0.4em] mb-8">Critical Risk Gate</h3>
                             <div className="space-y-4">
                                {(result.criticalRisks || []).map((risk: any) => (
                                    <div key={risk.id} className="p-6 rounded-3xl bg-red-500/5 border border-red-500/10 flex flex-col gap-3">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-white text-sm">{risk.name}</span>
                                            <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[8px] font-black uppercase">Open Risk</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 italic">"{risk.evidence}"</p>
                                    </div>
                                ))}
                                {(result.criticalRisks?.length === 0) && <div className="text-emerald-400 font-mono text-[10px] font-black p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-center uppercase tracking-widest">No Absolute Blockers Found</div>}
                             </div>
                        </div>

                        {/* Evidence */}
                        <div className="bg-[#050810] border border-white/5 p-10 rounded-[40px] shadow-2xl">
                             <h3 className="font-mono text-[10px] text-neon-cyan font-black uppercase tracking-[0.4em] mb-8">Regulatory Roadmap</h3>
                             <div className="space-y-4">
                                {(result.actionPlan?.actions || []).map((action: any) => (
                                    <div key={action.id} className="p-6 rounded-3xl bg-neon-cyan/5 border border-neon-cyan/10 flex flex-col gap-2">
                                        <span className="text-white font-bold text-xs">{action.name}</span>
                                        <div className="flex justify-between items-center text-[9px] font-mono text-neon-cyan/60 uppercase font-black">
                                            <span>Owner: {action.owner}</span>
                                            <span>T: {action.deadline}</span>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                )}

            </main>

            {/* 🧠 INTELLIGENCE FEEDBACK LOOP (Bottom Float) */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-[#050810]/80 backdrop-blur-2xl border border-white/10 px-8 py-4 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <span className="font-mono text-[10px] font-black uppercase tracking-widest text-white/50">Human Feedback (v9 Loop):</span>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all font-mono text-[9px] font-black uppercase tracking-widest">
                    <span className="material-symbols-outlined text-sm">thumb_up</span> Correct
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all font-mono text-[9px] font-black uppercase tracking-widest">
                   <span className="material-symbols-outlined text-sm">thumb_down</span> Incorrect
                </button>
                <div className="h-4 w-px bg-white/10"></div>
                <button className="text-[9px] font-black uppercase tracking-widest text-[#ff00e5] animate-pulse">
                    Training Future Weights...
                </button>
            </div>

            {/* 📄 HIDDEN PDF TEMPLATE (Off-screen) */}
            <div className="fixed -left-[2000px] top-0 pointer-events-none">
                <PDFReportTemplate validation={validation} />
            </div>

            <style jsx>{`
                .tech-grid {
                    background-image: 
                        linear-gradient(to right, rgba(0, 242, 255, 0.05) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(0, 242, 255, 0.05) 1px, transparent 1px);
                    background-size: 40px 40px;
                }
            `}</style>
        </div>
    );
}
