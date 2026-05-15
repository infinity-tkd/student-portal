const fs = require('fs');
const path = require('path');

const directories = ['pages', 'components'];

const replacements = [
  { regex: /bg-\[brand-black\]/g, replacement: 'bg-brand-black' },
  { regex: /text-\[brand-black\]/g, replacement: 'text-brand-black' },
  { regex: /border-\[brand-black\]/g, replacement: 'border-brand-black' },
  { regex: /shadow-\[brand-black\]/g, replacement: 'shadow-brand-black' },
  
  { regex: /bg-\[brand-red\]/g, replacement: 'bg-brand-red' },
  { regex: /text-\[brand-red\]/g, replacement: 'text-brand-red' },
  { regex: /border-\[brand-red\]/g, replacement: 'border-brand-red' },
  { regex: /shadow-\[brand-red\]/g, replacement: 'shadow-brand-red' },
  
  { regex: /bg-\[brand-gray\]/g, replacement: 'bg-brand-gray' },
  { regex: /text-\[brand-gray\]/g, replacement: 'text-brand-gray' }
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
        console.log(`Cleaned up ${fullPath}`);
      }
    }
  }
}

directories.forEach(dir => processDirectory(dir));
console.log('Cleanup complete.');
