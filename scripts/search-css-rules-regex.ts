import fs from 'fs';
import path from 'path';

const cssDir = path.join(process.cwd(), 'public', 'assets', 'original', 'css');
const cssFiles = fs.readdirSync(cssDir);

cssFiles.forEach(file => {
  if (file.endsWith('.css')) {
    const content = fs.readFileSync(path.join(cssDir, file), 'utf-8');
    
    // Use regex to find selectors like #wrapper, .content_body, body
    // followed by any characters until { and then }
    const regex = /(?:#wrapper|\.content_body|body\b)[^{}]*\{[^{}]*(?:opacity|display|visibility)[^{}]*\}/gi;
    const matches = content.match(regex) || [];
    if (matches.length > 0) {
      console.log(`\n--- Matches in ${file} ---`);
      matches.forEach(m => console.log(m.trim().slice(0, 300)));
    }
  }
});
