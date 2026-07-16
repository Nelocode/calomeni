import fs from 'fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('C:/Users/nelso/.gemini/antigravity/brain/54778396-91ad-4d81-8e16-cb6af1e91113/scratch/raw-home.html', 'utf-8');
const dom = new JSDOM(html);
const doc = dom.window.document;

console.log('--- Searching raw-home.html for Sliders ---');

// Search for classes or IDs containing slider or revolution
const sliders = doc.querySelectorAll('[class*="slider"], [id*="slider"], [class*="rev"], [id*="rev"]');
console.log(`Found ${sliders.length} elements matching slider/rev:`);
sliders.forEach((el, idx) => {
  // Only print unique top-level ones or first few
  if (idx < 20) {
    console.log(`[${idx + 1}] Tag: <${el.tagName.toLowerCase()}> id="${el.id}" class="${el.className}" parent: <${el.parentElement?.tagName.toLowerCase()}> class="${el.parentElement?.className}"`);
  }
});
