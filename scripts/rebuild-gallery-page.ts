import { db, postsPages } from '../src/db/client';
import { eq, and } from 'drizzle-orm';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets', 'imported');

async function downloadFile(url: string, destPath: string): Promise<boolean> {
  const dir = path.dirname(destPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(destPath, buffer);
    return true;
  } catch (err) {
    console.error(`Failed to download ${url}:`, err);
    return false;
  }
}

async function run() {
  console.log('--- Rebuilding Gallery Page Content ---');

  const result = await db
    .select()
    .from(postsPages)
    .where(
      and(
        eq(postsPages.slug, 'gallery'),
        eq(postsPages.type, 'page')
      )
    )
    .limit(1);

  if (result.length === 0) {
    console.log('No gallery page found in DB');
    process.exit(1);
  }

  const content = result[0].content;
  const dom = new JSDOM(content);
  const doc = dom.window.document;

  const links = doc.querySelectorAll('a');
  console.log(`Processing ${links.length} gallery links...`);

  let galleryHtml = '<h2>Galería de Fotos</h2>\n<div class="gallery-grid">\n';

  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    const actionHash = link.getAttribute('data-e-action-hash') || '';
    
    // Parse the settings base64 out of data-e-action-hash
    // Format is: #elementor-action%3Aaction%3Dlightbox%26settings%3D<BASE64>
    // URL-decoded: #elementor-action:action=lightbox&settings=<BASE64>
    const decodedHash = decodeURIComponent(actionHash);
    const settingsMatch = decodedHash.match(/settings=([^&]+)/);
    
    if (settingsMatch) {
      const settingsB64 = settingsMatch[1];
      try {
        const jsonStr = Buffer.from(settingsB64, 'base64').toString('utf-8');
        const settings = JSON.parse(jsonStr);
        const imageUrl = settings.url;
        
        if (imageUrl) {
          const basename = path.basename(imageUrl.split('?')[0]);
          const localFileName = `gallery_${Date.now()}_${basename}`;
          const localFilePath = path.join(ASSETS_DIR, localFileName);
          
          console.log(`Downloading gallery image [${i+1}]: ${imageUrl} -> ${localFileName}`);
          const success = await downloadFile(imageUrl, localFilePath);
          
          if (success) {
            const localUrl = `/assets/imported/${localFileName}`;
            galleryHtml += `  <div class="gallery-item">\n`;
            galleryHtml += `    <a href="${localUrl}" target="_blank" class="gallery-lightbox-link">\n`;
            galleryHtml += `      <img src="${localUrl}" alt="${settings.title || 'Foto Galería'}" class="gallery-thumbnail" />\n`;
            galleryHtml += `    </a>\n`;
            galleryHtml += `  </div>\n`;
          }
        }
      } catch (err) {
        console.error(`Failed to parse settings for link ${i+1}:`, err);
      }
    }
  }

  galleryHtml += '</div>\n';

  // Add CSS grid styles to make the gallery look absolutely stunning!
  galleryHtml += `
<style>
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
    margin-top: 30px;
    margin-bottom: 50px;
  }
  .gallery-item {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    background: #fff;
    border: 1px solid #eee;
  }
  .gallery-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  }
  .gallery-thumbnail {
    width: 100%;
    height: 180px;
    object-fit: cover;
    display: block;
    transition: opacity 0.2s ease;
  }
  .gallery-thumbnail:hover {
    opacity: 0.9;
  }
</style>
`;

  // Wrap inside the standard page-content container
  const finalContent = `<div class="page-content">\n${galleryHtml}\n</div>`;

  await db
    .update(postsPages)
    .set({ content: finalContent })
    .where(
      and(
        eq(postsPages.slug, 'gallery'),
        eq(postsPages.type, 'page')
      )
    );

  console.log('Gallery page rebuilt and updated in DB successfully!');
  process.exit(0);
}

run();
