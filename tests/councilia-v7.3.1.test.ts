import { calculateAllScores } from '../src/lib/scoring';
import { validateOutput } from '../src/services/councilia/validator';
import { CouncilDomain, ScoringInput } from '../src/types/councilia-universal';

describe('CouncilIA v7.3.1 Regression Suite', () => {
    
    test('Deterministic Scoring: High Consensus Case', () => {
        const input: ScoringInput = {
            personaScores: [90, 85, 80, 88, 85, 82],
            evidenceDensity: 'high',
            unresolvedRisks: 0,
            validationStatus: 'complete',
            domain: 'agro'
        };
        
        const result = calculateAllScores(input);
        
        expect(result.meanScore).toBeGreaterThan(80);
        expect(result.consensusStrength).toBeGreaterThan(90);
    });

    test('4-Guard Validator: Mismatch Detection (Consensus vs Score)', () => {
        const output: any = {
            metadata: { protocolVersion: '7.3.1' },
            executiveVerdict: { 
                verdict: 'GO', 
                score: 30,
                confidence: { validationStatus: 'complete' }
            },
            consensusAnalysis: { strengthPercentage: 95 }
        };
        
        const validation = validateOutput(output);
        expect(validation.valid).toBe(false);
        expect(validation.strategy).toBe('SAFE_MODE_FALLBACK');
    });

    test('4-Guard Validator: Neutral Leak (All 50s)', () => {
        const input: ScoringInput = {
            personaScores: [50, 50, 50, 50, 50, 50],
            evidenceDensity: 'moderate',
            unresolvedRisks: 0,
            validationStatus: 'complete',
            domain: 'general'
        };
        
        const scoring = calculateAllScores(input);
        
        // We need to simulate a full output for the validator
        const mockOutput: any = {
            metadata: { protocolVersion: '7.3.1' },
            executiveVerdict: { score: scoring.meanScore },
            consensusAnalysis: { strengthPercentage: scoring.consensusStrength }
        };
        
        const validation = validateOutput(mockOutput);
        
        expect(scoring.consensusStrength).toBe(100); // StdDev 0
        expect(validation.valid).toBe(false); // Should fail Guard 4 (Neutral Leak)
    });
});
