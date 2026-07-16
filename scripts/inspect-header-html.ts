import fs from 'fs';

async function run() {
  const rawHomePath = 'C:\\Users\\nelso\\.gemini\\antigravity\\brain\\54778396-91ad-4d81-8e16-cb6af1e91113\\scratch\\raw-home.html';
  
  console.log('--- Inspecting header in raw-home.html ---');
  if (fs.existsSync(rawHomePath)) {
    const rawHtml = fs.readFileSync(rawHomePath, 'utf-8');
    const headerStart = rawHtml.indexOf('<header');
    const headerEnd = rawHtml.indexOf('</header>');
    if (headerStart !== -1 && headerEnd !== -1) {
      console.log(rawHtml.slice(headerStart, headerEnd + 9));
    } else {
      console.log('Header tags not found in raw-home.html');
    }
  } else {
    console.log('raw-home.html not found at absolute path!');
  }
}

run();
