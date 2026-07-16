import fs from 'fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('C:/Users/nelso/.gemini/antigravity/brain/54778396-91ad-4d81-8e16-cb6af1e91113/scratch/raw-home.html', 'utf-8');
const dom = new JSDOM(html);
const doc = dom.window.document;

console.log('--- Inspecting All Rows in Homepage ---');

const rows = doc.querySelectorAll('.post_content > .vc_row, .content_body .vc_row');
console.log(`Found ${rows.length} rows:`);

rows.forEach((row: any, rIdx) => {
  console.log(`\nRow [${rIdx + 1}]: id="${row.id}" class="${row.className}"`);
  
  // Find top-level columns of this row (not columns of nested rows)
  const columns = Array.from(row.querySelectorAll('.wpb_column')).filter((col: any) => {
    // Keep only columns whose direct row parent is this row
    let parent = col.parentElement;
    while (parent && !parent.classList.contains('vc_row')) {
      parent = parent.parentElement;
    }
    return parent === row;
  });
  
  console.log(`  Columns found: ${columns.length}`);
  columns.forEach((col: any, cIdx) => {
    console.log(`    * Column [${cIdx + 1}]: class="${col.className}"`);
    // Print headings and text snippets
    const headings = col.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingTexts = Array.from(headings).map((h: any) => `<${h.tagName.toLowerCase()}> "${h.textContent?.trim()}"`).join(', ');
    if (headingTexts) {
      console.log(`      - Headings: ${headingTexts}`);
    }
    const images = col.querySelectorAll('img');
    const imageSources = Array.from(images).map((img: any) => img.src).join(', ');
    if (imageSources) {
      console.log(`      - Images: ${imageSources}`);
    }
    // Check if column has custom style attribute
    const style = col.getAttribute('style');
    if (style) {
      console.log(`      - Inline style: "${style}"`);
    }
  });
});
