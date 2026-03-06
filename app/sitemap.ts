import type { MetadataRoute } from 'next';
import { getPublicAppUrl } from '@/lib/config';

type SitemapEntry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const publicAppUrl = getPublicAppUrl();
  const lastModified = new Date();

  const staticEntries: SitemapEntry[] = [
    { path: '/', changeFrequency: 'daily', priority: 1 },
    { path: '/new.html', changeFrequency: 'daily', priority: 0.9 },
  ];

  return staticEntries.map((entry) => ({
    url: new URL(entry.path, publicAppUrl).toString(),
    lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
