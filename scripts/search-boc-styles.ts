import fs from 'fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('C:/Users/nelso/.gemini/antigravity/brain/54778396-91ad-4d81-8e16-cb6af1e91113/scratch/raw-home.html', 'utf-8');
const dom = new JSDOM(html);
const doc = dom.window.document;

console.log('--- Inspecting boc-animation-styles-inline-css for colors/backgrounds ---');

const style = doc.querySelector('#boc-animation-styles-inline-css');
if (style) {
  const content = style.textContent || '';
  
  // Search for background, color, background-color
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.match(/(background|color)/i) && line.match(/(body|wrapper|content|html|h1|h2|h3|h4|h5|h6|heading|#wrapper)/i)) {
      console.log(`Line ${idx + 1}: ${line.trim().slice(0, 150)}`);
    }
  });
} else {
  console.log('boc-animation-styles-inline-css not found in raw-home.html!');
}
