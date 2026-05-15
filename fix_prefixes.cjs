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

      // Fix hover:bg-white dark:bg-slate-900 -> hover:bg-white dark:hover:bg-slate-900
      // We look for any word boundary, then a prefix like hover:, group-hover:, focus:, active:, then our standard pairs.
      
      const prefixes = ['hover:', 'group-hover:', 'focus:', 'active:'];
      
      const pairs = [
        ['bg-white', 'dark:bg-slate-900'],
        ['text-slate-800', 'dark:text-white'],
        ['text-slate-700', 'dark:text-slate-200'],
        ['bg-slate-50', 'dark:bg-brand-black/50'],
        ['border-slate-100', 'dark:border-white/5'],
        ['border-slate-200', 'dark:border-white/10'],
        ['border-slate-50', 'dark:border-white/5'],
        ['text-brand-black', 'dark:text-white'],
        ['bg-slate-100', 'dark:bg-white/10'],
        ['bg-brand-light', 'dark:bg-brand-black']
      ];

      for (const prefix of prefixes) {
        for (const [light, dark] of pairs) {
          // e.g. "hover:bg-white dark:bg-slate-900" -> "hover:bg-white dark:hover:bg-slate-900"
          // Note: The script added ` dark:bg-slate-900` right after `hover:bg-white`.
          const searchStr = `${prefix}${light} ${dark}`;
          const replaceStr = `${prefix}${light} dark:${prefix}${dark.replace('dark:', '')}`;
          
          // Use global replacement
          content = content.split(searchStr).join(replaceStr);
        }
      }

      // Also there was a bug where `bg-white dark:bg-slate-900/90 /90` happened in Layout.tsx (already fixed manually, but good to check others).
      
      // Look for `dark:bg-slate-900/10 dark:bg-slate-900` -> `dark:bg-slate-900/10`
      // It's easier to just do regex to remove duplicate `dark:` classes of the same type.
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Fixed prefixes in ${fullPath}`);
      }
    }
  }
}

directories.forEach(dir => processDirectory(dir));
console.log('Prefix fix complete.');
