'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { t, type UILang } from '@/lib/i18n/ui-strings';

// Removed old EXPERTS array as we will use the new Agent Selection Grid directly in the UI.

export default function SystemReady() {
    const router = useRouter();
    const [idea, setIdea] = useState('');
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState('');
    const [tenantId, setTenantId] = useState('');
    const [lang] = useState<UILang>('English');

    const [profileLoading, setProfileLoading] = useState(true);
    const [showUpgrade, setShowUpgrade] = useState(false);
    const [debugInfo, setDebugInfo] = useState<any>(null);
    const [usageInfo, setUsageInfo] = useState<{ usage: number, limit: number, plan: string, userName: string } | null>(null);

    // Context / RAG variables
    const [showContextModal, setShowContextModal] = useState(false);
    const [contextText, setContextText] = useState("");
    const [repoName, setRepoName] = useState("");
    const [ingestingContext, setIngestingContext] = useState(false);

    // Custom Persona variable
    const [customPersonas, setCustomPersonas] = useState<any[]>([]);
    const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);

    useEffect(() => {
        const supabase = createClient();
        (async () => {
            setProfileLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setProfileLoading(false);
                return;
            }
            setUserId(user.id);
            const { data: profile } = await supabase
                .from('profiles')
                .select('tenant_id')
                .eq('id', user.id)
                .single();
            if (profile) setTenantId(profile.tenant_id);

            // Fetch active custom personas
            const { data: personaData } = await supabase
                .from('custom_personas')
                .select('*')
                .eq('user_id', user.id)
                .eq('is_active', true)
                .order('updated_at', { ascending: false });

            if (personaData && personaData.length > 0) {
                setCustomPersonas(personaData);
                setSelectedPersonaId(personaData[0].id);
            }

            setProfileLoading(false);

            // Fetch usage info
            try {
                const res = await fetch('/api/usage');
                const data = await res.json();
                if (data.usage !== undefined) setUsageInfo(data);
            } catch (_e) {
                console.error("Failed to fetch usage:", _e);
            }
        })();
    }, []);

    async function handleBilling() {
        try {
            const res = await fetch('/api/stripe/portal', { method: 'POST' });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                router.push('/pricing');
            }
        } catch (_e) {
            router.push('/pricing');
        }
    }

    async function start() {
        setLoading(true);
        try {
            const payload = {
                idea: idea || t(lang, 'sys_placeholder'),
                topic: 'CouncilIA Live Debate',
                region: 'EU',
                sensitivity: 'business',
                tenant_id: tenantId,
                user_id: userId,
                useCustomExpert: !!selectedPersonaId,
                customPersonaId: selectedPersonaId,
            };

            const res = await fetch('/api/session/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.status === 403 && data.error === 'LIMIT_REACHED') {
                console.warn('[Limit Reached] Debug info:', data.debug);
                setDebugInfo(data);
                setShowUpgrade(true);
                return;
            }

            if (!data?.runId) throw new Error(data.error || 'Missing runId');

            // Fire worker manually from the client side so serverless doesn't kill it
            fetch('/api/session/worker', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...payload,
                    validationId: data.validationId,
                    runId: data.runId,
                })
            }).catch(console.error);

            router.push('/chamber/' + data.runId);
        } catch (err: any) {
            alert(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    async function handleIngestContext() {
        if (!contextText.trim() || !repoName.trim()) return;
        setIngestingContext(true);
        try {
            // We'll call the text ingest API next
            const res = await fetch('/api/repo/ingest-text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uId: userId,
                    name: repoName,
                    content: contextText,
                }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.error);
            setShowContextModal(false);
            setContextText("");
        } catch (err: any) {
            alert(err.message || 'Failed to ingest context');
        } finally {
            setIngestingContext(false);
        }
    }

    const cc = idea.length;
    const contextTokens = Math.ceil(contextText.length / 4);

    return (
        <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-[#05050a] text-slate-100 overflow-hidden relative font-body" suppressHydrationWarning>
            {/* Background Grid Overlay */}
            <div className="absolute inset-0 tech-grid pointer-events-none opacity-40"></div>

            {/* Sidebar Navigation */}
            <aside className="w-full md:w-20 lg:w-64 flex flex-row md:flex-col border-b md:border-b-0 md:border-r border-[#00f2ff]/10 glass-panel z-20 shrink-0 h-16 md:h-auto items-center md:items-stretch">
                <div className="px-4 md:p-6 flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#00f2ff]/10 border border-[#00f2ff]/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,242,255,0.2)]">
                        <span className="material-symbols-outlined text-[#00f2ff] text-xl md:text-2xl">rocket_launch</span>
                    </div>
                    <div className="hidden lg:block">
                        <h1 className="font-display font-bold text-lg tracking-tight leading-none italic uppercase">Antigravity</h1>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#00f2ff] font-bold">Neural Engine</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-8 md:flex flex-col gap-2 hidden">
                    <a className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/5 text-white/50 border border-transparent transition-all hover:bg-white/10" href="/dashboard">
                        <span className="material-symbols-outlined">grid_view</span>
                        <span className="hidden lg:block font-medium text-sm">Dashboard</span>
                    </a>
                    <a className="flex items-center gap-4 px-4 py-3 rounded-xl bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/20 transition-all font-bold" href="#">
                        <span className="material-symbols-outlined">terminal</span>
                        <span className="hidden lg:block text-sm">New Session</span>
                    </a>
                </nav>

                {/* Mobile top-right actions */}
                <div className="md:hidden ml-auto px-4 flex items-center gap-4">
                    <a className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-white/50" href="/dashboard">
                        <span className="material-symbols-outlined text-lg">grid_view</span>
                    </a>
                </div>

                <div className="p-4 mt-auto hidden md:block">
                    <div className="flex flex-col gap-2 p-3 rounded-xl bg-white/5 border border-white/10 group transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border-2 border-[#afff33]/30 flex items-center justify-center relative shadow-inner">
                                <span className="text-white font-display font-bold uppercase text-sm">
                                    {usageInfo?.userName ? usageInfo.userName.charAt(0) : <span className="material-symbols-outlined text-sm text-slate-400">person</span>}
                                </span>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#afff33] border-2 border-[#161616] rounded-full shadow-[0_0_8px_#afff33]"></div>
                            </div>
                            <div className="hidden lg:block overflow-hidden flex-1">
                                <p className="text-sm font-semibold truncate font-display text-white">
                                    {usageInfo?.userName || 'Loading...'}
                                </p>
                                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">ID: {userId.substring(0, 6) || '---'}</p>
                            </div>
                        </div>

                        {usageInfo && (
                            <div className="hidden lg:block mt-2 pt-2 border-t border-white/5">
                                <div className="flex items-center justify-between text-[10px] uppercase font-mono mb-2">
                                    <span className="text-slate-500">Sessions</span>
                                    <span className={usageInfo.usage >= usageInfo.limit ? "text-red-400" : "text-[#afff33]"}>
                                        {usageInfo.usage} / {usageInfo.limit}
                                    </span>
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#00f2ff] to-[#afff33] transition-all duration-1000"
                                        style={{ width: `${Math.min(100, (usageInfo.usage / usageInfo.limit) * 100)}%` }}
                                    ></div>
                                </div>

                                <button
                                    onClick={handleBilling}
                                    className="w-full mt-3 py-2 border border-slate-700 rounded bg-slate-800/50 hover:bg-slate-700 hover:text-white transition-colors text-[10px] font-mono font-bold uppercase tracking-widest text-slate-300 flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[14px]">credit_card</span>
                                    Manage Billing
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Workspace (Split Grid) */}
            <main className="flex-1 flex flex-col xl:flex-row relative z-10 overflow-y-auto xl:overflow-hidden">

                {/* Left Side: Neural Input Field */}
                <section className="flex-1 flex flex-col p-4 md:p-6 lg:p-10 border-b xl:border-b-0 xl:border-r border-[#00f2ff]/10 relative min-h-[60vh] xl:min-h-0">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="font-display text-3xl font-extrabold tracking-tight uppercase italic flex items-center gap-3">
                                <span className="text-white">Neural</span>
                                <span className="text-[#00f2ff]">Input</span>
                            </h2>
                            <p className="text-slate-500 text-xs font-mono uppercase tracking-widest mt-1">Specify validation parameters</p>
                        </div>
                        <div className="flex gap-4 text-[10px] uppercase font-bold tracking-widest">
                            <button
                                onClick={() => setShowContextModal(true)}
                                className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#ff00e5]/10 border border-[#ff00e5]/20 text-[#ff00e5] hover:bg-[#ff00e5]/20 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[14px]">library_add</span>
                                Add Context
                            </button>
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#afff33]/10 border border-[#afff33]/20 text-[#afff33]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#afff33] animate-pulse"></span>
                                System Ready
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 relative w-full group flex flex-col">
                        {/* Decorative Corners */}
                        <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-[#00f2ff]/40 rounded-tl-lg pointer-events-none"></div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#00f2ff]/40 rounded-tr-lg pointer-events-none"></div>
                        <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#00f2ff]/40 rounded-bl-lg pointer-events-none"></div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-[#00f2ff]/40 rounded-br-lg pointer-events-none"></div>

                        <div className="flex-1 glass-panel rounded-2xl overflow-hidden focus-within:border-[#00f2ff]/60 transition-all duration-500 shadow-2xl flex flex-col">
                            <div className="flex items-center gap-2 px-6 py-4 border-b border-[#00f2ff]/10 bg-[#00f2ff]/5">
                                <span className="material-symbols-outlined text-[#00f2ff] text-sm">psychology</span>
                                <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#00f2ff]/70 font-mono">Console // Input Stream</span>
                            </div>

                            <textarea
                                className="flex-1 w-full bg-transparent border-none focus:ring-0 p-8 text-xl text-slate-200 placeholder:text-slate-600 resize-none font-light leading-relaxed custom-scrollbar"
                                placeholder={t(lang, 'sys_placeholder') || "Enter your complex prompt / objective here..."}
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) start(); }}
                                maxLength={2500}
                            />

                            <div className="p-4 bg-white/5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono uppercase text-slate-400">
                                <div className="flex gap-4">
                                    <span className={cc > 2000 ? "text-red-400" : "text-[#afff33]"}>Tokens: {cc}/2500</span>
                                    <span>Temp: 0.82</span>
                                </div>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">keyboard_command_key</span> + Enter to submit</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right Side: Agent Selection & Submit */}
                <section className="xl:w-[450px] flex flex-col bg-[#121235]/30 p-4 md:p-6 lg:p-10 relative z-10 overflow-visible xl:overflow-y-auto xl:custom-scrollbar">

                    <div className="mb-8">
                        <h3 className="font-display font-bold text-sm text-white uppercase tracking-widest flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-[#ff00e5] text-lg">smart_toy</span>
                            Assigned Neural Agents
                        </h3>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="glass-panel p-3 rounded-lg border border-[#00f2ff]/30 hover:bg-[#00f2ff]/10 cursor-help transition-all" title="Visionary and strategy expert.">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="material-symbols-outlined text-[#00f2ff] text-xl">visibility</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#afff33] shadow-[0_0_5px_#afff33]"></div>
                                </div>
                                <h4 className="font-bold text-xs text-white">Visionary</h4>
                                <p className="text-[9px] text-[#00f2ff]/60 uppercase font-mono mt-1">Strategic Lead</p>
                            </div>

                            <div className="glass-panel p-3 rounded-lg border border-white/10 hover:bg-white/5 cursor-help transition-all" title="Technical architect and logic expert.">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="material-symbols-outlined text-white/50 text-xl">terminal</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#afff33] shadow-[0_0_5px_#afff33]"></div>
                                </div>
                                <h4 className="font-bold text-xs text-white">Technologist</h4>
                                <p className="text-[9px] text-slate-500 uppercase font-mono mt-1">System Architect</p>
                            </div>

                            <div className="glass-panel p-3 rounded-lg border border-[#ff00e5]/30 hover:bg-[#ff00e5]/10 cursor-help transition-all" title="Red-teaming and risk identification expert.">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="material-symbols-outlined text-[#ff00e5] text-xl">skull</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#afff33] shadow-[0_0_5px_#afff33]"></div>
                                </div>
                                <h4 className="font-bold text-xs text-white">Advocate</h4>
                                <p className="text-[9px] text-[#ff00e5]/60 uppercase font-mono mt-1">Devil's Advocate</p>
                            </div>

                            <div className="glass-panel p-3 rounded-lg border border-[#afff33]/30 hover:bg-[#afff33]/10 cursor-help transition-all" title="Market trends and user adoption expert.">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="material-symbols-outlined text-[#afff33] text-xl">trending_up</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#afff33] shadow-[0_0_5px_#afff33]"></div>
                                </div>
                                <h4 className="font-bold text-xs text-white">Market</h4>
                                <p className="text-[9px] text-[#afff33]/60 uppercase font-mono mt-1">Trend Analysis</p>
                            </div>

                            <div className="glass-panel p-3 rounded-lg border border-amber-500/30 hover:bg-amber-500/10 cursor-help transition-all" title="Regulatory compliance and ethics expert.">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="material-symbols-outlined text-amber-500 text-xl">gavel</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#afff33] shadow-[0_0_5px_#afff33]"></div>
                                </div>
                                <h4 className="font-bold text-xs text-white">Ethics</h4>
                                <p className="text-[9px] text-amber-500/60 uppercase font-mono mt-1">Compliance Check</p>
                            </div>

                            <div className="glass-panel p-3 rounded-lg border border-blue-500/30 hover:bg-blue-500/10 cursor-help transition-all" title="Financial modeling and ROI expert.">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="material-symbols-outlined text-blue-500 text-xl">account_balance</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#afff33]"></div>
                                </div>
                                <h4 className="font-bold text-xs text-white">Finance</h4>
                                <p className="text-[9px] text-blue-500/60 uppercase font-mono mt-1">Cost Projection</p>
                            </div>
                        </div>

                        {/* Custom Expert Slots */}
                        <div className="mt-3 flex flex-col gap-2 relative">
                            {customPersonas.length > 0 && customPersonas.map((persona) => {
                                const isSelected = selectedPersonaId === persona.id;
                                return (
                                    <div
                                        key={persona.id}
                                        className={`glass-panel p-3 rounded-lg border transition-all flex items-center gap-3 cursor-pointer ${isSelected ? 'bg-white/5' : 'bg-black/40'}`}
                                        style={{ borderColor: isSelected ? `${persona.color}50` : 'rgba(255,255,255,0.05)' }}
                                        onClick={() => setSelectedPersonaId(isSelected ? null : persona.id)}
                                    >
                                        <div className="flex-1 flex justify-between items-center">
                                            <div className={`flex flex-col transition-all duration-300 ${!isSelected && 'grayscale opacity-50'}`}>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">{persona.emoji || '🔬'}</span>
                                                    <h4 className="font-bold text-xs text-white">{persona.name}</h4>
                                                </div>
                                                <p className="text-[9px] uppercase font-mono mt-1" style={{ color: persona.color || '#6366f1' }}>
                                                    {persona.role || 'Custom Persona'}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {/* Edit/Config Button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push('/dashboard/custom-persona');
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-neon-cyan transition-all border border-white/5"
                                                    title="Configure / Upload Files"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">settings</span>
                                                </button>

                                                <div className={`text-[9px] font-bold uppercase tracking-widest transition-colors duration-300 ${isSelected ? 'text-[#00f2ff]' : 'text-slate-500'}`}>
                                                    {isSelected ? 'Enabled' : 'Disabled'}
                                                </div>
                                                {/* Native-style Visual Toggle */}
                                                <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${isSelected ? 'bg-[#00f2ff]/30 shadow-[0_0_10px_rgba(0,242,255,0.2)]' : 'bg-slate-700/50'}`}>
                                                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform duration-300 ${isSelected ? 'bg-[#00f2ff] translate-x-5' : 'bg-slate-400 translate-x-0'}`}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Always show Add New Persona button */}
                            <a href="/dashboard/custom-persona" className="glass-panel p-3 rounded-lg border border-dashed border-white/20 hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all flex justify-between items-center group">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-slate-500 group-hover:text-neon-cyan transition-colors">add_circle</span>
                                    <div>
                                        <h4 className="font-bold text-xs text-slate-300 group-hover:text-white transition-colors">{t(lang, 'sys_train_persona') || 'Train Custom Expert'}</h4>
                                        <p className="text-[9px] text-slate-500 uppercase font-mono mt-1">{t(lang, 'sys_train_persona_desc') || 'Add internal data perspective'}</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-600 group-hover:text-neon-cyan transition-colors">arrow_forward</span>
                            </a>
                        </div>
                    </div>

                    <div className="mt-auto pt-8 border-t border-[#00f2ff]/10">
                        <div className="flex flex-col gap-4 mb-8">
                            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-mono text-slate-400">
                                <span>Engine Version</span>
                                <span className="text-[#00f2ff]">ACE v4.2</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-mono text-slate-400">
                                <span>Council Judges</span>
                                <span className="text-white">GPT-4o / Claude 3.5</span>
                            </div>
                        </div>

                        <button
                            onClick={start}
                            disabled={loading || profileLoading || !idea.trim()}
                            className="w-full relative px-6 py-6 bg-[#00f2ff]/10 border border-[#00f2ff] rounded-xl overflow-hidden transition-all hover:bg-[#00f2ff]/20 active:scale-[0.98] shadow-[0_0_20px_rgba(0,242,255,0.2)] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            <div className="flex items-center justify-center gap-3 relative z-10">
                                {loading || profileLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-[#00f2ff]/30 border-t-[#00f2ff] rounded-full animate-spin" />
                                        <span className="font-display font-black text-sm tracking-[0.2em] text-[#00f2ff] uppercase italic">Initializing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="font-display font-black text-sm tracking-[0.2em] text-[#00f2ff] uppercase italic glow-text">Initiate Neural Synthesis</span>
                                        <span className="material-symbols-outlined text-[#00f2ff] animate-pulse">bolt</span>
                                    </>
                                )}
                            </div>
                        </button>
                    </div>

                </section>
            </main>
            {
                showUpgrade && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl shadow-purple-500/20 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500" />

                            <div className="mb-6">
                                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Limit Reached</h2>
                                <p className="text-white/50 text-sm leading-relaxed mb-4">
                                    {debugInfo ? (
                                        <span>Plan: <b className="text-purple-400 uppercase">{debugInfo.debug?.plan}</b> · Usage: <b className="text-white">{debugInfo.usage} / {debugInfo.limit}</b></span>
                                    ) : (
                                        t(lang, 'sys_limit_reached_desc')
                                    )}
                                </p>

                                {debugInfo?.debug && (
                                    <div className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.05] mb-4">
                                        <p className="text-[9px] font-mono text-white/20 uppercase tracking-tighter mb-1">Debug Session Info</p>
                                        <p className="text-[10px] font-mono text-white/40 break-all leading-tight">
                                            Tenant: {debugInfo.debug.tenant?.substring(0, 16)}...<br />
                                            User: {debugInfo.debug.user?.substring(0, 16)}...
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => router.push('/pricing?checkout=pro')}
                                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all active:scale-[0.98]"
                                >
                                    Upgrade to Pro
                                </button>
                                <button
                                    onClick={() => setShowUpgrade(false)}
                                    className="w-full bg-white/5 border border-white/10 text-white/50 font-medium py-3 rounded-xl hover:bg-white/10 transition-all"
                                >
                                    Close
                                </button>
                            </div>

                            <p className="mt-6 text-center text-[10px] text-white/20 uppercase tracking-widest font-bold">
                                Secure payment via Stripe
                            </p>
                        </div>
                    </div>
                )
            }

            {/* Context Modal */}
            {showContextModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-[#0a0a1f] border border-[#ff00e5]/30 rounded-2xl w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(255,0,229,0.15)] flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-[#ff00e5]/20 bg-[#ff00e5]/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[#ff00e5]">library_add</span>
                                <div>
                                    <h3 className="font-display font-bold text-white uppercase tracking-widest text-sm">Inject Context</h3>
                                    <p className="font-mono text-[10px] text-[#ff00e5]/60 uppercase tracking-widest">Supplemental Memory Bank</p>
                                </div>
                            </div>
                            <button onClick={() => setShowContextModal(false)} className="text-slate-500 hover:text-white transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6">
                            <div>
                                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">Memory Bank Label</label>
                                <input
                                    type="text"
                                    value={repoName}
                                    onChange={(e) => setRepoName(e.target.value)}
                                    placeholder="e.g. Q4 Financial Report, Competitor Analysis..."
                                    className="w-full bg-black/50 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff00e5]/50 focus:bg-black/80 transition-all font-sans"
                                />
                            </div>
                            <div className="flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">Raw Data payload</label>
                                    <span className="text-[10px] font-mono text-[#ff00e5] bg-[#ff00e5]/10 px-2 py-0.5 rounded border border-[#ff00e5]/20">
                                        ~{contextTokens.toLocaleString()} tokens
                                    </span>
                                </div>
                                <textarea
                                    value={contextText}
                                    onChange={(e) => setContextText(e.target.value)}
                                    placeholder="Paste full articles, reports, code snippets, or raw terminal output here..."
                                    className="flex-1 min-h-[250px] w-full bg-black/50 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-[#ff00e5]/50 focus:bg-black/80 transition-all font-mono custom-scrollbar resize-none"
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-slate-800 bg-black/30 flex justify-end gap-3">
                            <button
                                onClick={() => setShowContextModal(false)}
                                className="px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleIngestContext}
                                disabled={ingestingContext || !contextText.trim() || !repoName.trim()}
                                className="flex items-center gap-2 px-6 py-2.5 bg-[#ff00e5]/10 border border-[#ff00e5]/50 text-[#ff00e5] font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-[#ff00e5] hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,0,229,0.2)]"
                            >
                                {ingestingContext ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                                        Ingesting...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[16px]">memory</span>
                                        Ingest Data
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}
