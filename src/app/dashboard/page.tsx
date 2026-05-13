import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('id', user.id)
        .single();

    const { data: validations } = await supabase
        .from('validations')
        .select('*')
        .eq('tenant_id', profile?.tenant_id)
        .order('created_at', { ascending: false });

    const totalValidations = validations?.length || 0;
    const scoredValidations = validations?.filter(v => v.consensus_score !== null) || [];
    const averageScore = scoredValidations.length > 0
        ? Math.round(scoredValidations.reduce((acc, v) => acc + v.consensus_score, 0) / scoredValidations.length)
        : 0;
    const viableIdeas = scoredValidations.filter(v => v.consensus_score >= 70).length;

    const recentValidations = validations?.slice(0, 10) || [];

    return (
        <div className="min-h-screen bg-premium-bg text-premium-text font-body selection:bg-premium-accent/20 antialiased">
            
            {/* Header */}
            <header className="border-b border-black/[0.03] bg-premium-bg/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="size-12 rounded-xl bg-premium-text flex items-center justify-center text-premium-bg hover:scale-105 transition-transform shadow-lg shadow-black/5">
                            <span className="material-symbols-outlined text-[24px]">layers</span>
                        </Link>
                        <div>
                            <h1 className="text-xl font-black font-display tracking-tight uppercase">Strategic Dashboard</h1>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-premium-muted">Portfolio Overview & Intelligence</p>
                        </div>
                    </div>

                    <div className="flex gap-4 items-center">
                        <Link href="/new" className="premium-button px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-premium-accent/10">
                            New Simulation
                        </Link>
                        <div className="h-8 w-px bg-black/[0.05] mx-2"></div>
                        <form action="/api/auth/signout" method="post">
                            <button type="submit" className="size-10 rounded-full bg-black/[0.03] flex items-center justify-center text-premium-muted hover:text-red-500 hover:bg-red-50 transition-all">
                                <span className="material-symbols-outlined text-[20px]">logout</span>
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-8 py-16">

                {/* Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="premium-card p-10 group hover:border-premium-accent/20 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="size-10 rounded-xl bg-black/[0.03] flex items-center justify-center text-premium-muted group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined">folder_open</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-premium-muted">Total Simulations</span>
                        </div>
                        <div className="text-6xl font-black font-display tracking-tighter">{totalValidations}</div>
                    </div>

                    <div className="premium-card p-10 group hover:border-premium-accent/20 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="size-10 rounded-xl bg-black/[0.03] flex items-center justify-center text-premium-muted group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined">analytics</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-premium-muted">Avg Confidence</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <div className={`text-6xl font-black font-display tracking-tighter ${averageScore >= 70 ? 'text-emerald-600' : 'text-premium-text'}`}>{averageScore}</div>
                            <span className="text-xl font-bold text-premium-muted">%</span>
                        </div>
                    </div>

                    <div className="premium-card p-10 group hover:border-premium-accent/20 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="size-10 rounded-xl bg-black/[0.03] flex items-center justify-center text-premium-muted group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined">verified</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-premium-muted">Viable Outcomes</span>
                        </div>
                        <div className="text-6xl font-black font-display tracking-tighter text-emerald-600">{viableIdeas}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* LEFT COLUMN: History */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center gap-4 mb-10">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-premium-muted">Simulation History</h2>
                            <div className="flex-1 h-px bg-black/[0.03]"></div>
                        </div>

                        {recentValidations && recentValidations.length > 0 ? (
                            <div className="space-y-4">
                                {recentValidations.map((v) => (
                                    <Link key={v.id} href={`/report/${v.id}`} className="premium-card p-8 flex items-center justify-between group hover:border-premium-accent/40 hover:shadow-2xl hover:shadow-black/5 transition-all">
                                        <div className="flex-1 min-w-0 pr-8">
                                            <div className="text-lg font-black font-display tracking-tight mb-2 truncate group-hover:text-premium-accent transition-colors">
                                                {v.idea}
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                                                    v.status === 'complete' ? 'border-emerald-100 text-emerald-700 bg-emerald-50' : 
                                                    v.status === 'error' ? 'border-red-100 text-red-700 bg-red-50' :
                                                    'border-amber-100 text-amber-700 bg-amber-50'
                                                }`}>
                                                    {v.status === 'complete' ? 'Deliberated' : v.status}
                                                </span>
                                                <span className="text-[9px] font-bold uppercase tracking-widest text-premium-muted">
                                                    {new Date(v.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>

                                        {v.consensus_score && (
                                            <div className="text-right">
                                                <div className="text-[9px] font-black uppercase tracking-widest text-premium-muted mb-1">Score</div>
                                                <div className={`text-3xl font-black font-display ${v.consensus_score >= 70 ? 'text-emerald-600' : 'text-premium-text'}`}>
                                                    {Math.round(v.consensus_score)}
                                                </div>
                                            </div>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="premium-card p-20 text-center border-dashed">
                                <span className="material-symbols-outlined text-4xl text-premium-muted/30 mb-6">history_edu</span>
                                <h3 className="text-xl font-black font-display mb-2">Workspace Empty</h3>
                                <p className="text-sm text-premium-muted mb-10 max-w-xs mx-auto">No strategic simulations detected. Start a new session to begin deliberation.</p>
                                <Link href="/new" className="premium-button premium-button-secondary px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em]">
                                    Start First Session
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Resources */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32 space-y-12">
                            <div>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-premium-muted mb-8">Strategic Resources</h2>
                                <div className="space-y-4">
                                    <Link href="/dashboard/custom-persona" className="premium-card p-6 flex items-center gap-5 group hover:border-premium-accent/20 transition-all">
                                        <div className="size-12 rounded-xl bg-black/[0.03] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                            🏛️
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black uppercase tracking-tight">Perspective Training</p>
                                            <p className="text-[9px] text-premium-muted font-bold uppercase tracking-widest">Add Internal Data</p>
                                        </div>
                                        <span className="material-symbols-outlined ml-auto text-premium-muted group-hover:text-premium-accent transition-colors">arrow_forward</span>
                                    </Link>

                                    <button className="w-full premium-card p-6 flex items-center gap-5 group hover:border-premium-accent/20 transition-all text-left">
                                        <div className="size-12 rounded-xl bg-black/[0.03] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                            📊
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black uppercase tracking-tight">Executive Export</p>
                                            <p className="text-[9px] text-premium-muted font-bold uppercase tracking-widest">Generate PDF Portfolio</p>
                                        </div>
                                        <span className="material-symbols-outlined ml-auto text-premium-muted group-hover:text-premium-accent transition-colors">download</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-premium-muted mb-8">Account</h2>
                                <Link href="/api/stripe/portal" className="premium-card p-6 flex items-center justify-between group hover:border-premium-accent/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <span className="material-symbols-outlined text-premium-muted">credit_card</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Subscription & Billing</span>
                                    </div>
                                    <span className="material-symbols-outlined text-premium-muted group-hover:text-premium-accent transition-colors">open_in_new</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}
