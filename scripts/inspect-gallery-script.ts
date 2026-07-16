import { JSDOM } from 'jsdom';

async function run() {
  const url = 'https://calomenilaw.com/galeria/';
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP Status ${res.status}`);
    const html = await res.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const scripts = doc.querySelectorAll('script');
    const s21 = scripts[20]; // 0-indexed 21st script is 20
    if (s21) {
      console.log('Script 21 content:');
      console.log(s21.textContent);
    } else {
      console.log('Script 21 not found!');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
