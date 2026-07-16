import fs from 'fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('C:/Users/nelso/.gemini/antigravity/brain/54778396-91ad-4d81-8e16-cb6af1e91113/scratch/raw-home.html', 'utf-8');
const dom = new JSDOM(html);
const doc = dom.window.document;

console.log('--- Inspecting Column 2 of Row "distingue" ---');

const row = doc.querySelector('#distingue');
if (row) {
  const cols = row.querySelectorAll('.wpb_column');
  if (cols.length >= 2) {
    const col2 = cols[1];
    console.log('Column 2 outerHTML:');
    console.log(col2.outerHTML);
  } else {
    console.log('Less than 2 columns found in #distingue');
  }
} else {
  console.log('#distingue row not found!');
}
