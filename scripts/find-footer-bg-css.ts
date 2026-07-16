import fs from 'fs';
import path from 'path';

const cssDir = path.join(process.cwd(), 'public', 'assets', 'original', 'css');

async function run() {
  console.log('--- Searching CSS files for #footer background ---');
  if (!fs.existsSync(cssDir)) {
    console.log('CSS directory not found');
    return;
  }

  const files = fs.readdirSync(cssDir);
  files.forEach(file => {
    if (file.endsWith('.css')) {
      const content = fs.readFileSync(path.join(cssDir, file), 'utf-8');
      const regex = /#footer[^{}]*\{[^{}]*\}/gi;
      const matches = content.match(regex) || [];
      if (matches.length > 0) {
        console.log(`\nFile: ${file}`);
        matches.forEach(m => console.log('  ' + m.trim().replace(/\s+/g, ' ')));
      }
    }
  });
}

run();
