import fs from 'fs';
import path from 'path';

const cssDir = path.join(process.cwd(), 'public', 'assets', 'original', 'css');
const cssFiles = fs.readdirSync(cssDir);

cssFiles.forEach(file => {
  if (file.endsWith('.css')) {
    const content = fs.readFileSync(path.join(cssDir, file), 'utf-8');
    
    // Look for #wrapper, .content_body, elegante_body_class_custom, wrapper
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.match(/(#wrapper|\.content_body|body)/) && line.match(/(opacity|display|visibility|none|hidden)/)) {
        console.log(`[${file}] Line ${idx + 1}: ${line.trim().slice(0, 150)}`);
      }
    });
  }
});
