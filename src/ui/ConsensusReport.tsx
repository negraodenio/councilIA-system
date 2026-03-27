'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { t, resolveUILang, type UILang } from '@/lib/i18n/ui-strings';
import PDFReportTemplate from './PDFReportTemplate';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ReactDiffViewer from 'react-diff-viewer-continued';
import Link from 'next/link';

// ─── UTILS: Extract Code Patches ────────────────
function extractPatches(roundsTextData: string[]) {
    const patches: { oldCode: string, newCode: string }[] = [];
    const regex = /<OLD_CODE>([\s\S]*?)<\/OLD_CODE>\s*<NEW_CODE>([\s\S]*?)<\/NEW_CODE>/g;

    roundsTextData.forEach(text => {
        if (!text) return;
        let match;
        while ((match = regex.exec(text)) !== null) {
            patches.push({
                oldCode: match[1].trim(),
                newCode: match[2].trim()
            });
        }
    });
    return patches;
}

// ─── V2 Persona config ────────────────────────
const PERSONA_META: Record<string, { color: string; gradient: string; emoji: string }> = {
    visionary: { color: '#A855F7', gradient: 'from-purple-500/20 to-purple-900/10', emoji: '🔮' },
    technologist: { color: '#06B6D4', gradient: 'from-cyan-500/20 to-cyan-900/10', emoji: '⚙️' },
    devil: { color: '#EF4444', gradient: 'from-red-500/20 to-red-900/10', emoji: '😈' },
    marketeer: { color: '#22C55E', gradient: 'from-emerald-500/20 to-emerald-900/10', emoji: '📊' },
    ethicist: { color: '#F59E0B', gradient: 'from-amber-500/20 to-amber-900/10', emoji: '⚖️' },
    financier: { color: '#3B82F6', gradient: 'from-blue-500/20 to-blue-900/10', emoji: '💰' },
};

function getMeta(id: string) {
    return PERSONA_META[id] || { color: '#94a3b8', gradient: 'from-slate-500/20 to-slate-900/10', emoji: '🤖' };
}

