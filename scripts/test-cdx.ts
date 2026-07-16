async function run() {
  const url = 'calomeniandassociates.com/*';
  const cdxUrl = `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(url)}&output=json&limit=100`;
  console.log(`Checking CDX wildcard for ${url}...`);
  try {
    const res = await fetch(cdxUrl);
    if (!res.ok) {
      console.log(`Failed for CDX: ${res.status}`);
      return;
    }
    const data = await res.json();
    console.log(`Total URLs found: ${data.length - 1}`);
    // Print unique original URLs
    const urls = new Set(data.slice(1).map((row: any) => row[2]));
    console.log('URLs:', Array.from(urls));
  } catch (err) {
    console.error(`Error checking ${url}:`, err);
  }
}

run();
