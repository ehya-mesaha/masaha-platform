import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'

export const getCachedSpaceTypes = unstable_cache(
  async () => prisma.spaceType.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
  ['space-types'],
  { revalidate: 3600, tags: ['catalog'] },
)

export const getCachedActiveCities = unstable_cache(
  async () => prisma.city.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    select: { id: true, name: true },
  }),
  ['active-cities'],
  { revalidate: 3600, tags: ['catalog'] },
)

