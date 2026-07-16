import fs from 'fs';
import path from 'path';

const CSS_ASSETS = [
  { name: 'all.css', url: 'https://web.archive.org/web/20241221015017cs_/https://use.fontawesome.com/releases/v5.8.1/css/all.css' },
  { name: 'v4-shims.css', url: 'https://web.archive.org/web/20241221015017cs_/https://use.fontawesome.com/releases/v5.8.1/css/v4-shims.css' },
  { name: 'wp-customer-reviews-generated.css', url: 'https://web.archive.org/web/20241221015017cs_/https://www.calomeniandassociates.com/wp-content/plugins/wp-customer-reviews/css/wp-customer-reviews-generated.css' },
  { name: 'style.min.css', url: 'https://web.archive.org/web/20241221015017cs_/https://www.calomeniandassociates.com/wp-includes/css/dist/block-library/style.min.css' },
  { name: 'styles.css', url: 'https://web.archive.org/web/20241221015017cs_/https://www.calomeniandassociates.com/wp-content/plugins/contact-form-7/includes/css/styles.css' },
  { name: 'rs6.css', url: 'https://web.archive.org/web/20241221015017cs_/https://www.calomeniandassociates.com/wp-content/plugins/revslider/public/assets/css/rs6.css' },
  { name: 'sfsi-style.css', url: 'https://web.archive.org/web/20241221015017cs_/https://www.calomeniandassociates.com/wp-content/plugins/ultimate-social-media-icons/css/sfsi-style.css' },
  { name: 'disable_sfsi.css', url: 'https://web.archive.org/web/20241221015017cs_/https://www.calomeniandassociates.com/wp-content/plugins/ultimate-social-media-icons/css/disable_sfsi.css' },
  { name: 'grid.css', url: 'https://web.archive.org/web/20241221015017cs_/https://www.calomeniandassociates.com/wp-content/themes/elegante/stylesheets/grid.css' },
  { name: 'icons.css', url: 'https://web.archive.org/web/20241221015017cs_/https://www.calomeniandassociates.com/wp-content/themes/elegante/stylesheets/icons.css' },
  { name: 'js_composer.min.css', url: 'https://web.archive.org/web/20241221015017cs_/https://www.calomeniandassociates.com/wp-content/plugins/js_composer/assets/css/js_composer.min.css' },
  { name: 'theme-style.css', url: 'https://web.archive.org/web/20241221015017cs_/https://www.calomeniandassociates.com/wp-content/themes/elegante/style.css' },
  { name: 'animations.css', url: 'https://web.archive.org/web/20241221015017cs_/https://www.calomeniandassociates.com/wp-content/themes/elegante/stylesheets/animations.css' },
  { name: 'grid_responsive.css', url: 'https://web.archive.org/web/20241221015017cs_/https://www.calomeniandassociates.com/wp-content/themes/elegante/stylesheets/grid_responsive.css' },
  { name: 'google-review.css', url: 'https://web.archive.org/web/20241221015017cs_/https://www.calomeniandassociates.com/wp-content/plugins/widget-google-reviews/static/css/google-review.css' },
  { name: 'gdpr-main.css', url: 'https://web.archive.org/web/20241221015017cs_/https://www.calomeniandassociates.com/wp-content/plugins/gdpr-cookie-compliance/dist/styles/gdpr-main.css' },
  { name: 'background-style.css', url: 'https://web.archive.org/web/20241221015017cs_/https://www.calomeniandassociates.com/wp-content/plugins/parallax_video_backgrounds_vc/assets/css/background-style.css' },
  { name: 'parallax-animate.css', url: 'https://web.archive.org/web/20241221015017cs_/https://www.calomeniandassociates.com/wp-content/plugins/parallax_video_backgrounds_vc/assets/css/animate.css' },
  { name: 'parallax-style.css', url: 'https://web.archive.org/web/20241221015017cs_/https://www.calomeniandassociates.com/wp-content/plugins/parallax_video_backgrounds_vc/assets/css/style.css' },
  { name: 'composer-animate.min.css', url: 'https://web.archive.org/web/20241221015017cs_/https://www.calomeniandassociates.com/wp-content/plugins/js_composer/assets/lib/bower/animate-css/animate.min.css' }
];

