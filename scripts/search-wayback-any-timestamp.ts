const pages = [
  'about-us',
  'services',
  'gallery',
  'reviews',
  'contact-us'
];

async function run() {
  console.log('--- Querying CDX API for any captures of internal pages ---');
  
  for (const page of pages) {
    const url = `https://www.calomeniandassociates.com/${page}/`;
    const cdxUrl = `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(url)}&output=json&limit=5`;
    
    console.log(`\nQuerying for: ${url}`);
    try {
      const res = await fetch(cdxUrl);
      if (!res.ok) {
        console.log(`  - CDX status: ${res.status}`);
        continue;
      }
      const data = await res.json() as string[][];
      if (data.length <= 1) {
        console.log('  - No captures found.');
      } else {
        console.log(`  - Found ${data.length - 1} captures:`);
        for (let i = 1; i < Math.min(6, data.length); i++) {
          const row = data[i];
          console.log(`    * Timestamp: ${row[1]}, Status: ${row[4]}`);
        }
      }
    } catch (err) {
      console.error(`  - Failed to query CDX for ${url}:`, err);
    }
  }
}

run();
