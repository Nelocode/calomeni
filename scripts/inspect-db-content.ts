import { db, postsPages } from '../src/db/client';
import { eq } from 'drizzle-orm';
import { JSDOM } from 'jsdom';

async function run() {
  const result = await db
    .select()
    .from(postsPages)
    .where(eq(postsPages.slug, 'home'))
    .limit(1);
    
  if (result.length === 0) {
    console.log('No home page found in DB');
    process.exit(1);
  }
  
  const content = result[0].content;
  const dom = new JSDOM(content);
  const doc = dom.window.document;
  
  console.log('--- Checking <style> tags in DB content ---');
  const styles = doc.querySelectorAll('style');
  console.log(`Found ${styles.length} style tags in DB content:`);
  styles.forEach((s, idx) => {
    const text = s.textContent || '';
    console.log(`[${idx + 1}] Length: ${text.length}`);
    if (text.includes('vc_custom_')) {
      console.log(`  - CONTAINS vc_custom_! Snippet: ${text.slice(0, 300)}`);
    } else {
      console.log(`  - No vc_custom_ found. Snippet: ${text.slice(0, 100)}`);
    }
  });
  
  process.exit(0);
}

run();
