import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@masaha.sa' },
    update: {},
    create: {
      name: 'مدير المنصة',
      email: 'admin@masaha.sa',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Space types
  const types = [
    'مكتب',
    'قاعة تدريب',
    'قاعة اجتماعات',
    'استوديو تصوير',
    'مساحة عمل مشتركة',
    'قاعة فعاليات',
    'مساحة تجارية',
  ]
  for (const name of types) {
    await prisma.spaceType.upsert({ where: { name }, update: {}, create: { name } })
  }

  // Amenities
  const amenities = [
    { name: 'إنترنت', icon: 'wifi' },
    { name: 'شاشة', icon: 'monitor' },
    { name: 'بروجكتور', icon: 'projector' },
    { name: 'طاولات', icon: 'table' },
    { name: 'كراسي', icon: 'chair' },
    { name: 'ضيافة', icon: 'coffee' },
    { name: 'مواقف', icon: 'parking' },
    { name: 'تكييف', icon: 'ac' },
    { name: 'عزل صوتي', icon: 'sound' },
  ]
  for (const a of amenities) {
    await prisma.amenity.upsert({ where: { name: a.name }, update: {}, create: a })
  }

  console.log('Seed completed successfully!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
