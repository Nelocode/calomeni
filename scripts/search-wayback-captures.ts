async function run() {
  const domain = 'calomeniandassociates.com';
  const cdxUrl = `http://web.archive.org/cdx/search/cdx?url=${domain}/*&output=json&fl=original,timestamp,statuscode&limit=500`;

  console.log(`Querying CDX for all pages on: ${domain}...`);
  try {
    const res = await fetch(cdxUrl);
    if (!res.ok) {
      console.log(`CDX API returned status: ${res.status}`);
      return;
    }
    const data = await res.json() as string[][];
    if (data.length <= 1) {
      console.log('No captures found.');
      return;
    }

    console.log(`Found ${data.length - 1} entries:`);
    // Print all entries to inspect them
    for (let i = 1; i < data.length; i++) {
      const [original, timestamp, status] = data[i];
      console.log(`[${i}] ${original} -> ${timestamp} (Status: ${status})`);
    }

  } catch (err) {
    console.error('Error querying CDX:', err);
  }
}

run();
