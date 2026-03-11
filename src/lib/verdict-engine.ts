/**
 * Verdict Engine: Fighter Pilot Cockpit Logic
 * Handles tactical calculations for the CouncilIA HUD.
 */

export interface AllianceData {
    category: 'Growth' | 'Guardian' | 'Optimizer' | 'Outlier';
    personas: string[];
    avgScore: number;
    color: string;
}

/**
 * Calculates the Estimated Value at Risk (VaR) based on consensus score.
 * Lower score = higher risk.
 */
export function calculateVaR(score: number): string {
    // Logic: Higher score means lower risk. 100 score = ~0.5% risk. 0 score = 99.9% risk.
    // Exponential curve to reflect that lower scores are exponentially more dangerous.
    const baseRisk = 100 - score;
    const varValue = Math.min(99.9, (baseRisk ** 1.2) / 2 + 0.5);
    return varValue.toFixed(1) + '%';
}

/**
 * Calculates a high-precision fidelity index.
 */
export function getPrecisionLevel(score: number): string {
    // Base precision 90% + variance based on score.
    const precision = 90 + (score / 100) * 9.5;
    return precision.toFixed(1) + '%';
}

/**
 * Clusters personas into strategic alliances.
 */
export function getAllianceClustering(personaScores: Record<string, number>): AllianceData[] {
    const categories: Record<string, { personas: string[]; color: string }> = {
        'Growth': { personas: ['visionary', 'marketeer'], color: '#A855F7' },
        'Guardian': { personas: ['devil', 'ethicist'], color: '#EF4444' },
        'Optimizer': { personas: ['technologist', 'financier'], color: '#3B82F6' }
    };

    const alliances: AllianceData[] = [];

    for (const [catName, config] of Object.entries(categories)) {
        const matchingPersonas = Object.keys(personaScores).filter(id => config.personas.includes(id));
        if (matchingPersonas.length > 0) {
            const sum = matchingPersonas.reduce((acc, id) => acc + (personaScores[id] || 0), 0);
            alliances.push({
                category: catName as any,
                personas: matchingPersonas,
                avgScore: Math.round(sum / matchingPersonas.length),
                color: config.color
            });
        }
    }

    return alliances;
}

/**
 * Generates a scientific badge/citation ID based on the persona and score.
 */
export function getScientificBadge(personaId: string, score: number): { label: string; cite: string } | null {
    if (score < 40) return { label: "Adversarial Check", cite: "Ellemers (PNAS 2020)" };
    
    switch (personaId) {
        case 'visionary':
        case 'marketeer':
            return { label: "Growth Insight", cite: "Amershi (CHI 2019)" };
        case 'devil':
        case 'ethicist':
            return { label: "Bias Guard", cite: "Ellemers (PNAS 2020)" };
        case 'technologist':
        case 'financier':
            return { label: "Precision Logic", cite: "Shaikh (PLOS 2025)" };
        default:
            return { label: "Collective Intelligence", cite: "MpFL (ICLR 2025)" };
    }
}
