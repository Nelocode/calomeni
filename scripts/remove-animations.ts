import { db, postsPages } from '../src/db/client';
import { eq } from 'drizzle-orm';
import { JSDOM } from 'jsdom';

const ANIMATION_CLASSES = [
  'wpb_animate_when_almost_visible',
  'boc_animate_when_almost_visible',
  'vc_animate-when-almost-visible',
  'animate_when_almost_visible',
  'wpb_bounceInUp',
  'wpb_fadeInLeft',
  'wpb_fadeInRight',
  'bounceInUp',
  'fadeInLeft',
  'fadeInRight',
  'boc_bottom-to-top',
  'boc_anim_hidden',
  'animated',
  'boc_start_animation',
  'wpb_start_animation'
];

async function removeAnimations() {
  console.log('--- Stripping Animation Classes from Database Pages ---');
  
  const pages = await db.select().from(postsPages);
  
  for (const page of pages) {
    if (!page.content) continue;
    
    console.log(`Processing: ${page.title} (Slug: ${page.slug})`);
    
    const dom = new JSDOM(page.content);
    const doc = dom.window.document;
    
    // Find all elements inside the page
    const elements = doc.querySelectorAll('*');
    let removedCount = 0;
    
    elements.forEach((el: any) => {
      ANIMATION_CLASSES.forEach(cls => {
        if (el.classList.contains(cls)) {
          el.classList.remove(cls);
          removedCount++;
        }
      });
      
      // Also remove any data-animate or data-delay attributes if present
      if (el.hasAttribute('data-animate')) {
        el.removeAttribute('data-animate');
      }
      if (el.hasAttribute('data-delay')) {
        el.removeAttribute('data-delay');
      }
    });
    
    console.log(`  Removed ${removedCount} animation class occurrences`);
    
    const newContent = dom.serialize();
    // Serialize returns full html document, but in database we only want the body content
    // wait! JSDOM serialize returns <html><head></head><body>...</body></html>.
    // If the database has <style> tags at the beginning, JSDOM might put them in head or body.
    // Let's get the innerHTML of head and body to preserve styles and content!
    const headHtml = doc.head.innerHTML.trim();
    const bodyHtml = doc.body.innerHTML.trim();
    
    let contentToSave = '';
    if (headHtml) {
      contentToSave += headHtml + '\n';
    }
    contentToSave += bodyHtml;
    
    await db
      .update(postsPages)
      .set({
        content: contentToSave,
        updatedAt: Date.now()
      })
      .where(eq(postsPages.slug, page.slug));
  }
  
  console.log('--- Animation stripping completed! ---');
  process.exit(0);
}

removeAnimations();
