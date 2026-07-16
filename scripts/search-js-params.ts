import fs from 'fs';

const html = fs.readFileSync('C:/Users/nelso/.gemini/antigravity/brain/54778396-91ad-4d81-8e16-cb6af1e91113/scratch/raw-home.html', 'utf-8');

// Find script tags containing bocJSParams
const matches = html.match(/<script[^>]*>[\s\S]*?bocJSParams[\s\S]*?<\/script>/gi) || [];
console.log(`Found ${matches.length} script tags with bocJSParams:`);
matches.forEach((m, idx) => {
  console.log(`\nMatch ${idx + 1}:`);
  console.log(m);
});
