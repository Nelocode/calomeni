import fs from 'fs';
import path from 'path';

const cssDir = path.join(process.cwd(), 'public', 'assets', 'original', 'css');
const cssFiles = fs.readdirSync(cssDir);

console.log('--- Searching WPBakery layout classes for visibility/opacity ---');

const targets = ['vc_row', 'vc_column', 'wpb_column', 'wpb_wrapper', 'vc_column-inner', 'vc_row-fluid'];

cssFiles.forEach(file => {
  if (file.endsWith('.css')) {
    const content = fs.readFileSync(path.join(cssDir, file), 'utf-8');
    
    targets.forEach(target => {
      // Find rules styling the target class that set opacity, display, or visibility
      const regex = new RegExp(`(?:^|\\s|,)\\.${target}[^{}]*\\{[^{}]*(opacity|display|visibility)[^{}]*\\}`, 'gi');
      const matches = content.match(regex) || [];
      if (matches.length > 0) {
        console.log(`\nMatch for .${target} in ${file}:`);
        matches.forEach(m => console.log(m.trim().replace(/\s+/g, ' ')));
      }
    });
  }
});
