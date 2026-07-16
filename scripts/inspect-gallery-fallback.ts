import { JSDOM } from 'jsdom';

async function run() {
  const url = 'https://calomenilaw.com/galeria/';
  console.log(`Fetching gallery fallback from: ${url}`);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP Status ${res.status}`);
    const html = await res.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const main = doc.querySelector('main') || doc.body;
    console.log('Main HTML length:', main.innerHTML.length);
    console.log('Main HTML content:');
    console.log(main.innerHTML.trim().slice(0, 2000));
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
