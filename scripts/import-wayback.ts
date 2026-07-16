import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { db, postsPages } from '../src/db/client';
import { eq } from 'drizzle-orm';

const PAGES = [
  {
    slug: 'home',
    url: 'https://web.archive.org/web/20241221015017/https://www.calomeniandassociates.com/',
    fallbackUrl: 'https://calomenilaw.com/',
    title: 'Home - Calomeni Law'
  },
  {
    slug: 'about-us',
    url: 'https://web.archive.org/web/https://www.calomeniandassociates.com/about-us/',
    fallbackUrl: 'https://calomenilaw.com/nosotros/',
    title: 'About Us'
  },
  {
    slug: 'services',
    url: 'https://web.archive.org/web/https://www.calomeniandassociates.com/services/',
    fallbackUrl: 'https://calomenilaw.com/servicios/',
    title: 'Our Services'
  },
  {
    slug: 'gallery',
    url: 'https://web.archive.org/web/https://www.calomeniandassociates.com/gallery/',
    fallbackUrl: 'https://calomenilaw.com/galeria/',
    title: 'Gallery'
  },
  {
    slug: 'reviews',
    url: 'https://web.archive.org/web/https://www.calomeniandassociates.com/reviews/',
    fallbackUrl: 'https://calomenilaw.com/resenas/',
    title: 'Reviews'
  },
  {
    slug: 'contact-us',
    url: 'https://web.archive.org/web/https://www.calomeniandassociates.com/contact-us/',
    fallbackUrl: 'https://calomenilaw.com/contacto/',
    title: 'Contact Us'
  }
];

const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets', 'imported');

// Ensure directory for imported assets exists
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// Download helper
async function downloadFile(url: string, destPath: string): Promise<boolean> {
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(destPath, buffer);
    return true;
  } catch (err) {
    console.error(`Failed to download ${url}:`, err);
    return false;
  }
}

// Clean image URLs from Wayback
function cleanWaybackUrl(url: string): string {
  if (url.startsWith('/web/')) {
    return 'https://web.archive.org' + url;
  }
  return url;
}

// Rewrite relative and absolute URLs inside style tags to point to Wayback Machine
function rewriteStyleUrls(styleContent: string, pageUrl: string): string {
  const WAYBACK_PREFIX = 'https://web.archive.org/web/20241221015017im_/';
  return styleContent.replace(/url\(['"]?([^'")\s]+)['"]?\)/gi, (match, urlPath) => {
    if (urlPath.startsWith('data:')) return match;
    
    let cleanUrl = urlPath;
    if (cleanUrl.includes('web.archive.org/web/')) {
      const parts = cleanUrl.match(/\/web\/\d+(?:im_|js_)?\/(https?:\/\/.+)/);
      if (parts && parts[1]) {
        cleanUrl = parts[1];
      }
    }
    cleanUrl = cleanUrl.replace(/^https:\/\/web\.archive\.orghttps:\/\//g, 'https://');
    
    let absoluteUrl = '';
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('//')) {
      absoluteUrl = cleanUrl.startsWith('//') ? 'https:' + cleanUrl : cleanUrl;
    } else {
      try {
        const base = new URL(pageUrl);
        if (cleanUrl.startsWith('/')) {
          absoluteUrl = base.origin + cleanUrl;
        } else {
          const pathParts = base.pathname.split('/');
          pathParts.pop();
          const relativeParts = cleanUrl.split('/');
          for (const part of relativeParts) {
            if (part === '.') continue;
            if (part === '..') pathParts.pop();
            else pathParts.push(part);
          }
          absoluteUrl = base.origin + pathParts.join('/');
        }
      } catch (e) {
        return match;
      }
    }
    return `url("${WAYBACK_PREFIX}${absoluteUrl}")`;
  });
}

