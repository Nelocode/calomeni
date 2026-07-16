import fs from 'fs';
import path from 'path';

const jsDir = path.join(process.cwd(), 'public', 'assets', 'original', 'js');

function searchElementHiding(fileName: string) {
  const filePath = path.join(jsDir, fileName);
  if (!fs.existsSync(filePath)) return;
  
  const content = fs.readFileSync(filePath, 'utf-8');
  console.log(`\n--- Hiding/Animation operations in ${fileName} ---`);
  
  // Find lines with opacity, hide, fadeOut, animate, display, css
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.match(/(body|wrapper|content_body|content|html|page)/i) && 
        line.match(/(opacity|hide|fade|css|animate|display)/i)) {
      console.log(`Line ${idx + 1}: ${line.trim().slice(0, 150)}`);
    }
  });
}

searchElementHiding('common.js');
searchElementHiding('libs.min.js');
searchElementHiding('js_composer_front.min.js');
