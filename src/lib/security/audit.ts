/**
 * 🛡️ COUNCILIA v14 — AUDIT SECURITY LAYER
 * Implements HMAC-SHA256 Signed Hash Chaining for Tamper-Proof Audit Trails.
 */

import crypto from 'crypto';

/**
 * Generates a signed HMAC hash for a given payload and optional previous hash.
 * This ensures that the audit trail is verifiable by a server-side secret.
 */
export function generateSignedHash(payload: any, prevHash: string = ''): string {
    const secret = process.env.AUDIT_SECRET || 'councilia_hardened_fallback_key_2026';
    const data = JSON.stringify(payload) + prevHash;
    
    return crypto
        .createHmac('sha256', secret)
        .update(data)
        .digest('hex');
}

/**
 * Verifies if a hash matches the provided payload and previous hash.
 */
export function verifyAuditHash(hash: string, payload: any, prevHash: string = ''): boolean {
    const expected = generateSignedHash(payload, prevHash);
    return hash === expected;
}
