import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\nelso\\.gemini\\antigravity\\brain\\54778396-91ad-4d81-8e16-cb6af1e91113';
const DEST_DIR = path.join(process.cwd(), 'public', 'assets', 'imported');

const images = [
  { srcName: 'immigration_law_service_1784166900773.jpg', destName: 'immigration-law.jpg' },
  { srcName: 'accident_law_service_1784166912934.jpg', destName: 'accident-law.jpg' },
  { srcName: 'family_law_service_1784166925321.jpg', destName: 'family-law.jpg' },
  { srcName: 'business_law_service_1784166939915.jpg', destName: 'business-law.jpg' },
  { srcName: 'lawyers_team_about_1784166953086.jpg', destName: 'about-us-team.jpg' }
];

async function run() {
  console.log('--- Copying generated images to public assets ---');
  if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
  }

  images.forEach(img => {
    const srcPath = path.join(ARTIFACTS_DIR, img.srcName);
    const destPath = path.join(DEST_DIR, img.destName);

    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${img.srcName} -> ${img.destName}`);
    } else {
      console.log(`Source not found: ${img.srcName}`);
    }
  });

  console.log('Images deployed successfully!');
  process.exit(0);
}

run();
