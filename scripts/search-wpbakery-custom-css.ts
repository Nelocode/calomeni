import fs from 'fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('C:/Users/nelso/.gemini/antigravity/brain/54778396-91ad-4d81-8e16-cb6af1e91113/scratch/raw-home.html', 'utf-8');
const dom = new JSDOM(html);
const doc = dom.window.document;

console.log('--- Searching raw-home.html head for custom styles ---');

const styleTags = doc.querySelectorAll('head style');
console.log(`Found ${styleTags.length} <style> tags in <head>:`);

styleTags.forEach((style, idx) => {
  const content = style.textContent || '';
  console.log(`\nStyle Tag ${idx + 1}: id="${style.id}" class="${style.className}" size=${content.length} chars`);
  
  // Look for .vc_custom or background-image
  if (content.includes('.vc_custom') || content.includes('background-image')) {
    console.log(`  -> Contains .vc_custom or background-image!`);
    console.log(content.slice(0, 500) + '\n...');
  }
});
