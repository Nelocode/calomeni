import { db, postsPages } from '../src/db/client';
import { eq, and } from 'drizzle-orm';

async function run() {
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

  if (result.length > 0) {
    console.log('--- Contact Us page content ---');
    console.log(result[0].content);
  } else {
    console.log('Contact Us page not found');
  }
  process.exit(0);
}

run();
