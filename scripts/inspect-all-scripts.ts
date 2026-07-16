import fs from 'fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('C:/Users/nelso/.gemini/antigravity/brain/54778396-91ad-4d81-8e16-cb6af1e91113/scratch/local-home.html', 'utf-8');
const dom = new JSDOM(html);
const doc = dom.window.document;

console.log('--- Inspecting all <script> tags in local-home.html ---');

const scripts = doc.querySelectorAll('script');
scripts.forEach((script, idx) => {
  const src = script.getAttribute('src');
  const content = script.textContent || '';
  console.log(`\nScript ${idx + 1}: src="${src || 'Inline script'}"`);
  if (!src && content.trim()) {
    console.log('Inline code snippet:');
    console.log(content.trim().slice(0, 1000));
  }
});
