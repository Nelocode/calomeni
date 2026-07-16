import { db, postsPages } from '../src/db/client';
import { eq, and } from 'drizzle-orm';
import { JSDOM } from 'jsdom';

async function run() {
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

  console.log('--- Inspecting Gallery Links and Images ---');
  const links = doc.querySelectorAll('a');
  console.log(`Found ${links.length} links:`);
  links.forEach((l, idx) => {
    console.log(`[${idx + 1}] href="${l.href}" text="${l.textContent?.trim().slice(0, 100)}"`);
    // Print attributes
    Array.from(l.attributes).forEach(attr => {
      console.log(`  - ${attr.name} = "${attr.value}"`);
    });
  });

  const imgs = doc.querySelectorAll('img');
  console.log(`\nFound ${imgs.length} images:`);
  imgs.forEach((img, idx) => {
    console.log(`[${idx + 1}] src="${img.src}" class="${img.className}"`);
  });

  process.exit(0);
}

run();
