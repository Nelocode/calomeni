import { db, postsPages } from '../src/db/client';
import { eq, and } from 'drizzle-orm';
import { JSDOM } from 'jsdom';

const pages = ['about-us', 'services', 'gallery', 'reviews', 'contact-us'];

async function run() {
  console.log('--- Cleaning Redundant Titles from DB Content ---');

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

    if (result.length === 0) continue;

    const page = result[0];
    const dom = new JSDOM(page.content);
    const doc = dom.window.document;

    // Find the first heading (h2 or h1) in the content
    const firstHeading = doc.querySelector('h1, h2');
    if (firstHeading) {
      const headingText = firstHeading.textContent?.trim().toLowerCase() || '';
      // If the heading text is similar to the page titles (in English or Spanish), remove it
      const redundantTerms = [
        'nosotros', 'about us', 
        'servicios', 'services', 'our services',
        'galería', 'galeria', 'gallery',
        'reseñas', 'resenas', 'reviews',
        'contacto', 'contact', 'contact us'
      ];

      if (redundantTerms.includes(headingText)) {
        console.log(`Removing redundant title "${firstHeading.textContent?.trim()}" from page: ${slug}`);
        firstHeading.remove();

        // Update DB
        const updatedContent = doc.body.innerHTML;
        await db
          .update(postsPages)
          .set({ content: updatedContent })
          .where(
            and(
              eq(postsPages.slug, slug),
              eq(postsPages.type, 'page')
            )
          );
      }
    }
  }

  console.log('Cleanup completed successfully!');
  process.exit(0);
}

run();
