import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'public', 'assets', 'original', 'css', 'theme-style.css');
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf-8');
  console.log('--- Searching theme-style.css for #footer rules ---');
  
  const regex = /#footer[^{}]*\{[^{}]*\}/gi;
  const matches = content.match(regex) || [];
  matches.forEach(m => console.log(m.trim().replace(/\s+/g, ' ')));
} else {
  console.log('theme-style.css not found!');
}
