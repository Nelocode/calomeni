import { JSDOM } from 'jsdom';

async function run() {
  const url = 'https://calomenilaw.com/nosotros/';
  console.log(`Fetching raw fallback content for: ${url}`);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP Status ${res.status}`);
    const html = await res.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const main = doc.querySelector('main') || doc.body;
    
    // Find heading for "Nuestro equipo" or similar
    const elements = Array.from(main.querySelectorAll('h2, h3, h4, p, span, div'));
    let foundTeam = false;
    let teamHtml = '';

    elements.forEach(el => {
      const text = el.textContent?.trim() || '';
      if (text.includes('Nuestro equipo') || text.includes('Team')) {
        foundTeam = true;
      }
      if (foundTeam) {
        // Log tag and text
        console.log(`<${el.tagName} class="${el.className}">: "${text.slice(0, 300)}"`);
      }
    });

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
