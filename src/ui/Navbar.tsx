'use client';

import Link from 'next/link';

export function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-sm border-b border-neutral-100">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="text-lg font-semibold tracking-tight">
                    Council<span className="text-neutral-400">IA</span>
                </Link>
                <div className="hidden md:flex items-center gap-8 text-sm text-neutral-500">
                    <Link href="/#how" className="hover:text-neutral-900 transition font-medium">How it works</Link>
                    <Link href="/#council" className="hover:text-neutral-900 transition font-medium">The Council</Link>
                    <Link href="/#usecases" className="hover:text-neutral-900 transition font-medium">Use cases</Link>
                    <Link href="/pricing" className="hover:text-neutral-900 transition font-medium">Pricing</Link>
                    <Link href="/methodology" className="hover:text-neutral-900 transition font-bold text-cyan-600">Methodology</Link>
                    <Link
                        href="/login"
                        className="bg-neutral-900 text-white px-4 py-2 rounded-md text-sm hover:bg-neutral-800 transition shadow-sm"
                    >
                        Start a session
                    </Link>
                </div>
            </div>
        </nav>
    );
}
