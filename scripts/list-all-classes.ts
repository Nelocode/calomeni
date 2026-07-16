import fs from 'fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('C:/Users/nelso/.gemini/antigravity/brain/54778396-91ad-4d81-8e16-cb6af1e91113/scratch/local-home.html', 'utf-8');
const dom = new JSDOM(html);
const doc = dom.window.document;

console.log('--- Unique class names inside .content_body ---');
const contentBody = doc.querySelector('.content_body');
if (contentBody) {
  const classes = new Set<string>();
  contentBody.querySelectorAll('*').forEach((el: any) => {
    if (el.className) {
      el.className.split(/\s+/).forEach((c: string) => {
        if (c.trim()) {
          classes.add(c.trim());
        }
      });
    }
  });
  
  console.log(Array.from(classes).sort());
} else {
  console.log('.content_body not found!');
}
