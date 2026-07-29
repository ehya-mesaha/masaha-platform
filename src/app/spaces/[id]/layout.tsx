import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

const SITE_URL = 'https://ehyamesaha.sa'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  try {
    const space = await prisma.space.findFirst({
      where: { id, status: 'APPROVED' },
      select: {
        name: true,
        description: true,
        city: true,
        district: true,
        price: true,
        updatedAt: true,
        type: { select: { name: true } },
        images: { orderBy: { order: 'asc' }, take: 1, select: { url: true } },
      },
    })
    if (!space) return { title: 'المساحة غير موجودة | إحياء مساحة', robots: { index: false, follow: false } }

    const title = `${space.name} في ${space.city} | إحياء مساحة`
    const description = space.description?.slice(0, 155)
      || `احجز ${space.type.name} في ${space.city}${space.district ? `، ${space.district}` : ''} بالساعة عبر إحياء مساحة.`
    const image = space.images[0]?.url

    return {
      title,
      description,
      alternates: { canonical: `${SITE_URL}/spaces/${id}` },
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/spaces/${id}`,
        type: 'website',
        locale: 'ar_SA',
        siteName: 'إحياء مساحة',
        images: image ? [{ url: image, alt: space.name }] : undefined,
      },
      twitter: { card: 'summary_large_image', title, description, images: image ? [image] : undefined },
      other: {
        'product:price:amount': String(space.price),
        'product:price:currency': 'SAR',
      },
    }
  } catch {
    return { title: 'مساحة | إحياء مساحة' }
  }
}

export default function SpaceLayout({ children }: { children: React.ReactNode }) {
  return children
}
