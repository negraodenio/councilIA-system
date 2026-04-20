'use client';

import { useState, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    const redirectTo = searchParams.get('redirect') || '/new';
    const checkout = searchParams.get('checkout');

    async function handleLogin() {
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }
        setLoading(true);
        setError('');
        setInfo('');
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) {
            setError(err.message);
            setLoading(false);
            return;
        }

        const finalRedirect = checkout ? `${redirectTo}?checkout=${checkout}` : redirectTo;
        router.push(finalRedirect);
    }

    async function handleSignup() {
        if (!email || !password) {
            setError('Please enter both email and password to sign up.');
            return;
        }
        setLoading(true);
        setError('');
        setInfo('');

        const finalNext = checkout ? `${redirectTo}?checkout=${checkout}` : redirectTo;
        const confirmUrl = `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(finalNext)}`;

        const { error: err } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: confirmUrl,
            },
        });
        if (err) {
            setError(err.message);
            setLoading(false);
            return;
        }
        setInfo('Check your email to confirm signup!');
        setLoading(false);
    }

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                <p className="text-slate-400">Enter your core credentials to access the chamber.</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                    <input
                        type="email"
                        placeholder="founder@startup.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        className="w-full bg-[#0a0f1d] border border-slate-700/50 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-mono text-sm"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        className="w-full bg-[#0a0f1d] border border-slate-700/50 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all font-mono text-sm"
                    />
                </div>
            </div>

            <div className="mt-6">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-start gap-3">
                        <span className="mt-0.5">⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                {info && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl mb-6 text-sm flex items-start gap-3">
                        <span className="mt-0.5">✅</span>
                        <span>{info}</span>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white font-black uppercase tracking-widest text-xs py-4 px-6 rounded-xl disabled:opacity-50 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group overflow-hidden relative"
                    >
                        <span className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span className="relative z-10">Authenticating...</span>
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-sm relative z-10">lock_open</span>
                                <span className="relative z-10">Sign In</span>
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleSignup}
                        disabled={loading}
                        className="flex-1 bg-slate-800/50 border border-slate-700 text-white font-bold py-4 px-6 rounded-xl disabled:opacity-50 hover:bg-slate-700/50 transition-all active:scale-[0.98]"
                    >
                        Create Account
                    </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-slate-500 text-xs font-mono opacity-60">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Secure infrastructure powered by Supabase
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#050810] flex flex-col md:flex-row font-sans">
            {/* Left Panel: Hero Brand Section (Hidden on small screens) */}
            <div className="hidden md:flex flex-col justify-between w-1/2 lg:w-5/12 xl:w-1/3 bg-[#0a0f1d] border-r border-slate-800/80 p-12 lg:p-16 relative overflow-hidden">
                {/* Immersive glow effects */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute -top-[20%] -left-[20%] w-[140%] h-[70%] rounded-[100%] bg-purple-900/20 blur-[120px]"></div>
                    <div className="absolute bottom-[0%] -right-[20%] w-[100%] h-[60%] rounded-[100%] bg-cyan-900/20 blur-[120px]"></div>
                    <div className="absolute top-[20%] left-[0%] w-[200%] h-[1px] transform -rotate-45 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    <div className="absolute top-[30%] left-[0%] w-[200%] h-[1px] transform -rotate-45 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent"></div>
                </div>

                {/* Top Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 p-[1px] shadow-lg shadow-purple-500/20">
                        <div className="w-full h-full bg-[#0a0f1d] rounded-[11px] flex items-center justify-center">
                            <span className="text-xl">🏛️</span>
                        </div>
                    </div>
                    <span className="text-white font-bold text-xl tracking-wide">CouncilIA</span>
                </div>

                {/* Center Value Proposition */}
                <div className="relative z-10 my-auto">
                    <div className="inline-block px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-[10px] text-cyan-400 font-mono tracking-[0.2em] mb-6 uppercase animate-pulse">
                        ACE ENGINE v3.0 // OS 3.0
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-[1.15] tracking-tight">
                        Validate your vision.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
                            Before you build.
                        </span>
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-md">
                        Subject your startup thesis to the world's most rigorous AI advisory council. Six elite personas. Three rounds of adversarial debate. One definitive verdict.
                    </p>

                    <div className="space-y-5">
                        <div className="flex items-start gap-4 text-slate-300 group">
                            <div className="mt-0.5 w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold text-sm shrink-0 group-hover:bg-cyan-900/30 group-hover:border-cyan-500/50 transition-colors">1</div>
                            <div>
                                <h3 className="text-white font-medium mb-1">Pre-Mortem Analysis</h3>
                                <p className="text-sm text-slate-500">Identify fatal flaws before writing a single line of code or spending budget.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 text-slate-300 group">
                            <div className="mt-0.5 w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-purple-400 font-bold text-sm shrink-0 group-hover:bg-purple-900/30 group-hover:border-purple-500/50 transition-colors">2</div>
                            <div>
                                <h3 className="text-white font-medium mb-1">Dialectical Inquiry</h3>
                                <p className="text-sm text-slate-500">Watch specialized agents aggressively cross-examine each other's assumptions.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 text-slate-300 group">
                            <div className="mt-0.5 w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0 group-hover:bg-emerald-900/30 group-hover:border-emerald-500/50 transition-colors">3</div>
                            <div>
                                <h3 className="text-white font-medium mb-1">Codebase Context</h3>
                                <p className="text-sm text-slate-500">Upload your active repositories for highly technical and grounded architectural reviews.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Legal */}
                <div className="relative z-10 flex items-center gap-4 text-slate-600 text-xs">
                    <span>© {new Date().getFullYear()} CouncilIA</span>
                    <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
                    <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
                </div>
            </div>

            {/* Right Panel: Active Login Area */}
            <div className="flex-1 flex flex-col justify-center relative p-6 sm:p-12 lg:p-24 overflow-y-auto">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 p-[1px]">
                        <div className="w-full h-full bg-[#0a0f1d] rounded-[11px] flex items-center justify-center">
                            <span className="text-xl">🏛️</span>
                        </div>
                    </div>
                    <span className="text-white font-bold text-xl tracking-wide">CouncilIA</span>
                </div>

                {/* Subtle background element for form area */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

                <div className="relative z-10 w-full max-w-[420px] mx-auto xl:mx-0 xl:ml-[10%]">
                    <Suspense fallback={
                        <div className="p-8 border border-white/5 rounded-2xl bg-white/[0.02] flex flex-col items-center justify-center min-h-[400px]">
                            <div className="w-8 h-8 border-2 border-slate-600 border-t-cyan-500 rounded-full animate-spin mb-4" />
                            <div className="text-slate-400 font-mono text-sm">Initializing secure terminal...</div>
                        </div>
                    }>
                        <LoginForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
