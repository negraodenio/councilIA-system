/**
 * Verdict Engine v3.0: High-Fidelity Strategic Intelligence
 * Transforms unstructured AI expert debates into structured strategic metrics.
 */

export interface AllianceData {
    category: string;
    personas: string[];
    avgScore: number;
    color: string;
    description?: string;
}

export interface SmartVerdictMetadata {
    score: number;
    confidence: number;
    keyRisk?: string;
    keyOpportunity?: string;
    alliance: 'Velocity' | 'Stability' | 'Neutral';
    verdictTrigger?: string;
    // Persona specific
    failureMode?: string;
    circuitBreaker?: string;
    vaccine?: string;
    championProfile?: string;
    procurementLane?: string;
    landTeam?: string;
    expandPath?: string;
    metricOwned?: string;
}

/**
 * Robustly parses persona response text into structured metadata.
 */
export function parsePersonaResponseV3(text: string): SmartVerdictMetadata {
    const metadata: Partial<SmartVerdictMetadata> = {};

    // Standard metric extractors
    const extract = (regex: RegExp) => {
        const match = text.match(regex);
        return match ? match[1].trim() : undefined;
    };

    metadata.score = parseInt(extract(/SCORE:\s*\[?(\d{1,3})\]?/i) || '50');
    metadata.confidence = parseInt(extract(/CONFIDENCE:\s*\[?(\d{1,3})\]?%/i) || '70');
    metadata.keyRisk = extract(/KEY RISK:\s*(.*)/i);
    metadata.keyOpportunity = extract(/KEY OPPORTUNITY:\s*(.*)/i);
    metadata.alliance = (extract(/ALLIANCE:\s*\[?"?(Velocity|Stability|Neutral)"?\]?/i) || 'Neutral') as any;
    metadata.verdictTrigger = extract(/VERDICT_TRIGGER:\s*(.*)/i);

    // Persona specific fields
    metadata.failureMode = extract(/FAILURE_MODE:\s*(.*)/i);
    metadata.circuitBreaker = extract(/CIRCUIT_BREAKER:\s*(.*)/i);
    metadata.vaccine = extract(/VACCINE:\s*(.*)/i);
    metadata.championProfile = extract(/CHAMPION_PROFILE:\s*(.*)/i);
    metadata.procurementLane = extract(/PROCUREMENT_LANE:\s*\[?"?(.*)"?\]?/i);
    metadata.landTeam = extract(/LAND_TEAM:\s*\[?"?(.*)"?\]?/i);
    metadata.expandPath = extract(/EXPAND_PATH:\s*\[?"?(.*)"?\]?/i);
    metadata.metricOwned = extract(/METRIC_OWNED:\s*\[?"?(.*)"?\]?/i);

    return metadata as SmartVerdictMetadata;
}

/**
 * Calculates the Estimated Value at Risk (VaR).
 */
export function calculateVaR(score: number): string {
    const baseRisk = 100 - score;
    const varValue = Math.min(99.9, (baseRisk ** 1.15) / 1.8 + 0.5);
    return varValue.toFixed(1) + '%';
}

/**
 * Calculates a high-precision fidelity index.
 */
export function getPrecisionLevel(score: number): string {
    const precision = 88 + (score / 100) * 11.4;
    return precision.toFixed(1) + '%';
}

/**
 * Clusters personas into dynamic strategic alliances based on their prompt-defined alliance type.
 */
export function getAllianceClusteringV3(personaResponses: { id: string, text: string }[]): AllianceData[] {
    const parsedData = personaResponses.map(r => ({
        id: r.id,
        metadata: parsePersonaResponseV3(r.text)
    }));

    const velocityList = parsedData.filter(d => d.metadata.alliance === 'Velocity');
    const stabilityList = parsedData.filter(d => d.metadata.alliance === 'Stability');
    const neutralList = parsedData.filter(d => d.metadata.alliance === 'Neutral');

    const alliances: AllianceData[] = [];

    if (velocityList.length > 0) {
        alliances.push({
            category: 'Velocity',
            personas: velocityList.map(d => d.id),
            avgScore: Math.round(velocityList.reduce((acc, d) => acc + d.metadata.score, 0) / velocityList.length),
            color: '#A855F7', // Purple/Visionary
            description: 'Focused on growth, market capture, and speed.'
        });
    }

    if (stabilityList.length > 0) {
        alliances.push({
            category: 'Stability',
            personas: stabilityList.map(d => d.id),
            avgScore: Math.round(stabilityList.reduce((acc, d) => acc + d.metadata.score, 0) / stabilityList.length),
            color: '#EF4444', // Red/Guardian
            description: 'Focused on risk mitigation, ethics, and resilience.'
        });
    }

    if (neutralList.length > 0) {
        alliances.push({
            category: 'Optimizer',
            personas: neutralList.map(d => d.id),
            avgScore: Math.round(neutralList.reduce((acc, d) => acc + d.metadata.score, 0) / neutralList.length),
            color: '#3B82F6', // Blue/Technologist
            description: 'Pragmatic balance between growth and risk.'
        });
    }

    return alliances;
}

/**
 * Generates a scientific badge/citation ID.
 */
export function getScientificBadge(personaId: string, score: number): { label: string; cite: string } | null {
    if (score < 40) return { label: "Adversarial Check", cite: "Ellemers (PNAS 2020)" };
    
    switch (personaId) {
        case 'visionary':
        case 'marketeer':
            return { label: "Growth Insight", cite: "Amershi (CHI 2019)" };
        case 'devil':
        case 'ethicist':
            return { label: "Resilience Guard", cite: "Taleb (Antifragile 2012)" };
        case 'technologist':
        case 'financier':
            return { label: "Precision Logic", cite: "Shaikh (PLOS 2025)" };
        default:
            return { label: "Collective Intelligence", cite: "MpFL (ICLR 2025)" };
    }
}
