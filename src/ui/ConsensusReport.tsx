'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { exportToPDF } from '@/lib/pdf-utils';
import PDFReportTemplate from './PDFReportTemplate';

// ─── UTILS: Strategic Perspectives ──────────
const PERSONA_META: Record<string, { color: string; emoji: string; label: string }> = {
    strategic: { color: '#14B8A6', emoji: '🎯', label: 'Strategic Perspective' },
    technical: { color: '#06B6D4', emoji: '⚙️', label: 'Technical Perspective' },
    contrarian: { color: '#EF4444', emoji: '⚖️', label: 'Contrarian Perspective' },
    market: { color: '#22C55E', emoji: '📈', label: 'Market Perspective' },
    risk: { color: '#F59E0B', emoji: '🛡️', label: 'Risk & Compliance' },
    financial: { color: '#3B82F6', emoji: '💰', label: 'Financial Perspective' },
    company: { color: '#4F46E5', emoji: '🏛️', label: 'Company Perspective' },
};

function getMeta(id: string) {
    const n = id.toLowerCase();
    if (n.includes('inovação') || n.includes('strategic') || n.includes('visionary')) return PERSONA_META.strategic;
    if (n.includes('cientista') || n.includes('technical') || n.includes('technologist')) return PERSONA_META.technical;
    if (n.includes('auditor') || n.includes('contrarian') || n.includes('devil')) return PERSONA_META.contrarian;
    if (n.includes('mercado') || n.includes('market')) return PERSONA_META.market;
    if (n.includes('regulatório') || n.includes('risk') || n.includes('ethic')) return PERSONA_META.risk;
    if (n.includes('financeiro') || n.includes('financial')) return PERSONA_META.financial;
    if (n.includes('company') || n.includes('internal')) return PERSONA_META.company;
    return { color: '#6B7280', emoji: '🧠', label: id };
}

