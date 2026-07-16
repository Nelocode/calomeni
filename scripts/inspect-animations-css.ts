import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'public', 'assets', 'original', 'css', 'animations.css');
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf-8');
  console.log('--- Inspecting animations.css ---');
  
  const index = content.indexOf('.boc_animate_when_almost_visible');
  if (index !== -1) {
    console.log(content.slice(index, index + 500));
  } else {
    console.log('.boc_animate_when_almost_visible not found in animations.css');
    // Print first 500 chars of file
    console.log(content.slice(0, 500));
  }
} else {
  console.log('animations.css not found!');
}
