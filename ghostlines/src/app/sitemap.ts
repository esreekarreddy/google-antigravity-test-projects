import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://ghostline.sreekarreddy.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
        url: 'https://ghostline.sreekarreddy.com/call',
        lastModified: new Date(),
        changeFrequency: 'always',
        priority: 0.8,
    }
  ];
}
