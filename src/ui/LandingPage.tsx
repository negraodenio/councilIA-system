'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LandingPage() {
    const router = useRouter();
    const [idea, setIdea] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('Ready');
    const [results, setResults] = useState<any>(null);
    const [typingText, setTypingText] = useState({ market: '', risk: '', rec: '' });
    const outputColRef = useRef<HTMLDivElement>(null);

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
                // payload looks like: { perspectives: [{name, text, emoji}], score, recommendation }
                // We need to map it to the new UI structure (Market, Risk, Verdict)
                
                const marketText = payload.perspectives.find((p: any) => p.id === 'market')?.text || payload.perspectives[0]?.text;
                const riskText = payload.perspectives.find((p: any) => p.id === 'risk' || p.id === 'contrarian')?.text || payload.perspectives[1]?.text;
                
                setResults({
                    market: marketText,
                    risk: riskText,
                    verdict: payload.score >= 70 ? 'GO' : payload.score >= 40 ? 'CONDITIONAL' : 'NO-GO',
                    confidence: payload.score,
                    recommendation: payload.recommendation
                });

                setStatus('Council aligned');
                
                // Start typing effects
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
        <div className="landing-page-v3">
            <style jsx>{`
                .landing-page-v3 {
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
                }

                .landing-page-v3::before {
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
                    position: relative;
                    z-index: 10;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 28px 60px;
                    border-bottom: 1px solid var(--border);
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
                    font-size: 14px;
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
                    font-size: 14px;
                    font-weight: 500;
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
                    padding: 80px 60px 0;
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
                }

                .demo-panel {
                    border-radius: 20px;
                    border: 1px solid var(--border-hover);
                    background: var(--surface);
                    overflow: hidden;
                    position: relative;
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
                    font-size: 12px;
                    color: var(--muted);
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                }

                .demo-body {
                    padding: 24px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                    min-height: 320px;
                }

                .demo-input-col {
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                }

                .input-label {
                    font-size: 11px;
                    color: var(--muted);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    font-weight: 500;
                }

                textarea#q {
                    flex: 1;
                    background: var(--surface-2);
                    border: 1px solid var(--border);
                    border-radius: 14px;
                    padding: 18px;
                    color: var(--text);
                    font-size: 16px;
                    font-family: 'DM Sans', sans-serif;
                    font-weight: 300;
                    line-height: 1.7;
                    resize: none;
                    outline: none;
                    transition: border-color 0.2s;
                    min-height: 160px;
                }

                textarea#q::placeholder { color: rgba(255,255,255,0.22); }
                textarea#q:focus { border-color: var(--border-hover); }

                .chips-row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                .chip {
                    padding: 6px 12px;
                    border-radius: 999px;
                    background: var(--surface-2);
                    border: 1px solid var(--border);
                    color: var(--muted-2);
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.15s;
                    white-space: nowrap;
                }
                .chip:hover {
                    border-color: var(--teal);
                    color: var(--teal);
                }

                .run-btn {
                    padding: 14px 22px;
                    border-radius: 12px;
                    border: none;
                    background: linear-gradient(135deg, var(--teal), var(--indigo));
                    color: white;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 15px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: opacity 0.2s, transform 0.15s;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    width: 100%;
                    justify-content: center;
                }

                .run-btn:hover { opacity: 0.88; transform: translateY(-1px); }
                .run-btn:active { transform: translateY(0); }
                .run-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

                .demo-output-col {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .output-perspectives {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    flex: 1;
                }

                .perspective-card {
                    background: var(--surface-2);
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    padding: 14px 16px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    transition: border-color 0.2s;
                    min-height: 80px;
                }

                .perspective-card.active { border-color: var(--border-hover); }

                .p-tag {
                    font-size: 10px;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }

                .p-tag.market { color: var(--teal); }
                .p-tag.risk { color: #F59E0B; }
                .p-tag.rec { color: var(--indigo); }

                .p-text {
                    font-size: 13px;
                    line-height: 1.65;
                    color: rgba(240,244,250,0.75);
                    font-weight: 300;
                }

                .rec-card {
                    background: linear-gradient(135deg, var(--teal-dim), var(--indigo-dim));
                    border: 1px solid rgba(14,207,184,0.18);
                    border-radius: 12px;
                    padding: 14px 16px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 10px;
                }

                .rec-verdict {
                    font-family: 'Syne', sans-serif;
                    font-size: 22px;
                    font-weight: 800;
                    letter-spacing: -0.5px;
                }

                .rec-confidence {
                    font-size: 12px;
                    color: var(--muted-2);
                    text-align: right;
                }

                .rec-conf-num {
                    font-size: 20px;
                    font-weight: 500;
                    color: var(--teal);
                    display: block;
                }

                .skeleton-line {
                    height: 12px;
                    border-radius: 6px;
                    background: linear-gradient(90deg, var(--border) 25%, rgba(255,255,255,0.06) 50%, var(--border) 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.4s infinite;
                    margin-bottom: 6px;
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
                    margin: 56px auto 0;
                    padding: 0 60px 80px;
                }

                .sp-label {
                    text-align: center;
                    font-size: 12px;
                    color: var(--muted);
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    margin-bottom: 28px;
                }

                .sp-logos {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0;
                    border: 1px solid var(--border);
                    border-radius: 16px;
                    background: var(--surface);
                    overflow: hidden;
                }

                .sp-item {
                    flex: 1;
                    padding: 20px 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-right: 1px solid var(--border);
                }

                .sp-item:last-child { border-right: none; }

                .sp-logo-text {
                    font-family: 'Syne', sans-serif;
                    font-weight: 700;
                    font-size: 15px;
                    color: var(--muted);
                    letter-spacing: -0.3px;
                    transition: color 0.2s;
                }

                .sp-item:hover .sp-logo-text { color: var(--muted-2); }

                .sp-stat-row {
                    display: flex;
                    gap: 0;
                    margin-top: 16px;
                }

                .sp-stat {
                    flex: 1;
                    text-align: center;
                    padding: 20px;
                    border: 1px solid var(--border);
                    border-radius: 14px;
                    background: var(--surface);
                }

                .sp-stat + .sp-stat { margin-left: 12px; }

                .sp-stat-num {
                    font-family: 'Syne', sans-serif;
                    font-size: 32px;
                    font-weight: 800;
                    letter-spacing: -1px;
                    background: linear-gradient(135deg, var(--teal), var(--indigo));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    display: block;
                }

                .sp-stat-label {
                    font-size: 13px;
                    color: var(--muted);
                    margin-top: 4px;
                    font-weight: 300;
                }

                .sp-quote {
                    margin-top: 16px;
                    border: 1px solid var(--border);
                    border-radius: 14px;
                    background: var(--surface);
                    padding: 24px 28px;
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .q-avatar {
                    width: 44px; height: 44px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--teal-dim), var(--indigo-dim));
                    border: 1px solid var(--border-hover);
                    display: flex; align-items: center; justify-content: center;
                    font-family: 'Syne', sans-serif;
                    font-weight: 700;
                    font-size: 14px;
                    flex-shrink: 0;
                }

                .q-body {
                    flex: 1;
                }

                .q-text {
                    font-size: 15px;
                    line-height: 1.7;
                    color: var(--muted-2);
                    font-weight: 300;
                    font-style: italic;
                    margin-bottom: 8px;
                }

                .q-author {
                    font-size: 13px;
                    color: var(--muted);
                }

                .q-author strong {
                    color: var(--text);
                    font-weight: 500;
                    font-style: normal;
                }

                @media (max-width: 860px) {
                    nav { padding: 20px 24px; }
                    .hero { padding: 52px 24px 0; }
                    .demo-body { grid-template-columns: 1fr; }
                    .demo-output-col { display: none; }
                    .social-proof { padding: 0 24px 60px; }
                    .sp-logos { flex-wrap: wrap; }
                    .sp-item { border-right: none; border-bottom: 1px solid var(--border); }
                    .sp-item:last-child { border-bottom: none; }
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
                    <Link href="#" className="nav-link">Product</Link>
                    <Link href="#" className="nav-link">Use Cases</Link>
                    <Link href="#" className="nav-link">Pricing</Link>
                    <button onClick={() => router.push('/login')} className="nav-cta">Start free →</button>
                </div>
            </nav>

            <section className="hero">
                <div className="eyebrow">
                    <div className="eyebrow-dot"></div>
                    <span>Strategic Simulation AI</span>
                </div>

                <h1>
                    Simulate the decision.
                    <span className="h1-line2">Before reality does.</span>
                </h1>

                <p className="hero-sub">
                    Run any strategic decision through multiple AI perspectives — financial, operational, contrarian — and get a clear recommendation before you commit.
                </p>

                <div className="demo-panel">
                    <div className="demo-top">
                        <div className="demo-dots">
                            <div className="demo-dot"></div>
                            <div className="demo-dot"></div>
                            <div className="demo-dot"></div>
                        </div>
                        <div className="demo-label">Live Simulation</div>
                        <div style={{ fontSize: '12px', color: status === 'Simulating…' ? '#F59E0B' : '#0ECFB8' }}>
                            {status}
                        </div>
                    </div>

                    <div className="demo-body">
                        <div className="demo-input-col">
                            <div className="input-label">Your decision</div>
                            <textarea 
                                id="q" 
                                placeholder="Should we expand to Brazil or Portugal first?"
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                            />

                            <div className="chips-row">
                                <div className="chip" onClick={() => setQ('Should we hire now or wait until Series A?')}>Hiring timing</div>
                                <div className="chip" onClick={() => setQ('Should we raise prices by 20% this quarter?')}>Pricing</div>
                                <div className="chip" onClick={() => setQ('Should we build the feature in-house or buy a solution?')}>Build vs buy</div>
                                <div className="chip" onClick={() => setQ('Should we enter the US market before product-market fit?')}>Market entry</div>
                            </div>

                            <button className="run-btn" disabled={loading || !idea.trim()} onClick={runSimulation}>
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polygon points="5,3 19,12 5,21"/></svg>
                                Run Simulation
                            </button>
                        </div>

                        <div className="demo-output-col">
                            <div className="output-perspectives">
                                <div className={`perspective-card ${loading ? 'state-loading' : results ? 'active' : 'state-idle'}`}>
                                    <div className="p-tag market">Market Perspective</div>
                                    <div className="skel">
                                        <div className="skeleton-line" style={{ width: '90%' }}></div>
                                        <div className="skeleton-line" style={{ width: '70%' }}></div>
                                    </div>
                                    <div className="p-text">
                                        {results ? typingText.market : "Run a simulation to see how the market sees this."}
                                        {loading && <span className="cursor"></span>}
                                    </div>
                                </div>

                                <div className={`perspective-card ${loading ? 'state-loading' : results ? 'active' : 'state-idle'}`}>
                                    <div className="p-tag risk">Risk Perspective</div>
                                    <div className="skel">
                                        <div className="skeleton-line" style={{ width: '85%' }}></div>
                                        <div className="skeleton-line" style={{ width: '60%' }}></div>
                                    </div>
                                    <div className="p-text">
                                        {results ? typingText.risk : "Operational and financial risks will appear here."}
                                        {loading && <span className="cursor"></span>}
                                    </div>
                                </div>
                            </div>

                            <div className="rec-card">
                                <div>
                                    <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Recommendation</div>
                                    <div className="rec-verdict" style={{ color: results?.verdict === 'GO' ? 'var(--teal)' : results?.verdict === 'NO-GO' ? '#F87171' : '#F59E0B' }}>
                                        {results ? results.verdict : '—'}
                                    </div>
                                    <div className="p-text" style={{ fontSize: '12px', marginTop: '4px' }}>
                                        {results ? typingText.rec : "Waiting for simulation…"}
                                    </div>
                                </div>
                                <div className="rec-confidence">
                                    <span className="rec-conf-num">{results ? results.confidence + '%' : '—'}</span>
                                    Confidence
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="social-proof">
                <div className="sp-label">Trusted by forward-thinking teams</div>
                <div className="sp-logos">
                    <div className="sp-item"><span className="sp-logo-text">Accenture</span></div>
                    <div className="sp-item"><span className="sp-logo-text">Deloitte Digital</span></div>
                    <div className="sp-item"><span className="sp-logo-text">Sequoia Alumni</span></div>
                    <div className="sp-item"><span className="sp-logo-text">YC W24</span></div>
                    <div className="sp-item"><span className="sp-logo-text">500 Startups</span></div>
                </div>

                <div className="sp-stat-row">
                    <div className="sp-stat">
                        <span className="sp-stat-num">12 400+</span>
                        <div className="sp-stat-label">Simulations run</div>
                    </div>
                    <div className="sp-stat">
                        <span className="sp-stat-num">87%</span>
                        <div className="sp-stat-label">Avg decision confidence</div>
                    </div>
                    <div className="sp-stat">
                        <span className="sp-stat-num">3.2×</span>
                        <div className="sp-stat-label">Faster than a strategy meeting</div>
                    </div>
                </div>

                <div className="sp-quote">
                    <div className="q-avatar">MF</div>
                    <div className="q-body">
                        <p className="q-text">"We ran a simulation before our Series B pitch. The council surfaced a risk our team had completely overlooked. We fixed it. The round closed."</p>
                        <p className="q-author"><strong>Miguel Ferreira</strong> — CEO, Portela Labs</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