// Scrape and clean page content
async function scrapePage(page: typeof PAGES[0], isFallback = false): Promise<{ content: string; title: string; metaDescription: string } | null> {
  const pageUrl = isFallback ? page.fallbackUrl : page.url;
  console.log(`Fetching page: ${pageUrl} (Fallback mode: ${isFallback})`);
  
  try {
    const response = await fetch(pageUrl);
    if (!response.ok) {
      console.error(`HTTP error fetching ${pageUrl}: ${response.status} ${response.statusText}`);
      if (!isFallback) {
        console.log(`Wayback failed. Trying fallback website: ${page.fallbackUrl}`);
        return scrapePage(page, true);
      }
      return null;
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    // Extract dynamic page-specific styles from the original document (ONLY for original wayback captures)
    let customStyles = '';
    if (!isFallback) {
      const styleElements = doc.querySelectorAll('style');
      styleElements.forEach(style => {
        const styleText = style.textContent || '';
        if (styleText.includes('wm-ipp') || styleText.includes('archive.org/static') || styleText.includes('window.archive_analytics')) {
          return;
        }
        const rewrittenText = rewriteStyleUrls(styleText, pageUrl);
        customStyles += `<style>${rewrittenText}</style>\n`;
      });
    }

    // Check if the Wayback page itself is a 404
    const pageTitle = doc.querySelector('title')?.textContent?.trim() || '';
    if (!isFallback && (pageTitle.includes('Wayback Machine') && doc.body.textContent?.includes('Not Found'))) {
      console.log(`Wayback Machine returned a "Not Found" page. Trying fallback website: ${page.fallbackUrl}`);
      return scrapePage(page, true);
    }

    // Remove Wayback elements
    const waybackElements = doc.querySelectorAll('#wm-ipp-base, #wm-ipp, #wm-ipp-print, #wm-ipp-inside, script[src*="archive.org"], link[href*="archive.org"]');
    waybackElements.forEach(el => el.remove());

    // Extract meta description
    const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || '';

    let mainContainer: Element | null = null;

    if (!isFallback) {
      // For Wayback pages (which use the original Elegante theme), we extract the inner content of .content_body
      mainContainer = doc.querySelector('.content_body');
      
      // If .content_body is not found, fallback to standard selectors
      if (!mainContainer) {
        mainContainer = doc.querySelector('#content') || doc.querySelector('main') || doc.body;
      }
    } else {
      // For fallback pages (from calomenilaw.com using Elementor), we extract the main content container
      // and let the original Elegante styles render it.
      mainContainer = doc.querySelector('main') || doc.querySelector('#content') || doc.querySelector('.page-content') || doc.body;
    }

    if (!mainContainer) {
      console.error(`No main container found for ${page.slug}`);
      return null;
    }

    // Clean up unnecessary scripts, noscripts, and style/link sheets that might be inside the main container
    const unwantedInner = mainContainer.querySelectorAll('script, noscript, iframe, #wpadminbar, .gdpr-cookie-compliance, #gdpr-cookie-compliance');
    unwantedInner.forEach(el => el.remove());

    // Process all elements inside the container
    if (isFallback) {
      // 1. First, unwrap all Elementor/Gutenberg wrapper divs/sections to flatten the DOM structure
      let changed = true;
      while (changed) {
        changed = false;
        const wrappers = mainContainer.querySelectorAll('div[class*="elementor"], section[class*="elementor"], div[class*="wp-block"], section[class*="wp-block"], div[class^="e-"], section[class^="e-"], div[class*=" e-"], section[class*=" e-"]');
        for (const wrap of Array.from(wrappers)) {
          const parent = wrap.parentElement;
          if (parent) {
            while (wrap.firstChild) {
              parent.insertBefore(wrap.firstChild, wrap);
            }
            wrap.remove();
            changed = true;
            break;
          }
        }
      }

      // 2. Remove all custom style, class, and id attributes from remaining text elements
      const textTags = mainContainer.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, ul, ol, li, strong, em, table, tr, td, th');
      textTags.forEach(el => {
        el.removeAttribute('class');
        el.removeAttribute('style');
        el.removeAttribute('id');
      });

      // 3. Remove empty divs and sections that might have been left behind
      const emptyDivs = mainContainer.querySelectorAll('div, section');
      emptyDivs.forEach(el => {
        if (!el.textContent?.trim() && el.querySelectorAll('img').length === 0) {
          el.remove();
        }
      });
    }

    // Process images
    const images = mainContainer.querySelectorAll('img');
    console.log(`Found ${images.length} images on page ${page.slug}`);
    
    for (const img of images) {
      const src = img.getAttribute('src');
      if (!src) {
        img.remove();
        continue;
      }

      let downloadUrl = cleanWaybackUrl(src);
      
      if (downloadUrl.startsWith('/') && !downloadUrl.startsWith('//') && !downloadUrl.includes('web.archive.org')) {
        const urlObj = new URL(pageUrl);
        downloadUrl = urlObj.origin + downloadUrl;
      }

      const ext = path.extname(src.split('?')[0]) || '.png';
      const cleanName = path.basename(src.split('?')[0]).replace(/[^a-zA-Z0-9.-]/g, '_');
      const localFileName = `${page.slug}_${Date.now()}_${cleanName}`;
      const localFilePath = path.join(ASSETS_DIR, localFileName);

      console.log(`Downloading image: ${downloadUrl} -> ${localFileName}`);
      const success = await downloadFile(downloadUrl, localFilePath);
      if (success) {
        img.setAttribute('src', `/assets/imported/${localFileName}`);
      } else {
        if (downloadUrl.includes('web.archive.org')) {
          const match = downloadUrl.match(/\/web\/\d+im_\/(https?:\/\/.+)/);
          if (match && match[1]) {
            console.log(`Wayback download failed, trying original image URL: ${match[1]}`);
            const secondSuccess = await downloadFile(match[1], localFilePath);
            if (secondSuccess) {
              img.setAttribute('src', `/assets/imported/${localFileName}`);
              continue;
            }
          }
        }
        img.remove();
      }

      // Remove srcset since it contains non-local references
      img.removeAttribute('srcset');
      img.removeAttribute('sizes');
    }

    // Clean links
    const links = mainContainer.querySelectorAll('a');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        let cleanHref = href;
        const match = href.match(/\/web\/\d+\/(https?:\/\/.+)/);
        if (match && match[1]) {
          cleanHref = match[1];
        }

        const calomeniDomain = 'calomeniandassociates.com';
        const calomeniLawDomain = 'calomenilaw.com';
        
        if (cleanHref.includes(calomeniDomain) || cleanHref.includes(calomeniLawDomain) || cleanHref.startsWith('/')) {
          const urlPath = cleanHref.replace(/^https?:\/\/[^\/]+/, '');
          
          if (urlPath === '/' || urlPath === '') {
            link.setAttribute('href', '/'); // Go to local root
          } else {
            const slugMatch = PAGES.find(p => p.slug !== 'home' && (urlPath.includes(p.slug) || (p.fallbackUrl && urlPath.includes(p.fallbackUrl.replace('https://calomenilaw.com', '')))));
            if (slugMatch) {
              link.setAttribute('href', `/${slugMatch.slug}`);
            } else {
              const parts = urlPath.split('/').filter(Boolean);
              if (parts.length > 0) {
                const potentialSlug = parts[parts.length - 1];
                link.setAttribute('href', `/${potentialSlug}`);
              } else {
                link.setAttribute('href', '/');
              }
            }
          }
        } else if (cleanHref.startsWith('#')) {
          // Keep anchors
        } else {
          link.setAttribute('href', cleanHref);
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      }
    });

    // Strip animation classes to prevent WPBakery/Theme animations from hiding content
    const animationClasses = [
      'wpb_animate_when_almost_visible',
      'boc_animate_when_almost_visible',
      'vc_animate-when-almost-visible',
      'animate_when_almost_visible',
      'wpb_bounceInUp',
      'wpb_fadeInLeft',
      'wpb_fadeInRight',
      'bounceInUp',
      'fadeInLeft',
      'fadeInRight',
      'boc_bottom-to-top',
      'boc_anim_hidden',
      'animated',
      'boc_start_animation',
      'wpb_start_animation'
    ];
    mainContainer.querySelectorAll('*').forEach((el: any) => {
      animationClasses.forEach(cls => {
        if (el.classList.contains(cls)) {
          el.classList.remove(cls);
        }
      });
      if (el.hasAttribute('data-animate')) el.removeAttribute('data-animate');
      if (el.hasAttribute('data-delay')) el.removeAttribute('data-delay');
    });

    let contentHtml = mainContainer.innerHTML.trim();

    // Minor HTML cleanup - preserve empty structural divs/spans
    contentHtml = contentHtml.replace(/<!--[\s\S]*?-->/g, ''); // Remove comments

    // Prepend the page-specific custom styles
    if (customStyles) {
      contentHtml = customStyles + contentHtml;
    }

    return {
      content: contentHtml,
      title: page.title || pageTitle || page.slug,
      metaDescription: metaDescription || ''
    };

  } catch (err) {
    console.error(`Error scraping ${pageUrl}:`, err);
    if (!isFallback) {
      console.log(`Failed. Trying fallback website: ${page.fallbackUrl}`);
      return scrapePage(page, true);
    }
    return null;
  }
}

