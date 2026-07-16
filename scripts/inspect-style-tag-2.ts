import fs from 'fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('C:/Users/nelso/.gemini/antigravity/brain/54778396-91ad-4d81-8e16-cb6af1e91113/scratch/local-home.html', 'utf-8');
const dom = new JSDOM(html);
const doc = dom.window.document;

const styleTags = doc.querySelectorAll('style');
if (styleTags.length >= 2) {
  const content = styleTags[1].textContent || '';
  console.log('Style Tag 2 total size:', content.length);
  // Search for body or html rules
  const bodyIndex = content.indexOf('body');
  if (bodyIndex !== -1) {
    console.log('Snippet around body:');
    console.log(content.slice(bodyIndex - 50, bodyIndex + 300));
  } else {
    console.log('body selector not found in Style Tag 2');
  }
} else {
  console.log('Less than 2 style tags found!');
}
