import fs from 'fs';
import path from 'path';

const cssFile = path.join(process.cwd(), 'public', 'assets', 'original', 'css', 'js_composer.min.css');
if (fs.existsSync(cssFile)) {
  const content = fs.readFileSync(cssFile, 'utf-8');
  console.log('--- Searching js_composer.min.css for animations ---');
  
  // Search for classes containing animate
  const classes = content.match(/\.[a-zA-Z0-9_-]*animate[a-zA-Z0-9_-]*/g) || [];
  console.log(`Found ${classes.length} classes containing 'animate'. Unique classes:`);
  console.log(Array.from(new Set(classes)).slice(0, 50));
  
  // Search for keyframes
  const keyframes = content.match(/@keyframes\s+[a-zA-Z0-9_-]+/g) || [];
  console.log(`Found keyframes:`, keyframes);
} else {
  console.log('js_composer.min.css not found!');
}
