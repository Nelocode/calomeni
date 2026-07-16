import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'public', 'assets', 'original', 'css', 'js_composer.min.css');
const content = fs.readFileSync(file, 'utf-8');

console.log('--- Inspecting css rules in js_composer.min.css ---');

// Find rule for wpb_animate_when_almost_visible
const ruleIndex = content.indexOf('.wpb_animate_when_almost_visible');
if (ruleIndex !== -1) {
  console.log('wpb_animate_when_almost_visible rule snippet:');
  console.log(content.slice(ruleIndex, ruleIndex + 300));
}

// Find keyframes wpb_appear
const keyframesIndex = content.indexOf('@keyframes wpb_appear');
if (keyframesIndex !== -1) {
  console.log('\nwpb_appear keyframes snippet:');
  console.log(content.slice(keyframesIndex, keyframesIndex + 300));
}

// Find keyframes wpb_btt
const keyframesBttIndex = content.indexOf('@keyframes wpb_btt');
if (keyframesBttIndex !== -1) {
  console.log('\nwpb_btt keyframes snippet:');
  console.log(content.slice(keyframesBttIndex, keyframesBttIndex + 300));
}
