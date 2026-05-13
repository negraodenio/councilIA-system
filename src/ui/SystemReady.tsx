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
        <div className="min-h-screen flex flex-col md:flex-row relative" suppressHydrationWarning>
            
            {/* Sidebar */}
            <aside className="w-full md:w-24 lg:w-72 bg-[var(--bg)] border-b md:border-b-0 md:border-r border-[var(--border)] flex flex-row md:flex-col shrink-0 px-6 py-8 z-10">
                <div className="flex items-center gap-4 mb-12">
                    <div className="size-10 rounded-xl bg-gradient-to-br from-[var(--teal)] to-[var(--indigo)] flex items-center justify-center font-bold text-white shadow-lg">
                        C
                    </div>
                    <div className="hidden lg:block">
                        <h1 className="premium-heading text-lg tracking-tight leading-none mb-1">CouncilIA</h1>
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Strategic Intelligence</span>
                    </div>
                </div>

                <nav className="flex-1 flex flex-col gap-2 hidden md:flex">
                    <button onClick={() => router.push('/dashboard')} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[var(--surface-2)] transition-all text-[var(--muted)] hover:text-[var(--text)]">
                        <span className="material-symbols-outlined text-[20px]">grid_view</span>
                        <span className="hidden lg:block font-bold text-[10px] uppercase tracking-widest">Dashboard</span>
                    </button>
                    <button className="flex items-center gap-4 px-4 py-3 rounded-xl bg-[var(--surface-2)] text-[var(--teal)] transition-all">
                        <span className="material-symbols-outlined text-[20px]">add_circle</span>
                        <span className="hidden lg:block font-bold text-[10px] uppercase tracking-widest">New Session</span>
                    </button>
                </nav>

                <div className="mt-auto pt-8 border-t border-[var(--border)] hidden lg:block">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="size-10 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center font-bold text-[var(--text)]">
                            {usageInfo?.userName?.charAt(0) || '?'}
                        </div>
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-tight text-[var(--text)]">{usageInfo?.userName || 'Executive'}</p>
                            <p className="text-[9px] text-[var(--muted)] font-bold uppercase tracking-widest">{usageInfo?.plan || 'Enterprise'}</p>
                        </div>
                    </div>
                    {usageInfo && (
                        <div className="space-y-4">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                                <span>Utilization</span>
                                <span>{usageInfo.usage}/{usageInfo.limit}</span>
                            </div>
                            <div className="h-1 bg-[var(--surface-2)] rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[var(--teal)] to-[var(--indigo)]" style={{ width: `${(usageInfo.usage / usageInfo.limit) * 100}%` }}></div>
                            </div>
                            <button onClick={handleBilling} className="w-full py-3 text-[10px] font-bold uppercase tracking-[0.2em] border border-[var(--border)] rounded-xl hover:border-[var(--teal)] hover:text-[var(--teal)] transition-all">
                                Manage Account
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 flex flex-col xl:flex-row relative">
                
                {/* Input Stream */}
                <section className="flex-1 p-8 md:p-12 lg:p-20 flex flex-col animate-fade-up">
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--surface-2)] border border-[var(--border)] rounded-full mb-6">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--muted-2)]">Strategic Input Stream</span>
                        </div>
                        <h2 className="premium-heading text-4xl md:text-6xl text-[var(--text)] mb-2">
                            Define your <span className="text-[var(--muted)] italic font-light">objective.</span>
                        </h2>
                    </div>

                    <div className="flex-1 flex flex-col relative group">
                        <div className="flex-1 premium-card premium-card-accent p-0 overflow-hidden flex flex-col border-[var(--border-hover)] focus-within:border-[var(--teal)] transition-all duration-500">
                            <div className="px-8 py-4 border-b border-[var(--border)] bg-[var(--bg)]/40 flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Executive Directive</span>
                                <button onClick={() => setShowContextModal(true)} className="text-[10px] font-bold uppercase tracking-widest text-[var(--teal)] hover:underline flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[16px]">attachment</span>
                                    Add Context
                                </button>
                            </div>
                            <textarea
                                className="flex-1 w-full bg-transparent border-none focus:ring-0 p-8 text-2xl md:text-3xl text-[var(--text)] placeholder:text-white/10 resize-none font-syne font-medium leading-tight"
                                placeholder="Describe the strategic dilemma or board-level opportunity..."
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                            />
                            <div className="px-8 py-4 border-t border-[var(--border)] flex justify-between text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                                <span>{idea.length} / 2500 characters</span>
                                <span className="text-[var(--teal)]">Simulation Engine: Ready</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sidebar: Perspectives */}
                <section className="xl:w-96 p-8 md:p-12 bg-white/[0.01] border-l border-[var(--border)] flex flex-col animate-fade-up" style={{ animationDelay: '0.1s' }}>
                    <div className="mb-10">
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--muted)] mb-8">Board Perspectives</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {[
                                { name: 'Strategic', icon: '🎯', role: 'Visionary Lead', color: 'var(--teal)' },
                                { name: 'Technical', icon: '⚙️', role: 'Systems Lead', color: 'var(--indigo)' },
                                { name: 'Contrarian', icon: '⚖️', role: 'Risk Analyst', color: '#F87171' },
                                { name: 'Market', icon: '📈', role: 'Growth Lead', color: '#F59E0B' },
                            ].map(p => (
                                <div key={p.name} className="premium-card p-4 flex items-center gap-4 hover:border-[var(--border-hover)] transition-all cursor-default group">
                                    <div className="size-11 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                        {p.icon}
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-tight text-[var(--text)]">{p.name}</p>
                                        <p className="text-[9px] text-[var(--muted)] font-bold uppercase tracking-widest">{p.role}</p>
                                    </div>
                                    <div className="ml-auto size-1.5 rounded-full bg-[var(--teal)] shadow-[0_0_8px_var(--teal)] animate-premium-pulse"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-10">
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--muted)] mb-8">Custom Perspectives</h3>
                        <div className="space-y-4">
                            {customPersonas.length > 0 ? (
                                <select 
                                    value={selectedPersonaId || ''} 
                                    onChange={(e) => setSelectedPersonaId(e.target.value)}
                                    className="premium-input text-xs"
                                >
                                    {customPersonas.map(p => (
                                        <option key={p.id} value={p.id}>{p.emoji} {p.name}</option>
                                    ))}
                                </select>
                            ) : (
                                <button onClick={() => router.push('/dashboard/custom-persona')} className="w-full premium-button premium-button-secondary py-4 text-[10px] font-bold uppercase tracking-widest border-dashed">
                                    + Add Custom Perspective
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="mt-auto space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                                <span>Logic Consistency</span>
                                <span className="text-[var(--teal)]">OPTIMAL</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                                <span>Simulation Latency</span>
                                <span className="text-[var(--text)]">~12s</span>
                            </div>
                        </div>
                        <button
                            onClick={start}
                            disabled={loading || profileLoading || !idea.trim()}
                            className="w-full premium-button premium-button-primary py-6 text-[11px] font-bold uppercase tracking-[0.4em] shadow-2xl"
                        >
                            {loading ? 'Initializing...' : 'Initiate Simulation →'}
                        </button>
                    </div>
                </section>
            </main>

            {/* Context Modal */}
            {showContextModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg)]/80 backdrop-blur-xl p-6 animate-fade-up">
                    <div className="premium-card premium-card-accent max-w-2xl w-full p-10">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--muted)] mb-2">Company Intelligence</h3>
                                <h2 className="premium-heading text-3xl text-[var(--text)]">Add Contextual Data</h2>
                            </div>
                            <button onClick={() => setShowContextModal(false)} className="text-[var(--muted)] hover:text-[var(--text)] transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        <div className="space-y-8">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] block mb-3">Context Name</label>
                                <input
                                    type="text"
                                    value={repoName}
                                    onChange={(e) => setRepoName(e.target.value)}
                                    placeholder="e.g. 2024 Strategic Roadmap"
                                    className="premium-input"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] block mb-3">Raw Intelligence Data</label>
                                <textarea
                                    value={contextText}
                                    onChange={(e) => setContextText(e.target.value)}
                                    placeholder="Paste reports, financial data, or market research here..."
                                    className="premium-input h-64 resize-none"
                                />
                            </div>
                        </div>

                        <div className="mt-12 flex gap-4">
                            <button onClick={() => setShowContextModal(false)} className="flex-1 premium-button premium-button-secondary py-4 text-[11px] font-bold uppercase tracking-widest">Cancel</button>
                            <button
                                onClick={handleIngestContext}
                                disabled={ingestingContext || !contextText.trim() || !repoName.trim()}
                                className="flex-[2] premium-button premium-button-primary px-12 text-[11px] font-bold uppercase tracking-widest"
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
