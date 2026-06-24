const fs = require('fs');
const files = [
  'app/page.tsx',
  'app/login/page.tsx',
  'app/register/page.tsx',
  'app/privacy/page.tsx',
  'app/security/page.tsx',
  'app/terms/page.tsx',
  'components/layout/Sidebar.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes("'use client'") && !content.startsWith("'use client'")) {
     content = content.replace(/'use client'[;\n]*/g, '');
     content = "'use client'\n" + content;
  }
  fs.writeFileSync(file, content);
}
console.log('fixed');
