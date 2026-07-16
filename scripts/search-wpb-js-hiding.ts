import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'public', 'assets', 'original', 'js', 'js_composer_front.min.js');
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf-8');
  console.log('--- Searching js_composer_front.min.js for hiding operations ---');
  
  // Find hide, opacity, display, css, fadeOut, animate, remove
  const keywords = ['hide', 'opacity', 'display', 'css', 'fadeOut', 'animate', 'remove'];
  
  // Since it is minified, we look for matches of these words
  keywords.forEach(kw => {
    let count = 0;
    let pos = 0;
    while ((pos = content.indexOf(kw, pos)) !== -1) {
      count++;
      pos += kw.length;
    }
    console.log(`Keyword "${kw}": found ${count} times`);
  });
  
  // Let's print snippets around the word "opacity" or "hide"
  let pos = 0;
  while (true) {
    const idx = content.indexOf('opacity', pos);
    if (idx === -1) break;
    console.log(`\nOpacity snippet at index ${idx}:`);
    console.log(content.slice(Math.max(0, idx - 100), idx + 100));
    pos = idx + 1;
  }
} else {
  console.log('js_composer_front.min.js not found!');
}
