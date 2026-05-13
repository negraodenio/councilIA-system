'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LandingPage() {
    const router = useRouter();
    const [idea, setIdea] = useState('');
    const [loading, setLoading] = useState(false);
    const [previewResult, setPreviewResult] = useState<any>(null);
    const resultRef = useRef<HTMLDivElement>(null);

    const runPreview = async () => {
        if (!idea.trim() || loading) return;
        setLoading(true);
        setPreviewResult(null);
        try {
            const res = await fetch('/api/session/preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idea })
            });
            const data = await res.json();
            if (data.ok) {
                setPreviewResult(data.data);
                setTimeout(() => {
                    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="landing-page-root">
            <style jsx>{`
                .landing-page-root {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    --bg: #0B0D12;
                    --surface: #12161D;
                    --surface-2: #171C25;
                    --text: #F8FAFC;
                    --muted: #94A3B8;
                    --line: rgba(255,255,255,0.06);
                    --accent: #14B8A6;
                    --accent2: #4F46E5;
                    --shadow: 0 10px 40px rgba(0,0,0,0.32);
                    --radius-xl: 30px;
                    --radius-lg: 22px;
                    font-family: 'Inter', sans-serif;
                    background:
                        radial-gradient(circle at top right, rgba(20,184,166,0.10), transparent 25%),
                        radial-gradient(circle at bottom left, rgba(79,70,229,0.10), transparent 25%),
                        var(--bg);
                    color: var(--text);
                    min-height: 100 screen;
                    overflow-x: hidden;
                    -webkit-font-smoothing: antialiased;
                }

                .noise {
                    position: fixed;
                    inset: 0;
                    opacity: 0.015;
                    pointer-events: none;
                    background-image:
                        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cg fill='white'%3E%3Ccircle cx='12' cy='12' r='1'/%3E%3Ccircle cx='70' cy='50' r='1'/%3E%3Ccircle cx='120' cy='80' r='1'/%3E%3Ccircle cx='90' cy='130' r='1'/%3E%3C/g%3E%3C/svg%3E");
                    z-index: 1;
                }

                .container {
                    max-width: 1440px;
                    margin: 0 auto;
                    padding: 0 40px;
                    position: relative;
                    z-index: 2;
                }

                nav {
                    height: 92px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .logo {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }

                .logo-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: 14px;
                    background: linear-gradient(135deg, var(--accent), var(--accent2));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 16px;
                    box-shadow: 0 0 30px rgba(20,184,166,0.18);
                    color: white;
                }

                .logo-text {
                    display: flex;
                    flex-direction: column;
                }

                .logo-title {
                    font-size: 22px;
                    font-weight: 800;
                    letter-spacing: -1px;
                }

                .logo-sub {
                    font-size: 10px;
                    color: var(--muted);
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                }

                .nav-links {
                    display: flex;
                    align-items: center;
                    gap: 34px;
                }

                .nav-links a {
                    text-decoration: none;
                    color: var(--muted);
                    font-size: 15px;
                    transition: 0.3s ease;
                }

                .nav-links a:hover {
                    color: white;
                }

                .cta {
                    padding: 14px 24px;
                    border-radius: 16px;
                    background: linear-gradient(135deg, var(--accent), var(--accent2));
                    text-decoration: none;
                    color: white;
                    font-weight: 700;
                    font-size: 14px;
                    box-shadow: 0 0 40px rgba(20,184,166,0.16);
                    transition: 0.35s ease;
                    border: none;
                    cursor: pointer;
                }

                .cta:hover {
                    transform: translateY(-2px);
                }

                .hero {
                    padding: 90px 0 100px;
                    text-align: center;
                }

                .badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 18px;
                    border-radius: 999px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid var(--line);
                    margin-bottom: 38px;
                    backdrop-filter: blur(12px);
                }

                .badge-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 999px;
                    background: var(--accent);
                    box-shadow: 0 0 12px var(--accent);
                }

                .badge span {
                    font-size: 11px;
                    color: var(--muted);
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    font-weight: 700;
                }

                h1 {
                    font-size: 112px;
                    line-height: 0.90;
                    letter-spacing: -7px;
                    font-weight: 900;
                    max-width: 1100px;
                    margin: 0 auto 34px;
                }

                .gradient {
                    background: linear-gradient(135deg, var(--accent), var(--accent2));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .subtitle {
                    max-width: 900px;
                    margin: 0 auto;
                    color: var(--muted);
                    font-size: 25px;
                    line-height: 1.7;
                }

                .prompt-wrapper {
                    margin: 70px auto 0;
                    max-width: 1120px;
                    border-radius: var(--radius-xl);
                    background: rgba(255,255,255,0.03);
                    border: 1px solid var(--line);
                    padding: 28px;
                    backdrop-filter: blur(16px);
                    box-shadow: var(--shadow);
                    text-align: left;
                }

                .prompt-top {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 20px;
                }

                .prompt-label {
                    color: var(--muted);
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.16em;
                    font-weight: 700;
                }

                .prompt-free {
                    color: rgba(255,255,255,0.35);
                    font-size: 12px;
                }

                textarea {
                    width: 100%;
                    min-height: 170px;
                    background: var(--surface);
                    border: 1px solid var(--line);
                    border-radius: 24px;
                    padding: 28px;
                    color: white;
                    font-size: 24px;
                    line-height: 1.7;
                    resize: none;
                    outline: none;
                    font-family: 'Inter', sans-serif;
                }

                textarea::placeholder {
                    color: rgba(255,255,255,0.28);
                }

                .prompt-footer {
                    margin-top: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .chips {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }

                .chip {
                    padding: 10px 14px;
                    border-radius: 999px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.05);
                    color: var(--muted);
                    font-size: 12px;
                }

                .simulate-btn {
                    padding: 16px 28px;
                    border-radius: 16px;
                    border: none;
                    background: linear-gradient(135deg, var(--accent), var(--accent2));
                    color: white;
                    font-size: 15px;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow: 0 0 40px rgba(20,184,166,0.15);
                    transition: 0.3s ease;
                }

                .simulate-btn:hover {
                    transform: translateY(-2px);
                }

                .simulate-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .preview-grid {
                    margin-top: 38px;
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                }

                .preview-card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid var(--line);
                    border-radius: 24px;
                    padding: 28px;
                }

                .preview-tag {
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.14em;
                    color: var(--muted);
                    margin-bottom: 16px;
                    font-weight: 700;
                }

                .preview-card p {
                    color: rgba(255,255,255,0.76);
                    line-height: 1.8;
                    font-size: 16px;
                }

                .section {
                    padding: 120px 0;
                }

                .section-title {
                    text-align: center;
                    font-size: 64px;
                    line-height: 1;
                    letter-spacing: -4px;
                    margin-bottom: 24px;
                }

                .section-sub {
                    max-width: 760px;
                    margin: 0 auto 70px;
                    text-align: center;
                    color: var(--muted);
                    font-size: 20px;
                    line-height: 1.8;
                }

                .features {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 24px;
                }

                .feature-card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid var(--line);
                    border-radius: 28px;
                    padding: 36px;
                    transition: 0.35s ease;
                }

                .feature-card:hover {
                    transform: translateY(-6px);
                    border-color: rgba(255,255,255,0.12);
                }

                .feature-icon {
                    width: 52px;
                    height: 52px;
                    border-radius: 18px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 26px;
                    font-size: 20px;
                }

                .feature-card h3 {
                    font-size: 28px;
                    margin-bottom: 18px;
                    line-height: 1.1;
                }

                .feature-card p {
                    color: rgba(255,255,255,0.65);
                    line-height: 1.9;
                    font-size: 16px;
                }

                .simulation-demo {
                    margin-top: 90px;
                    border-radius: 34px;
                    overflow: hidden;
                    border: 1px solid var(--line);
                    background: rgba(255,255,255,0.03);
                    backdrop-filter: blur(14px);
                    box-shadow: var(--shadow);
                }

                .simulation-header {
                    padding: 22px 28px;
                    border-bottom: 1px solid var(--line);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .simulation-title {
                    font-size: 15px;
                    color: var(--muted);
                }

                .simulation-status {
                    color: var(--accent);
                    font-size: 13px;
                }

                .simulation-body {
                    padding: 34px;
                    display: grid;
                    grid-template-columns: 1.2fr 0.8fr;
                    gap: 26px;
                }

                .discussion {
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                }

                .discussion-card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid var(--line);
                    border-radius: 22px;
                    padding: 22px;
                }

                .discussion-role {
                    color: var(--muted);
                    font-size: 11px;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    margin-bottom: 12px;
                    font-weight: 700;
                }

                .discussion-card p {
                    color: rgba(255,255,255,0.78);
                    line-height: 1.8;
                }

                .consensus {
                    background: linear-gradient(
                        180deg,
                        rgba(20,184,166,0.10),
                        rgba(79,70,229,0.10)
                    );
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 28px;
                    padding: 30px;
                }

                .consensus-label {
                    color: var(--muted);
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.14em;
                    margin-bottom: 16px;
                    font-weight: 700;
                }

                .consensus h4 {
                    font-size: 42px;
                    margin-bottom: 18px;
                }

                .consensus p {
                    color: rgba(255,255,255,0.78);
                    line-height: 1.9;
                    margin-bottom: 24px;
                }

                .confidence {
                    padding: 14px 18px;
                    border-radius: 16px;
                    background: rgba(255,255,255,0.06);
                    display: inline-block;
                    color: white;
                    font-weight: 700;
                    font-size: 14px;
                }

                .final-cta {
                    text-align: center;
                    padding-bottom: 120px;
                }

                .final-cta h2 {
                    font-size: 78px;
                    line-height: 0.96;
                    letter-spacing: -5px;
                    margin-bottom: 24px;
                }

                .final-cta p {
                    max-width: 760px;
                    margin: 0 auto 40px;
                    color: var(--muted);
                    font-size: 21px;
                    line-height: 1.8;
                }

                @media(max-width: 1200px) {
                    h1 { font-size: 82px; }
                    .preview-grid, .features, .simulation-body { grid-template-columns: 1fr; }
                }

                @media(max-width: 768px) {
                    .container { padding: 0 24px; }
                    .nav-links { display: none; }
                    h1 { font-size: 56px; letter-spacing: -4px; }
                    .subtitle { font-size: 18px; }
                    textarea { font-size: 18px; }
                    .prompt-footer { flex-direction: column; align-items: flex-start; gap: 18px; }
                    .section-title { font-size: 44px; }
                    .final-cta h2 { font-size: 50px; }
                }
            `}</style>

            <div className="noise"></div>

            <div className="container">
                <nav>
                    <div className="logo">
                        <div className="logo-icon">C</div>
                        <div className="logo-text">
                            <div className="logo-title">CouncilIA</div>
                            <div className="logo-sub">Strategic Simulation AI</div>
                        </div>
                    </div>

                    <div className="nav-links">
                        <a href="#">Product</a>
                        <a href="#">Perspectives</a>
                        <a href="#">Use Cases</a>
                        <a href="#">Pricing</a>
                        <a href="#">Resources</a>
                    </div>

                    <button onClick={() => router.push('/login')} className="cta">
                        Start Simulating
                    </button>
                </nav>

                <section className="hero">
                    <div className="badge">
                        <div className="badge-dot"></div>
                        <span>Collaborative Strategic Intelligence</span>
                    </div>

                    <h1>
                        Simulate outcomes <br />
                        <span className="gradient">before you commit.</span>
                    </h1>

                    <p className="subtitle">
                        CouncilIA helps founders, operators and organizations explore strategic decisions through collaborative AI perspectives and organizational intelligence — before real-world execution.
                    </p>

                    <div className="prompt-wrapper">
                        <div className="prompt-top">
                            <div className="prompt-label">Try a lightweight simulation</div>
                            <div className="prompt-free">No signup required</div>
                        </div>

                        <textarea 
                            placeholder="Should we expand operations to Brazil or Portugal first?"
                            value={idea}
                            onChange={(e) => setIdea(e.target.value)}
                        ></textarea>

                        <div className="prompt-footer">
                            <div className="chips">
                                <div className="chip">Market Expansion</div>
                                <div className="chip">AI Adoption</div>
                                <div className="chip">Pricing Strategy</div>
                                <div className="chip">Operations</div>
                            </div>

                            <button 
                                className="simulate-btn"
                                onClick={runPreview}
                                disabled={loading || !idea.trim()}
                            >
                                {loading ? 'Simulating...' : 'Simulate'}
                            </button>
                        </div>

                        {previewResult && (
                            <div ref={resultRef} className="preview-grid">
                                {previewResult.perspectives.map((p: any) => (
                                    <div key={p.id} className="preview-card">
                                        <div className="preview-tag">{p.name}</div>
                                        <p>{p.text}</p>
                                    </div>
                                ))}
                                <div className="preview-card">
                                    <div className="preview-tag">Recommendation</div>
                                    <p>{previewResult.recommendation}</p>
                                </div>
                            </div>
                        )}
                        
                        {!previewResult && !loading && (
                             <div className="preview-grid">
                                <div className="preview-card">
                                    <div className="preview-tag">Market Perspective</div>
                                    <p>Brazil offers stronger long-term upside, but operational complexity and support costs may slow execution during the first 18 months.</p>
                                </div>
                                <div className="preview-card">
                                    <div className="preview-tag">Contrarian Perspective</div>
                                    <p>Expanding into the smaller market first may create stronger operational maturity before scaling aggressively.</p>
                                </div>
                                <div className="preview-card">
                                    <div className="preview-tag">Recommendation</div>
                                    <p>Validate operational assumptions in Portugal first, then expand into Brazil with stronger execution readiness.</p>
                                </div>
                             </div>
                        )}
                    </div>
                </section>

                <section className="section">
                    <h2 className="section-title">Strategic thinking for modern organizations.</h2>
                    <p className="section-sub">Simulate strategic decisions through multiple perspectives, organizational memory and real-world consequence modeling.</p>

                    <div className="features">
                        <div className="feature-card">
                            <div className="feature-icon">◐</div>
                            <h3>Strategic Perspectives</h3>
                            <p>Multiple AI perspectives collaborate and debate decisions to expose blind spots, hidden assumptions and second-order effects.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">◎</div>
                            <h3>Organizational Intelligence</h3>
                            <p>Bring company knowledge, strategic context and internal memory directly into simulations and recommendations.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">✦</div>
                            <h3>Decision Confidence</h3>
                            <p>Move beyond intuition with simulated strategic outcomes designed to improve clarity before execution.</p>
                        </div>
                    </div>

                    <div className="simulation-demo">
                        <div className="simulation-header">
                            <div className="simulation-title">Strategic Simulation — Market Expansion</div>
                            <div className="simulation-status">Council aligned</div>
                        </div>

                        <div className="simulation-body">
                            <div className="discussion">
                                <div className="discussion-card">
                                    <div className="discussion-role">Financial Perspective</div>
                                    <p>Customer acquisition costs may exceed projections during the first year, reducing margin sustainability during aggressive expansion.</p>
                                </div>
                                <div className="discussion-card">
                                    <div className="discussion-role">Operations Perspective</div>
                                    <p>Current support infrastructure may struggle with multilingual operational scaling across multiple regions simultaneously.</p>
                                </div>
                                <div className="discussion-card">
                                    <div className="discussion-role">Company Perspective</div>
                                    <p>Previous LATAM expansion initiatives experienced elevated onboarding and support complexity during rapid deployment phases.</p>
                                </div>
                            </div>

                            <div className="consensus">
                                <div className="consensus-label">Recommendation</div>
                                <h4>NO-GO</h4>
                                <p>Current operational readiness does not support aggressive multi-market expansion. A phased rollout strategy is recommended before scaling further.</p>
                                <div className="confidence">Decision Confidence — 87%</div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="final-cta">
                    <h2>Think through decisions <br /> before reality does.</h2>
                    <p>Strategic Simulation AI for founders, consultants, operators and modern organizations.</p>
                    <button onClick={() => router.push('/login')} className="cta">
                        Start Your First Simulation
                    </button>
                </section>
            </div>
        </div>
    );
}
