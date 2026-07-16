import fs from 'fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('C:/Users/nelso/.gemini/antigravity/brain/54778396-91ad-4d81-8e16-cb6af1e91113/scratch/raw-home.html', 'utf-8');
const dom = new JSDOM(html);
const doc = dom.window.document;

// Print direct children of #wrapper or body
console.log('--- Body Direct Children ---');
doc.body.childNodes.forEach((node: any) => {
  if (node.nodeType === 1) { // Element
    console.log(`Element: <${node.tagName.toLowerCase()}> id="${node.id}" class="${node.className}"`);
  }
});

const wrapper = doc.querySelector('#wrapper');
if (wrapper) {
  console.log('\n--- Wrapper Direct Children ---');
  wrapper.childNodes.forEach((node: any) => {
    if (node.nodeType === 1) {
      console.log(`Element: <${node.tagName.toLowerCase()}> id="${node.id}" class="${node.className}"`);
    }
  });
}
