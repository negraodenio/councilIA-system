/**
 * Science-Sanitizer (v12.0.0)
 * Security layer for NFKC Normalization and Unicode Smuggling Protection.
 * Part of the Shielded Protocol.
 */

export function normalizeAndSanitize(text: string): string {
    if (!text) return '';

    // 1. NFKC Normalization (prevents Unicode Smuggling)
    // Converts \u202E and similar into canonical forms or strips control chars
    let sanitized = text.normalize('NFKC');

    // 2. Critical Keyword Injection Guard
    const redlines = [
        /ignore\s+(all\s+)?instructions/gi,
        /system\s+override/gi,
        /as\s+a\s+helpful\s+assistant/gi,
        /você\s+é\s+um\s+assistente/gi,
        /ignore\s+todas\s+as\s+instruções/gi
    ];

    for (const pattern of redlines) {
        if (pattern.test(sanitized)) {
            throw new Error(`[SECURITY_VIOLATION] Attempted Prompt Injection detected.`);
        }
    }

    // 3. Control Character Strip (Filtering RTL/LTR smuggling)
    // Strips \u202A-\u202E, \u2066-\u2069 etc.
    sanitized = sanitized.replace(/[\u200B-\u200D\u202A-\u202E\u2060-\u206F]/g, '');

    return sanitized.trim();
}
