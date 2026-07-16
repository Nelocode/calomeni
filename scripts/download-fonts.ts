import fs from 'fs';
import path from 'path';

const FONTS = [
  // Icomoon theme fonts
  {
    url: 'https://web.archive.org/web/20241221015017im_/https://www.calomeniandassociates.com/wp-content/themes/elegante/stylesheets/fonts/icomoon.woff?mb3b1k',
    dest: 'public/assets/original/css/fonts/icomoon.woff'
  },
  {
    url: 'https://web.archive.org/web/20241221015017im_/https://www.calomeniandassociates.com/wp-content/themes/elegante/stylesheets/fonts/icomoon.ttf?mb3b1k',
    dest: 'public/assets/original/css/fonts/icomoon.ttf'
  },
  
  // FontAwesome solid
  {
    url: 'https://web.archive.org/web/20241221015017im_/https://use.fontawesome.com/releases/v5.8.1/webfonts/fa-solid-900.woff2',
    dest: 'public/assets/original/webfonts/fa-solid-900.woff2'
  },
  {
    url: 'https://web.archive.org/web/20241221015017im_/https://use.fontawesome.com/releases/v5.8.1/webfonts/fa-solid-900.woff',
    dest: 'public/assets/original/webfonts/fa-solid-900.woff'
  },
  {
    url: 'https://web.archive.org/web/20241221015017im_/https://use.fontawesome.com/releases/v5.8.1/webfonts/fa-solid-900.ttf',
    dest: 'public/assets/original/webfonts/fa-solid-900.ttf'
  },

  // FontAwesome regular
  {
    url: 'https://web.archive.org/web/20241221015017im_/https://use.fontawesome.com/releases/v5.8.1/webfonts/fa-regular-400.woff2',
    dest: 'public/assets/original/webfonts/fa-regular-400.woff2'
  },
  {
    url: 'https://web.archive.org/web/20241221015017im_/https://use.fontawesome.com/releases/v5.8.1/webfonts/fa-regular-400.woff',
    dest: 'public/assets/original/webfonts/fa-regular-400.woff'
  },
  {
    url: 'https://web.archive.org/web/20241221015017im_/https://use.fontawesome.com/releases/v5.8.1/webfonts/fa-regular-400.ttf',
    dest: 'public/assets/original/webfonts/fa-regular-400.ttf'
  },

  // FontAwesome brands
  {
    url: 'https://web.archive.org/web/20241221015017im_/https://use.fontawesome.com/releases/v5.8.1/webfonts/fa-brands-400.woff2',
    dest: 'public/assets/original/webfonts/fa-brands-400.woff2'
  },
  {
    url: 'https://web.archive.org/web/20241221015017im_/https://use.fontawesome.com/releases/v5.8.1/webfonts/fa-brands-400.woff',
    dest: 'public/assets/original/webfonts/fa-brands-400.woff'
  },
  {
    url: 'https://web.archive.org/web/20241221015017im_/https://use.fontawesome.com/releases/v5.8.1/webfonts/fa-brands-400.ttf',
    dest: 'public/assets/original/webfonts/fa-brands-400.ttf'
  }
];

async function downloadFile(url: string, dest: string) {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  console.log(`Downloading: ${url} -> ${dest}`);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP Status ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(dest, buffer);
    console.log(`Saved: ${dest}`);
  } catch (err) {
    console.error(`Failed to download ${url}:`, err);
  }
}

async function run() {
  console.log('--- Starting Font Downloader & CSS Updater ---');
  
  for (const item of FONTS) {
    await downloadFile(item.url, item.dest);
  }

  // Now, update CSS files to reference fonts locally
  // 1. In any CSS file in public/assets/original/css/, search for icomoon and fontawesome URLs pointing to archive.org, and rewrite them to relative/local paths
  const cssDir = path.join(process.cwd(), 'public', 'assets', 'original', 'css');
  const files = fs.readdirSync(cssDir);

  files.forEach(file => {
    if (file.endsWith('.css')) {
      const filePath = path.join(cssDir, file);
      let content = fs.readFileSync(filePath, 'utf-8');
      let modified = false;

      // Replace icomoon remote url with local fonts/icomoon
      const icomoonRegex = /https:\/\/web\.archive\.org\/web\/[0-9]+im_\/https:\/\/www\.calomeniandassociates\.com\/wp-content\/themes\/elegante\/stylesheets\/fonts\/icomoon\.(woff|ttf)\?mb3b1k/g;
      if (icomoonRegex.test(content)) {
        content = content.replace(icomoonRegex, 'fonts/icomoon.$1?mb3b1k');
        modified = true;
        console.log(`Updated icomoon fonts in ${file}`);
      }

      // Replace fontawesome remote url with local ../webfonts/
      const faRegex = /https:\/\/web\.archive\.org\/web\/[0-9]+im_\/https:\/\/use\.fontawesome\.com\/releases\/v5\.8\.1\/webfonts\/fa-(solid-900|regular-400|brands-400)\.(woff2|woff|ttf)/g;
      if (faRegex.test(content)) {
        content = content.replace(faRegex, '../webfonts/fa-$1.$2');
        modified = true;
        console.log(`Updated fontawesome fonts in ${file}`);
      }

      if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
      }
    }
  });

  console.log('--- Font Downloader & CSS Updater Completed! ---');
}

run();
