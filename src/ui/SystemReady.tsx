'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { t, type UILang } from '@/lib/i18n/ui-strings';

export default function SystemReady() {
    const router = useRouter();
    const [idea, setIdea] = useState('');
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState('');
    const [tenantId, setTenantId] = useState('');
    const [lang] = useState<UILang>('English');

    const [profileLoading, setProfileLoading] = useState(true);
    const [showUpgrade, setShowUpgrade] = useState(false);
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
                topic: 'Strategic Perspective Simulation',
                region: 'Global',
                sensitivity: 'high',
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
                setShowUpgrade(true);
                return;
            }

            if (!data?.runId) throw new Error(data.error || 'Missing runId');

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

    return (
        <div className="min-h-screen bg-premium-bg text-premium-text font-body selection:bg-premium-accent/20 flex flex-col md:flex-row antialiased">
            
            {/* Sidebar */}
            <aside className="w-full md:w-24 lg:w-72 bg-premium-bg border-b md:border-b-0 md:border-r border-black/[0.03] flex flex-row md:flex-col shrink-0 px-6 py-8">
                <div className="flex items-center gap-4 mb-12">
                    <div className="size-10 rounded-xl bg-premium-text flex items-center justify-center text-premium-bg shadow-lg shadow-black/10">
                        <span className="material-symbols-outlined text-[20px]">layers</span>
                    </div>
                    <div className="hidden lg:block">
                        <h1 className="font-display font-black text-lg tracking-tight uppercase leading-none mb-1">CouncilIA</h1>
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-premium-muted">Strategic Intelligence Workspace</span>
                    </div>
                </div>

                <nav className="flex-1 flex flex-col gap-2 hidden md:flex">
                    <button onClick={() => router.push('/dashboard')} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-black/[0.03] transition-all text-premium-muted hover:text-premium-text">
                        <span className="material-symbols-outlined text-[20px]">grid_view</span>
                        <span className="hidden lg:block font-bold text-[10px] uppercase tracking-widest">Dashboard</span>
                    </button>
                    <button className="flex items-center gap-4 px-4 py-3 rounded-xl bg-black/[0.05] text-premium-text transition-all font-bold">
                        <span className="material-symbols-outlined text-[20px]">add_circle</span>
                        <span className="hidden lg:block text-[10px] uppercase tracking-widest">New Simulation</span>
                    </button>
                </nav>

                <div className="mt-auto pt-8 border-t border-black/[0.03] hidden lg:block">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="size-10 rounded-full bg-black/[0.05] flex items-center justify-center font-bold">
                            {usageInfo?.userName?.charAt(0) || '?'}
                        </div>
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-tight">{usageInfo?.userName || 'User'}</p>
                            <p className="text-[9px] text-premium-muted font-bold uppercase tracking-widest">{usageInfo?.plan || 'Standard'}</p>
                        </div>
                    </div>
                    {usageInfo && (
                        <div className="space-y-4">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-premium-muted">
                                <span>Utilization</span>
                                <span>{usageInfo.usage}/{usageInfo.limit}</span>
                            </div>
                            <div className="h-[2px] bg-black/[0.05] rounded-full overflow-hidden">
                                <div className="h-full bg-premium-accent" style={{ width: `${(usageInfo.usage / usageInfo.limit) * 100}%` }}></div>
                            </div>
                            <button onClick={handleBilling} className="w-full py-3 text-[9px] font-black uppercase tracking-[0.2em] border border-black/[0.05] rounded-xl hover:bg-black/[0.03] transition-all">
                                Manage Account
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 flex flex-col xl:flex-row relative">
                
                {/* Input Stream */}
                <section className="flex-1 p-8 md:p-12 lg:p-20 flex flex-col">
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/[0.03] border border-black/[0.05] rounded-full mb-6">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-premium-muted">Strategic Input Stream</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black font-display tracking-tighter text-premium-text">
                            Define your <span className="text-premium-muted italic">objective.</span>
                        </h2>
                    </div>

                    <div className="flex-1 flex flex-col relative group">
                        <div className="flex-1 premium-card p-0 overflow-hidden flex flex-col border-black/[0.08] focus-within:border-premium-accent/40 transition-all duration-500">
                            <div className="px-8 py-4 border-b border-black/[0.03] bg-black/[0.01] flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-premium-muted">Core Directive</span>
                                <button onClick={() => setShowContextModal(true)} className="text-[10px] font-bold uppercase tracking-widest text-premium-accent hover:underline flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[16px]">attachment</span>
                                    Add Company Context
                                </button>
                            </div>
                            <textarea
                                className="flex-1 w-full bg-transparent border-none focus:ring-0 p-8 text-2xl text-premium-text placeholder:text-premium-muted/30 resize-none font-display font-light leading-snug"
                                placeholder="Describe the strategic dilemma or market opportunity..."
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                            />
                            <div className="px-8 py-4 border-t border-black/[0.03] flex justify-between text-[10px] font-bold uppercase tracking-widest text-premium-muted/50">
                                <span>{idea.length} / 2500 characters</span>
                                <span>Strategic Confidence: Balanced</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sidebar: Perspectives */}
                <section className="xl:w-96 p-8 md:p-12 bg-black/[0.02] border-l border-black/[0.03] flex flex-col">
                    <div className="mb-10">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-premium-muted mb-8">Strategic Perspectives</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {[
                                { name: 'Strategic', icon: '🎯', role: 'Visionary Lead' },
                                { name: 'Technical', icon: '⚙️', role: 'Systems Lead' },
                                { name: 'Contrarian', icon: '⚖️', role: 'Risk Analyst' },
                                { name: 'Market', icon: '📈', role: 'Growth Lead' },
                            ].map(p => (
                                <div key={p.name} className="premium-card p-4 flex items-center gap-4 hover:border-premium-accent/20 transition-all cursor-default group">
                                    <div className="size-10 rounded-xl bg-premium-bg flex items-center justify-center text-lg border border-black/[0.03] group-hover:scale-110 transition-transform">
                                        {p.icon}
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-tight">{p.name}</p>
                                        <p className="text-[9px] text-premium-muted font-bold uppercase tracking-widest">{p.role}</p>
                                    </div>
                                    <div className="ml-auto size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-10">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-premium-muted mb-8">Internal Contexts</h3>
                        <button onClick={() => router.push('/dashboard/custom-persona')} className="w-full premium-button premium-button-secondary py-4 text-[10px] font-bold uppercase tracking-widest border-dashed">
                            + Add Organizational Perspective
                        </button>
                    </div>

                    <div className="mt-auto space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-premium-muted/50">
                                <span>Logic Consistency</span>
                                <span>High</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-premium-muted/50">
                                <span>Decision Latency</span>
                                <span>~12s</span>
                            </div>
                        </div>
                        <button
                            onClick={start}
                            disabled={loading || profileLoading || !idea.trim()}
                            className="w-full premium-button py-6 text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-premium-accent/20"
                        >
                            {loading ? 'Simulating...' : 'Initiate Simulation'}
                        </button>
                    </div>
                </section>
            </main>

            {/* Context Modal */}
            {showContextModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-6 animate-in fade-in duration-300">
                    <div className="premium-card max-w-2xl w-full p-10 bg-premium-bg">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-premium-muted mb-2">Company Intelligence</h3>
                                <h2 className="text-2xl font-black font-display tracking-tight">Add Contextual Data</h2>
                            </div>
                            <button onClick={() => setShowContextModal(false)} className="material-symbols-outlined text-premium-muted hover:text-premium-text">close</button>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-premium-muted block mb-2">Context Name</label>
                                <input
                                    type="text"
                                    value={repoName}
                                    onChange={(e) => setRepoName(e.target.value)}
                                    placeholder="e.g. 2024 Strategic Roadmap"
                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.05] bg-black/[0.01] focus:outline-none focus:border-premium-accent/40 text-sm font-medium"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-premium-muted block mb-2">Raw Data</label>
                                <textarea
                                    value={contextText}
                                    onChange={(e) => setContextText(e.target.value)}
                                    placeholder="Paste reports, financial data, or market research here..."
                                    className="w-full h-64 px-4 py-3 rounded-xl border border-black/[0.05] bg-black/[0.01] focus:outline-none focus:border-premium-accent/40 text-sm font-medium resize-none"
                                />
                            </div>
                        </div>

                        <div className="mt-10 flex gap-4">
                            <button onClick={() => setShowContextModal(false)} className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest border border-black/[0.05] rounded-xl hover:bg-black/[0.02]">Cancel</button>
                            <button
                                onClick={handleIngestContext}
                                disabled={ingestingContext || !contextText.trim() || !repoName.trim()}
                                className="flex-2 premium-button px-12 text-[10px] font-black uppercase tracking-widest"
                            >
                                {ingestingContext ? 'Ingesting...' : 'Ingest Intelligence'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
