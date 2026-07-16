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
  
  console.log('--- Searching for Parallax attributes in Homepage ---');
  const parallaxElements = doc.querySelectorAll('[*|parallax], [class*="parallax"], [id*="parallax"]');
  console.log(`Found ${parallaxElements.length} elements containing 'parallax':`);
  parallaxElements.forEach((el, idx) => {
    console.log(`[${idx + 1}] Tag: <${el.tagName.toLowerCase()}> id="${el.id}" class="${el.className}"`);
    // Print attributes
    Array.from(el.attributes).forEach(attr => {
      console.log(`  - ${attr.name} = "${attr.value}"`);
    });
  });
  
  // Search for data-vc-parallax anywhere
  const vcParallax = doc.querySelectorAll('[data-vc-parallax], [data-vc-parallax-o-fade]');
  console.log(`\nFound ${vcParallax.length} elements with data-vc-parallax:`);
  vcParallax.forEach((el, idx) => {
    console.log(`[${idx + 1}] Tag: <${el.tagName.toLowerCase()}> id="${el.id}" class="${el.className}"`);
    Array.from(el.attributes).forEach(attr => {
      console.log(`  - ${attr.name} = "${attr.value}"`);
    });
  });
  
  process.exit(0);
}

run();
