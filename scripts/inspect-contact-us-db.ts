import { db, postsPages } from '../src/db/client';
import { eq, and } from 'drizzle-orm';

async function run() {
  console.log('--- Inspecting DB Content of contact-us page ---');
  const result = await db
    .select()
    .from(postsPages)
    .where(
      and(
        eq(postsPages.slug, 'contact-us'),
        eq(postsPages.type, 'page')
      )
    )
    .limit(1);

  if (result.length === 0) {
    console.log('No contact-us page found');
    process.exit(1);
  }

  console.log(result[0].content);
  process.exit(0);
}

run();
