import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'public', 'assets', 'original', 'css', 'theme-style.css');
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf-8');
  console.log('--- Inspecting .boc_heading in theme-style.css ---');
  
  const index = content.indexOf('.boc_heading');
  if (index !== -1) {
    console.log(content.slice(index - 100, index + 400));
  } else {
    console.log('.boc_heading not found!');
  }
} else {
  console.log('theme-style.css not found!');
}
