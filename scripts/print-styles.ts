import fs from 'fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('C:/Users/nelso/.gemini/antigravity/brain/54778396-91ad-4d81-8e16-cb6af1e91113/scratch/local-home.html', 'utf-8');
const dom = new JSDOM(html);
const doc = dom.window.document;

doc.querySelectorAll('style').forEach((style, idx) => {
  console.log(`\n================ STYLE TAG ${idx + 1} ================`);
  console.log(`id="${style.id}" class="${style.className}"`);
  console.log(style.textContent?.trim().slice(0, 1000));
});
