import fs from 'fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('C:/Users/nelso/.gemini/antigravity/brain/54778396-91ad-4d81-8e16-cb6af1e91113/scratch/local-home.html', 'utf-8');
const dom = new JSDOM(html);
const doc = dom.window.document;

console.log('--- Inspecting local-home.html DOM ---');

const contentBody = doc.querySelector('.content_body');
if (!contentBody) {
  console.log('ERROR: .content_body NOT found in HTML!');
} else {
  console.log('.content_body found!');
  const children = contentBody.children;
  console.log(`Number of direct children of .content_body: ${children.length}`);
  
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    console.log(`Child ${i + 1}: <${child.tagName.toLowerCase()}> id="${child.id}" class="${child.className}"`);
    
    // Check if it has child elements
    const innerChildren = child.querySelectorAll('*');
    console.log(`  Sub-elements count: ${innerChildren.length}`);
    if (innerChildren.length > 0) {
      // Print first 5 sub-elements
      console.log('  Some sub-elements:');
      Array.from(innerChildren).slice(0, 5).forEach((el: any) => {
        console.log(`    <${el.tagName.toLowerCase()}> class="${el.className}"`);
      });
    }
  }
}
