import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://sreekarreddy.com/projects/ghostline',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
        url: 'https://sreekarreddy.com/projects/ghostline/call',
        lastModified: new Date(),
        changeFrequency: 'always',
        priority: 0.8,
    }
  ];
}