export default function ConsensusReport({ validation }: { validation: any }) {
    const [activeTab, setActiveTab] = useState<'insights' | 'discussion' | 'alignment'>('insights');
    const [isExporting, setIsExporting] = useState(false);

    const result = validation.full_result || validation || {};
    const ev = result.executiveVerdict || {};
    const meanScore = Math.round(ev.score || 0);
    const statusLabel = ev.verdict || (meanScore >= 70 ? 'GO' : meanScore >= 40 ? 'CONDITIONAL' : 'NO-GO');
    
    const statusTheme = meanScore >= 70 
        ? { border: 'border-emerald-500/20', text: 'text-emerald-600', bg: 'bg-emerald-500/[0.03]' }
        : meanScore >= 40 
            ? { border: 'border-amber-500/20', text: 'text-amber-600', bg: 'bg-amber-500/[0.03]' }
            : { border: 'border-red-500/20', text: 'text-red-600', bg: 'bg-red-500/[0.03]' };

    const perspectives = result.fullTranscript?.round3?.responses || [];

    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            await exportToPDF('pdf-report-v12', { 
                filename: `CouncilIA_Memo_${validation.id?.substring(0, 8)}.pdf` 
            });
        } catch (_err) {
            alert('Export failed. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="min-h-screen bg-premium-bg text-premium-text font-body selection:bg-premium-accent/20 antialiased">
            
            {/* Header */}
            <header className="sticky top-0 z-50 bg-premium-bg/80 backdrop-blur-md border-b border-black/[0.03] h-20 flex items-center justify-between px-8">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="flex items-center gap-2 text-premium-muted hover:text-premium-text transition-colors">
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Dashboard</span>
                    </Link>
                    <div className="h-4 w-px bg-black/[0.05]"></div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-premium-muted">Strategic Memo — ID: {validation.id?.substring(0,8)}</span>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleExportPDF}
                        disabled={isExporting}
                        className="premium-button premium-button-secondary py-2 text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"
                    >
                        {isExporting ? 'Exporting...' : 'Export Memo'}
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto py-16 px-6">

                {/* Hero Verdict */}
                <section className={`premium-card p-12 md:p-16 ${statusTheme.bg} ${statusTheme.border} mb-12 text-center relative overflow-hidden`}>
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/[0.03] border border-black/[0.05] rounded-full mb-6">
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-premium-muted">Strategic Recommendation</span>
                        </div>
                        
                        <h1 className="text-7xl md:text-8xl font-black font-display tracking-tight text-premium-text mb-8">
                            {statusLabel}
                        </h1>

                        <div className="max-w-2xl mx-auto space-y-6">
                            <p className="text-2xl font-bold text-premium-text leading-tight">
                                {result.decisaoImediata || 'The council has reached a decision based on the provided context.'}
                            </p>
                            <div className="h-px w-20 bg-black/[0.1] mx-auto"></div>
                            <div className="prose prose-premium mx-auto text-premium-muted leading-relaxed italic text-lg">
                                <ReactMarkdown>{result.sinteseTecnica || 'Awaiting final synthesis...'}</ReactMarkdown>
                            </div>
                        </div>

                        <div className="mt-12 flex justify-center gap-12">
                            <div className="text-center">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-premium-muted mb-1">Decision Confidence</div>
                                <div className="text-4xl font-black font-display text-premium-text">{meanScore}%</div>
                            </div>
                            <div className="text-center">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-premium-muted mb-1">Strategic Alignment</div>
                                <div className="text-4xl font-black font-display text-premium-accent">High</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tabs */}
                <div className="flex justify-center gap-8 mb-12 border-b border-black/[0.03]">
                    {[
                        { id: 'insights', label: 'Strategic Insights' },
                        { id: 'discussion', label: 'Perspective Discussion' },
                        { id: 'alignment', label: 'Decision Logic' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-premium-text' : 'text-premium-muted hover:text-premium-text'}`}
                        >
                            {tab.label}
                            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-premium-text animate-in slide-in-from-left-full"></div>}
                        </button>
                    ))}
                </div>

                {/* Content Layers */}
                <div className="animate-in fade-in duration-700">
                    {activeTab === 'insights' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="premium-card p-10">
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-premium-muted mb-8">Critical Risks</h3>
                                <div className="space-y-6">
                                    {(result.criticalRisks || []).length > 0 ? (
                                        result.criticalRisks.map((risk: any) => (
                                            <div key={risk.id} className="thought-layer">
                                                <h4 className="font-bold text-sm mb-1">{risk.name}</h4>
                                                <p className="text-sm text-premium-muted leading-relaxed">{risk.evidence}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-premium-muted italic">No immediate blockers identified by the council.</p>
                                    )}
                                </div>
                            </div>
                            <div className="premium-card p-10">
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-premium-muted mb-8">Strategic Actions</h3>
                                <div className="space-y-6">
                                    {(result.actionPlan?.actions || []).length > 0 ? (
                                        result.actionPlan.actions.map((action: any) => (
                                            <div key={action.id} className="flex gap-4">
                                                <div className="size-5 rounded-full border border-premium-accent flex items-center justify-center shrink-0 mt-1">
                                                    <div className="size-2 bg-premium-accent rounded-full"></div>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm mb-1">{action.name}</h4>
                                                    <p className="text-[11px] text-premium-muted uppercase tracking-widest font-bold">Priority: {action.deadline}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-premium-muted italic">No mandatory actions for current stage.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'discussion' && (
                        <div className="space-y-8">
                            {perspectives.map((r: any) => {
                                const meta = getMeta(r.persona);
                                return (
                                    <div key={r.persona} className="premium-card p-10 md:p-12">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="size-12 rounded-2xl bg-premium-bg flex items-center justify-center text-xl shadow-sm border border-black/[0.03]">
                                                {meta.emoji}
                                            </div>
                                            <div>
                                                <h3 className="font-black font-display uppercase tracking-wider text-premium-text">{meta.label}</h3>
                                                <div className="text-[10px] font-bold uppercase tracking-widest text-premium-muted">Confidence Index: {r.score}%</div>
                                            </div>
                                        </div>
                                        <div className="prose prose-premium max-w-none text-premium-text/80 leading-relaxed italic text-lg text-justify">
                                            <ReactMarkdown>{r.analysis}</ReactMarkdown>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {activeTab === 'alignment' && (
                        <div className="premium-card p-12 text-center">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-premium-muted mb-12">Decision Lineage</h3>
                            <div className="max-w-2xl mx-auto space-y-12">
                                <div className="flex justify-between items-center px-12">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="size-4 bg-premium-muted/20 rounded-full"></div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-premium-muted">Thesis</span>
                                    </div>
                                    <div className="h-[2px] flex-1 bg-premium-muted/10 mx-4"></div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="size-4 bg-premium-muted/40 rounded-full"></div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-premium-muted">Antithesis</span>
                                    </div>
                                    <div className="h-[2px] flex-1 bg-premium-muted/10 mx-4"></div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="size-6 bg-premium-accent rounded-full shadow-lg shadow-premium-accent/20"></div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-premium-text">Synthesis</span>
                                    </div>
                                </div>
                                <p className="text-premium-muted italic leading-relaxed">
                                    The final synthesis represents the emergence of strategic clarity after resolving 3 rounds of adversarial challenge across specialized perspectives.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Quote */}
                <div className="mt-24 text-center">
                    <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-premium-muted/40">Generated by CouncilIA v14.0 — Strategic Intelligence Layer</p>
                </div>

            </main>

            {/* Hidden PDF Support */}
            <div className="fixed -left-[2000px] top-0 pointer-events-none">
                <PDFReportTemplate validation={validation} />
            </div>
        </div>
    );
}
