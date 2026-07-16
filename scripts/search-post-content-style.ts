import fs from 'fs';
import path from 'path';

const cssDir = path.join(process.cwd(), 'public', 'assets', 'original', 'css');
const cssFiles = fs.readdirSync(cssDir);

console.log('--- CSS Rules for .post_content ---');

cssFiles.forEach(file => {
  if (file.endsWith('.css')) {
    const content = fs.readFileSync(path.join(cssDir, file), 'utf-8');
    
    const regex = /\.post_content[^{}]*\{[^{}]*\}/gi;
    const matches = content.match(regex) || [];
    if (matches.length > 0) {
      console.log(`\nMatches in ${file}:`);
      matches.forEach(m => console.log(m));
    }
  }
});
