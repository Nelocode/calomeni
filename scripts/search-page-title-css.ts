import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'public', 'assets', 'original', 'css', 'theme-style.css');
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf-8');
  console.log('--- Searching theme-style.css for page title styling ---');
  
  // Find selectors with page_title, title_holder, title_bgr
  const regex = /(?:\.page_title|\.title_holder|\.title_bgr)[^{}]*\{[^{}]*\}/gi;
  const matches = content.match(regex) || [];
  matches.slice(0, 30).forEach(m => console.log(m.trim().replace(/\s+/g, ' ')));
} else {
  console.log('theme-style.css not found!');
}
