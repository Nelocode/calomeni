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
  
  const section = doc.querySelector('.section');
  if (section) {
    console.log('--- Children of .section ---');
    section.childNodes.forEach((node: any) => {
      if (node.nodeType === 1) {
        console.log(`Tag: <${node.tagName.toLowerCase()}> id="${node.id}" class="${node.className}"`);
        node.childNodes.forEach((child: any) => {
          if (child.nodeType === 1) {
            console.log(`  Subtag: <${child.tagName.toLowerCase()}> id="${child.id}" class="${child.className}"`);
          }
        });
      }
    });
  } else {
    console.log('.section not found!');
  }
  
  process.exit(0);
}

run();
