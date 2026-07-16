import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('C:\\Users\\nelso\\.gemini\\antigravity\\brain\\54778396-91ad-4d81-8e16-cb6af1e91113\\scratch\\raw-home.html', 'utf-8');
const dom = new JSDOM(html);
const doc = dom.window.document;

console.log('--- Stylesheet Links ---');
const links = doc.querySelectorAll('link[rel="stylesheet"]');
links.forEach(link => {
  console.log(`- href: ${link.getAttribute('href')}`);
});

console.log('\n--- Script Source Links ---');
const scripts = doc.querySelectorAll('script[src]');
scripts.forEach(script => {
  console.log(`- src: ${script.getAttribute('src')}`);
});
