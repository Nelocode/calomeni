import { db, postsPages } from '../src/db/client';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

async function downloadFile(url: string, dest: string) {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  console.log(`Downloading BG Image: ${url} -> ${dest}`);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP Status ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(dest, buffer);
    console.log(`Saved BG Image: ${dest}`);
    return true;
  } catch (err) {
    console.error(`Failed to download BG Image ${url}:`, err);
    return false;
  }
}

async function run() {
  console.log('--- Starting Background Image Downloader & DB Updater ---');
  
  const result = await db
    .select()
    .from(postsPages)
    .where(eq(postsPages.slug, 'home'))
    .limit(1);
    
  if (result.length === 0) {
    console.log('No home page found in DB');
    process.exit(1);
  }
  
  let content = result[0].content;
  
  // Find all URLs inside url(...) pointing to web.archive.org
  const urlRegex = /url\(['"]?(https:\/\/web\.archive\.org\/web\/[0-9]+im_\/[^'")]+)['"]?\)/gi;
  const matches = [];
  let match;
  while ((match = urlRegex.exec(content)) !== null) {
    matches.push(match[1]);
  }
  
  console.log(`Found ${matches.length} background images in content styles.`);
  
  let updatedCount = 0;
  for (const url of matches) {
    // Extract filename
    // Example url: https://web.archive.org/web/20241221015017im_/https://www.calomeniandassociates.com/wp-content/uploads/414900-PD6T35-864-1.jpg?id=25476
    const cleanUrl = url.split('?')[0];
    const basename = path.basename(cleanUrl);
    const localBasename = `bg_${Date.now()}_${basename}`;
    const localPath = path.join('public', 'assets', 'imported', localBasename);
    
    const success = await downloadFile(url, localPath);
    if (success) {
      // Replace remote URL with local path in content
      const localUrl = `/assets/imported/${localBasename}`;
      // Escape URL for regex replacement
      const escapedUrl = url.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const replaceRegex = new RegExp(escapedUrl, 'g');
      content = content.replace(replaceRegex, localUrl);
      updatedCount++;
    }
  }
  
  if (updatedCount > 0) {
    await db
      .update(postsPages)
      .set({ content: content })
      .where(eq(postsPages.slug, 'home'));
    console.log(`Updated ${updatedCount} background image URLs in database.`);
  } else {
    console.log('No database updates needed.');
  }

  console.log('--- Background Image Downloader Completed! ---');
  process.exit(0);
}

run();
