'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { type UILang, t } from '@/lib/i18n/ui-strings';
import { calculateVaR, getScientificBadge, parsePersonaResponseV3, getAllianceClusteringV3 } from '@/lib/verdict-engine';

interface PDFReportTemplateProps {
    validation: any;
    lang: UILang;
}

const PERSONAS: Record<string, { lbl: string; pt: string; em: string; c: string }> = {
    visionary: { lbl: 'Visionary', pt: 'Visionário', em: '🔮', c: '#A855F7' },
    technologist: { lbl: 'Technologist', pt: 'Tecnologista', em: '⚙️', c: '#06B6D4' },
    devil: { lbl: 'Devils Advocate', pt: 'Advogado do Diabo', em: '👿', c: '#EF4444' },
    marketeer: { lbl: 'Market Analyst', pt: 'Analista de Mercado', em: '📊', c: '#22C55E' },
    ethicist: { lbl: 'Ethics and Risk', pt: 'Ética e Risco', em: '⚖️', c: '#F59E0B' },
    financier: { lbl: 'Financial', pt: 'Financeiro', em: '💰', c: '#3B82F6' }
};

function gp(name: string, lang: UILang) {
    const key = Object.keys(PERSONAS).find(k => name.toLowerCase().includes(k));
    const p = key ? PERSONAS[key] : { lbl: name, pt: name, em: '🤖', c: '#6366F1' };
    return { ...p, dn: (lang as string) === 'Portuguese' ? p.pt : p.lbl };
}

