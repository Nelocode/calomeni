import fs from 'fs';
import path from 'path';

const cssDir = path.join(process.cwd(), 'public', 'assets', 'original', 'css');
const cssFiles = fs.readdirSync(cssDir);

console.log('--- CSS Rules for Headings (h1-h6) ---');

cssFiles.forEach(file => {
  if (file.endsWith('.css')) {
    const content = fs.readFileSync(path.join(cssDir, file), 'utf-8');
    
    // Find heading selector rules that have color properties
    const regex = /(?:^|\s|\,)(h1|h2|h3|h4|h5|h6)[^{}]*\{[^{}]*color[^{}]*\}/gi;
    const matches = content.match(regex) || [];
    if (matches.length > 0) {
      console.log(`\nMatches in ${file}:`);
      matches.slice(0, 30).forEach(m => console.log(m.trim().replace(/\s+/g, ' ')));
    }
  }
});
