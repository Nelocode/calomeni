// Use native fetch

async function searchAndDownload() {
  const url = 'https://www.calomeniandassociates.com/wp-content/themes/elegante/stylesheets/fonts/icomoon.woff';
  const cdxUrl = `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(url)}&output=json`;

  console.log('Querying CDX API for icomoon.woff...');
  try {
    const res = await fetch(cdxUrl);
    if (!res.ok) throw new Error(`CDX API status ${res.status}`);
    
    const data = await res.json() as string[][];
    if (data.length <= 1) {
      console.log('No captures found in Wayback for icomoon.woff');
      return;
    }

    console.log(`Found ${data.length - 1} captures:`);
    // Skip header line
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const timestamp = row[1];
      const originalUrl = row[2];
      const status = row[4];
      console.log(`- Capture ${i}: timestamp=${timestamp}, originalUrl=${originalUrl}, status=${status}`);
    }
  } catch (err) {
    console.error('Error querying CDX:', err);
  }
}

searchAndDownload();
