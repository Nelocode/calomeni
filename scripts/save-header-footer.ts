import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('C:/Users/nelso/.gemini/antigravity/brain/54778396-91ad-4d81-8e16-cb6af1e91113/scratch/raw-home.html', 'utf-8');
const dom = new JSDOM(html);
const doc = dom.window.document;

// Remove Wayback injected elements
const waybackElements = doc.querySelectorAll('#wm-ipp-base, #wm-ipp, #wm-ipp-print, #wm-ipp-inside, script[src*="archive.org"], link[href*="archive.org"]');
waybackElements.forEach(el => el.remove());

const header = doc.querySelector('header') || doc.querySelector('#header') || doc.querySelector('.header');
const footer = doc.querySelector('footer') || doc.querySelector('#footer') || doc.querySelector('.footer');

const destDir = 'C:/Users/nelso/.gemini/antigravity/brain/54778396-91ad-4d81-8e16-cb6af1e91113/scratch';

if (header) {
  fs.writeFileSync(path.join(destDir, 'header.html'), header.outerHTML);
  console.log('Saved header.html');
} else {
  console.log('Header not found');
}

if (footer) {
  fs.writeFileSync(path.join(destDir, 'footer.html'), footer.outerHTML);
  console.log('Saved footer.html');
} else {
  console.log('Footer not found');
}
