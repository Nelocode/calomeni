import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'public', 'assets', 'original', 'js', 'common.js');
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf-8');
  console.log('--- Searching common.js for fadeOut ---');
  
  let pos = 0;
  while (true) {
    const idx = content.indexOf('fadeOut', pos);
    if (idx === -1) break;
    console.log(`\nfadeOut snippet at index ${idx}:`);
    console.log(content.slice(Math.max(0, idx - 100), idx + 100));
    pos = idx + 1;
  }
} else {
  console.log('common.js not found!');
}
