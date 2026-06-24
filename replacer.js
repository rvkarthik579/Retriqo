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
  
  if (!content.includes('next/image')) {
    content = content.replace(/^(?:['"]use client['"];?\n)?/i, "$&import Image from 'next/image';\n");
  }
  
  const depth = file.split('/').length - 1;
  const relativePrefix = depth === 0 ? './' : '../'.repeat(depth);
  const importPath = relativePrefix + '../public/retriqo-logo.svg';
  
  if (!content.includes('import retriqoLogo from')) {
    content = content.replace(/^(?:['"]use client['"];?\n)?/i, "$&import retriqoLogo from '" + importPath + "';\n");
  }

  content = content.replace(/<img\s+src="\/retriqo-logo\.svg"\s+alt="Retriqo"\s+style=\{\{([^}]+)\}\}\s*\/>/g, '<Image src={retriqoLogo} alt="Retriqo" style={{$1, width: \'auto\'}} priority unoptimized />');
  
  fs.writeFileSync(file, content);
}
console.log('done');
