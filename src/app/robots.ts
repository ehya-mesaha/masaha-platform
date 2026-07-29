import type { MetadataRoute } from 'next'

const SITE_URL = 'https://ehyamesaha.sa'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/about', '/contact', '/policies', '/spaces', '/sellers'],
      disallow: [
        '/api/',
        '/admin/',
        '/buyer/',
        '/seller/',
        '/auth/',
        '/notifications',
        '/seller-application/success',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
