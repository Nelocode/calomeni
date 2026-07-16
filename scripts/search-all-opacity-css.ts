import fs from 'fs';
import path from 'path';

const cssDir = path.join(process.cwd(), 'public', 'assets', 'original', 'css');
const cssFiles = fs.readdirSync(cssDir);

console.log('--- CSS Selectors with opacity: 0 ---');

cssFiles.forEach(file => {
  if (file.endsWith('.css')) {
    const content = fs.readFileSync(path.join(cssDir, file), 'utf-8');
    
    // Match CSS rules. Minified CSS is on a single line, so we match selectors and blocks
    // A CSS selector followed by { ... opacity: 0 ... }
    const regex = /([^{}]+)\{[^{}]*opacity\s*:\s*0(?:[^0-9a-zA-Z\s]|$)[^{}]*\}/gi;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const selector = match[1].trim().replace(/\s+/g, ' ');
      console.log(`[${file}] ${selector}`);
    }
  }
});
