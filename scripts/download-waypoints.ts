import fs from 'fs';
import path from 'path';

const url = 'https://web.archive.org/web/20241221015017/https://www.calomeniandassociates.com/wp-content/plugins/js_composer/assets/lib/waypoints/waypoints.min.js';
const dest = path.join(process.cwd(), 'public', 'assets', 'original', 'js', 'waypoints.min.js');

async function download() {
  console.log(`Downloading waypoints.min.js from Wayback Machine...`);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`HTTP error: ${res.status} ${res.statusText}`);
      process.exit(1);
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buffer);
    console.log(`Successfully downloaded waypoints.min.js to: ${dest}`);
    process.exit(0);
  } catch (err) {
    console.error('Download failed:', err);
    process.exit(1);
  }
}

download();
