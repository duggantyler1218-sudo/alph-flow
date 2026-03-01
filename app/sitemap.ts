import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/shopify/client';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alph-flow-tys-projects-4759a559.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE}/store/${p.handle}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    { url: BASE,                        lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/store`,             lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/chat`,              lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/coach`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    ...productUrls,
  ];
}
