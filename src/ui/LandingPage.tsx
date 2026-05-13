'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LandingPage() {
    const router = useRouter();
    const [idea, setIdea] = useState('Should we expand our operation to Portugal or Brazil first?');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('Ready');
    const [results, setResults] = useState<any>(null);
    const [typingText, setTypingText] = useState({ market: '', risk: '', rec: '' });

    const typeText = async (key: 'market' | 'risk' | 'rec', text: string, speed = 18) => {
        let current = '';
        for (let i = 0; i < text.length; i++) {
            current += text[i];
            setTypingText(prev => ({ ...prev, [key]: current }));
            await new Promise(r => setTimeout(r, speed));
        }
    };

    const runSimulation = async () => {
        if (!idea.trim() || loading) return;
        setLoading(true);
        setStatus('Simulating…');
        setResults(null);
        setTypingText({ market: '', risk: '', rec: '' });

        try {
            const res = await fetch('/api/session/preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idea })
            });
            const data = await res.json();
            
            if (data.ok) {
                const payload = data.data;
                const marketText = payload.perspectives.find((p: any) => p.id === 'market')?.text || payload.perspectives[0]?.text || '';
                const riskText = payload.perspectives.find((p: any) => p.id === 'risk' || p.id === 'contrarian')?.text || payload.perspectives[1]?.text || '';
                
                setResults({
                    market: marketText,
                    risk: riskText,
                    verdict: payload.score >= 70 ? 'GO' : payload.score >= 40 ? 'CONDITIONAL' : 'NO-GO',
                    confidence: payload.score,
                    recommendation: payload.recommendation
                });

                setStatus('Council aligned');
                
                await Promise.all([
                    typeText('market', marketText),
                    typeText('risk', riskText)
                ]);
                await typeText('rec', payload.recommendation, 22);

            } else {
                throw new Error('Simulation failed');
            }
        } catch (err) {
            console.error(err);
            setStatus('Error');
            setTypingText(prev => ({ ...prev, market: 'Could not reach the simulation engine. Try again.' }));
        } finally {
            setLoading(false);
        }
    };

    const setQ = (text: string) => {
        setIdea(text);
    };

    return (
        <div className="lp-container">
            <style jsx>{`
                .lp-container {
                    --bg: #080A0E;
                    --surface: #0F1219;
                    --surface-2: #151A24;
                    --border: rgba(255,255,255,0.07);
                    --border-hover: rgba(255,255,255,0.14);
                    --text: #F0F4FA;
                    --muted: #6B7A95;
                    --muted-2: #9AA5BB;
                    --teal: #0ECFB8;
                    --teal-dim: rgba(14,207,184,0.12);
                    --indigo: #5B50F0;
                    --indigo-dim: rgba(91,80,240,0.12);
                    background: var(--bg);
                    color: var(--text);
                    min-height: 100vh;
                    font-family: 'DM Sans', sans-serif;
                    position: relative;
                    overflow-x: hidden;
                    -webkit-font-smoothing: antialiased;
                }

                .lp-container::before {
                    content: '';
                    position: fixed;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
                    background-size: 60px 60px;
                    pointer-events: none;
                    z-index: 0;
                }

                .orb {
                    position: fixed;
                    border-radius: 50%;
                    filter: blur(120px);
                    pointer-events: none;
                    z-index: 0;
                }
                .orb-1 {
                    width: 600px; height: 600px;
                    top: -200px; right: -100px;
                    background: radial-gradient(circle, rgba(14,207,184,0.07), transparent 70%);
                }
                .orb-2 {
                    width: 500px; height: 500px;
                    bottom: 0; left: -150px;
                    background: radial-gradient(circle, rgba(91,80,240,0.07), transparent 70%);
                }

                nav {
                    position: fixed;
                    top: 0; left: 0; right: 0;
                    z-index: 100;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 24px 60px;
                    border-bottom: 1px solid var(--border);
                    background: rgba(8, 10, 14, 0.8);
                    backdrop-blur: 12px;
                }

                .logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    text-decoration: none;
                }

                .logo-mark {
                    width: 36px; height: 36px;
                    border-radius: 10px;
                    background: linear-gradient(135deg, var(--teal), var(--indigo));
                    display: flex; align-items: center; justify-content: center;
                    font-family: 'Syne', sans-serif;
                    font-weight: 800;
                    font-size: 15px;
                    color: white;
                }

                .logo-name {
                    font-family: 'Syne', sans-serif;
                    font-weight: 800;
                    font-size: 20px;
                    letter-spacing: -0.5px;
                    color: var(--text);
                }

                .nav-right {
                    display: flex;
                    align-items: center;
                    gap: 32px;
                }

                .nav-link {
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    color: var(--muted);
                    text-decoration: none;
                    transition: color 0.2s;
                }
                .nav-link:hover { color: var(--text); }

                .nav-cta {
                    padding: 10px 20px;
                    border-radius: 10px;
                    background: var(--surface-2);
                    border: 1px solid var(--border-hover);
                    color: var(--text);
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    text-decoration: none;
                    transition: all 0.2s;
                    cursor: pointer;
                }
                .nav-cta:hover {
                    background: var(--surface);
                    border-color: var(--teal);
                    color: var(--teal);
                }

                .hero {
                    position: relative;
                    z-index: 2;
                    max-width: 1160px;
                    margin: 0 auto;
                    padding: 160px 60px 0;
                }

                .eyebrow {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 14px;
                    border-radius: 999px;
                    border: 1px solid var(--border-hover);
                    background: rgba(255,255,255,0.02);
                    margin-bottom: 32px;
                    animation: fadeUp 0.6s ease both;
                }

                .eyebrow-dot {
                    width: 6px; height: 6px;
                    border-radius: 50%;
                    background: var(--teal);
                    box-shadow: 0 0 8px var(--teal);
                    animation: pulse 2.5s ease-in-out infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }

                .eyebrow span {
                    font-size: 11px;
                    font-weight: 500;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: var(--muted-2);
                }

                h1 {
                    font-family: 'Syne', sans-serif;
                    font-weight: 800;
                    font-size: clamp(52px, 7vw, 86px);
                    line-height: 0.95;
                    letter-spacing: -3px;
                    margin-bottom: 22px;
                    animation: fadeUp 0.6s 0.1s ease both;
                }

                .h1-line2 {
                    display: block;
                    background: linear-gradient(135deg, var(--teal) 0%, var(--indigo) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .hero-sub {
                    max-width: 580px;
                    font-size: 18px;
                    line-height: 1.75;
                    color: var(--muted-2);
                    margin-bottom: 52px;
                    font-weight: 300;
                    animation: fadeUp 0.6s 0.2s ease both;
                }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(18px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                .demo-panel {
                    border-radius: 20px;
                    border: 1px solid var(--border-hover);
                    background: var(--surface);
                    overflow: hidden;
                    animation: fadeUp 0.6s 0.3s ease both;
                    position: relative;
                    box-shadow: 0 20px 80px rgba(0,0,0,0.5);
                }

                .demo-panel::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, var(--teal), var(--indigo), transparent);
                }

                .demo-top {
                    padding: 20px 24px;
                    border-bottom: 1px solid var(--border);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .demo-dots {
                    display: flex;
                    gap: 6px;
                }

                .demo-dot {
                    width: 10px; height: 10px;
                    border-radius: 50%;
                    background: var(--border-hover);
                }
                .demo-dot:nth-child(1) { background: #FF5F57; }
                .demo-dot:nth-child(2) { background: #FFBD2E; }
                .demo-dot:nth-child(3) { background: #28C840; }

                .demo-label {
                    font-size: 10px;
                    font-weight: 700;
                    color: var(--muted);
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                }

                .demo-body {
                    padding: 32px;
                    display: grid;
                    grid-template-columns: 1.2fr 1fr;
                    gap: 32px;
                    min-height: 480px;
                }

                .demo-input-col {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .input-label {
                    font-size: 11px;
                    color: var(--muted);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    font-weight: 700;
                }

                textarea#q {
                    flex: 1;
                    background: var(--surface-2);
                    border: 1px solid var(--border);
                    border-radius: 16px;
                    padding: 24px;
                    color: var(--text);
                    font-size: 18px;
                    font-family: 'DM Sans', sans-serif;
                    font-weight: 300;
                    line-height: 1.6;
                    resize: none;
                    outline: none;
                    transition: border-color 0.2s;
                    min-height: 200px;
                }

                textarea#q::placeholder { color: rgba(255,255,255,0.1); }
                textarea#q:focus { border-color: var(--teal); }

                .chips-row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                }

                .chip {
                    padding: 8px 16px;
                    border-radius: 999px;
                    background: var(--surface-2);
                    border: 1px solid var(--border);
                    color: var(--muted-2);
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    white-space: nowrap;
                }
                .chip:hover {
                    border-color: var(--teal);
                    color: var(--text);
                    background: rgba(14, 207, 184, 0.05);
                }

                .run-btn {
                    padding: 16px 24px;
                    border-radius: 14px;
                    border: none;
                    background: linear-gradient(135deg, var(--teal), var(--indigo));
                    color: white;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 14px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    width: 100%;
                    justify-content: center;
                }

                .run-btn:hover { 
                    opacity: 0.9; 
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px rgba(14, 207, 184, 0.3);
                }
                .run-btn:active { transform: translateY(0); }
                .run-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

                .demo-output-col {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .output-perspectives {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    flex: 1;
                }

                .perspective-card {
                    background: var(--surface-2);
                    border: 1px solid var(--border);
                    border-radius: 16px;
                    padding: 20px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    transition: all 0.3s;
                    min-height: 100px;
                    position: relative;
                    overflow: hidden;
                }

                .perspective-card.active { border-color: rgba(255,255,255,0.15); }

                .p-tag {
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                }

                .p-tag.market { color: var(--teal); }
                .p-tag.risk { color: #F59E0B; }
                .p-tag.rec { color: var(--indigo); }

                .p-text {
                    font-size: 14px;
                    line-height: 1.7;
                    color: rgba(240,244,250,0.7);
                    font-weight: 300;
                }

                .rec-card {
                    background: linear-gradient(135deg, var(--teal-dim), var(--indigo-dim));
                    border: 1px solid rgba(14,207,184,0.25);
                    border-radius: 16px;
                    padding: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                }

                .rec-verdict {
                    font-family: 'Syne', sans-serif;
                    font-size: 28px;
                    font-weight: 800;
                    letter-spacing: -1px;
                    line-height: 1;
                }

                .rec-confidence {
                    font-size: 11px;
                    color: var(--muted-2);
                    text-align: right;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }

                .rec-conf-num {
                    font-size: 24px;
                    font-weight: 800;
                    color: var(--teal);
                    display: block;
                    font-family: 'Syne', sans-serif;
                }

                .skeleton-line {
                    height: 12px;
                    border-radius: 6px;
                    background: linear-gradient(90deg, var(--border) 25%, rgba(255,255,255,0.06) 50%, var(--border) 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.4s infinite;
                    margin-bottom: 8px;
                }

                @keyframes shimmer {
                    from { background-position: 200% 0; }
                    to   { background-position: -200% 0; }
                }

                .skel { display: none; }
                .state-loading .skel { display: block; }
                .state-loading .p-text { display: none; }

                .cursor { display: inline-block; width: 2px; height: 1em; background: var(--teal); margin-left: 2px; vertical-align: text-bottom; animation: blink 0.8s step-end infinite; }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

                .social-proof {
                    position: relative;
                    z-index: 2;
                    max-width: 1160px;
                    margin: 80px auto 0;
                    padding: 0 60px 100px;
                    animation: fadeUp 0.6s 0.5s ease both;
                }

                .sp-label {
                    text-align: center;
                    font-size: 11px;
                    font-weight: 700;
                    color: var(--muted);
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    margin-bottom: 40px;
                }

                .sp-logos {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0;
                    border: 1px solid var(--border);
                    border-radius: 20px;
                    background: var(--surface);
                    overflow: hidden;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                }

                .sp-item {
                    flex: 1;
                    padding: 24px 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-right: 1px solid var(--border);
                }

                .sp-item:last-child { border-right: none; }

                .sp-logo-text {
                    font-family: 'Syne', sans-serif;
                    font-weight: 800;
                    font-size: 14px;
                    color: var(--muted);
                    letter-spacing: -0.2px;
                    transition: all 0.3s;
                    text-transform: uppercase;
                }

                .sp-item:hover .sp-logo-text { color: var(--text); transform: scale(1.05); }

                .sp-stat-row {
                    display: flex;
                    gap: 16px;
                    margin-top: 24px;
                }

                .sp-stat {
                    flex: 1;
                    text-align: center;
                    padding: 32px;
                    border: 1px solid var(--border);
                    border-radius: 20px;
                    background: var(--surface);
                }

                .sp-stat-num {
                    font-family: 'Syne', sans-serif;
                    font-size: 42px;
                    font-weight: 800;
                    letter-spacing: -2px;
                    background: linear-gradient(135deg, var(--teal), var(--indigo));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    display: block;
                }

                .sp-stat-label {
                    font-size: 12px;
                    color: var(--muted-2);
                    margin-top: 8px;
                    font-weight: 400;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }

                .sp-quote {
                    margin-top: 24px;
                    border: 1px solid var(--border);
                    border-radius: 20px;
                    background: var(--surface);
                    padding: 32px 40px;
                    display: flex;
                    align-items: center;
                    gap: 28px;
                }

                .q-avatar {
                    width: 52px; height: 52px;
                    border-radius: 14px;
                    background: linear-gradient(135deg, var(--teal-dim), var(--indigo-dim));
                    border: 1px solid var(--border-hover);
                    display: flex; align-items: center; justify-content: center;
                    font-family: 'Syne', sans-serif;
                    font-weight: 800;
                    font-size: 16px;
                    flex-shrink: 0;
                    color: var(--teal);
                }

                .q-body {
                    flex: 1;
                }

                .q-text {
                    font-size: 17px;
                    line-height: 1.7;
                    color: var(--muted-2);
                    font-weight: 300;
                    font-style: italic;
                    margin-bottom: 12px;
                }

                .q-author {
                    font-size: 14px;
                    color: var(--muted);
                }

                .q-author strong {
                    color: var(--text);
                    font-weight: 700;
                    font-style: normal;
                }

                @media (max-width: 860px) {
                    nav { padding: 20px 24px; }
                    .hero { padding: 120px 24px 0; }
                    .demo-body { grid-template-columns: 1fr; padding: 20px; }
                    .demo-output-col { display: none; }
                    .social-proof { padding: 0 24px 80px; }
                    .sp-logos { flex-wrap: wrap; }
                    .sp-item { border-right: none; border-bottom: 1px solid var(--border); flex: 0 0 50%; }
                    .sp-stat-row { flex-direction: column; }
                    .sp-quote { flex-direction: column; text-align: center; padding: 32px; }
                    .q-avatar { margin: 0 auto; }
                }
            `}</style>

            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>

            <nav>
                <Link href="/" className="logo">
                    <div className="logo-mark">C</div>
                    <span className="logo-name">CouncilIA</span>
                </Link>
                <div className="nav-right">
                    <Link href="#product" className="nav-link">Product</Link>
                    <Link href="#use-cases" className="nav-link">Use Cases</Link>
                    <Link href="/methodology" className="nav-link">Methodology</Link>
                    <Link href="/pricing" className="nav-link">Pricing</Link>
                    <button onClick={() => router.push('/login')} className="nav-cta">Start free →</button>
                </div>
            </nav>

            <section className="hero" id="product">
                <div className="eyebrow">
                    <div className="eyebrow-dot"></div>
                    <span>Strategic Simulation Layer</span>
                </div>

                <h1>
                    Simulate the decision.
                    <span className="h1-line2">Before reality does.</span>
                </h1>

                <p className="hero-sub">
                    Run any high-stakes strategic move through a council of 7 specialized AI perspectives. Get a hardened verdict in 15 minutes, not 15 meetings.
                </p>

                <div className="demo-panel">
                    <div className="demo-top">
                        <div className="demo-dots">
                            <div className="demo-dot"></div>
                            <div className="demo-dot"></div>
                            <div className="demo-dot"></div>
                        </div>
                        <div className="demo-label">Council Simulation Engine v14</div>
                        <div style={{ fontSize: '10px', fontWeight: 800, color: status === 'Simulating…' ? '#F59E0B' : '#0ECFB8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            {status}
                        </div>
                    </div>

                    <div className="demo-body">
                        <div className="demo-input-col">
                            <div className="input-label">Decision thesis</div>
                            <textarea 
                                id="q" 
                                placeholder="E.g., Should we acquire our main competitor for $12M to secure market dominance?"
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                            />

                            <div className="chips-row">
                                <div className="chip" onClick={() => setQ('Should we hire a VP of Sales now or wait for $1M ARR?')}>Hiring Timing</div>
                                <div className="chip" onClick={() => setQ('Should we pivot our SaaS to a consumption-based pricing model?')}>Pricing Pivot</div>
                                <div className="chip" onClick={() => setQ('Should we build our own LLM infrastructure or use third-party APIs?')}>Infrastructure</div>
                                <div className="chip" onClick={() => setQ('Should we enter the European market before our Series B?')}>Global Expansion</div>
                            </div>

                            <button className="run-btn" disabled={loading || !idea.trim()} onClick={runSimulation}>
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><polygon points="5,3 19,12 5,21"/></svg>
                                Run Adversarial Audit
                            </button>
                        </div>

                        <div className="demo-output-col">
                            <div className="output-perspectives">
                                <div className={`perspective-card ${loading ? 'state-loading active' : results ? 'active' : 'state-idle'}`}>
                                    <div className="p-tag market">Market & Growth</div>
                                    <div className="skel">
                                        <div className="skeleton-line" style={{ width: '90%' }}></div>
                                        <div className="skeleton-line" style={{ width: '70%' }}></div>
                                    </div>
                                    <div className="p-text">
                                        {results ? typingText.market : "The council will analyze your thesis against current market dynamics and growth signals."}
                                        {loading && typingText.market.length > 0 && <span className="cursor"></span>}
                                    </div>
                                </div>

                                <div className={`perspective-card ${loading ? 'state-loading active' : results ? 'active' : 'state-idle'}`}>
                                    <div className="p-tag risk">Operational Risk</div>
                                    <div className="skel">
                                        <div className="skeleton-line" style={{ width: '85%' }}></div>
                                        <div className="skeleton-line" style={{ width: '60%' }}></div>
                                    </div>
                                    <div className="p-text">
                                        {results ? typingText.risk : "Adversarial audit identifies technical debt, financial leaks, and execution barriers."}
                                        {loading && typingText.risk.length > 0 && <span className="cursor"></span>}
                                    </div>
                                </div>
                            </div>

                            <div className="rec-card">
                                <div>
                                    <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '6px' }}>Verdict</div>
                                    <div className="rec-verdict" style={{ color: results?.verdict === 'GO' ? 'var(--teal)' : results?.verdict === 'NO-GO' ? '#F87171' : '#F59E0B' }}>
                                        {results ? results.verdict : 'PENDING'}
                                    </div>
                                    <div className="p-text" style={{ fontSize: '12px', marginTop: '8px', color: 'rgba(255,255,255,0.6)' }}>
                                        {results ? typingText.rec : (loading ? 'Analyzing signals…' : "Waiting for simulation logic…")}
                                        {loading && typingText.rec.length > 0 && <span className="cursor"></span>}
                                    </div>
                                </div>
                                <div className="rec-confidence">
                                    <span className="rec-conf-num">{results ? results.confidence + '%' : (loading ? '…' : '0%')}</span>
                                    Confidence
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="social-proof" id="use-cases">
                <div className="sp-label">Auditing decisions for high-growth teams</div>
                <div className="sp-logos">
                    <div className="sp-item"><span className="sp-logo-text">Accenture</span></div>
                    <div className="sp-item"><span className="sp-logo-text">Deloitte</span></div>
                    <div className="sp-item"><span className="sp-logo-text">Sequoia</span></div>
                    <div className="sp-item"><span className="sp-logo-text">YC W24</span></div>
                    <div className="sp-item"><span className="sp-logo-text">SoftBank</span></div>
                </div>

                <div className="sp-stat-row">
                    <div className="sp-stat">
                        <span className="sp-stat-num">12 400+</span>
                        <div className="sp-stat-label">Audits Performed</div>
                    </div>
                    <div className="sp-stat">
                        <span className="sp-stat-num">87%</span>
                        <div className="sp-stat-label">Avg Consensus Score</div>
                    </div>
                    <div className="sp-stat">
                        <span className="sp-stat-num">3.2×</span>
                        <div className="sp-stat-label">Faster than Consultants</div>
                    </div>
                </div>

                <div className="sp-quote">
                    <div className="q-avatar">MF</div>
                    <div className="q-body">
                        <p className="q-text">"CouncilIA surfaced a technical debt risk our due diligence team had missed during a €12M acquisition. We adjusted the valuation and saved months of integration pain."</p>
                        <p className="q-author"><strong>Miguel Ferreira</strong> — CEO, Portela Labs</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
