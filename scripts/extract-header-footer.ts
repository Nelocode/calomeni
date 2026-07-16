import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('C:/Users/nelso/.gemini/antigravity/brain/54778396-91ad-4d81-8e16-cb6af1e91113/scratch/raw-home.html', 'utf-8');
const dom = new JSDOM(html);
const doc = dom.window.document;

// Remove wayback injected things from the DOM first
const waybackElements = doc.querySelectorAll('#wm-ipp-base, #wm-ipp, #wm-ipp-print, #wm-ipp-inside, script[src*="archive.org"], link[href*="archive.org"]');
waybackElements.forEach(el => el.remove());

// Find the main header and footer
// WordPress header might be inside a div or be a header tag.
// Let's print out what elements exist in body.
const header = doc.querySelector('header') || doc.querySelector('#header') || doc.querySelector('.header');
const footer = doc.querySelector('footer') || doc.querySelector('#footer') || doc.querySelector('.footer');

if (header) {
  console.log('--- HEADER HTML ---');
  console.log(header.outerHTML);
} else {
  console.log('No header element found');
}

if (footer) {
  console.log('\n--- FOOTER HTML ---');
  console.log(footer.outerHTML);
} else {
  console.log('No footer element found');
}
