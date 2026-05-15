const fs = require('fs');
const path = require('path');

const directories = ['pages', 'components'];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;

      // Fix text-slate-900 -> text-slate-900 dark:text-white
      content = content.replace(/(?<!dark:)text-slate-900(?!\s+dark:text-white)/g, 'text-slate-900 dark:text-white');
      
      // Also clean up any bg-white dark:bg-slate-900 text-slate-900 dark:text-white where there might be duplicate dark:text-white
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Fixed text-slate-900 in ${fullPath}`);
      }
    }
  }
}

directories.forEach(dir => processDirectory(dir));
console.log('text-slate-900 fix complete.');
