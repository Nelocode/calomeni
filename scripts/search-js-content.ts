import fs from 'fs';
import path from 'path';

const jsDir = path.join(process.cwd(), 'public', 'assets', 'original', 'js');

function searchFile(fileName: string) {
  const filePath = path.join(jsDir, fileName);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${fileName}`);
    return;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  console.log(`\n--- Searching in ${fileName} ---`);
  
  // Look for fadeOut, fadeIn, preloader, animate, opacity
  const keywords = ['fadeOut', 'fadeIn', 'preloader', 'loader', 'opacity', 'hide', 'animate', 'display'];
  
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    keywords.forEach(kw => {
      if (line.includes(kw)) {
        // Print matching lines, truncating to 120 chars
        console.log(`[${kw}] Line ${idx + 1}: ${line.trim().slice(0, 150)}`);
      }
    });
  });
}

searchFile('common.js');
searchFile('libs.min.js');
searchFile('parallax-custom.js');
