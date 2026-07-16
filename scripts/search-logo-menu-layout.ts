import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'public', 'assets', 'original', 'css', 'theme-style.css');
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf-8');
  console.log('--- Searching theme-style.css (regex matches for layout) ---');
  
  const regex = /[^{}]*(?:#logo|#menu)[^{}]*\{[^{}]*\}/gi;
  const matches = content.match(regex) || [];
  matches.forEach(m => {
    const clean = m.trim().replace(/\s+/g, ' ');
    if (clean.includes('float') || clean.includes('align') || clean.includes('margin') || clean.includes('display')) {
      console.log(clean);
    }
  });
} else {
  console.log('theme-style.css not found!');
}
