import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'public', 'assets', 'original', 'css', 'js_composer.min.css');
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf-8');
  
  console.log('--- Finding Selector for opacity:0!important ---');
  
  let pos = 0;
  while (true) {
    const idx = content.indexOf('opacity:0!important', pos);
    if (idx === -1) break;
    
    // Find the nearest preceding '{'
    let openBrace = idx;
    while (openBrace > 0 && content[openBrace] !== '{') {
      openBrace--;
    }
    
    // Find the nearest preceding '}' before the openBrace
    let closeBrace = openBrace - 1;
    while (closeBrace > 0 && content[closeBrace] !== '}' && content[closeBrace] !== '{') {
      closeBrace--;
    }
    
    const selector = content.slice(closeBrace + 1, openBrace).trim();
    console.log(`Found at index ${idx}:`);
    console.log(`  Selector: "${selector}"`);
    console.log(`  Rule: "${content.slice(openBrace + 1, idx + 100)}"`);
    
    pos = idx + 1;
  }
} else {
  console.log('js_composer.min.css not found!');
}
