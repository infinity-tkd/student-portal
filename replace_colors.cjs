const fs = require('fs');
const path = require('path');

const directories = ['pages', 'components'];

const replacements = [
  { regex: /#131950/g, replacement: 'brand-black' },
  { regex: /bg-\[#131950\]/g, replacement: 'bg-brand-black' },
  { regex: /text-\[#131950\]/g, replacement: 'text-brand-red' },
  { regex: /border-\[#131950\]/g, replacement: 'border-brand-red' },
  { regex: /shadow-\[#131950\]/g, replacement: 'shadow-brand-black' },
  { regex: /dark-blue/g, replacement: 'brand-red' },
  { regex: /brand-gold/g, replacement: 'brand-gray' },
  { regex: /bg-blue-/g, replacement: 'bg-red-' },
  { regex: /text-blue-/g, replacement: 'text-red-' },
  { regex: /border-blue-/g, replacement: 'border-red-' },
  { regex: /shadow-blue-/g, replacement: 'shadow-red-' },
  { regex: /ring-blue-/g, replacement: 'ring-red-' },
  { regex: /from-blue-/g, replacement: 'from-red-' },
  { regex: /to-blue-/g, replacement: 'to-red-' },
  { regex: /via-blue-/g, replacement: 'via-red-' },
  { regex: /emerald-500/g, replacement: 'emerald-500' }, // leaving emerald for now as success states
  // Google Drive Logo Replacements
  { regex: /https:\/\/drive\.google\.com\/thumbnail\?id=1L2mH_O2UxPYEkQVsgzNdV4VhLS6hrIlQ&sz=s700/g, replacement: '/logo/Red.svg' },
  { regex: /https:\/\/drive\.google\.com\/thumbnail\?id=1YbDau7zKy6QQO0m9GVhYpNZuCVquTk9A&sz=s700/g, replacement: '/logo/Red.svg' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      for (const { regex, replacement } of replacements) {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          modified = true;
        }
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

directories.forEach(dir => processDirectory(dir));
console.log('Replacement complete.');