export default function PDFReportTemplate({ validation, lang }: PDFReportTemplateProps) {
    const score = Math.round(validation.consensus_score || 0);
    const dateStr = new Date(validation.created_at).toLocaleDateString();

    const r = validation.full_result || {};
    const judgeText = r.judge || '';
    const round3 = (r.round3 || []) as any[];
    const round1 = (r.round1 || []) as any[];
    const roundToParse = round3.length > 0 ? round3 : round1;

    // v3.0 Strategic Metadata
    const personaData = roundToParse.map(node => ({
        id: node.id || node.name.toLowerCase(),
        name: node.name,
        text: node.text,
        meta: parsePersonaResponseV3(node.text)
    }));

    const devilData = personaData.find(d => d.id.includes('devil'))?.meta;
    const marketeerData = personaData.find(d => d.id.includes('marketeer'))?.meta;

    let cleanJudgeText = typeof judgeText === 'string' ? judgeText.replace(/\\n/g, '\n') : '';
    cleanJudgeText = cleanJudgeText.replace(/## 🏛️ CouncilIA.*?Verdict Final\n/i, '');
    
    // Parse sections for styling
    const sections: { id: string, title: string, content: string }[] = [];
    const emojiMap: Record<string, string> = {
        '📊': 'summary',
        '✅': 'strengths',
        '⚠️': 'risks',
        '💡': 'recommendations',
        '🎯': 'decision'
    };
    
    const parts = cleanJudgeText.split(/###\s+/);
    parts.forEach(part => {
        const lines = part.trim().split('\n');
        const firstLine = lines[0];
        for (const [emoji, id] of Object.entries(emojiMap)) {
            if (firstLine.includes(emoji)) {
                sections.push({ id, title: firstLine.trim(), content: lines.slice(1).join('\n').trim() });
                break;
            }
        }
    });

    const decision = sections.find(s => s.id === 'decision');
    const strengths = sections.find(s => s.id === 'strengths');
    const risks = sections.find(s => s.id === 'risks');
    const recommendations = sections.find(s => s.id === 'recommendations');

    const isEmbrapa = !!(r.is_embrapa || r.is_embrapa_poc || r.isEmbrapa || r.isEmbrapaPOC || validation.full_result?.is_embrapa);

    return (
        <div id="pdf-report-container" className="bg-[#050810] text-white font-sans w-[210mm] relative overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
            <style dangerouslySetInnerHTML={{
                __html: `
                #pdf-report-container { width: 794px; overflow: visible !important; }
                .pdf-page { width: 794px; min-height: 1123px; padding: 60px; position: relative; background-color: #050810; box-sizing: border-box; overflow: visible !important; page-break-after: always; border-bottom: 1px solid rgba(255,255,255,0.02); }
                .pdf-page:last-child { page-break-after: auto; border-bottom: none; }
                .mono { font-family: monospace; }
                h1, h2, h3, h4 { letter-spacing: -0.025em; font-weight: 800; }
                .glass { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; }
            `}} />

            {/* PAGE 1: Executive HUD */}
            <section className="pdf-page">
                {/* Glow Backgrounds */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full"></div>
                
                <div className="flex justify-between items-start mb-12 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">C</div>
                        <span className="font-bold text-2xl tracking-tight">CouncilIA <span className="text-cyan-400 opacity-60 text-xs align-top">V3.0</span></span>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{isEmbrapa ? t(lang, 'cr_executive_opinion') : 'Strategic Analysis Report'}</p>
                        <p className="text-[10px] mono text-cyan-500/70">ID // VAL-{validation.id.substring(0, 12).toUpperCase()}</p>
                    </div>
                </div>

                <div className="mb-12 relative z-10">
                    <h1 className="text-4xl mb-6 leading-tight max-w-[90%]">{isEmbrapa ? t(lang, 'cr_executive_summary') : 'Executive Briefing Consensus'}</h1>
                    <div className="p-6 glass italic text-slate-400 text-sm leading-relaxed border-l-2 border-cyan-500/50">
                        &quot;{validation.idea.substring(0, 300)}{validation.idea.length > 300 ? '...' : ''}&quot;
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-12 relative z-10">
                    <div className="p-8 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 font-mono">Consensus Score</p>
                        <div className="relative flex items-center justify-center">
                            <div className="text-7xl font-black">{score}</div>
                            <div className="absolute -inset-8 bg-cyan-400/10 blur-xl rounded-full"></div>
                        </div>
                        <div className="flex gap-2 mt-4 mb-6">
                             <div className={`size-2.5 rounded-full ${score >= 70 ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-white/10'}`}></div>
                             <div className={`size-2.5 rounded-full ${score >= 40 && score < 70 ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'bg-white/10'}`}></div>
                             <div className={`size-2.5 rounded-full ${score < 40 ? 'bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]' : 'bg-white/10'}`}></div>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 font-mono">STATUS: {score >= 70 ? 'VIABLE' : score >= 40 ? 'CAUTION' : 'HIGH RISK'}</p>
                    </div>

                    <div className="p-8 glass flex flex-col justify-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8 text-center font-mono">Diagnostics</p>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-[10px] font-black mb-2 tracking-widest font-mono">
                                    <span className="text-slate-400">MISSION CONFIDENCE</span>
                                    <span className="text-cyan-400">{score}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-cyan-500" style={{ width: `${score}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] font-black mb-2 tracking-widest font-mono">
                                    <span className="text-slate-400">VALUE AT RISK (VaR)</span>
                                    <span className="text-red-500">{calculateVaR(score)}</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500" style={{ width: `${100 - score}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Strategic Overlays (New v3.0) */}
                <div className="grid grid-cols-2 gap-6 mb-12 relative z-10">
                    {devilData && (
                        <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20">
                            <div className="flex items-center gap-2 text-red-400 mb-3">
                                <span className="text-[10px] font-black uppercase tracking-widest">Antifragile Vaccine</span>
                            </div>
                            <p className="text-xs text-red-100 italic font-medium">&quot;{devilData.vaccine || 'N/A'}&quot;</p>
                            <p className="mt-4 py-2 px-3 bg-black/40 rounded border border-red-500/20 text-[9px] font-mono text-red-300 flex items-center gap-2">
                                <span className="opacity-50">▲</span> CIRCUIT BREAKER: {devilData.circuitBreaker || 'ROI < 1x'}
                            </p>
                        </div>
                    )}
                    {marketeerData && (
                        <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
                            <div className="flex items-center gap-2 text-indigo-400 mb-3">
                                <span className="text-[10px] font-black uppercase tracking-widest">Champion Profile</span>
                            </div>
                            <p className="text-xs text-indigo-100 font-bold mb-1">{marketeerData.championProfile || 'N/A'}</p>
                            <div className="grid grid-cols-2 gap-2 mt-4 text-[9px] font-mono">
                                <div className="p-2 bg-black/40 rounded border border-indigo-500/10">
                                    <span className="opacity-50 block mb-1">PROCUR. LANE</span>
                                    <span className="text-indigo-200">{marketeerData.procurementLane || 'Standard'}</span>
                                </div>
                                <div className="p-2 bg-black/40 rounded border border-indigo-500/10">
                                    <span className="opacity-50 block mb-1">METRIC OWNED</span>
                                    <span className="text-indigo-200">{marketeerData.metricOwned || 'LTV/CAC'}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6 relative z-10">
                    {decision && (
                        <div className={`p-8 border-2 rounded-[24px] relative overflow-hidden shadow-xl ${decision.content.toLowerCase().match(/avançar|proceder|avancer|fortfahren|avanzar|strong go/)
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100'
                            : decision.content.toLowerCase().match(/não|ne pas|nicht|no proceder|do not/)
                                ? 'bg-red-500/10 border-red-500/30 text-red-100'
                                : 'bg-amber-500/10 border-amber-500/30 text-amber-100'
                            }`}>
                            
                            {isEmbrapa && (
                                <div className="absolute top-0 right-0 px-6 py-2 font-black text-[12px] uppercase tracking-[0.3em] opacity-60 bg-white/10 rounded-bl-2xl">
                                    {decision.content.toLowerCase().match(/avançar|proceder|avancer|fortfahren|avanzar|strong go/)
                                        ? t(lang, 'cr_status_go')
                                        : decision.content.toLowerCase().match(/não|ne pas|nicht|no proceder|do not/)
                                            ? t(lang, 'cr_status_stop')
                                            : t(lang, 'cr_status_caution')
                                    }
                                </div>
                            )}

                            <div className="absolute top-0 left-0 p-4 opacity-10 font-black text-6xl tracking-tighter uppercase whitespace-nowrap">
                                {isEmbrapa ? 'PARECER' : 'DECISION'}
                            </div>
                            
                            <h3 className={`text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 ${decision.content.toLowerCase().match(/avançar|proceder|avancer|fortfahren|avanzar|strong go/)
                                ? 'text-emerald-400'
                                : decision.content.toLowerCase().match(/não|ne pas|nicht|no proceder|do not/)
                                    ? 'text-red-400'
                                    : 'text-amber-400'
                                }`}>
                                🎯 {isEmbrapa ? t(lang, 'cr_executive_opinion').toUpperCase() : 'STRATEGIC RECOMMENDATION'}
                            </h3>
                            <div className="text-xl font-bold leading-relaxed relative z-10">
                                <ReactMarkdown>{decision.content}</ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>

                {isEmbrapa && (
                    <div className="mt-8 p-6 glass border-blue-500/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-2xl rounded-full"></div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-4 flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                            GLOSSÁRIO TÉCNICO & HINTS (AUDITORIA v5.0)
                        </h4>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-[9px] text-slate-400 leading-tight relative z-10">
                            <div><strong className="text-slate-200 uppercase tracking-tighter mr-1">RDC 166/2017:</strong> Resolução da ANVISA sobre a validação de métodos analíticos para insumos farmacêuticos e medicamentos.</div>
                            <div><strong className="text-slate-200 uppercase tracking-tighter mr-1">ISO/IEC 17025:</strong> Padrão internacional para laboratórios de calibração e ensaio, essencial para exportação.</div>
                            <div><strong className="text-slate-200 uppercase tracking-tighter mr-1">TRL (Technology Readiness Level):</strong> Escala de maturação tecnológica (1-9). Foco em TRL 4-6 para projetos piloto.</div>
                            <div><strong className="text-slate-200 uppercase tracking-tighter mr-1">COST BRASIL:</strong> Conjunto de dificuldades estruturais, burocráticas e logísticas que tornam o investimento caro.</div>
                            <div><strong className="text-slate-200 uppercase tracking-tighter mr-1">HIERARCHY OF TRUTH:</strong> Protocolo Embrapa v5.0 de priorização de evidências regulatórias sobre opiniões empíricas.</div>
                            <div><strong className="text-slate-200 uppercase tracking-tighter mr-1">MAPA/ANVISA:</strong> Órgãos anuentes fundamentais para a liberação comercial de novos bioprodutos no Brasil.</div>
                        </div>
                    </div>
                )}

                <div className="absolute bottom-10 left-[60px] right-[60px] flex justify-between pt-6 border-t border-white/5 opacity-50 relative z-10">
                    <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Engine // EMBER-ACE 5.0 // Embrapa Scientific Synthesis</p>
                    <p className="text-[10px] text-slate-500 font-bold flex items-center gap-2">
                        <span className="size-1 rounded-full bg-cyan-500 animate-pulse"></span>
                        PAGE 01 // EXECUTIVE ONLY
                    </p>
                </div>
            </section>

            {/* PAGE 2: Methodology & Detailed Plan */}
            <section className="pdf-page">
                <div className="mb-12 relative z-10">
                    <h2 className="text-2xl mb-10 flex items-center gap-4">
                        <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
                        Scientific Scrutiny Framework
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-4 mb-12">
                         {[1, 2, 3, 4, 5].map(num => {
                             const key = num === 1 ? 'pill_precision' : num === 2 ? 'pill_alignment' : num === 3 ? 'pill_strategy' : num === 4 ? 'pill_protocol' : 'pill_interface';
                             const colorClass = num === 1 ? 'text-indigo-400 border-indigo-500/20' : num === 2 ? 'text-purple-400 border-purple-500/20' : num === 3 ? 'text-emerald-400 border-emerald-500/20' : num === 4 ? 'text-amber-400 border-amber-500/20' : 'text-pink-400 border-pink-500/20';
                             return (
                                <div key={num} className={`p-5 glass border ${colorClass} flex flex-col gap-2`}>
                                    <div className="flex justify-between items-start opacity-70">
                                        <p className="text-[10px] font-black uppercase tracking-widest">{t(lang, key)}</p>
                                        <span className="text-[8px] mono">PILL // 0{num}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                                        <ReactMarkdown>{t(lang, key + '_desc')}</ReactMarkdown>
                                    </p>
                                </div>
                             );
                         })}
                    </div>

                    {recommendations && (
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="size-6 bg-cyan-500/20 rounded flex items-center justify-center text-cyan-400 text-sm">💡</span>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Execution Roadmap Protocol</h3>
                            </div>
                            <div className="bg-white/[0.02] p-8 rounded-2xl text-[11px] leading-relaxed text-slate-300 border border-white/5 prose prose-invert max-w-none prose-sm">
                                <ReactMarkdown>{recommendations.content}</ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>


                <div className="absolute bottom-10 left-[60px] right-[60px] flex justify-between pt-6 border-t border-white/5 opacity-50 relative z-10">
                    <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Verified Adversarial Alignment Mechanism</p>
                    <p className="text-[10px] text-slate-500 font-bold flex items-center gap-2">
                         <span className="size-1 rounded-full bg-slate-700"></span>
                         PAGE 02
                    </p>
                </div>
            </section>
        </div>
    );
}
