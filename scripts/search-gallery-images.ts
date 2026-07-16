import { JSDOM } from 'jsdom';

async function run() {
  const url = 'https://calomenilaw.com/galeria/';
  console.log(`Searching for images in: ${url}`);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP Status ${res.status}`);
    const html = await res.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    // Search for any img tags
    const images = doc.querySelectorAll('img');
    console.log(`Total <img> tags: ${images.length}`);
    images.forEach((img, idx) => {
      console.log(`[${idx + 1}] src="${img.src}" class="${img.className}"`);
    });

    // Search for gallery JSON configs or references to uploads/
    // Let's search inside scripts
    const scripts = doc.querySelectorAll('script');
    console.log(`Total <script> tags: ${scripts.length}`);
    scripts.forEach((s, idx) => {
      const content = s.textContent || '';
      if (content.includes('uploads') || content.includes('gallery')) {
        console.log(`[Script ${idx + 1}] contains 'uploads' or 'gallery'! Length: ${content.length}`);
        // print a snippet
        const lines = content.split('\n');
        lines.forEach(line => {
          if (line.includes('wp-content/uploads')) {
            console.log(`  Line: ${line.trim().slice(0, 200)}`);
          }
        });
      }
    });

    // Let's print any element that has data-settings or data-gallery
    const dataEls = doc.querySelectorAll('[data-settings]');
    console.log(`\nElements with data-settings: ${dataEls.length}`);
    dataEls.forEach((el, idx) => {
      const settings = el.getAttribute('data-settings');
      if (settings && (settings.includes('gallery') || settings.includes('image') || settings.includes('url'))) {
        console.log(`[${idx + 1}] tag: <${el.tagName}> classes: "${el.className}"`);
        console.log(`  settings: ${settings.slice(0, 300)}`);
      }
    });

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
