import fs from 'fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('C:/Users/nelso/.gemini/antigravity/brain/54778396-91ad-4d81-8e16-cb6af1e91113/scratch/local-home.html', 'utf-8');
const dom = new JSDOM(html);
const doc = dom.window.document;

console.log('--- Inspecting Current local-home.html ---');

// 1. Check if any animation classes remain
const ANIMATION_CLASSES = [
  'wpb_animate_when_almost_visible',
  'boc_animate_when_almost_visible',
  'vc_animate-when-almost-visible',
  'animate_when_almost_visible',
  'wpb_bounceInUp',
  'wpb_fadeInLeft',
  'wpb_fadeInRight',
  'bounceInUp',
  'fadeInLeft',
  'fadeInRight',
  'boc_bottom-to-top',
  'boc_anim_hidden',
  'animated'
];

let foundAnimationClasses = 0;
doc.querySelectorAll('*').forEach((el: any) => {
  ANIMATION_CLASSES.forEach(cls => {
    if (el.classList.contains(cls)) {
      console.log(`Found animation class "${cls}" on <${el.tagName.toLowerCase()}> class="${el.className}"`);
      foundAnimationClasses++;
    }
  });
});
console.log(`Total animation classes found in current HTML: ${foundAnimationClasses}`);

// 2. Check content of .content_body
const contentBody = doc.querySelector('.content_body');
if (contentBody) {
  console.log('\n.content_body text length:', contentBody.textContent?.trim().length || 0);
  console.log('.content_body innerHTML snippet (first 300 chars):');
  console.log(contentBody.innerHTML.trim().slice(0, 300));
} else {
  console.log('\nERROR: .content_body NOT FOUND in final HTML!');
}

// 3. Search for any opacity or display styles in inlined <style> elements
console.log('\nSearching for opacity or display:none styles in inlined <style> elements:');
doc.querySelectorAll('style').forEach((style, idx) => {
  const content = style.textContent || '';
  if (content.includes('opacity') || content.includes('display:none') || content.includes('display: none')) {
    console.log(`Style element ${idx + 1} contains opacity/display:none!`);
    // Find lines
    const lines = content.split('\n');
    lines.forEach(line => {
      if (line.match(/(opacity|display\s*:\s*none)/i) && line.match(/(wrapper|content|body|row|column|\bvc_\b|\bwpb_\b|\bpic\b)/i)) {
        console.log(`  - ${line.trim().slice(0, 150)}`);
      }
    });
  }
});
