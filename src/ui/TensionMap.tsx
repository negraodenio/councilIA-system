'use client';
import { AllianceData } from '@/lib/verdict-engine';

export default function TensionMap({ alliances }: { alliances: AllianceData[] }) {
    if (!alliances || alliances.length === 0) return null;

    return (
        <div className="flex flex-col gap-4 mt-6">
            <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Alliance Tension Map</span>
                <span className="text-[9px] font-mono text-neon-cyan/50 animate-pulse">LIVE TELEMETRY</span>
            </div>
            
            <div className="relative h-24 w-full bg-black/40 rounded-xl border border-white/5 overflow-hidden flex items-center justify-around px-4">
                {/* Decorative scanning line */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-cyan/5 to-transparent w-1/2 h-full -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none"></div>
                
                {alliances.map((alliance, idx) => {
                    const height = 20 + (alliance.avgScore / 100) * 60;
                    return (
                        <div key={idx} className="flex flex-col items-center gap-2 group relative">
                            {/* Score Tooltip */}
                            <div className="absolute -top-8 bg-black/80 border border-white/10 px-2 py-0.5 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none font-mono">
                                {alliance.avgScore}pts
                            </div>
                            
                            <div 
                                className="w-8 rounded-t-sm transition-all duration-1000 ease-out relative"
                                style={{ 
                                    height: `${height}%`, 
                                    backgroundColor: alliance.color + '20',
                                    border: `1px solid ${alliance.color}50`,
                                    boxShadow: `0 0 15px ${alliance.color}10`
                                }}
                            >
                                <div className="absolute top-0 left-0 w-full h-0.5" style={{ backgroundColor: alliance.color }}></div>
                            </div>
                            <span className="text-[9px] font-mono uppercase tracking-tighter opacity-70 group-hover:opacity-100 transition-opacity" style={{ color: alliance.color }}>
                                {alliance.category}
                            </span>
                        </div>
                    );
                })}
                
                {/* Horizontal reference lines */}
                <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none opacity-10">
                    <div className="w-full h-px bg-white"></div>
                    <div className="w-full h-px bg-white"></div>
                    <div className="w-full h-px bg-white"></div>
                </div>
            </div>
        </div>
    );
}

// Add these keyframes to your globals.css if not already present
// @keyframes shimmer {
//   100% { transform: translateX(200%); }
// }
