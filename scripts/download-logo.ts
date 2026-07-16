import fs from 'fs';
import path from 'path';

async function run() {
  const url = 'https://web.archive.org/web/20241221015017im_/https://www.calomeniandassociates.com/wp-content/uploads/LOGO-CALOMENI-PARA-WEB-BIG.png';
  const destDir = path.join(process.cwd(), 'public', 'assets', 'imported');
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  const destPath = path.join(destDir, 'logo-big.png');
  
  console.log(`Downloading logo: ${url} -> ${destPath}`);
  const res = await fetch(url);
  if (res.ok) {
    const ab = await res.arrayBuffer();
    fs.writeFileSync(destPath, Buffer.from(ab));
    console.log('Logo downloaded successfully!');
  } else {
    console.error('Failed to download logo.');
  }
}
run();
