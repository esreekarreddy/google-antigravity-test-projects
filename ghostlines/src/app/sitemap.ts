import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://sr-ghostline.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
        url: 'https://sr-ghostline.vercel.app/call',
        lastModified: new Date(),
        changeFrequency: 'always',
        priority: 0.8,
    }
  ];
}
