import fs from 'fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('C:/Users/nelso/.gemini/antigravity/brain/54778396-91ad-4d81-8e16-cb6af1e91113/scratch/local-home.html', 'utf-8');
const dom = new JSDOM(html);
const doc = dom.window.document;

console.log('--- Checking for <style> tags inside .original-page-content ---');
const container = doc.querySelector('.original-page-content');
if (container) {
  const styles = container.querySelectorAll('style');
  console.log(`Found ${styles.length} style tags inside .original-page-content:`);
  styles.forEach((s, idx) => {
    console.log(`[${idx + 1}] Length: ${s.textContent?.length || 0}`);
    console.log(`Snippet: ${s.textContent?.trim().slice(0, 300)}`);
  });
} else {
  console.log('.original-page-content not found!');
}
