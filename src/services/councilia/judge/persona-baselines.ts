/**
 * 🔬 COUNCILIA v14 — PERSONA BASELINES
 * Stores fixed semantic vectors for core archetypes to detect Persona Drift (PSI).
 */

export class PersonaBaselineService {
    /**
     * Simulation of persona baseline vectors. 
     * In a live production environment, these would be pre-computed 
     * centroid vectors from a gold-standard persona response dataset.
     */
    static getBaselineForPersona(_persona: string): number[] {
        // Mock vector for v14 Scientific Demo
        return new Array(1536).fill(0).map(() => Math.random());
    }

    /**
     * Verifies if a given persona ID is a core system archetype.
     */
    static isCoreArchetype(id: string): boolean {
        const cores = ['visionary', 'technologist', 'auditor', 'market', 'ethicist', 'financier'];
        return cores.some(c => id.toLowerCase().includes(c));
    }
}
