'use client';

import Link from 'next/link';

export function Footer() {
    return (
        <footer className="py-20 px-8 border-t border-[var(--border)] bg-[var(--bg)] relative overflow-hidden">
            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-grid-white/[0.025] bg-[size:60px_60px] pointer-events-none"></div>
            
            <div className="max-w-[1160px] mx-auto relative z-10">
                {/* Top row */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
                    {/* Company info */}
                    <div className="space-y-6 max-w-sm">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="size-8 rounded-lg bg-gradient-to-br from-[var(--teal)] to-[var(--indigo)] flex items-center justify-center font-bold text-sm text-white shadow-lg">
                                C
                            </div>
                            <span className="font-syne font-extrabold text-xl tracking-tighter text-[var(--text)] group-hover:text-[var(--teal)] transition-colors">
                                CouncilIA
                            </span>
                        </Link>
                        
                        <p className="text-sm text-[var(--muted-2)] font-light leading-relaxed">
                            Strategic Intelligence Layer for board-level decision support. Powered by{" "}
                            <a href="https://www.ia4all.eu" target="_blank" rel="noopener noreferrer" className="text-[var(--teal)] hover:underline">
                                ia4all.eu
                            </a>
                        </p>
                        
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
                                <span className="text-base">🇵🇹</span>
                                <span>Av. Álvares Cabral 13, Lisboa, Portugal</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
                                <span className="material-symbols-outlined text-sm">mail</span>
                                <a href="mailto:help@ia4all.eu" className="hover:text-[var(--text)] transition-colors">
                                    help@ia4all.eu
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-2 gap-16">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Product</h4>
                            <div className="flex flex-col gap-3 text-sm text-[var(--muted-2)]">
                                <Link href="/pricing" className="hover:text-[var(--teal)] transition-colors">Pricing</Link>
                                <Link href="/methodology" className="hover:text-[var(--teal)] transition-colors">Methodology</Link>
                                <Link href="/dashboard" className="hover:text-[var(--teal)] transition-colors">Dashboard</Link>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Legal</h4>
                            <div className="flex flex-col gap-3 text-sm text-[var(--muted-2)]">
                                <Link href="/privacy" className="hover:text-[var(--teal)] transition-colors">Privacy Policy</Link>
                                <Link href="/terms" className="hover:text-[var(--teal)] transition-colors">Terms of Service</Link>
                                <Link href="/compliance" className="hover:text-[var(--teal)] transition-colors">GDPR Compliance</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom row */}
                <div className="border-t border-[var(--border)] pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <span className="text-xs text-[var(--muted)] font-light tracking-wide">
                        © 2025 CouncilIA — EU-first, Executive-grade Intelligence.
                    </span>
                    <div className="flex items-center gap-6 text-xs text-[var(--muted)]">
                        <span className="flex items-center gap-2">
                            Founded by{" "}
                            <a href="https://linkedin.com/in/denionegrao" target="_blank" rel="noopener noreferrer" className="text-[var(--text)] font-medium hover:text-[var(--teal)] transition-colors">
                                Denio Negrao
                            </a>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
