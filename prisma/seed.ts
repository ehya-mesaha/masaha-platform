import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, ServicePricingType } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@ehyamesaha.sa' },
    update: { role: 'ADMIN', status: 'ACTIVE' },
    create: { name: 'مدير المنصة', email: 'admin@ehyamesaha.sa', password: adminPassword, role: 'ADMIN', status: 'ACTIVE' },
  })

  for (const name of ['قاعة تدريب', 'قاعة اجتماعات', 'قاعة فعاليات', 'ملعب أو مرفق رياضي', 'مسرح أو قاعة عروض', 'مساحة عمل مشتركة', 'استوديو تصوير']) {
    await prisma.spaceType.upsert({ where: { name }, update: {}, create: { name } })
  }
  for (const amenity of [
    { name: 'إنترنت لاسلكي', icon: 'wifi', category: 'تقنية' },
    { name: 'شاشة عرض', icon: 'monitor', category: 'تقنية' },
    { name: 'جهاز عرض', icon: 'projector', category: 'تقنية' },
    { name: 'نظام صوت', icon: 'sound', category: 'تقنية' },
    { name: 'مواقف سيارات', icon: 'parking', category: 'الموقع' },
    { name: 'تكييف', icon: 'ac', category: 'الراحة' },
    { name: 'دخول لذوي الإعاقة', icon: 'accessibility', category: 'الوصول' },
  ]) {
    await prisma.amenity.upsert({ where: { name: amenity.name }, update: amenity, create: amenity })
  }

  const ownerServices: { name: string; description: string; category: string; pricingType: ServicePricingType; defaultPrice: number; sortOrder: number }[] = [
    { name: 'المطبوعات', description: 'إرسال الملفات للطباعة وتوصيلها قبل موعد الحجز؛ السعر لكل 10 صفحات ويُفصّل حسب اللون والوجه.', category: 'مطبوعات', pricingType: 'PER_TEN_PAGES', defaultPrice: 5, sortOrder: 1 },
    { name: 'منظّم', description: 'لاستقبال الضيوف والتنسيق والإشراف على الفعالية.', category: 'تنظيم', pricingType: 'PER_HOUR', defaultPrice: 80, sortOrder: 2 },
    { name: 'تنظيف بعد الاستخدام', description: 'تنظيف القاعة وإعادتها لحالتها الأصلية بعد انتهاء الحجز.', category: 'تنظيف', pricingType: 'PER_BOOKING', defaultPrice: 250, sortOrder: 3 },
    { name: 'مياه', description: 'مياه معدنية مع الأكواب.', category: 'ضيافة', pricingType: 'PER_PERSON', defaultPrice: 7, sortOrder: 4 },
    { name: 'قهوة عربية', description: 'قهوة عربية مع التمور والمستلزمات.', category: 'ضيافة', pricingType: 'PER_PERSON', defaultPrice: 15, sortOrder: 5 },
    { name: 'شاي', description: 'شاي ساخن مع المستلزمات.', category: 'ضيافة', pricingType: 'PER_PERSON', defaultPrice: 5, sortOrder: 6 },
    { name: 'ضيافة خفيفة', description: 'تشكيلة خفيفة من المأكولات والمشروبات مع حقل تفاصيل حر.', category: 'ضيافة', pricingType: 'PER_PERSON', defaultPrice: 20, sortOrder: 7 },
  ]
  for (const service of ownerServices) await prisma.serviceCatalog.upsert({ where: { name: service.name }, update: service, create: service })

  const partnerServices: { name: string; description: string; pricingType: ServicePricingType; indicativePrice: number | null; sortOrder: number }[] = [
    { name: 'منظّم', description: 'استقبال الضيوف والتنسيق والإشراف على الفعالية.', pricingType: 'PER_HOUR', indicativePrice: 150, sortOrder: 1 },
    { name: 'تنظيف احترافي', description: 'فريق تنظيف وتجهيز قبل أو بعد الفعالية.', pricingType: 'PER_BOOKING', indicativePrice: 250, sortOrder: 2 },
    { name: 'تصوير وتوثيق', description: 'مصور محترف لتوثيق الفعالية.', pricingType: 'PER_HOUR', indicativePrice: 400, sortOrder: 3 },
    { name: 'إنتاج فيديو', description: 'تصوير وإنتاج مقطع مرئي للفعالية.', pricingType: 'PER_BOOKING', indicativePrice: 600, sortOrder: 4 },
    { name: 'تصميم بوستر', description: 'تصميم إعلان بصري للفعالية.', pricingType: 'PER_ITEM', indicativePrice: 200, sortOrder: 5 },
    { name: 'إعلان رقمي', description: 'تجهيز ونشر إعلان رقمي موجه.', pricingType: 'PER_BOOKING', indicativePrice: 300, sortOrder: 6 },
    { name: 'طلب خاص', description: 'خدمة مخصصة حسب احتياجك.', pricingType: 'CUSTOM', indicativePrice: null, sortOrder: 7 },
  ]
  for (const service of partnerServices) await prisma.partnerService.upsert({ where: { name: service.name }, update: service, create: service })
  console.log('Ehya Masaha seed completed.')
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
