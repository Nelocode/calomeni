import fs from 'fs';

async function run() {
  try {
    const res = await fetch('http://localhost:4321/');
    if (!res.ok) {
      console.log(`Failed to fetch local server: ${res.status} ${res.statusText}`);
      process.exit(1);
    }
    const html = await res.text();
    const dest = 'C:/Users/nelso/.gemini/antigravity/brain/54778396-91ad-4d81-8e16-cb6af1e91113/scratch/local-home.html';
    fs.writeFileSync(dest, html);
    console.log(`Successfully fetched local home page and saved to: ${dest}`);
    process.exit(0);
  } catch (err) {
    console.error('Error fetching local server:', err);
    process.exit(1);
  }
}

run();
