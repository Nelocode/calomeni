import fs from 'fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('C:/Users/nelso/.gemini/antigravity/brain/54778396-91ad-4d81-8e16-cb6af1e91113/scratch/raw-home.html', 'utf-8');
const dom = new JSDOM(html);
const doc = dom.window.document;

console.log('--- Searching for vc_custom_1567213164889 in raw-home.html ---');

let found = false;
doc.querySelectorAll('style').forEach((style, idx) => {
  const content = style.textContent || '';
  if (content.includes('vc_custom_1567213164889')) {
    console.log(`Found in Style Tag ${idx + 1}:`);
    console.log(content.trim().slice(0, 1000));
    found = true;
  }
});

if (!found) {
  console.log('Not found in any <style> tag in raw-home.html!');
}
