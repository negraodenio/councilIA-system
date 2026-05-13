'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Navbar() {
    const router = useRouter();

    return (
        <nav className="relative z-10 flex items-center justify-between padding-x h-20 border-b border-[var(--border)] bg-[var(--bg)]/40 backdrop-blur-xl">
            <Link href="/" className="flex items-center gap-3 group">
                <div className="size-9 rounded-xl bg-gradient-to-br from-[var(--teal)] to-[var(--indigo)] flex items-center justify-center font-bold text-[15px] text-white shadow-lg shadow-[var(--teal-dim)]">
                    C
                </div>
                <span className="font-syne font-extrabold text-xl tracking-tighter text-[var(--text)] group-hover:text-[var(--teal)] transition-colors">
                    CouncilIA
                </span>
            </Link>

            <div className="flex items-center gap-8">
                <div className="hidden md:flex items-center gap-8 text-sm">
                    <Link href="/dashboard" className="text-[var(--muted)] hover:text-[var(--text)] transition-colors">Dashboard</Link>
                    <Link href="/dashboard/custom-persona" className="text-[var(--muted)] hover:text-[var(--text)] transition-colors">Perspectives</Link>
                    <Link href="#" className="text-[var(--muted)] hover:text-[var(--text)] transition-colors">Pricing</Link>
                </div>
                
                <button 
                    onClick={() => router.push('/login')}
                    className="px-5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border-hover)] text-[var(--text)] text-sm font-medium hover:border-[var(--teal)] hover:text-[var(--teal)] transition-all"
                >
                    Start free →
                </button>
            </div>
        </nav>
    );
}
