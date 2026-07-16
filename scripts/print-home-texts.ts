import fs from 'fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('C:/Users/nelso/.gemini/antigravity/brain/54778396-91ad-4d81-8e16-cb6af1e91113/scratch/local-home.html', 'utf-8');
const dom = new JSDOM(html);
const doc = dom.window.document;

console.log('--- Inspecting Elements and Text in .content_body ---');

const contentBody = doc.querySelector('.content_body');
if (contentBody) {
  // Find all elements with text
  const textElements = contentBody.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, strong');
  console.log(`Found ${textElements.length} text elements inside .content_body:`);
  
  Array.from(textElements).slice(0, 30).forEach((el: any, idx) => {
    const text = el.textContent?.trim() || '';
    if (text) {
      console.log(`[${idx + 1}] <${el.tagName.toLowerCase()}> class="${el.className}" text: "${text.slice(0, 100)}"`);
    }
  });
} else {
  console.log('.content_body not found!');
}
