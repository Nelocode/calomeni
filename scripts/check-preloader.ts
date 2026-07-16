import fs from 'fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('C:/Users/nelso/.gemini/antigravity/brain/54778396-91ad-4d81-8e16-cb6af1e91113/scratch/raw-home.html', 'utf-8');
const dom = new JSDOM(html);
const doc = dom.window.document;

// Search for preloader divs
const preloaderCandidates = doc.querySelectorAll('[id*="preloader"], [id*="loader"], [class*="preloader"], [class*="loader"], [id*="loading"], [class*="loading"]');
console.log('--- Preloader candidates ---');
preloaderCandidates.forEach(el => {
  console.log(`Tag: <${el.tagName.toLowerCase()}> id="${el.id}" class="${el.className}"`);
});

// Look for opacity styles in html or body in raw HTML
const rawMatches = html.match(/<body[^>]*>/i);
if (rawMatches) {
  console.log('\nBody tag:', rawMatches[0]);
}
const htmlMatches = html.match(/<html[^>]*>/i);
if (htmlMatches) {
  console.log('Html tag:', htmlMatches[0]);
}
