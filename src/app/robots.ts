// app/robots.ts es una convencion especial de Next: en vez de escribir
// un archivo robots.txt a mano, exportas una funcion que lo genera.
// Next se encarga de servirlo en /robots.txt automaticamente.
import type { MetadataRoute } from 'next';

const SITE_URL = 'https://narravia.co';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /admin nunca debe indexarse ni rastrearse — es tu panel
      // privado, no contenido del blog.
      disallow: '/admin',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
