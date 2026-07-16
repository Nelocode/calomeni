import fs from 'fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('C:/Users/nelso/.gemini/antigravity/brain/54778396-91ad-4d81-8e16-cb6af1e91113/scratch/raw-home.html', 'utf-8');
const dom = new JSDOM(html);
const doc = dom.window.document;

console.log('--- Inspecting Original Header in raw-home.html ---');

const header = doc.querySelector('header');
if (header) {
  console.log('Header class:', header.className);
  console.log('Header innerHTML snippet (first 1000 chars):');
  console.log(header.innerHTML.trim().slice(0, 1000));
} else {
  console.log('No <header> element found in raw-home.html!');
}
