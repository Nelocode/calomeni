import type { APIRoute } from 'astro';
import { db, postsPages, products } from '../db/client';
import { eq, and } from 'drizzle-orm';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const siteUrl = url.origin;
  
  // 1. Obtener páginas y blog posts publicados
  const items = await db
    .select({ slug: postsPages.slug, type: postsPages.type, updatedAt: postsPages.updatedAt })
    .from(postsPages)
    .where(eq(postsPages.published, 1));
    
  // 2. Obtener productos activos
  const prods = await db
    .select({ slug: products.slug, updatedAt: products.updatedAt })
    .from(products)
    .where(eq(products.published, 1));

  // 3. Crear cabecera y páginas fijas principales
  const staticPages = [
    { url: `${siteUrl}/`, changefreq: 'daily', priority: '1.0' },
    { url: `${siteUrl}/productos`, changefreq: 'daily', priority: '0.9' },
    { url: `${siteUrl}/blog`, changefreq: 'daily', priority: '0.8' },
  ];

  // 4. Agregar páginas dinámicas del CMS
  const dynamicUrls = items.map((item) => {
    const path = item.type === 'post' ? `/blog/${item.slug}` : `/${item.slug}`;
    return `
  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${new Date(item.updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  // 5. Agregar productos de la tienda
  const productUrls = prods.map((prod) => {
    return `
  <url>
    <loc>${siteUrl}/productos/${prod.slug}</loc>
    <lastmod>${new Date(prod.updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  // 6. Generar el XML final
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('')}
  ${dynamicUrls.join('')}
  ${productUrls.join('')}
</urlset>`.trim();

  return new Response(sitemapXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};
