import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'public', 'assets', 'original', 'js', 'common.js');
const content = fs.readFileSync(file, 'utf-8');

console.log('--- Usages of bocJSParams in common.js ---');
const matches = content.match(/bocJSParams\.[a-zA-Z0-9_]+/g) || [];
console.log(Array.from(new Set(matches)));
