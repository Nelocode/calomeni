import { db, postsPages } from '../src/db/client';
import { eq, and } from 'drizzle-orm';
import { JSDOM } from 'jsdom';

async function run() {
  const result = await db
    .select()
    .from(postsPages)
    .where(
      and(
        eq(postsPages.slug, 'home'),
        eq(postsPages.type, 'page')
      )
    )
    .limit(1);

  if (result.length === 0) {
    console.log('No home page found');
    process.exit(1);
  }

  const content = result[0].content;
  const dom = new JSDOM(content);
  const doc = dom.window.document;

  const styleTags = doc.querySelectorAll('style');
  console.log(`Found ${styleTags.length} <style> tags in home page content:`);
  styleTags.forEach((s, idx) => {
    console.log(`\n--- Style Tag ${idx + 1} ---`);
    console.log(s.textContent?.slice(0, 1000));
  });

  process.exit(0);
}

run();
