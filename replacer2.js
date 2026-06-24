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
  content = content.replace(/import retriqoLogo from '[^']+';\n/, "import retriqoLogo from '@/public/retriqo-logo.svg';\n");
  fs.writeFileSync(file, content);
}
console.log('done');
