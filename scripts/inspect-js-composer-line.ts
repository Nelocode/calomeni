import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'public', 'assets', 'original', 'css', 'js_composer.min.css');
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf-8');
  
  // Since the file might be minified on a few lines, let's search for "opacity: 0 !important" or "opacity:0!important"
  const regex = /[^;{}]*opacity\s*:\s*0\s*!important[^{}]*/gi;
  const matches = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    matches.push(match[0]);
  }
  
  console.log('Found "opacity: 0 !important" matches in js_composer.min.css:');
  matches.forEach((m, idx) => console.log(`[${idx + 1}] ${m.trim()}`));
} else {
  console.log('js_composer.min.css not found!');
}
