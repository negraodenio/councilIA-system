/**
 * 🛡️ COUNCILIA v14 — AUDIT SECURITY LAYER (Edge Compatible)
 * Implements HMAC-SHA256 Signed Hash Chaining for Tamper-Proof Audit Trails.
 * Uses Web Crypto API for cross-runtime compatibility (Node.js & Edge).
 */

/**
 * Generates a signed HMAC hash for a given payload and optional previous hash.
 * This ensures that the audit trail is verifiable by a server-side secret.
 */
export async function generateSignedHash(payload: any, prevHash: string = ''): Promise<string> {
    const secret = process.env.AUDIT_SECRET || 'councilia_hardened_fallback_key_2026';
    const data = JSON.stringify(payload) + prevHash;
    
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const msgData = encoder.encode(data);

    // subtle is global in modern runtimes (Node 16+, Edge, Browser)
    const cryptoInstance = typeof crypto !== 'undefined' ? crypto : (await import('node:crypto')).webcrypto;

    const key = await cryptoInstance.subtle.importKey(
        'raw', 
        keyData, 
        { name: 'HMAC', hash: 'SHA-256' }, 
        false, 
        ['sign']
    );

    const signature = await cryptoInstance.subtle.sign('HMAC', key, msgData);
    
    // Hash to Hex
    return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Verifies if a hash matches the provided payload and previous hash.
 */
export async function verifyAuditHash(hash: string, payload: any, prevHash: string = ''): Promise<boolean> {
    const expected = await generateSignedHash(payload, prevHash);
    return hash === expected;
}
