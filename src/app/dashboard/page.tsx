import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Navbar } from '@/ui/Navbar';

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
        <div className="min-h-screen">
            <Navbar />
            
            <main className="max-w-[1160px] mx-auto px-6 md:px-15 py-16 animate-fade-up">
                
                {/* Hero Header */}
                <div className="mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--surface-2)] border border-[var(--border)] rounded-full mb-6">
                        <div className="size-1.5 bg-[var(--teal)] rounded-full animate-premium-pulse shadow-[0_0_8px_var(--teal)]"></div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-2)]">Strategic Workspace v14.0</span>
                    </div>
                    <h1 className="premium-heading text-5xl md:text-6xl text-[var(--text)] mb-4">Strategic Dashboard</h1>
                    <p className="text-lg text-[var(--muted-2)] font-light max-w-2xl">
                        Portfolio Overview & Strategic Intelligence. Monitor your organization's simulated outcomes and decision confidence.
                    </p>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    <div className="premium-card premium-card-accent">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="material-symbols-outlined text-[var(--muted)] text-xl">folder_open</span>
                            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--muted)]">Total Simulations</span>
                        </div>
                        <div className="text-5xl font-extrabold font-syne tracking-tighter text-[var(--text)]">{totalValidations}</div>
                    </div>

                    <div className="premium-card premium-card-accent">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="material-symbols-outlined text-[var(--muted)] text-xl">analytics</span>
                            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--muted)]">Avg Confidence</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <div className="text-5xl font-extrabold font-syne tracking-tighter text-[var(--teal)]">{averageScore}%</div>
                        </div>
                    </div>

                    <div className="premium-card premium-card-accent">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="material-symbols-outlined text-[var(--muted)] text-xl">verified</span>
                            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--muted)]">Viable Outcomes</span>
                        </div>
                        <div className="text-5xl font-extrabold font-syne tracking-tighter text-[var(--indigo)]">{viableIdeas}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* LEFT COLUMN: History */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Simulation History</h2>
                            <Link href="/new" className="text-[11px] font-bold uppercase tracking-widest text-[var(--teal)] hover:underline">New Simulation +</Link>
                        </div>

                        {recentValidations && recentValidations.length > 0 ? (
                            <div className="space-y-4">
                                {recentValidations.map((v, idx) => (
                                    <Link 
                                        key={v.id} 
                                        href={`/report/${v.id}`} 
                                        className="premium-card block group hover:border-[var(--teal)] transition-all animate-fade-up"
                                        style={{ animationDelay: `${idx * 0.05}s` }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0 pr-8">
                                                <h3 className="text-xl font-bold font-syne tracking-tight mb-2 truncate group-hover:text-[var(--teal)] transition-colors">
                                                    {v.idea}
                                                </h3>
                                                <div className="flex items-center gap-4">
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                                                        v.status === 'complete' ? 'text-[var(--teal)]' : 
                                                        v.status === 'error' ? 'text-red-400' :
                                                        'text-[var(--muted-2)]'
                                                    }`}>
                                                        {v.status === 'complete' ? 'Deliberated' : v.status}
                                                    </span>
                                                    <span className="text-[10px] text-[var(--muted)] tracking-widest uppercase">
                                                        {new Date(v.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>

                                            {v.consensus_score !== null && (
                                                <div className="text-right">
                                                    <div className="text-3xl font-extrabold font-syne tracking-tighter text-[var(--text)]">
                                                        {Math.round(v.consensus_score)}%
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="premium-card py-24 text-center border-dashed border-[var(--border)] bg-transparent">
                                <span className="material-symbols-outlined text-4xl text-[var(--border-hover)] mb-6">history_edu</span>
                                <h3 className="text-2xl font-syne font-bold mb-2">Workspace Empty</h3>
                                <p className="text-[var(--muted-2)] mb-10 max-w-xs mx-auto font-light">No strategic simulations detected. Start a new session to begin deliberation.</p>
                                <Link href="/new" className="premium-button premium-button-primary inline-flex">
                                    Start First Session
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Resources */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32 space-y-10">
                            <div>
                                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] mb-8">Strategic Resources</h2>
                                <div className="space-y-4">
                                    <Link href="/dashboard/custom-persona" className="premium-card block group">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                                🏛️
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-tight group-hover:text-[var(--teal)] transition-colors">Perspective Training</p>
                                                <p className="text-[10px] text-[var(--muted)] font-medium uppercase tracking-widest">Add Internal Data</p>
                                            </div>
                                            <span className="material-symbols-outlined ml-auto text-[var(--muted)] group-hover:text-[var(--teal)] transition-colors">arrow_forward</span>
                                        </div>
                                    </Link>

                                    <button className="w-full premium-card group text-left">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                                📊
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-tight group-hover:text-[var(--teal)] transition-colors">Executive Export</p>
                                                <p className="text-[10px] text-[var(--muted)] font-medium uppercase tracking-widest">Generate Portfolio</p>
                                            </div>
                                            <span className="material-symbols-outlined ml-auto text-[var(--muted)] group-hover:text-[var(--teal)] transition-colors">download</span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] mb-8">Account</h2>
                                <Link href="/api/stripe/portal" className="premium-card block group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className="material-symbols-outlined text-[var(--muted)]">credit_card</span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Subscription & Billing</span>
                                        </div>
                                        <span className="material-symbols-outlined text-[var(--muted)] group-hover:text-[var(--teal)] transition-colors">open_in_new</span>
                                    </div>
                                </Link>
                                
                                <form action="/api/auth/signout" method="post" className="mt-4">
                                    <button type="submit" className="w-full premium-card py-4 text-center group border-red-500/10 hover:border-red-500/40 hover:bg-red-500/5 transition-all">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 group-hover:text-red-500">Sign Out</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}
