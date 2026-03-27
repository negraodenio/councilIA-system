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
        <div className="min-h-screen bg-space-black text-slate-100 font-body relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 tech-grid pointer-events-none opacity-20"></div>

            {/* Glow Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-cyan/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#ff00e5]/5 blur-[150px] rounded-full pointer-events-none"></div>

            {/* Header */}
            <header className="relative z-10 border-b border-[rgba(0,240,255,0.1)] bg-space-black/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="size-10 bg-neon-cyan/10 rounded-lg flex items-center justify-center border border-neon-cyan/30 shadow-[0_0_15px_rgba(0,242,255,0.2)] shrink-0 overflow-hidden">
                            <span className="material-symbols-outlined text-neon-cyan font-bold select-none">account_tree</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-white font-display uppercase">Command Center</h1>
                            <p className="text-[10px] uppercase font-mono tracking-widest text-[#00f2ff]/70">Session overview & metrics</p>
                        </div>
                    </div>

                    <div className="flex gap-4 items-center">
                        <a href="/api/stripe/portal" className="hidden md:flex items-center gap-2 px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-widest border border-slate-700 rounded bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600 transition-colors text-slate-300">
                            <span className="material-symbols-outlined text-[14px]">payments</span>
                            Billing
                        </a>
                        <a href="/api/audit/export" className="hidden md:flex items-center gap-2 px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-widest border border-slate-700 rounded bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600 transition-colors text-slate-300">
                            <span className="material-symbols-outlined text-[14px]">download</span>
                            Export
                        </a>
                        <Link href="/new" className="flex items-center gap-2 bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/50 px-6 py-2 rounded font-bold text-xs uppercase tracking-widest hover:bg-[#00f2ff]/20 hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,242,255,0.2)]">
                            <span className="material-symbols-outlined text-[16px]">add</span>
                            New Session
                        </Link>
                        <form action="/api/auth/signout" method="post">
                            <button type="submit" className="p-2 text-slate-500 hover:text-red-400 transition hover:bg-red-400/10 rounded group" title="Terminate Connection">
                                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">power_settings_new</span>
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">

                {/* Global Metrics Row (Portfolio Overview shifted to top) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Metric 1 */}
                    <div className="p-6 rounded-xl border border-[rgba(0,240,255,0.1)] bg-panel-blue/40 flex items-center gap-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-neon-cyan/10 blur-xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="size-14 rounded-full border border-neon-cyan/30 flex items-center justify-center bg-[#0a0a1f] shrink-0 shadow-[0_0_15px_rgba(0,242,255,0.1)]">
                            <span className="material-symbols-outlined text-neon-cyan text-2xl">folder_data</span>
                        </div>
                        <div>
                            <div className="text-[10px] font-mono uppercase tracking-widest text-[#00f2ff]/60 mb-1">Total Validations</div>
                            <div className="text-4xl font-black font-display text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{totalValidations}</div>
                        </div>
                    </div>

                    {/* Metric 2 */}
                    <div className="p-6 rounded-xl border border-[rgba(0,240,255,0.1)] bg-panel-blue/40 flex items-center gap-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff00e5]/10 blur-xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="size-14 rounded-full border border-[#ff00e5]/30 flex items-center justify-center bg-[#0a0a1f] shrink-0 shadow-[0_0_15px_rgba(255,0,229,0.1)]">
                            <span className="material-symbols-outlined text-[#ff00e5] text-2xl">timeline</span>
                        </div>
                        <div>
                            <div className="text-[10px] font-mono uppercase tracking-widest text-[#ff00e5]/60 mb-1">Average Score</div>
                            <div className="flex items-baseline gap-1">
                                <div className={`text-4xl font-black font-display drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] ${averageScore >= 70 ? 'text-green-400' : averageScore >= 40 ? 'text-amber-400' : 'text-red-400'}`}>{averageScore}</div>
                                <div className="text-sm font-bold text-slate-500">/100</div>
                            </div>
                        </div>
                    </div>

                    {/* Metric 3 */}
                    <div className="p-6 rounded-xl border border-green-500/20 bg-green-500/5 flex items-center gap-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 blur-xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="size-14 rounded-full border border-green-500/30 flex items-center justify-center bg-[#0a0a1f] shrink-0 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                            <span className="material-symbols-outlined text-green-400 text-2xl">verified</span>
                        </div>
                        <div>
                            <div className="text-[10px] font-mono uppercase tracking-widest text-green-500/80 mb-1">Viable Projects</div>
                            <div className="flex items-baseline gap-2">
                                <div className="text-4xl font-black font-display text-green-300 drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">{viableIdeas}</div>
                                <div className="text-[10px] font-bold text-green-500/50 uppercase tracking-widest">Score ≥ 70</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* LEFT COLUMN: Recent Sessions */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="material-symbols-outlined text-[#00f2ff]">history</span>
                            <h2 className="text-lg font-bold font-display uppercase tracking-widest text-white">Execution Logs</h2>
                        </div>

                        {recentValidations && recentValidations.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {recentValidations.map((v) => (
                                    <Link key={v.id} href={`/report/${v.id}`} className="block border border-[rgba(0,240,255,0.1)] bg-panel-blue/20 p-5 rounded-xl hover:bg-panel-blue/40 hover:border-[#00f2ff]/30 transition-all group relative overflow-hidden">

                                        {/* Status Glow Strip */}
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                                            v.status === 'complete' ? 'bg-[#ff00e5] shadow-[0_0_10px_#ff00e5]' : 
                                            v.status === 'error' ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' :
                                            'bg-amber-400 shadow-[0_0_10px_#fbbf24]'
                                        }`}></div>

                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-slate-200 truncate group-hover:text-[#00f2ff] transition-colors">{v.idea}</div>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${
                                                        v.status === 'complete' ? 'border-[#ff00e5]/30 text-[#ff00e5] bg-[#ff00e5]/10' : 
                                                        v.status === 'error' ? 'border-red-500/30 text-red-500 bg-red-500/10' :
                                                        (Date.now() - new Date(v.created_at).getTime() > 15 * 60 * 1000) ? 'border-slate-500/30 text-slate-500 bg-slate-500/10' :
                                                        'border-amber-400/30 text-amber-400 bg-amber-400/10'
                                                    }`}>
                                                        {v.status === 'complete' ? 'Analyzed' : v.status === 'error' ? 'Failed' : (Date.now() - new Date(v.created_at).getTime() > 15 * 60 * 1000) ? 'Timed Out' : 'Pending'}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-slate-500">{new Date(v.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            {/* Score Display (Right Aligned) */}
                                            {v.consensus_score ? (
                                                <div className="flex items-center gap-3 bg-[rgba(0,0,0,0.3)] px-4 py-2 rounded-lg border border-slate-700">
                                                    <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Score</span>
                                                    <span className={`text-xl font-black font-display ${v.consensus_score >= 70 ? 'text-green-400' : v.consensus_score >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                                                        {Math.round(v.consensus_score)}
                                                    </span>
                                                </div>
                                            ) : v.status === 'error' ? (
                                                <div className="flex items-center gap-3 bg-red-500/5 px-4 py-2 rounded-lg border border-red-500/20">
                                                    <span className="text-[10px] uppercase font-mono tracking-widest text-red-500/70">Error</span>
                                                    <span className="material-symbols-outlined text-red-500 text-xl">error</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3 bg-[rgba(0,0,0,0.3)] px-4 py-2 rounded-lg border border-slate-700/50 opacity-50">
                                                    <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Processing</span>
                                                    <span className="material-symbols-outlined text-slate-500 animate-spin text-xl">sync</span>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 border border-[rgba(0,240,255,0.1)] border-dashed rounded-xl bg-panel-blue/10">
                                <div className="w-16 h-16 rounded-full border border-slate-700 bg-[#0a0a1f] flex items-center justify-center mx-auto mb-6 shadow-inner">
                                    <span className="material-symbols-outlined text-2xl text-slate-500">terminal</span>
                                </div>
                                <h3 className="text-xl font-display font-bold mb-2 text-white">No active targets</h3>
                                <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto">
                                    Initialize your first strategic validation. The Council is awaiting input data.
                                </p>
                                <Link href="/new" className="inline-block bg-[#00f2ff]/10 border border-[#00f2ff]/50 text-[#00f2ff] font-bold text-xs uppercase tracking-widest px-6 py-3 rounded hover:bg-[#00f2ff] hover:text-black transition-all shadow-[0_0_15px_rgba(0,242,255,0.2)]">
                                    Initialize Target
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Quick Templates */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-[#ff00e5]">bolt</span>
                                <h2 className="text-sm font-bold font-display uppercase tracking-widest text-white">Quick Inject</h2>
                            </div>

                            <p className="text-xs text-slate-500 mb-6 font-mono leading-relaxed">
                                Select a pre-configured scenario to deploy a rapid validation test against the Council.
                            </p>

                            <div className="space-y-4">
                                <button className="w-full text-left group p-5 border border-[rgba(0,240,255,0.1)] bg-panel-blue/30 rounded-lg hover:border-[#ff00e5]/50 hover:bg-[#ff00e5]/5 transition-all relative overflow-hidden">
                                    <div className="text-[10px] font-mono text-[#ff00e5]/70 mb-2 uppercase tracking-widest group-hover:text-[#ff00e5] transition-colors">Scenario 01 : SaaS</div>
                                    <div className="text-slate-300 font-medium text-sm leading-relaxed group-hover:text-white transition-colors">B2B Compliance platform utilizing localized LLMs for EU law.</div>
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 group-hover:text-[#ff00e5] group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100">arrow_forward</span>
                                </button>

                                <button className="w-full text-left group p-5 border border-[rgba(0,240,255,0.1)] bg-panel-blue/30 rounded-lg hover:border-[#ff00e5]/50 hover:bg-[#ff00e5]/5 transition-all relative overflow-hidden">
                                    <div className="text-[10px] font-mono text-[#ff00e5]/70 mb-2 uppercase tracking-widest group-hover:text-[#ff00e5] transition-colors">Scenario 02 : Hardware</div>
                                    <div className="text-slate-300 font-medium text-sm leading-relaxed group-hover:text-white transition-colors">Local edge-computing device for real-time agricultural drone scanning.</div>
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 group-hover:text-[#ff00e5] group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100">arrow_forward</span>
                                </button>

                                <button className="w-full text-left group p-5 border border-[rgba(0,240,255,0.1)] bg-panel-blue/30 rounded-lg hover:border-[#ff00e5]/50 hover:bg-[#ff00e5]/5 transition-all relative overflow-hidden">
                                    <div className="text-[10px] font-mono text-[#ff00e5]/70 mb-2 uppercase tracking-widest group-hover:text-[#ff00e5] transition-colors">Scenario 03 : Marketplace</div>
                                    <div className="text-slate-300 font-medium text-sm leading-relaxed group-hover:text-white transition-colors">P2P rental infrastructure for heavy construction equipment in LATAM.</div>
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 group-hover:text-[#ff00e5] group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100">arrow_forward</span>
                                </button>
                            </div>

                            <div className="mt-8 border-t border-[rgba(0,240,255,0.1)] pt-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="material-symbols-outlined text-amber-400">psychology</span>
                                    <h2 className="text-sm font-bold font-display uppercase tracking-widest text-white">Custom Expert</h2>
                                </div>
                                <p className="text-xs text-slate-500 mb-4 font-mono leading-relaxed">
                                    Train a 7th Council member with your company's internal data to argue on your behalf.
                                </p>
                                <Link href="/dashboard/custom-persona" className="flex items-center justify-between group p-4 border border-amber-400/20 bg-amber-400/5 rounded-lg hover:border-amber-400/50 hover:bg-amber-400/10 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded flex items-center justify-center bg-amber-400/10 text-amber-400 border border-amber-400/30">
                                            <span className="material-symbols-outlined text-[16px]">settings_account_box</span>
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors uppercase tracking-widest">Train Persona</div>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-600 group-hover:text-amber-400 transition-colors">arrow_forward</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
