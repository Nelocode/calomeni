import fs from 'fs';
import path from 'path';

const CSS_ASSETS = [
  { name: 'all.css', origUrl: 'https://use.fontawesome.com/releases/v5.8.1/css/all.css' },
  { name: 'v4-shims.css', origUrl: 'https://use.fontawesome.com/releases/v5.8.1/css/v4-shims.css' },
  { name: 'wp-customer-reviews-generated.css', origUrl: 'https://www.calomeniandassociates.com/wp-content/plugins/wp-customer-reviews/css/wp-customer-reviews-generated.css' },
  { name: 'style.min.css', origUrl: 'https://www.calomeniandassociates.com/wp-includes/css/dist/block-library/style.min.css' },
  { name: 'styles.css', origUrl: 'https://www.calomeniandassociates.com/wp-content/plugins/contact-form-7/includes/css/styles.css' },
  { name: 'rs6.css', origUrl: 'https://www.calomeniandassociates.com/wp-content/plugins/revslider/public/assets/css/rs6.css' },
  { name: 'sfsi-style.css', origUrl: 'https://www.calomeniandassociates.com/wp-content/plugins/ultimate-social-media-icons/css/sfsi-style.css' },
  { name: 'disable_sfsi.css', origUrl: 'https://www.calomeniandassociates.com/wp-content/plugins/ultimate-social-media-icons/css/disable_sfsi.css' },
  { name: 'grid.css', origUrl: 'https://www.calomeniandassociates.com/wp-content/themes/elegante/stylesheets/grid.css' },
  { name: 'icons.css', origUrl: 'https://www.calomeniandassociates.com/wp-content/themes/elegante/stylesheets/icons.css' },
  { name: 'js_composer.min.css', origUrl: 'https://www.calomeniandassociates.com/wp-content/plugins/js_composer/assets/css/js_composer.min.css' },
  { name: 'theme-style.css', origUrl: 'https://www.calomeniandassociates.com/wp-content/themes/elegante/style.css' },
  { name: 'animations.css', origUrl: 'https://www.calomeniandassociates.com/wp-content/themes/elegante/stylesheets/animations.css' },
  { name: 'grid_responsive.css', origUrl: 'https://www.calomeniandassociates.com/wp-content/themes/elegante/stylesheets/grid_responsive.css' },
  { name: 'google-review.css', origUrl: 'https://www.calomeniandassociates.com/wp-content/plugins/widget-google-reviews/static/css/google-review.css' },
  { name: 'gdpr-main.css', origUrl: 'https://www.calomeniandassociates.com/wp-content/plugins/gdpr-cookie-compliance/dist/styles/gdpr-main.css' },
  { name: 'background-style.css', origUrl: 'https://www.calomeniandassociates.com/wp-content/plugins/parallax_video_backgrounds_vc/assets/css/background-style.css' },
  { name: 'parallax-animate.css', origUrl: 'https://www.calomeniandassociates.com/wp-content/plugins/parallax_video_backgrounds_vc/assets/css/animate.css' },
  { name: 'parallax-style.css', origUrl: 'https://www.calomeniandassociates.com/wp-content/plugins/parallax_video_backgrounds_vc/assets/css/style.css' },
  { name: 'composer-animate.min.css', origUrl: 'https://www.calomeniandassociates.com/wp-content/plugins/js_composer/assets/lib/bower/animate-css/animate.min.css' }
];

const cssDir = path.join(process.cwd(), 'public', 'assets', 'original', 'css');

// Wayback timestamp to target
const WAYBACK_PREFIX = 'https://web.archive.org/web/20241221015017im_/';

async function fixUrls() {
  console.log('--- Fixing asset URLs inside CSS stylesheets ---');
  
  for (const asset of CSS_ASSETS) {
    const filePath = path.join(cssDir, asset.name);
    if (!fs.existsSync(filePath)) {
      console.log(`Skipping missing file: ${asset.name}`);
      continue;
    }

    console.log(`Processing: ${asset.name}`);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Clean first any broken "https://web.archive.orghttps://" typos
    content = content.replace(/https:\/\/web\.archive\.orghttps:\/\//g, 'https://');

    // Regex to match url(...) content
    const fixedContent = content.replace(/url\(['"]?([^'")\s]+)['"]?\)/gi, (match, urlPath) => {
      if (urlPath.startsWith('data:')) {
        return match;
      }

      let cleanUrl = urlPath;
      
      // Clean existing wayback prefixes if any
      if (cleanUrl.includes('web.archive.org/web/')) {
        const parts = cleanUrl.match(/\/web\/\d+(?:im_|js_)?\/(https?:\/\/.+)/);
        if (parts && parts[1]) {
          cleanUrl = parts[1];
        }
      }

      // Remove typo if present in cleanUrl too
      cleanUrl = cleanUrl.replace(/^https:\/\/web\.archive\.orghttps:\/\//g, 'https://');

      let absoluteUrl = '';

      if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('//')) {
        absoluteUrl = cleanUrl.startsWith('//') ? 'https:' + cleanUrl : cleanUrl;
      } else {
        // Resolve relative path based on origUrl
        const base = new URL(asset.origUrl);
        if (cleanUrl.startsWith('/')) {
          absoluteUrl = base.origin + cleanUrl;
        } else {
          const pathParts = base.pathname.split('/');
          pathParts.pop(); // Remove file name
          const relativeParts = cleanUrl.split('/');
          
          for (const part of relativeParts) {
            if (part === '.') {
              continue;
            } else if (part === '..') {
              pathParts.pop();
            } else {
              pathParts.push(part);
            }
          }
          absoluteUrl = base.origin + pathParts.join('/');
        }
      }

      const finalUrl = WAYBACK_PREFIX + absoluteUrl;
      return `url("${finalUrl}")`;
    });

    fs.writeFileSync(filePath, fixedContent);
    console.log(`Fixed and saved: ${filePath}`);
  }

  console.log('\n--- CSS URL Fixing Completed! ---');
}

fixUrls();
