const fs = require('fs');
const path = 'c:/Users/denio/Documents/Denio/Council/src/ui/ConsensusReport.tsx';
let content = fs.readFileSync(path, 'utf8');

// Remove the second instance of Smart Verdict (Antifragile & B2B Metrics)
// It starts with {/* Smart Verdict: Antifragile & B2B Metrics */}
const redundantStart = content.lastIndexOf('{/* Smart Verdict: Antifragile & B2B Metrics */}');
if (redundantStart !== -1) {
    // Find the end of that block. It ends with the closing tag of its container.
    // Looking at the file, it's followed by MethodologyMoat.
    const redundantEnd = content.indexOf('{/* 5. EBRAMPA ELITE: FULL TRANSCRIPT */}', redundantStart);
    if (redundantEnd !== -1) {
        const before = content.substring(0, redundantStart);
        const after = content.substring(redundantEnd);
        content = before + after;
        console.log('Redundant Smart Verdict removed.');
    }
}

// Remove empty lines between 588 and 601
const lines = content.split('\n');
const cleanedLines = [];
let inEmptyBlock = false;
for (let i = 0; i < lines.length; i++) {
    if (i >= 588 && i <= 600 && lines[i].trim() === '') {
        // Skip these lines
        continue;
    }
    cleanedLines.push(lines[i]);
}
content = cleanedLines.join('\n');

fs.writeFileSync(path, content);
console.log('Empty lines cleaned up.');
