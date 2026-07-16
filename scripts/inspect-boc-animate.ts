import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'public', 'assets', 'original', 'css', 'theme-style.css');
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf-8');
  console.log('--- Inspecting .boc_animate_when_almost_visible in theme-style.css ---');
  
  const index = content.indexOf('.boc_animate_when_almost_visible');
  if (index !== -1) {
    console.log(content.slice(index - 100, index + 400));
  } else {
    console.log('.boc_animate_when_almost_visible not found!');
  }
} else {
  console.log('theme-style.css not found!');
}
