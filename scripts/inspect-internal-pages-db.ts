import { db, postsPages } from '../src/db/client';
import { eq, and } from 'drizzle-orm';

const pages = ['about-us', 'services', 'gallery', 'reviews', 'contact-us'];

async function run() {
  console.log('--- Inspecting DB Content of Internal Pages ---');
  
  for (const slug of pages) {
    const result = await db
      .select()
      .from(postsPages)
      .where(
        and(
          eq(postsPages.slug, slug),
          eq(postsPages.type, 'page')
        )
      )
      .limit(1);
      
    if (result.length === 0) {
      console.log(`Page '${slug}' not found in DB!`);
      continue;
    }
    
    const p = result[0];
    console.log(`\n================ PAGE: ${slug} ================`);
    console.log(`Title: ${p.title}`);
    console.log(`Content length: ${p.content.length}`);
    console.log('Snippet (first 500 chars):');
    console.log(p.content.slice(0, 500));
  }
  
  process.exit(0);
}

run();
