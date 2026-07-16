import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

// 1. Scan local-home.html for classes starting with "icon-" or icons
const html = fs.readFileSync('C:/Users/nelso/.gemini/antigravity/brain/54778396-91ad-4d81-8e16-cb6af1e91113/scratch/local-home.html', 'utf-8');
const dom = new JSDOM(html);
const doc = dom.window.document;

const iconClasses = new Set<string>();
doc.querySelectorAll('*').forEach((el: any) => {
  Array.from(el.classList).forEach((cls: any) => {
    if (cls.startsWith('icon-') || cls.includes('icon')) {
      iconClasses.add(cls);
    }
  });
});

console.log('--- Icon Classes found in Homepage DOM ---');
console.log(Array.from(iconClasses));

// 2. Scan icons.css for font mappings
const file = path.join(process.cwd(), 'public', 'assets', 'original', 'css', 'icons.css');
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf-8');
  console.log('\n--- Mappings in icons.css ---');
  // Find matches like .icon-xxx:before { content: "\e900"; }
  const regex = /\.icon-([a-zA-Z0-9_-]+)\s*:\s*before\s*\{\s*content:\s*['"]\\([a-fA-F0-9]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    console.log(`Class: .icon-${match[1]} -> code: \\${match[2]}`);
  }
}
