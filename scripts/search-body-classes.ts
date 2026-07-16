import fs from 'fs';
import path from 'path';

const rawHomePath = 'C:\\Users\\nelso\\.gemini\\antigravity\\brain\\54778396-91ad-4d81-8e16-cb6af1e91113\\scratch\\raw-home.html';
const cssFile = path.join(process.cwd(), 'public', 'assets', 'original', 'css', 'theme-style.css');

async function run() {
  console.log('--- Inspecting body classes in raw-home.html ---');
  if (fs.existsSync(rawHomePath)) {
    const rawHtml = fs.readFileSync(rawHomePath, 'utf-8');
    const bodyStart = rawHtml.indexOf('<body');
    if (bodyStart !== -1) {
      const bodyTag = rawHtml.slice(bodyStart, rawHtml.indexOf('>', bodyStart) + 1);
      console.log('Body Tag:', bodyTag);
    }
  }

  console.log('\n--- Searching theme-style.css for header styles ---');
  if (fs.existsSync(cssFile)) {
    const css = fs.readFileSync(cssFile, 'utf-8');
    const regex = /\.header_style_[^{}]*\{[^{}]*\}/gi;
    const matches = css.match(regex) || [];
    matches.slice(0, 20).forEach(m => console.log(m.trim().replace(/\s+/g, ' ')));
  }
}

run();
