const fs = require('fs');
const path = require('path');

const directories = ['pages', 'components'];

const replacements = [
  { regex: /(?<!dark:)bg-white/g, replacement: 'bg-white dark:bg-slate-900' },
  { regex: /(?<!dark:)text-slate-800/g, replacement: 'text-slate-800 dark:text-white' },
  { regex: /(?<!dark:)text-slate-700/g, replacement: 'text-slate-700 dark:text-slate-200' },
  { regex: /(?<!dark:)bg-slate-50/g, replacement: 'bg-slate-50 dark:bg-brand-black/50' },
  { regex: /(?<!dark:)border-slate-100/g, replacement: 'border-slate-100 dark:border-white/5' },
  { regex: /(?<!dark:)border-slate-200/g, replacement: 'border-slate-200 dark:border-white/10' },
  { regex: /(?<!dark:)border-slate-50/g, replacement: 'border-slate-50 dark:border-white/5' },
  { regex: /(?<!dark:)text-brand-black/g, replacement: 'text-brand-black dark:text-white' },
  { regex: /(?<!dark:)bg-slate-100/g, replacement: 'bg-slate-100 dark:bg-white/10' },
  { regex: /(?<!dark:)bg-brand-light/g, replacement: 'bg-brand-light dark:bg-brand-black' }
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
      
      // Basic cleanup to avoid duplicates if run multiple times
      content = content.replace(/dark:bg-slate-900/g, '');
      content = content.replace(/dark:text-white/g, '');
      content = content.replace(/dark:text-slate-200/g, '');
      content = content.replace(/dark:bg-brand-black\/50/g, '');
      content = content.replace(/dark:border-white\/5/g, '');
      content = content.replace(/dark:border-white\/10/g, '');
      content = content.replace(/dark:bg-white\/10/g, '');
      content = content.replace(/dark:bg-brand-black/g, '');
      content = content.replace(/  +/g, ' '); // remove multiple spaces

      for (const { regex, replacement } of replacements) {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          modified = true;
        }
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Applied dark mode classes to ${fullPath}`);
      }
    }
  }
}

directories.forEach(dir => processDirectory(dir));
console.log('Dark mode application complete.');
