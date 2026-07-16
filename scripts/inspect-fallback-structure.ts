import { JSDOM } from 'jsdom';

async function run() {
  const url = 'https://calomenilaw.com/nosotros/';
  console.log(`Fetching fallback page structure for: ${url}`);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP Status ${res.status}`);
    const html = await res.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    // Check possible containers
    const selectors = [
      'main',
      '#content',
      '.content',
      '.entry-content',
      'article',
      '.elementor',
      '#primary',
      '#main',
      '.site-main'
    ];

    console.log('--- Selector check results ---');
    selectors.forEach(sel => {
      const el = doc.querySelector(sel);
      console.log(`Selector "${sel}": ${el ? 'FOUND (Length: ' + el.innerHTML.length + ')' : 'NOT FOUND'}`);
    });
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
