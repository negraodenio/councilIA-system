const fs = require('fs');
const path = 'c:/Users/denio/Documents/Denio/Council/src/ui/ConsensusReport.tsx';
let content = fs.readFileSync(path, 'utf8');

// The problematic block at 589-598
const target1 = /}\)\(\)}\s+<\/div>\s+<\/div>\s+<div className="mt-6">\s+<MethodologyMoat meanScore={meanScore} lang={lang} validation={validation} isEmbrapa={isEmbrapa} \/>\s+<\/div>\s+<\/div>\s+;\s+}\)\(\)}/g;

// Simplify the replacement. I want to remove the duplicate closure and stray divs.
// Instead of a complex regex, I'll look for the first instance of '})()}' around line 589 and remove it.

const lines = content.split('\n');

// Line index 588 is line 589
if (lines[588].includes('})()')) {
    console.log('Found corrupted closure at line 589');
    lines[588] = ''; // Remove line 589
    lines[589] = ''; // Remove line 590 (div)
    lines[590] = ''; // Remove line 591 (div)
    lines[591] = ''; // Empty line
    lines[592] = ''; // Remove line 593 (div)
    lines[593] = ''; // Remove MethodologyMoat call (we have it later)
    lines[594] = ''; // Remove div
    lines[595] = ''; // Remove div
    lines[596] = ''; // Remove return end
    lines[597] = ''; // Remove IIFE end
}

// Also cleanup the isEmbrapa hints section which is also messy
content = lines.join('\n');

fs.writeFileSync(path, content);
console.log('Patch applied successfully.');
