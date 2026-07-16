import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'public', 'assets', 'original', 'css', 'theme-style.css');
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf-8');
  const index = content.indexOf('/* PIC stuff */');
  if (index !== -1) {
    console.log(content.slice(index, index + 500));
  } else {
    console.log('/* PIC stuff */ comment not found, searching for .pic');
    const picIndex = content.indexOf('.pic');
    if (picIndex !== -1) {
      console.log(content.slice(picIndex, picIndex + 500));
    }
  }
} else {
  console.log('theme-style.css not found!');
}
