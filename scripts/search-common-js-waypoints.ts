import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'public', 'assets', 'original', 'js', 'common.js');
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf-8');
  console.log('--- Searching common.js for waypoint ---');
  
  let pos = 0;
  while (true) {
    const idx = content.indexOf('waypoint', pos);
    if (idx === -1) break;
    console.log(`\nwaypoint snippet at index ${idx}:`);
    console.log(content.slice(Math.max(0, idx - 150), idx + 200));
    pos = idx + 1;
  }
} else {
  console.log('common.js not found!');
}