// Main execution function
async function run() {
  console.log('--- Starting Web Archive & Live Fallback Import (EXACT DESIGN REVIVAL) ---');
  
  for (const page of PAGES) {
    console.log(`\nProcessing: ${page.title} (Slug: ${page.slug})`);
    
    const result = await scrapePage(page);
    if (!result) {
      console.error(`Could not import page for slug: ${page.slug}`);
      continue;
    }

    try {
      const existing = await db
        .select()
        .from(postsPages)
        .where(eq(postsPages.slug, page.slug))
        .limit(1);

      const now = Date.now();

      if (existing.length > 0) {
        console.log(`Page '${page.slug}' already exists. Updating...`);
        await db
          .update(postsPages)
          .set({
            title: result.title,
            content: result.content,
            metaTitle: result.title,
            metaDescription: result.metaDescription,
            updatedAt: now
          })
          .where(eq(postsPages.slug, page.slug));
      } else {
        console.log(`Creating page '${page.slug}'...`);
        await db.insert(postsPages).values({
          id: crypto.randomUUID(),
          title: result.title,
          slug: page.slug,
          content: result.content,
          type: 'page',
          published: 1,
          metaTitle: result.title,
          metaDescription: result.metaDescription,
          createdAt: now,
          updatedAt: now
        });
      }
      console.log(`Successfully imported page: ${page.slug}`);
    } catch (dbErr) {
      console.error(`Database error for slug '${page.slug}':`, dbErr);
    }
  }

  console.log('\n--- Web Archive & Live Fallback Import Completed! ---');
  process.exit(0);
}

run();
