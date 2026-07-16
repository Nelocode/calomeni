async function run() {
  const url = 'https://www.calomeniandassociates.com/gallery';
  const cdxUrl = `http://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(url)}&output=json&limit=10`;

  console.log(`Querying CDX for: ${url}`);
  try {
    const res = await fetch(cdxUrl);
    if (!res.ok) {
      console.log(`CDX API status: ${res.status}`);
      return;
    }
    const data = await res.json() as string[][];
    if (data.length <= 1) {
      console.log('No captures found.');
    } else {
      console.log(`Found ${data.length - 1} captures:`);
      for (let i = 1; i < data.length; i++) {
        console.log(`Timestamp: ${data[i][1]} -> status: ${data[i][4]}`);
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
