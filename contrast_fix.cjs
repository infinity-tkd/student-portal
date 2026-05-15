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

      // Make light mode slate texts darker for contrast
      // Note: we use word boundaries to avoid matching text-slate-400 inside text-slate-4000 (though unlikely)
      
      // Bump slate-300 to slate-500 in light mode
      content = content.replace(/(?<!dark:)text-slate-300(?!\s+dark:)/g, 'text-slate-500 dark:text-slate-300');
      // Bump slate-400 to slate-600 in light mode
      content = content.replace(/(?<!dark:)text-slate-400(?!\s+dark:)/g, 'text-slate-600 dark:text-slate-400');
      // Bump slate-500 to slate-700 in light mode
      content = content.replace(/(?<!dark:)text-slate-500(?!\s+dark:)/g, 'text-slate-700 dark:text-slate-400');
      
      // Fix borders as well
      content = content.replace(/(?<!dark:)border-slate-100(?!\s+dark:)/g, 'border-slate-200 dark:border-white/5');
      content = content.replace(/(?<!dark:)border-slate-200(?!\s+dark:)/g, 'border-slate-300 dark:border-white/10');
      
      // Fix background contrasts
      content = content.replace(/(?<!dark:)bg-slate-50(?!\s+dark:)/g, 'bg-slate-100 dark:bg-brand-black/50');
      content = content.replace(/(?<!dark:)bg-slate-100(?!\s+dark:)/g, 'bg-slate-200 dark:bg-white/10');
      
      // Fix existing dark:text-slate-400 where the light mode text is text-slate-400
      content = content.replace(/text-slate-400 dark:text-slate-400/g, 'text-slate-600 dark:text-slate-400');
      content = content.replace(/text-slate-500 dark:text-slate-400/g, 'text-slate-700 dark:text-slate-400');

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Fixed contrast in ${fullPath}`);
      }
    }
  }
}

directories.forEach(dir => processDirectory(dir));
console.log('Contrast fix complete.');
