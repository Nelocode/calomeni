import fs from 'fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('C:/Users/nelso/.gemini/antigravity/brain/54778396-91ad-4d81-8e16-cb6af1e91113/scratch/raw-home.html', 'utf-8');
const dom = new JSDOM(html);
const doc = dom.window.document;

console.log('--- Inspecting Services Section ---');

const servicesRow = doc.querySelector('#services');
if (servicesRow) {
  console.log('Services row classes:', servicesRow.className);
  // Find column elements
  const columns = servicesRow.querySelectorAll('[class*="vc_col-"]');
  console.log(`Found ${columns.length} columns:`);
  columns.forEach((col, idx) => {
    console.log(`\nColumn ${idx + 1}: class="${col.className}"`);
    // Find text or image elements inside this column
    const images = col.querySelectorAll('img');
    const titles = col.querySelectorAll('h1, h2, h3, h4, h5, h6');
    console.log(`  - Images: ${images.length}`);
    images.forEach(img => console.log(`    * src="${img.src}" style="${img.getAttribute('style') || ''}" class="${img.className}"`));
    console.log(`  - Headings: ${titles.length}`);
    titles.forEach(t => console.log(`    * <${t.tagName.toLowerCase()}> text="${t.textContent?.trim()}"`));
  });
} else {
  console.log('#services row not found!');
}
