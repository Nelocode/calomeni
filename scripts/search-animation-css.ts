import fs from 'fs';
import path from 'path';

const cssDir = path.join(process.cwd(), 'public', 'assets', 'original', 'css');
const cssFiles = fs.readdirSync(cssDir);

console.log('Searching for "opacity: 0" or animation styles in CSS...');

cssFiles.forEach(file => {
  if (file.endsWith('.css')) {
    const content = fs.readFileSync(path.join(cssDir, file), 'utf-8');
    if (content.includes('opacity: 0') || content.includes('opacity:0') || content.includes('animate-when-almost-visible') || content.includes('animate_when_almost_visible')) {
      console.log(`\nFound in file: ${file}`);
      // Find matching lines
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (line.includes('opacity') || line.includes('animate')) {
          console.log(`  Line ${idx + 1}: ${line.trim().slice(0, 120)}`);
        }
      });
    }
  }
});
