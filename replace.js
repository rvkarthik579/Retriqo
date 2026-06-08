const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.css')) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const files = [...walk('./app'), ...walk('./components'), './tailwind.config.ts'];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content
    .replace(/font-syne/g, 'font-geist')
    .replace(/'Syne'/g, "'Geist'")
    .replace(/"Syne"/g, '"Geist"')
    .replace(/Syne, sans-serif/g, 'Geist, sans-serif')
    .replace(/'DM Mono'/g, "'JetBrains Mono'")
    .replace(/"DM Mono"/g, '"JetBrains Mono"')
    .replace(/DM Mono, monospace/g, 'JetBrains Mono, monospace');
    
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated ' + file);
  }
}
