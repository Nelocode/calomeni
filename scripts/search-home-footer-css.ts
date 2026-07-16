import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'public', 'assets', 'original', 'css', 'theme-style.css');
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf-8');
  console.log('--- Searching theme-style.css for .home and #footer overrides ---');
  
  const regex = /\.home[^{}]*#footer[^{}]*\{[^{}]*\}/gi;
  const matches = content.match(regex) || [];
  matches.forEach(m => console.log(m.trim().replace(/\s+/g, ' ')));

  const regex2 = /#footer[^{}]*\.home[^{}]*\{[^{}]*\}/gi;
  const matches2 = content.match(regex2) || [];
  matches2.forEach(m => console.log(m.trim().replace(/\s+/g, ' ')));
} else {
  console.log('theme-style.css not found!');
}
