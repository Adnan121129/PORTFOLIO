import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.title,
    short_name: 'M. Adnan',
    description: site.description,
    start_url: '/',
    display: 'browser',
    background_color: '#f4f2ed',
    theme_color: '#14161a',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
