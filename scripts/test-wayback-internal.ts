const pages = [
  'about-us/',
  'services/',
  'gallery/',
  'reviews/',
  'contact-us/'
];

async function run() {
  console.log('--- Testing Wayback Machine captures for internal pages ---');
  
  for (const page of pages) {
    const waybackUrl = `https://web.archive.org/web/20241221015017/https://www.calomeniandassociates.com/${page}`;
    console.log(`Checking: ${waybackUrl}`);
    try {
      const res = await fetch(waybackUrl);
      console.log(`Result: ${res.status} ${res.statusText}`);
      if (res.status === 200) {
        // Inspect title
        const text = await res.text();
        const titleMatch = text.match(/<title>([^<]+)<\/title>/i);
        console.log(`  - Title: ${titleMatch ? titleMatch[1].trim() : 'No title'}`);
        console.log(`  - Text length: ${text.length}`);
      }
    } catch (err) {
      console.error(`Failed to check ${waybackUrl}:`, err);
    }
  }
}

run();
