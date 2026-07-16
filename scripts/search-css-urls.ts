import fs from 'fs';
import path from 'path';

const cssDir = path.join(process.cwd(), 'public', 'assets', 'original', 'css');
const cssFiles = fs.readdirSync(cssDir);

const urls = new Set<string>();

cssFiles.forEach(file => {
  if (file.endsWith('.css')) {
    const content = fs.readFileSync(path.join(cssDir, file), 'utf-8');
    const matches = content.match(/url\(['"]?([^'")]+)['"]?\)/g) || [];
    matches.forEach(m => {
      // Extract URL inside url()
      const urlMatch = m.match(/url\(['"]?([^'")]+)['"]?\)/);
      if (urlMatch && urlMatch[1]) {
        urls.add(`${file}: ${urlMatch[1]}`);
      }
    });
  }
});

console.log('--- URLs found inside CSS files ---');
Array.from(urls).slice(0, 100).forEach(u => console.log(u));
if (urls.size > 100) {
  console.log(`...and ${urls.size - 100} more URLs.`);
}
