'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ReactMarkdown from 'react-markdown';

type UILang = 'pt' | 'en' | 'es';
function resolveUILang(locale: string): UILang {
    // Force English for the US Market
    return 'en';
}

const L: Record<string, Record<UILang, string>> = {
    title: { pt: 'Camara de Debate ao Vivo', en: 'Live Debate Chamber', es: 'Camara de Debate en Vivo' },
    connecting: { pt: 'A conectar ao conselho...', en: 'Connecting to council...', es: 'Conectando al consejo...' },
    waiting: { pt: 'A aguardar especialistas...', en: 'Waiting for experts...', es: 'Esperando expertos...' },
    round1: { pt: 'Ronda 1 - Analise Inicial', en: 'Round 1 - Initial Analysis', es: 'Ronda 1 - Analisis Inicial' },
    round2: { pt: 'Ronda 2 - Debate Cruzado', en: 'Round 2 - Cross-Debate', es: 'Ronda 2 - Debate Cruzado' },
    round3: { pt: 'Ronda 3 - Convergencia', en: 'Round 3 - Convergence', es: 'Ronda 3 - Convergencia' },
    verdict: { pt: 'Veredicto do Juiz', en: 'Judge Verdict', es: 'Veredicto del Juez' },
    complete: { pt: 'Sessao Completa', en: 'Session Complete', es: 'Sesion Completa' },
    consensus: { pt: 'Consenso Global', en: 'Global Consensus', es: 'Consenso Global' },
    transcript: { pt: 'Transcricao ao Vivo', en: 'Live Transcript', es: 'Transcripcion en Vivo' },
    msgs: { pt: 'mensagens', en: 'messages', es: 'mensajes' },
    speaking: { pt: 'a falar...', en: 'speaking...', es: 'hablando...' },
    interject: { pt: 'Intervir', en: 'Interject', es: 'Intervenir' },
    placeholder: { pt: 'A sua contribuicao...', en: 'Your input...', es: 'Tu aporte...' },
    redirect: { pt: 'A redirecionar para o relatorio...', en: 'Redirecting to report...', es: 'Redirigiendo al informe...' },
};
function t(lang: UILang, key: string): string {
    return L[key]?.[lang] || L[key]?.en || key;
}

const PERSONAS: Record<string, { lbl: string; pt: string; em: string; c: string }> = {
    visionary: { lbl: 'Visionary', pt: 'Visionario', em: '\u{1F52E}', c: '#A855F7' },
    technologist: { lbl: 'Technologist', pt: 'Tecnologista', em: '\u2699\uFE0F', c: '#06B6D4' },
    devil: { lbl: 'Devils Advocate', pt: 'Advogado do Diabo', em: '\u{1F608}', c: '#EF4444' },
    marketeer: { lbl: 'Market Analyst', pt: 'Analista de Mercado', em: '\u{1F4CA}', c: '#22C55E' },
    ethicist: { lbl: 'Ethics and Risk', pt: 'Etica e Risco', em: '\u2696\uFE0F', c: '#F59E0B' },
    financier: { lbl: 'Financial', pt: 'Financeiro', em: '\u{1F4B0}', c: '#3B82F6' },
    judge: { lbl: 'Judge', pt: 'Juiz', em: '\u{1F3DB}\uFE0F', c: '#FFD700' },
};

function gp(name: string, lang: UILang) {
    const n = name.toLowerCase();
    // Embrapa Specialized Mappings
    if (n.includes('inovação') || n.includes('visionary')) return { ...PERSONAS.visionary, dn: name };
    if (n.includes('cientista') || n.includes('technologist')) return { ...PERSONAS.technologist, dn: name };
    if (n.includes('auditor') || n.includes('devil')) return { ...PERSONAS.devil, dn: name };
    if (n.includes('transferência') || n.includes('market')) return { ...PERSONAS.marketeer, dn: name };
    if (n.includes('regulatório') || n.includes('ethics')) return { ...PERSONAS.ethicist, dn: name };
    if (n.includes('fomento') || n.includes('financial')) return { ...PERSONAS.financier, dn: name };
    if (n.includes('especializado') || n.includes('judge')) return { ...PERSONAS.judge, dn: name };

    const key = Object.keys(PERSONAS).find(k => n.includes(k));
    const p = key ? PERSONAS[key] : { lbl: name, pt: name, em: '\u{1F916}', c: '#6366F1' };
    return { ...p, dn: lang === 'pt' ? p.pt : p.lbl };
}