export default function ConsensusReport({ validation, patches }: {
    validation: any;
    patches: any[];
}) {
    const [activeTab, setActiveTab] = useState<'verdict' | 'round1' | 'round2' | 'round3' | 'patches'>('verdict');
    const [isExporting, setIsExporting] = useState(false);
    
    // v7.3.1 Universal Mapping
    const result = validation.full_result || validation || {};
    const ev = result.executiveVerdict || {};
    const ca = result.consensusAnalysis || {};
    const lang: UILang = resolveUILang(result.metadata?.lang || 'pt');

    const isEmbrapa = !!(result.is_embrapa || result.domain === 'agro');

    const meanScore = Math.round(ev.score || 0);
    const realConsensus = ca.strengthPercentage || meanScore;
    const realDissent = ca.dissentRange || (100 - realConsensus);
    const varValue = ev.var?.percentage || 0;
    const varDisplay = `${varValue}%`;
    const isValidOutput = result.is_valid !== false && ev.verdict !== 'NO-GO' && result.metadata?.protocolVersion === '7.3.1';

    const allTranscriptTexts = [
        ...(result.fullTranscript?.round1?.responses?.map((r: any) => r.text) || []),
        ...(result.fullTranscript?.round2?.responses?.map((r: any) => r.text) || []),
        ...(result.fullTranscript?.round3?.responses?.map((r: any) => r.text) || []),
        result.judgeRationale || ''
    ];
    const generatedPatches = extractPatches(allTranscriptTexts);

    const validTab = (activeTab === 'patches' && generatedPatches.length === 0) ? 'verdict' : activeTab;
    const blockDashboard = !isValidOutput || (meanScore === 50 && realConsensus === 80);

    const statusLabel = ev.verdict || (meanScore >= 70 ? 'GO' : meanScore >= 40 ? 'CONDITIONAL' : 'NO-GO');
    const statusBg = meanScore >= 70
        ? 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30'
        : meanScore >= 40
            ? 'bg-amber-400/10 text-amber-300 border-amber-400/30'
            : 'bg-red-400/10 text-red-300 border-red-400/30';
    const statusDot = meanScore >= 70 ? 'bg-emerald-400' : meanScore >= 40 ? 'bg-amber-400' : 'bg-red-400';

    const ringColor = meanScore >= 70 ? '#22c55e' : meanScore >= 40 ? '#f59e0b' : '#ef4444';

    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            const container = document.getElementById('pdf-report-container');
            if (!container) { setIsExporting(false); return; }
            container.style.cssText = 'display:block;position:fixed;top:0;left:-900px;width:794px;z-index:-1;pointer-events:none;opacity:1;';
            await new Promise(r => setTimeout(r, 500));
            const pages = container.querySelectorAll('.pdf-page');
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            for (let i = 0; i < pages.length; i++) {
                const pageEl = pages[i] as HTMLElement;
                const canvas = await html2canvas(pageEl, { scale: 2, useCORS: true, logging: false, backgroundColor: '#050810', width: 794 });
                const imgData = canvas.toDataURL('image/png');
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidthInMm = pdf.internal.pageSize.getWidth();
                const imgHeightInMm = (imgProps.height * pdfWidthInMm) / imgProps.width;
                if (i > 0) pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidthInMm, imgHeightInMm);
            }
            container.style.cssText = 'display:none';
            pdf.save(`CouncilIA_Report_${(result.metadata?.sessionId?.substring(0,8) || 'EXPORT').toUpperCase()}.pdf`);
        } catch (error) {
            console.error('PDF Export Error:', error);
            alert('Failed to generate PDF.');
        } finally { setIsExporting(false); }
    };

    return (
        <div className="bg-deep-blue text-slate-50 min-h-screen relative overflow-x-hidden font-body" suppressHydrationWarning>
            <div className="absolute inset-0 tech-grid pointer-events-none opacity-20 z-0"></div>

            <header className="sticky top-0 z-50 bg-panel-blue/90 glass-blur border-b border-white/5 h-16 flex items-center justify-between px-4 lg:px-8">
                <a className="flex items-center gap-2 text-slate-400 hover:text-neon-cyan transition-colors group" href="/dashboard">
                    <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">chevron_left</span>
                    <span className="font-display text-xs tracking-wider uppercase">Dashboard</span>
                </a>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end border-r border-white/10 pr-4">
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Protocol</span>
                        <span className="text-[10px] font-mono text-neon-cyan/70">v7.3.1</span>
                    </div>
                    <button
                        onClick={() => {
                            if (blockDashboard) { alert('Report Locked: Validation Failed'); return; }
                            navigator.clipboard.writeText(JSON.stringify(validation, null, 2));
                            alert('JSON Copied!');
                        }}
                        disabled={blockDashboard}
                        className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 text-xs font-bold uppercase transition-colors disabled:opacity-30"
                    >
                        Copy JSON
                    </button>
                    <button
                        onClick={handleExportPDF}
                        disabled={isExporting || blockDashboard}
                        className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 text-xs font-bold uppercase transition-colors disabled:opacity-30"
                    >
                        Export PDF
                    </button>
                </div>
            </header>

            <main className="relative z-10 w-full max-w-screen-2xl mx-auto p-4 lg:p-6 flex flex-col gap-6">

                {/* 🚨 v7.3.1 SYSTEM STATUS BANNER */}
                {blockDashboard && (
                    <div className="bg-red-500/10 border-2 border-red-500/50 p-12 rounded-2xl flex flex-col items-center gap-6 text-center shadow-[0_0_50px_rgba(239,68,68,0.2)]">
                        <span className="material-symbols-outlined text-7xl text-red-500">gavel</span>
                        <div className="max-w-2xl">
                            <h2 className="text-3xl font-black text-red-400 mb-2 uppercase tracking-tighter">Report Invalid: Meta-Validation Failed</h2>
                            <p className="text-slate-300 leading-relaxed mb-8">
                                This report failed the CouncilIA v7.3.1 Truth-First consistency check. 
                                The delibereation indicates logical contradictions or a lack of verifiable evidence.
                                <br/><br/>
                                <strong className="text-red-400 uppercase tracking-widest bg-red-500/10 px-4 py-2 rounded">Action: Do not use for high-stakes decision making.</strong>
                            </p>
                            <div className="flex gap-4 justify-center">
                                <div className="px-6 py-3 bg-red-500/20 rounded-xl text-xs font-mono border border-red-500/30 uppercase font-black">Status: Blocked</div>
                                <div className="px-6 py-3 bg-white/5 rounded-xl text-xs font-mono border border-white/10 uppercase font-black">Code: ERR_V731_LOGIC_FAIL</div>
                            </div>
                        </div>
                    </div>
                )}

                {!blockDashboard && (
                    <>
                        {/* 🏆 EXECUTIVE HERO */}
                        <div className={`p-8 md:p-12 rounded-[32px] border-l-8 shadow-2xl relative overflow-hidden ${statusBg}`}>
                            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                <div className="max-w-3xl">
                                     <div className="flex items-center gap-3 mb-4">
                                        <div className={`size-3 rounded-full animate-pulse ${statusDot}`} />
                                        <span className="text-xs font-black uppercase tracking-[0.4em] opacity-80">Institutional Verdict</span>
                                    </div>
                                    <h1 className="text-5xl md:text-6xl font-display font-black tracking-tighter text-white mb-6 uppercase">
                                        {statusLabel}
                                    </h1>
                                    <p className="text-lg md:text-xl text-slate-200 font-medium leading-relaxed italic text-justify">
                                        "{ev.var?.interpretation || 'Technical alignment suggests a balanced decision path with manageable residual risk.'}"
                                    </p>
                                </div>
                                <div className="shrink-0">
                                     <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/20 flex flex-col items-center">
                                         <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Audit Score</span>
                                         <span className="text-4xl font-black text-white">{meanScore}<span className="text-lg text-slate-500">/100</span></span>
                                     </div>
                                </div>
                            </div>
                        </div>

                        {/* 📊 TRUTH-FIRST METRICS GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Consensus Strength */}
                            <div className="bg-black/40 border border-white/5 p-8 rounded-2xl flex flex-col items-center text-center">
                                <div className="relative size-32 mb-4">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                        <circle
                                            cx="50" cy="50" r="42"
                                            fill="none"
                                            stroke={ringColor}
                                            strokeDasharray={2 * Math.PI * 42}
                                            strokeDashoffset={2 * Math.PI * 42 * (1 - realConsensus / 100)}
                                            strokeLinecap="round"
                                            strokeWidth="8"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-black text-white">{realConsensus}%</span>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Consensus Strength ({ca.strengthLabel})</span>
                                <p className="text-[9px] text-slate-400 italic">"{ca.interpretation}"</p>
                            </div>

                            {/* Risk Exposure (VaR) */}
                            <div className="bg-black/40 border border-white/5 p-8 rounded-2xl flex flex-col justify-center">
                                <div className="mb-6">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">Value at Risk (VaR)</span>
                                        <span className="text-sm font-bold text-red-400 font-mono">{varDisplay}</span>
                                    </div>
                                    <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-400" style={{ width: `${varValue}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">Dissent Range</span>
                                        <span className="text-sm font-bold text-orange-400 font-mono">{realDissent}pts</span>
                                    </div>
                                    <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                                        <div className="h-full bg-orange-400" style={{ width: `${realDissent}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Kill Conditions */}
                            <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-2xl">
                                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-4">Showstoppers (Kill Conditions)</span>
                                <div className="space-y-3">
                                    {result.decisionRule?.proceedOnlyIf?.map((rule: string, i: number) => (
                                        <div key={i} className="flex items-start gap-3 p-2 bg-red-500/10 border border-red-500/10 rounded-lg">
                                            <span className="text-red-400 text-xs mt-0.5">🛑</span>
                                            <span className="text-[10px] text-red-100 font-bold uppercase tracking-tighter italic">NEEDS: {rule}</span>
                                        </div>
                                    ))}
                                    {(!result.decisionRule?.proceedOnlyIf || result.decisionRule.proceedOnlyIf.length === 0) && (
                                        <div className="flex items-center gap-2 p-3 bg-emerald-500/5 text-emerald-400 rounded-lg text-[10px] font-bold">
                                            <span>✅ NO ABSOLUTE BLOCKERS DETECTED</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 🛑 CRITICAL RISKS */}
                        <div className="mt-8">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">report_problem</span>
                                Technical Risks & Mitigations
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {(result.criticalRisks || []).map((risk: any) => (
                                    <div key={risk.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col gap-4">
                                        <div className="flex justify-between items-start">
                                            <span className="text-[9px] font-mono text-neon-cyan/50">RISK #{risk.id}</span>
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold ${risk.status === 'OPEN' ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'}`}>{risk.status}</span>
                                        </div>
                                        <h4 className="text-sm font-bold text-white">{risk.name}</h4>
                                        <p className="text-[10px] text-slate-400 italic font-mono uppercase tracking-tighter">Violates: {risk.violates}</p>
                                        <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                                            <p className="text-[10px] text-slate-100 leading-relaxed italic">"{risk.evidence}"</p>
                                        </div>
                                        <div className="bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20">
                                            <p className="text-[9px] text-indigo-300 uppercase font-black mb-1">MITIGATION</p>
                                            <p className="text-[10px] text-white font-bold">{risk.mitigation}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 📈 SMART ACTION PLAN */}
                        <div className="mt-8">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">account_tree</span>
                                Institutional Roadmap (SMART)
                            </h3>
                            <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                                <table className="w-full text-[11px] text-left border-collapse">
                                    <thead className="bg-white/5 border-b border-white/10 text-slate-500 uppercase text-[9px] font-black">
                                        <tr>
                                            <th className="px-6 py-4">Action Item</th>
                                            <th className="px-6 py-4">Owner</th>
                                            <th className="px-6 py-4">ISO Deadline</th>
                                            <th className="px-6 py-4">Success Criterion</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {(result.actionPlan?.actions || []).map((action: any) => (
                                            <tr key={action.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-4 font-bold text-slate-200 group-hover:text-neon-cyan">{action.name}</td>
                                                <td className="px-6 py-4 text-neon-cyan/70 font-mono font-black">{action.owner}</td>
                                                <td className="px-6 py-4 text-slate-400 italic">{action.deadline}</td>
                                                <td className="px-6 py-4 border-l border-white/5">
                                                    <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono text-[9px] font-black">
                                                        {action.successCriterion}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 🔍 EVIDENCE AUDIT TRAIL */}
                        <div className="mt-12 opacity-80 hover:opacity-100 transition-opacity">
                            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-4">Regulatory Evidence Audit Trail</h3>
                            <div className="space-y-4">
                                {(result.evidenceAudit?.highConfidence || []).map((item: any, i: number) => (
                                    <div key={i} className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-indigo-400 text-sm">verified</span>
                                            <span className="text-[10px] font-mono text-indigo-400 font-black">{item.source}</span>
                                        </div>
                                        <p className="text-xs text-slate-300 italic">"{item.supports}"</p>
                                    </div>
                                ))}
                                {(result.evidenceAudit?.unsupported || []).map((item: any, i: number) => (
                                    <div key={i} className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl flex flex-col gap-1">
                                         <div className="flex items-center gap-2 text-red-400">
                                            <span className="material-symbols-outlined text-sm">warning</span>
                                            <span className="text-[10px] font-mono font-black">FLAG: {item.flag}</span>
                                        </div>
                                        <p className="text-xs text-red-200"><strong>Claim:</strong> {item.claim}</p>
                                        <p className="text-[10px] text-red-400/80 italic">{item.issue}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Tabbed Deliberation View (Universal Protocol) */}
                {!blockDashboard && (
                    <div className="mt-12 bg-black/20 border border-white/5 rounded-2xl overflow-hidden">
                        <div className="flex border-b border-white/5 bg-white/5">
                            {['verdict', 'round1', 'round2', 'round3'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`px-8 py-4 text-[10px] font-mono font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-neon-cyan/10 text-neon-cyan border-b-2 border-neon-cyan' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    {tab === 'verdict' ? 'Rationale' : `Round ${tab.slice(-1)}`}
                                </button>
                            ))}
                        </div>
                        <div className="p-8">
                            {activeTab === 'verdict' && (
                                <div className="prose prose-invert max-w-none prose-sm prose-p:text-slate-300 italic text-justify">
                                    <ReactMarkdown>{result.judgeRationale || 'Scientific deliberation summary pending...'}</ReactMarkdown>
                                </div>
                            )}
                            {activeTab !== 'verdict' && result.fullTranscript?.[activeTab] && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {(result.fullTranscript?.[activeTab]?.responses || []).map((r: any) => (
                                        <PersonaCard key={r.persona} entry={{ id: r.persona.toLowerCase(), name: r.persona, text: r.analysis }} lang={lang} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
            
            {/* Action Footer */}
             <div className="fixed bottom-0 left-0 right-0 p-4 bg-deep-blue/80 glass-blur border-t border-white/5 z-40 flex justify-center gap-4">
                <button onClick={handleExportPDF} disabled={blockDashboard} className="px-6 h-10 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 shadow-xl transition-all disabled:opacity-30">
                    <span className="material-symbols-outlined text-sm">download</span>
                    Download Executive Report
                </button>
                <Link href="/dashboard" className="px-6 h-10 bg-white/5 border border-white/10 text-slate-300 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 transition-all">
                    <span className="material-symbols-outlined text-sm">add_circle</span>
                    New Session
                </Link>
            </div>
            
            {/* Hidden PDF Container */}
            <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
                <PDFReportTemplate validation={validation} lang={lang} />
            </div>
        </div>
    );
}

// ─── Persona Card ──────────────────────────────
function PersonaCard({ entry, lang }: {
    entry: { id: string; name: string; emoji?: string; text: string };
    lang: UILang;
}) {
    const [expanded, setExpanded] = useState(false);
    const meta = getMeta(entry.id);
    const emoji = entry.emoji || meta.emoji;
    const isLong = entry.text?.length > 400;
    const displayText = isLong && !expanded ? entry.text.slice(0, 400) + '...' : entry.text;

    return (
        <div className={`bg-gradient-to-br ${meta.gradient} border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all`}>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                <div className="size-8 rounded-lg bg-black/40 flex items-center justify-center text-sm border border-white/10" style={{ color: meta.color }}>{emoji}</div>
                <span className="font-bold text-xs uppercase tracking-widest" style={{ color: meta.color }}>{entry.name}</span>
            </div>
            <div className="p-4">
                <div className="prose prose-invert prose-xs text-[11px] text-slate-300 leading-relaxed text-justify opacity-80">
                    <ReactMarkdown>{displayText}</ReactMarkdown>
                </div>
                {isLong && (
                    <button onClick={() => setExpanded(!expanded)} className="mt-2 text-[9px] font-black uppercase tracking-widest text-neon-cyan hover:underline">
                        {expanded ? 'Show Less' : 'Read Full Analysis'}
                    </button>
                )}
            </div>
        </div>
    );
}