const JS_ASSETS = [
  { name: 'jquery.min.js', url: 'https://web.archive.org/web/20241221015017js_/https://www.calomeniandassociates.com/wp-includes/js/jquery/jquery.min.js' },
  { name: 'jquery-migrate.min.js', url: 'https://web.archive.org/web/20241221015017js_/https://www.calomeniandassociates.com/wp-includes/js/jquery/jquery-migrate.min.js' },
  { name: 'libs.min.js', url: 'https://web.archive.org/web/20241221015017js_/https://www.calomeniandassociates.com/wp-content/themes/elegante/js/libs.min.js' },
  { name: 'common.js', url: 'https://web.archive.org/web/20241221015017js_/https://www.calomeniandassociates.com/wp-content/themes/elegante/js/common.js' },
  { name: 'js_composer_front.min.js', url: 'https://web.archive.org/web/20241221015017js_/https://www.calomeniandassociates.com/wp-content/plugins/js_composer/assets/js/dist/js_composer_front.min.js' },
  { name: 'ultimate_bg.js', url: 'https://web.archive.org/web/20241221015017js_/https://www.calomeniandassociates.com/wp-content/plugins/parallax_video_backgrounds_vc/assets/js/ultimate_bg.js' },
  { name: 'jparallax.js', url: 'https://web.archive.org/web/20241221015017js_/https://www.calomeniandassociates.com/wp-content/plugins/parallax_video_backgrounds_vc/assets/js/jparallax.js' },
  { name: 'jquery.vhparallax.js', url: 'https://web.archive.org/web/20241221015017js_/https://www.calomeniandassociates.com/wp-content/plugins/parallax_video_backgrounds_vc/assets/js/jquery.vhparallax.js' },
  { name: 'jquery.appear.js', url: 'https://web.archive.org/web/20241221015017js_/https://www.calomeniandassociates.com/wp-content/plugins/parallax_video_backgrounds_vc/assets/js/jquery.appear.js' },
  { name: 'parallax-custom.js', url: 'https://web.archive.org/web/20241221015017js_/https://www.calomeniandassociates.com/wp-content/plugins/parallax_video_backgrounds_vc/assets/js/custom.js' }
];

const TARGET_CSS_DIR = path.join(process.cwd(), 'public', 'assets', 'original', 'css');
const TARGET_JS_DIR = path.join(process.cwd(), 'public', 'assets', 'original', 'js');

// Ensure dirs exist
if (!fs.existsSync(TARGET_CSS_DIR)) fs.mkdirSync(TARGET_CSS_DIR, { recursive: true });
if (!fs.existsSync(TARGET_JS_DIR)) fs.mkdirSync(TARGET_JS_DIR, { recursive: true });

async function downloadAndClean(url: string, dest: string, isCss = false) {
  console.log(`Downloading: ${url}`);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Error: Status ${res.status} for ${url}`);
      return;
    }
    let content = await res.text();
    
    if (isCss) {
      // Clean Wayback CSS wrapper comments and references
      content = content.replace(/\/\*[\s\S]*?Archive\.org[\s\S]*?\*\//g, '');
      // Clean rewritten URLs in CSS, e.g. url('/web/20241221015017im_/https://www.calomeniandassociates.com/wp-content/...')
      // to point directly to web archive or live URL
      content = content.replace(/\/web\/\d+im_\/(https?:\/\/[^\s\)]+)/g, '$1');
      content = content.replace(/\/web\/\d+\/(https?:\/\/[^\s\)]+)/g, '$1');
    } else {
      // Clean JS Wayback injects if any
      content = content.replace(/\/\*[\s\S]*?Archive\.org[\s\S]*?\*\//g, '');
    }
    
    fs.writeFileSync(dest, content);
    console.log(`Saved: ${dest}`);
  } catch (err) {
    console.error(`Error downloading ${url}:`, err);
  }
}

async function run() {
  console.log('--- Downloading original stylesheets ---');
  for (const asset of CSS_ASSETS) {
    const dest = path.join(TARGET_CSS_DIR, asset.name);
    await downloadAndClean(asset.url, dest, true);
  }

  console.log('\n--- Downloading original javascript files ---');
  for (const asset of JS_ASSETS) {
    const dest = path.join(TARGET_JS_DIR, asset.name);
    await downloadAndClean(asset.url, dest, false);
  }

  console.log('\n--- Asset Download Completed! ---');
  process.exit(0);
}

run();
