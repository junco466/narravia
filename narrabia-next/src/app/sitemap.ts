// app/sitemap.ts genera /sitemap.xml automaticamente. Como lee la
// base de datos (posts publicados), forzamos dynamic para que se
// genere en cada visita real — igual que hicimos con las paginas del
// blog — y asi cada post nuevo aparece aqui sin necesitar redeploy.
import type { MetadataRoute } from 'next';
import { serviceLocator } from '@/lib/serviceLocator';

export const dynamic = 'force-dynamic';

const SITE_URL = 'https://narravia.co';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, novels] = await Promise.all([
    serviceLocator.postQueryService.getAll(),
    serviceLocator.postQueryService.getNovelSummaries(),
  ]);

  // Las paginas fijas del sitio (no dependen de la base de datos).
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/poemas`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/reflexiones`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/novelas`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/sobre-mi`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE_URL}/contacto`, changeFrequency: 'yearly', priority: 0.4 },
  ];

  // Un poema/reflexión = una URL. Las novelas NO se listan por
  // capítulo (esos no tienen URL propia, se leen todos dentro de
  // /novelas/[seriesSlug]) — por eso se recorren aparte, por serie.
  const postRoutes: MetadataRoute.Sitemap = posts
    .filter((post) => post.type !== 'novela')
    .map((post) => ({
      url: `${SITE_URL}/${post.type === 'poema' ? 'poemas' : 'reflexiones'}/${post.id}`,
      lastModified: post.updatedAt ?? post.createdAt,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

  const novelRoutes: MetadataRoute.Sitemap = novels.map((novel) => ({
    url: `${SITE_URL}/novelas/${novel.seriesSlug}`,
    lastModified: novel.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes, ...novelRoutes];
}
