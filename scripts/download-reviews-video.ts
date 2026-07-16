import { db, postsPages } from '../src/db/client';
import { eq, and } from 'drizzle-orm';
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
  console.log('--- Starting Reviews Video Downloader ---');

  const result = await db
    .select()
    .from(postsPages)
    .where(
      and(
        eq(postsPages.slug, 'reviews'),
        eq(postsPages.type, 'page')
      )
    )
    .limit(1);

  if (result.length === 0) {
    console.log('No reviews page found in DB');
    process.exit(1);
  }

  let content = result[0].content;
  const videoUrl = 'https://calomenilaw.com/wp-content/uploads/2025/04/TESTIMONIAL-CALOMENI.mp4';
  const localFileName = 'testimonial_calomeni.mp4';
  const localFilePath = path.join(ASSETS_DIR, localFileName);

  console.log(`Downloading video: ${videoUrl} -> ${localFileName}`);
  const success = await downloadFile(videoUrl, localFilePath);

  if (success) {
    const localUrl = `/assets/imported/${localFileName}`;
    content = content.replace(videoUrl, localUrl);
    
    // Update the DB
    await db
      .update(postsPages)
      .set({ content: content })
      .where(
        and(
          eq(postsPages.slug, 'reviews'),
          eq(postsPages.type, 'page')
        )
      );
    console.log('Video updated locally in DB!');
  } else {
    console.log('Failed to download video.');
  }

  process.exit(0);
}

run();