const HEX = [
    { left: '50%', top: '15%' }, // Top
    { left: '85%', top: '30%' }, // Top Right
    { left: '85%', top: '70%' }, // Bottom Right
    { left: '50%', top: '85%' }, // Bottom
    { left: '15%', top: '70%' }, // Bottom Left
    { left: '15%', top: '30%' }, // Top Left
];

const ORBIT_POSITION = { left: '50%', top: '50%' };

interface Msg {
    id: string;
    expert_name: string;
    content: string;
    round: number;
    created_at: string;
    is_judge: boolean;
}

export default function DebateChamber({ runId }: { runId: string }) {
    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<Msg[]>([]);
    const [experts, setExperts] = useState<string[]>([]);
    const [speaking, setSpeaking] = useState('');
    const [phase, setPhase] = useState('');
    const [done, setDone] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [interjection, setInterjection] = useState('');
    const [sending, setSending] = useState(false);
    const [consensus, setConsensus] = useState(0);
    const [lang] = useState<UILang>(() =>
        resolveUILang(typeof navigator !== 'undefined' ? navigator.language : 'en')
    );

    useEffect(() => {
        if (done) return;
        const iv = setInterval(() => setElapsed(e => e + 1), 1000);
        return () => clearInterval(iv);
    }, [done]);

    const fmt = (s: number) => {
        const mm = String(Math.floor(s / 60)).padStart(2, '0');
        const ss = String(s % 60).padStart(2, '0');
        return mm + ':' + ss;
    };

    useEffect(() => {
        const supabase = createClient();
        let on = true;

        async function poll() {
            while (on) {
                const { data: events } = await supabase
                    .from('debate_events')
                    .select('*')
                    .eq('run_id', runId)
                    .order('ts', { ascending: true });

                if (events && events.length > 0 && on) {
                    const parsed: Msg[] = events
                        .filter(e => e.event_type === 'model_msg' || e.event_type === 'judge_note')
                        .map(e => {
                            const p = (e.payload || {}) as Record<string, unknown>;
                            return {
                                id: e.id,
                                expert_name: (e.model as string) || (p.persona as string) || 'system',
                                content: (p.text as string) || '',
                                round: (p.round as number) || 1,
                                created_at: (e.ts as string) || new Date().toISOString(),
                                is_judge: e.event_type === 'judge_note',
                            };
                        });

                    setMessages(parsed);

                    const names = Array.from(
                        new Set(parsed.filter(m => !m.is_judge && m.expert_name.toLowerCase() !== 'founder').map(m => m.expert_name))
                    );
                    setExperts(names);

                    const last = parsed[parsed.length - 1];
                    if (last) {
                        setSpeaking(last.expert_name);
                        if (last.is_judge) setPhase(t(lang, 'verdict'));
                        else if (last.round === 1) setPhase(t(lang, 'round1'));
                        else if (last.round === 2) setPhase(t(lang, 'round2'));
                        else if (last.round === 3) setPhase(t(lang, 'round3'));
                    }

                    const ce = events.filter(e => e.event_type === 'consensus');
                    if (ce.length > 0) {
                        const cp = (ce[ce.length - 1].payload || {}) as Record<string, unknown>;
                        setConsensus(Math.round((cp.global as number) || (cp.consensus_score as number) || 0));
                    } else {
                        setConsensus(Math.min(95, parsed.length * 4));
                    }

                    const comp = events.find(e => e.event_type === 'complete');
                    if (comp && on) {
                        const cp = (comp.payload || {}) as Record<string, unknown>;
                        setDone(true);
                        if (cp.consensus_score) setConsensus(Math.round(cp.consensus_score as number));
                        const vid = (cp.validationId || cp.validationId || cp.validation_id) as string; if (vid) {
                            setTimeout(() => router.push('/report/' + vid), 3000);
                        }
                        break;
                    }
                }

                const { data: run } = await supabase
                    .from('debate_runs')
                    .select('status, validation_id')
                    .eq('id', runId)
                    .single();

                if (run && run.status === 'complete' && on) {
                    setDone(true);
                    if (run.validation_id) {
                        setTimeout(() => router.push('/report/' + run.validation_id), 3000);
                    }
                    break;
                }

                if (on) await new Promise(r => setTimeout(r, 2000));
            }
        }

        poll();
        return () => { on = false; };
    }, [runId, router, lang]);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages]);

    async function sendInterject() {
        if (!interjection.trim()) return;
        setSending(true);
        try {
            await fetch('/api/session/interject', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ runId, message: interjection }),
            });
            setInterjection('');
        } finally {
            setSending(false);
        }
    }

    return (
        <div className="bg-[#0a0f1e] min-h-screen flex flex-col text-white" suppressHydrationWarning>
            <header className="sticky top-0 z-50 bg-[#0a0f1e]/90 backdrop-blur-md border-b border-white/5 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3"><a href="/dashboard" className="text-white/40 hover:text-white text-xs mr-2">&larr;</a>
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
                        <a href="/dashboard" className="text-lg font-black">C</a>
                    </div>
                    <div>
                        <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                            {t(lang, 'title')}
                        </h1>
                        <h2 className="text-sm font-bold text-white/90">
                            {phase || t(lang, 'connecting')}
                        </h2>
                    </div>
                </div>
                {!done ? (
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-red-400 text-xs font-mono font-bold">LIVE</span>
                        <span className="text-white/50 text-xs font-mono">{fmt(elapsed)}</span>
                    </div>
                ) : (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold">
                        {t(lang, 'complete')}
                    </div>
                )}
            </header>

            <main className="flex-1 flex flex-col">
                <div className="relative mx-auto w-full max-w-sm aspect-square flex items-center justify-center my-4">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        <div className="relative w-20 h-20">
                            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                <circle cx={50} cy={50} r={42} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={5} />
                                <circle
                                    cx={50} cy={50} r={42} fill="none"
                                    stroke="url(#cg)" strokeWidth={5} strokeLinecap="round"
                                    strokeDasharray={consensus * 2.64 + ' 264'}
                                    className="transition-all duration-1000"
                                />
                                <defs>
                                    <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#a855f7" />
                                        <stop offset="100%" stopColor="#06b6d4" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xl font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent" suppressHydrationWarning>
                                    {consensus}
                                </span>
                                <span className="text-[7px] font-bold text-white/30 uppercase tracking-widest">sync</span>
                            </div>
                        </div>
                    </div>

                    {experts.map((name, i) => {
                        const isOrbiting = i >= 6;
                        const pos = isOrbiting ? ORBIT_POSITION : HEX[i % 6];
                        const persona = gp(name, lang);
                        const active = speaking === name;

                        // Create a "hint" for the user:
                        // Since `model_msg` is only written *after* the turn, if they are active, show a dynamic generic hint
                        let hint = t(lang, 'speaking');
                        if (active) {
                            hint = lang === 'pt' ? 'A elaborar argumento...' : lang === 'es' ? 'Elaborando argumento...' : 'Drafting argument...';
                        } else {
                            // If they are NOT active, show a snippet of their last completed message (if any)
                            const lastMsg = [...messages].reverse().find(m => m.expert_name === name);
                            if (lastMsg && lastMsg.content) {
                                const cleanText = lastMsg.content.replace(/\*/g, '').replace(/\[.*\]/g, '').trim();
                                const words = cleanText.split(' ');
                                hint = `"${words.slice(0, 4).join(' ')}..."`;
                            } else {
                                hint = lang === 'pt' ? 'Aguardando...' : lang === 'es' ? 'Esperando...' : 'Waiting...';
                            }
                        }

                        return (
                            <div
                                key={name}
                                className={`absolute flex flex-col items-center gap-1 ${isOrbiting ? 'animate-[spin_20s_linear_infinite]' : ''}`}
                                style={{
                                    left: pos.left,
                                    top: pos.top,
                                    transform: isOrbiting ? 'translate(-50%, -50%) translateX(100px) rotate(0deg)' : 'translate(-50%, -50%)',
                                    transformOrigin: '0 0'
                                }}
                            >
                                <div className={`relative ${isOrbiting ? 'animate-[spin_20s_linear_infinite_reverse]' : ''}`}>
                                    {active && (
                                        <div
                                            className="absolute inset-0 rounded-full animate-ping opacity-20"
                                            style={{ backgroundColor: persona.c }}
                                        />
                                    )}
                                    <div
                                        className={'relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ' +
                                            (active ? 'scale-125 opacity-100 grayscale-0 shadow-lg' : 'scale-100 opacity-40 grayscale-[50%]')}
                                        style={{
                                            borderColor: persona.c,
                                            backgroundColor: persona.c + (active ? '30' : '10'),
                                            boxShadow: active ? `0 0 25px ${persona.c}80` : 'none',
                                        }}
                                    >
                                        <span className="text-lg">{persona.em}</span>
                                    </div>
                                </div>
                                <div className={`flex flex-col items-center gap-0.5 mt-2 transition-all duration-500 ${active ? 'translate-y-1' : 'translate-y-0'}`}>
                                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full text-center max-w-[85px] truncate transition-colors duration-500 border
                                        ${active ? 'text-white bg-black/80 shadow-md' : 'text-white/50 bg-black/40 border-transparent'}`}
                                        style={{
                                            borderColor: active ? persona.c + '60' : 'transparent',
                                            textShadow: active ? `0 0 8px ${persona.c}` : 'none',
                                        }}>
                                        {persona.dn}
                                    </span>
                                    <div
                                        className={`mt-1 px-2 py-1 rounded border shadow-lg max-w-[120px] text-center transition-all duration-500 ${active ? 'opacity-100 animate-pulse' : 'opacity-60 scale-95'}`}
                                        style={{
                                            backgroundColor: persona.c + (active ? '20' : '05'),
                                            borderColor: persona.c + (active ? '40' : '15'),
                                            backdropFilter: 'blur(4px)'
                                        }}
                                    >
                                        <span
                                            className={`text-[11px] font-medium leading-tight line-clamp-2 ${active ? 'text-white' : ''}`}
                                            style={{ color: active ? '#fff' : persona.c }}
                                        >
                                            {hint}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {experts.length === 0 && (
                        <div className="flex flex-col items-center gap-3 z-20">
                            <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                            <p className="text-white/30 text-xs font-bold">{t(lang, 'waiting')}</p>
                        </div>
                    )}
                </div>

                <div className="px-5 py-2 border-y border-white/5">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em]">
                            {t(lang, 'consensus')}
                        </span>
                        <span className="text-xs font-mono font-bold text-purple-400">{consensus}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-1000 rounded-full"
                            style={{ width: consensus + '%' }}
                        />
                    </div>
                </div>

                <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3 max-h-[50vh]">
                    <h3 className="text-white/20 text-[11px] font-black uppercase tracking-[0.3em] mb-3">
                        {t(lang, 'transcript')} - {messages.length} {t(lang, 'msgs')}
                    </h3>

                    {messages.map((msg) => {
                        const persona = gp(msg.expert_name, lang);
                        return (
                            <div key={msg.id} className="flex gap-3">
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border mt-1"
                                    style={{ borderColor: persona.c + '40', backgroundColor: persona.c + '15' }}
                                >
                                    <span className="text-sm"><span>{persona.em}</span></span>
                                </div>
                                <div className="flex-1 bg-white/[0.03] hover:bg-white/[0.05] rounded-xl p-3 border border-white/5">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[11px] font-black uppercase tracking-wider" style={{ color: persona.c }}>
                                            <span>{persona.dn}</span> <span>{msg.is_judge ? ' (Juiz)' : ''}</span>
                                        </span>
                                        <span className="text-white/15 text-[9px] font-mono"><span>R</span><span>{msg.round}</span></span>
                                    </div>
                                    <div className="text-sm text-white/80 leading-relaxed prose prose-invert prose-sm max-w-none prose-p:text-slate-300 prose-p:leading-relaxed prose-strong:text-white prose-headings:text-white prose-headings:text-sm prose-headings:font-bold prose-headings:mt-2 prose-headings:mb-1 prose-li:text-slate-300 prose-ul:my-1 prose-ol:my-1">
                                        <ReactMarkdown>{typeof msg.content === 'string' ? msg.content.replace(/\\n/g, '\n') : msg.content}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {messages.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-white/20 text-sm">{t(lang, 'connecting')}</p>
                        </div>
                    )}

                    {done && (
                        <div className="text-center py-6 text-emerald-400 text-sm font-bold animate-pulse">
                            {t(lang, 'redirect')}
                        </div>
                    )}
                </div>
            </main>

            {!done && (
                <div className="sticky bottom-0 z-50 bg-[#0a0f1e]/95 backdrop-blur border-t border-white/5 px-4 py-3">
                    <div className="flex items-center bg-white/[0.05] border border-white/10 rounded-2xl p-1.5 gap-2 max-w-2xl mx-auto">
                        <input
                            type="text"
                            className="flex-1 bg-transparent border-0 text-sm text-white placeholder:text-white/20 focus:ring-0 focus:outline-none px-3 py-2"
                            placeholder={t(lang, 'placeholder')}
                            value={interjection}
                            onChange={(e) => setInterjection(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendInterject()}
                        />
                        <button
                            onClick={sendInterject}
                            disabled={sending || !interjection.trim()}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs font-black uppercase tracking-widest disabled:opacity-30"
                        >
                            {t(lang, 'interject')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

