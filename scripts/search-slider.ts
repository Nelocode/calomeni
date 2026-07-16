import fs from 'fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('C:/Users/nelso/.gemini/antigravity/brain/54778396-91ad-4d81-8e16-cb6af1e91113/scratch/local-home.html', 'utf-8');
const dom = new JSDOM(html);
const doc = dom.window.document;

console.log('--- Searching for Slider Elements ---');

const sliderCandidates = doc.querySelectorAll('#slider, .slider, #deslizador, .deslizador, [class*="slider"], [id*="slider"], [class*="revslider"], [id*="revslider"]');
console.log(`Found ${sliderCandidates.length} slider candidates:`);
sliderCandidates.forEach((el, idx) => {
  console.log(`[${idx + 1}] Tag: <${el.tagName.toLowerCase()}> id="${el.id}" class="${el.className}"`);
});
