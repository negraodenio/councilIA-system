const fs = require('fs');
const path = 'c:/Users/denio/Documents/Denio/Council/src/ui/ConsensusReport.tsx';
let content = fs.readFileSync(path, 'utf8');

const strategicMetrics = `
                                                {/* Strategic Metrics (v7.2 Audit-Grade) */}
                                                <div className="mt-8 flex flex-col gap-6">
                                                    <div className="flex flex-col gap-4">
                                                        {(() => {
                                                            const devilData = personaData.find(d => d.id === 'devil')?.metadata;
                                                            const marketeerData = personaData.find(d => d.id === 'marketeer')?.metadata;
                                                            
                                                            if (!devilData && !marketeerData) return null;

                                                            return (
                                                                <>
                                                                    {devilData && devilData.vaccine && devilData.vaccine !== 'Analysis pending...' && (
                                                                        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)] group">
                                                                            <div className="flex items-center justify-between mb-4">
                                                                                <div className="flex items-center gap-2 text-red-400">
                                                                                    <span className="material-symbols-outlined text-xl">vaccines</span>
                                                                                    <span className="font-display font-black uppercase tracking-widest text-[10px]">Audit Correction Map</span>
                                                                                </div>
                                                                                <span className="text-[9px] font-mono text-red-500/50 uppercase">Mandatory Patch</span>
                                                                            </div>
                                                                            <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/10 mb-3 group-hover:bg-red-500/10 transition-colors">
                                                                                <p className="text-sm text-red-50 font-medium italic">"{devilData.vaccine}"</p>
                                                                            </div>
                                                                            {devilData.circuitBreaker && (
                                                                                <div className="flex items-center gap-2 p-2 bg-black/40 rounded border border-red-500/20">
                                                                                    <span className="material-symbols-outlined text-xs text-red-400">warning</span>
                                                                                    <span className="text-[9px] font-mono text-red-200 uppercase tracking-tighter">ABORT CONDITION: <span className="text-red-400 font-bold">{devilData.circuitBreaker}</span></span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}

                                                                    {marketeerData && marketeerData.championProfile && marketeerData.championProfile !== 'Analysis pending...' && (
                                                                        <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 group">
                                                                            <div className="flex items-center justify-between mb-4">
                                                                                <div className="flex items-center gap-2 text-indigo-400">
                                                                                    <span className="material-symbols-outlined text-xl">fact_check</span>
                                                                                    <span className="font-display font-black uppercase tracking-widest text-[10px]">Institutional alignment</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/10 mb-3 group-hover:bg-indigo-500/10 transition-colors">
                                                                                <p className="text-sm text-indigo-50 font-black uppercase tracking-wider leading-relaxed">{marketeerData.championProfile}</p>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
`;

// Inject before 'Critical Risks' section
if (content.includes('Critical Institutional Risks')) {
    content = content.replace('{/* 2. Critical Risks (v7.2 Audit-Grade) */}', strategicMetrics + '\n                                                {/* 2. Critical Risks (v7.2 Audit-Grade) */}');
    fs.writeFileSync(path, content);
    console.log('Strategic Metrics injected successfully.');
} else {
    console.error('Critical Risks section not found.');
}
