const fs = require('fs');
let code = fs.readFileSync('app/scan/[qr_id]/page.tsx', 'utf8');
code = code.replace(/\\D/g, 'D'); // Oops, wait.
// Let's just replace \` with `
code = code.replace(/\\`/g, '`');
// And replace \\D with \D
code = code.replace(/\\\\D/g, '\\D');
fs.writeFileSync('app/scan/[qr_id]/page.tsx', code);
console.log('Unescaped!');
