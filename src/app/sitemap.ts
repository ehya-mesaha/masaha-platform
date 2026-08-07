import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const SITE_URL = 'https://ehyamesaha.sa'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publicRoutes: Array<{ path: string; changeFrequency: 'daily' | 'weekly' | 'monthly'; priority: number }> = [
    { path: '', changeFrequency: 'daily', priority: 1 },
    { path: '/spaces', changeFrequency: 'daily', priority: 0.95 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/policies', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/seller-application', changeFrequency: 'monthly', priority: 0.65 },
  ]

  let spaces: Array<{ id: string; updatedAt: Date; images: Array<{ url: string }> }> = []
  try {
    spaces = await prisma.space.findMany({
      where: { status: 'APPROVED' },
      select: {
        id: true,
        updatedAt: true,
        images: { orderBy: { order: 'asc' }, take: 6, select: { url: true } },
      },
    })
  } catch {}

  return [
    ...publicRoutes.map(route => ({
      url: `${SITE_URL}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...spaces.map(space => ({
      url: `${SITE_URL}/spaces/${space.id}`,
      lastModified: space.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
      images: space.images.map(image => image.url),
    })),
  ]
}
