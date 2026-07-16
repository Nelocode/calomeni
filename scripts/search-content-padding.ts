import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'public', 'assets', 'original', 'css', 'theme-style.css');
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf-8');
  console.log('--- Searching theme-style.css for content spacing / padding ---');
  
  const selectors = [
    /\.content_body[^{}]*\{[^{}]*\}/gi,
    /#wrapper[^{}]*\{[^{}]*\}/gi,
    /\.full_container_page_title[^{}]*\{[^{}]*\}/gi
  ];

  selectors.forEach(regex => {
    const matches = content.match(regex) || [];
    matches.slice(0, 5).forEach(m => console.log(m.trim().replace(/\s+/g, ' ')));
  });
} else {
  console.log('theme-style.css not found!');
}
