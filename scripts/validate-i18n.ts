// scripts/validate-i18n.ts
// Validação de consistência das traduções do CouncilIA

import * as fs from 'fs';
import * as path from 'path';

type UILang = 'English' | 'Portuguese' | 'Spanish' | 'French' | 'German' | 'Italian' | 'Dutch';

interface ValidationResult {
    lang: UILang;
    key: string;
    value: string;
    englishValue: string;
    similarity: number;
    issue: 'identical' | 'high_similarity' | 'contains_english';
}

const ENGLISH_COMMON_WORDS = [
    'the', 'and', 'for', 'with', 'your', 'you', 'are', 'is', 'to', 'of',
    'in', 'on', 'at', 'by', 'from', 'as', 'it', 'this', 'that', 'have',
    'has', 'had', 'will', 'would', 'could', 'should', 'may', 'might',
    'system', 'status', 'online', 'ready', 'initialize', 'session',
    'dashboard', 'marketplace', 'vault', 'node', 'execute', 'protocol',
    'input', 'buffer', 'sovereignty', 'privacy', 'strict', 'tip', 'when',
    'handling', 'code', 'authorized', 'users', 'only', 'train', 'custom',
    'expert', 'add', 'internal', 'data', 'perspective', 'describe',
    'objective', 'placeholder', 'connecting', 'waiting', 'speaking',
    'deliberating', 'observing', 'interject', 'send', 'round', 'analysis',
    'attack', 'defense', 'verdict', 'judge', 'final', 'live', 'messages',
    'back', 'viable', 'caution', 'high', 'risk', 'dissent', 'agreement',
    'council', 'config', 'experts', 'rounds', 'consensus', 'transcript',
    'patches', 'proposed', 'preview', 'open', 'view', 'show', 'less',
    'read', 'full', 'complete', 'phase', 'core', 'sync', 'global'
];

const ALLOWED_UNIVERSAL = [
    'api', 'url', 'http', 'https', 'id', 'uuid', 'gpt', 'gpt-4o', 'claude',
    'json', 'xml', 'html', 'css', 'js', 'ts', 'sql', 'db', 'ui', 'ux',
    'eu', 'gdpr', 'lgpd', 'ccpa', 'hipaa', 'pii', 'iso', 'soc2',
    'github', 'pr', 'pull request', 'commit', 'branch', 'merge', 'repo',
    'alpha', 'beta', 'v1', 'v2', 'v3', 'v4', 'v2.4.9-alpha', 'ace v4.2',
    'l3', 'l1', 'l2', 'strict privacy', 'neural', 'council',
    'councilIA', 'antigravity', 'neural engine', 'sovereignty'
];

function normalizeText(text: string): string {
    return text.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function containsEnglishWords(text: string): boolean {
    const normalized = normalizeText(text);
    const words = normalized.split(' ');
    if (words.length <= 2) return false;

    const englishWordCount = words.filter(word =>
        ENGLISH_COMMON_WORDS.includes(word) && word.length > 2
    ).length;

    const englishRatio = englishWordCount / words.length;
    return englishRatio > 0.4;
}

function calculateSimilarity(str1: string, str2: string): number {
    const s1 = normalizeText(str1);
    const s2 = normalizeText(str2);
    if (s1 === s2) return 1.0;

    const words1 = s1.split(' ');
    const words2 = s2.split(' ');
    const intersection = words1.filter(w => words2.includes(w));
    const union = words1.concat(words2).filter((w, i, a) => a.indexOf(w) === i);
    return intersection.length / union.length;
}

function isAllowedUniversal(text: string): boolean {
    const lower = text.toLowerCase();
    return ALLOWED_UNIVERSAL.some(term => lower.includes(term.toLowerCase()));
}

function validateI18n(filePath: string): ValidationResult[] {
    const content = fs.readFileSync(filePath, 'utf-8');
    const issues: ValidationResult[] = [];

    const langBlocks: Record<string, Record<string, string>> = {};
    const langRegex = /(English|Portuguese|Spanish|French|German|Italian|Dutch):\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g;
    let match;

    while ((match = langRegex.exec(content)) !== null) {
        const lang = match[1];
        const blockContent = match[2];
        langBlocks[lang] = {};

        const keyValueRegex = /(\w+):\s*'((?:[^'\\]|\\.)*)'/g;
        let kvMatch;
        while ((kvMatch = keyValueRegex.exec(blockContent)) !== null) {
            const key = kvMatch[1];
            const value = kvMatch[2].replace(/\\'/g, "'");
            langBlocks[lang][key] = value;
        }
    }

    const englishStrings = langBlocks.English || {};

    (Object.keys(langBlocks) as UILang[]).forEach(lang => {
        if (lang === 'English') return;
        const translations = langBlocks[lang];

        Object.entries(translations).forEach(([key, value]) => {
            const englishValue = englishStrings[key];
            if (!englishValue) return;
            if (isAllowedUniversal(value)) return;

            const similarity = calculateSimilarity(value, englishValue);
            if (value === englishValue) {
                issues.push({ lang, key, value, englishValue, similarity: 1.0, issue: 'identical' });
            } else if (similarity > 0.7) {
                issues.push({ lang, key, value, englishValue, similarity, issue: 'high_similarity' });
            } else if (containsEnglishWords(value)) {
                issues.push({ lang, key, value, englishValue, similarity, issue: 'contains_english' });
            }
        });
    });

    return issues;
}

const filePath = path.join(process.cwd(), 'src', 'lib', 'i18n', 'ui-strings.ts');
if (fs.existsSync(filePath)) {
    const issues = validateI18n(filePath);
    if (issues.length > 0) {
        console.log(`\n🚨 ${issues.length} i18n issues found:\n`);
        issues.forEach(i => console.log(`${i.issue === 'identical' ? '🔴' : '🟡'} [${i.lang}] ${i.key}: "${i.value}" matches "${i.englishValue}"`));
    } else {
        console.log('✅ i18n validation passed!');
    }
}
