import { prisma } from '@/lib/prisma'

export const ADMIN_EXPORT_DATASETS = [
  'all',
  'users',
  'spaces',
  'bookings',
  'seller-applications',
  'service-requests',
  'space-needs',
  'contact-messages',
  'reviews',
  'audit-log',
] as const

export type AdminExportDataset = (typeof ADMIN_EXPORT_DATASETS)[number]
export type ExportCell = string | number | boolean | Date | null

export type ExportColumn = {
  key: string
  label: string
  width?: number
}
export type ExportSheet = {
  id: Exclude<AdminExportDataset, 'all'>
  name: string
  description: string
  columns: ExportColumn[]
  rows: Record<string, ExportCell>[]
}

type DateRange = {
  from?: Date
  to?: Date
}

const dateWhere = ({ from, to }: DateRange) =>
  from || to
    ? {
        createdAt: {
          ...(from ? { gte: from } : {}),
          ...(to ? { lte: to } : {}),
        },
      }
    : {}

const maskSensitiveNumber = (value: string | null) => {
  if (!value) return null
  if (value.length <= 4) return value
  return `${'•'.repeat(Math.min(value.length - 4, 8))}${value.slice(-4)}`
}

async function usersSheet(range: DateRange): Promise<ExportSheet> {
  const users = await prisma.user.findMany({
    where: dateWhere(range),
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      emailVerifiedAt: true,
      phoneVerifiedAt: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          spaces: true,
          bookings: true,
          reviews: true,
          partnerServiceRequests: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return {
    id: 'users',
    name: 'المستخدمون',
    description: 'الحسابات والأدوار والحالات ومؤشرات النشاط',
    columns: [
      { key: 'id', label: 'المعرّف', width: 25 },
      { key: 'name', label: 'الاسم', width: 24 },
      { key: 'email', label: 'البريد الإلكتروني', width: 30 },
      { key: 'phone', label: 'رقم الجوال', width: 18 },
      { key: 'role', label: 'الدور', width: 16 },
      { key: 'status', label: 'حالة الحساب', width: 18 },
      { key: 'emailVerified', label: 'توثيق البريد', width: 17 },
      { key: 'phoneVerified', label: 'توثيق الجوال', width: 17 },
      { key: 'spaces', label: 'المساحات', width: 12 },
      { key: 'bookings', label: 'الحجوزات', width: 12 },
      { key: 'reviews', label: 'التقييمات', width: 12 },
      { key: 'serviceRequests', label: 'طلبات الخدمات', width: 16 },
      { key: 'createdAt', label: 'تاريخ التسجيل', width: 21 },
      { key: 'updatedAt', label: 'آخر تحديث', width: 21 },
    ],
    rows: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      emailVerified: Boolean(user.emailVerifiedAt),
      phoneVerified: Boolean(user.phoneVerifiedAt),
      spaces: user._count.spaces,
      bookings: user._count.bookings,
      reviews: user._count.reviews,
      serviceRequests: user._count.partnerServiceRequests,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })),
  }
}

async function spacesSheet(range: DateRange): Promise<ExportSheet> {
  const spaces = await prisma.space.findMany({
    where: dateWhere(range),
    include: {
      type: { select: { name: true } },
      seller: { select: { name: true, email: true, phone: true } },
      organization: { select: { name: true, branchName: true } },
      _count: {
        select: {
          images: true,
          amenities: true,
          bookings: true,
          units: true,
          rules: true,
          serviceConfigs: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return {
    id: 'spaces',
    name: 'المساحات',
    description: 'السجل التشغيلي الكامل للمساحات والوحدات والتراخيص',
    columns: [
      { key: 'reference', label: 'المرجع', width: 20 },
      { key: 'name', label: 'اسم المساحة', width: 28 },
      { key: 'type', label: 'التصنيف', width: 20 },
      { key: 'owner', label: 'صاحب المساحة', width: 24 },
      { key: 'ownerEmail', label: 'بريد المالك', width: 28 },
      { key: 'ownerPhone', label: 'جوال المالك', width: 18 },
      { key: 'organization', label: 'الجهة / الفرع', width: 26 },
      { key: 'city', label: 'المدينة', width: 16 },
      { key: 'district', label: 'الحي', width: 18 },
      { key: 'capacity', label: 'السعة', width: 12 },
      { key: 'hourlyPrice', label: 'السعر بالساعة', width: 16 },
      { key: 'units', label: 'عدد الوحدات', width: 14 },
      { key: 'status', label: 'الحالة', width: 18 },
      { key: 'advertisingLicense', label: 'رقم الترخيص الإعلاني', width: 24 },
      { key: 'cancellationPolicy', label: 'سياسة الإلغاء', width: 18 },
      { key: 'bookings', label: 'الحجوزات', width: 12 },
      { key: 'images', label: 'الصور', width: 10 },
      { key: 'amenities', label: 'المرافق', width: 12 },
      { key: 'services', label: 'الخدمات', width: 12 },
      { key: 'rules', label: 'الشروط', width: 10 },
      { key: 'createdAt', label: 'تاريخ الإضافة', width: 21 },
      { key: 'updatedAt', label: 'آخر تحديث', width: 21 },
    ],
    rows: spaces.map((space) => ({
      reference: space.publicRef || space.id,
      name: space.name,
      type: space.type.name,
      owner: space.seller.name,
      ownerEmail: space.seller.email,
      ownerPhone: space.seller.phone,
      organization: space.organization
        ? [space.organization.name, space.organization.branchName].filter(Boolean).join(' — ')
        : null,
      city: space.city,
      district: space.district,
      capacity: space.capacity,
      hourlyPrice: space.price,
      units: Math.max(space.identicalUnitsCount, space._count.units),
      status: space.status,
      advertisingLicense: space.advertisingLicenseNumber,
      cancellationPolicy: space.cancellationPolicy,
      bookings: space._count.bookings,
      images: space._count.images,
      amenities: space._count.amenities,
      services: space._count.serviceConfigs,
      rules: space._count.rules,
      createdAt: space.createdAt,
      updatedAt: space.updatedAt,
    })),
  }
}

async function bookingsSheet(range: DateRange): Promise<ExportSheet> {
  const bookings = await prisma.booking.findMany({
    where: dateWhere(range),
    include: {
      space: {
        select: {
          name: true,
          publicRef: true,
          seller: { select: { name: true, email: true } },
        },
      },
      buyer: { select: { name: true, email: true, phone: true } },
      unit: { select: { label: true } },
      services: { select: { name: true, quantity: true, lineTotal: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return {
    id: 'bookings',
    name: 'الحجوزات',
    description: 'الحجوزات والأوقات والخدمات والقيم التشغيلية',
    columns: [
      { key: 'id', label: 'رقم الحجز', width: 25 },
      { key: 'spaceReference', label: 'مرجع المساحة', width: 20 },
      { key: 'space', label: 'المساحة', width: 26 },
      { key: 'unit', label: 'الوحدة', width: 18 },
      { key: 'owner', label: 'صاحب المساحة', width: 22 },
      { key: 'ownerEmail', label: 'بريد المالك', width: 28 },
      { key: 'buyer', label: 'طالب المساحة', width: 22 },
      { key: 'buyerEmail', label: 'بريد الطالب', width: 28 },
      { key: 'buyerPhone', label: 'جوال الطالب', width: 18 },
      { key: 'date', label: 'تاريخ الحجز', width: 18 },
      { key: 'startTime', label: 'وقت البداية', width: 21 },
      { key: 'endTime', label: 'وقت النهاية', width: 21 },
      { key: 'persons', label: 'عدد الأشخاص', width: 14 },
      { key: 'hours', label: 'الساعات', width: 12 },
      { key: 'basePrice', label: 'السعر الأساسي', width: 16 },
      { key: 'discount', label: 'الخصم', width: 14 },
      { key: 'servicesTotal', label: 'الخدمات الإضافية', width: 18 },
      { key: 'grandTotal', label: 'الإجمالي', width: 16 },
      { key: 'services', label: 'الخدمات', width: 38 },
      { key: 'status', label: 'الحالة', width: 20 },
      { key: 'cancelledAt', label: 'تاريخ الإلغاء', width: 21 },
      { key: 'refundAmount', label: 'قيمة الاسترداد', width: 16 },
      { key: 'createdAt', label: 'تاريخ الإنشاء', width: 21 },
    ],
    rows: bookings.map((booking) => ({
      id: booking.id,
      spaceReference: booking.space.publicRef || booking.spaceId,
      space: booking.space.name,
      unit: booking.unit.label,
      owner: booking.space.seller.name,
      ownerEmail: booking.space.seller.email,
      buyer: booking.buyer.name,
      buyerEmail: booking.buyer.email,
      buyerPhone: booking.buyer.phone,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      persons: booking.persons,
      hours: booking.totalHours,
      basePrice: booking.basePrice,
      discount: booking.discountAmount,
      servicesTotal: booking.servicesTotal,
      grandTotal: booking.grandTotal,
      services: booking.services
        .map((service) => `${service.name} × ${service.quantity} (${service.lineTotal})`)
        .join('، '),
      status: booking.status,
      cancelledAt: booking.cancelledAt,
      refundAmount: booking.refundAmount,
      createdAt: booking.createdAt,
    })),
  }
}

async function sellerApplicationsSheet(range: DateRange): Promise<ExportSheet> {
  const applications = await prisma.sellerApplication.findMany({
    where: dateWhere(range),
    include: { user: { select: { name: true, email: true, phone: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return {
    id: 'seller-applications',
    name: 'طلبات أصحاب المساحات',
    description: 'طلبات الانضمام والتحقق ومهلة اعتماد العقد',
    columns: [
      { key: 'id', label: 'مرجع الطلب', width: 25 },
      { key: 'applicant', label: 'مقدم الطلب', width: 22 },
      { key: 'email', label: 'البريد الإلكتروني', width: 28 },
      { key: 'phone', label: 'رقم الجوال', width: 18 },
      { key: 'schoolName', label: 'اسم الجهة', width: 28 },
      { key: 'branchName', label: 'اسم الفرع', width: 22 },
      { key: 'commercialRegister', label: 'السجل التجاري', width: 20 },
      { key: 'nationalId', label: 'الهوية الوطنية (محمية)', width: 22 },
      { key: 'multipleOwners', label: 'ملكية مشتركة', width: 16 },
      { key: 'powerOfAttorney', label: 'رقم الوكالة', width: 20 },
      { key: 'brokerageContract', label: 'عقد الوساطة', width: 20 },
      { key: 'status', label: 'الحالة', width: 20 },
      { key: 'contractSentAt', label: 'إرسال العقد', width: 21 },
      { key: 'approvalDeadline', label: 'مهلة الاعتماد', width: 21 },
      { key: 'consentAcceptedAt', label: 'قبول الإقرار', width: 21 },
      { key: 'createdAt', label: 'تاريخ الطلب', width: 21 },
      { key: 'updatedAt', label: 'آخر تحديث', width: 21 },
    ],
    rows: applications.map((application) => ({
      id: application.id,
      applicant: application.user.name,
      email: application.user.email,
      phone: application.user.phone,
      schoolName: application.schoolName,
      branchName: application.branchName,
      commercialRegister: application.commercialRegisterNo,
      nationalId: maskSensitiveNumber(application.nationalIdNumber),
      multipleOwners: application.multipleOwners,
      powerOfAttorney: application.powerOfAttorneyNumber,
      brokerageContract: application.brokerageContractNo,
      status: application.status,
      contractSentAt: application.contractSentAt,
      approvalDeadline: application.approvalDeadline,
      consentAcceptedAt: application.consentAcceptedAt,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
    })),
  }
}

async function serviceRequestsSheet(range: DateRange): Promise<ExportSheet> {
  const requests = await prisma.partnerServiceRequest.findMany({
    where: dateWhere(range),
    include: {
      buyer: { select: { name: true, email: true, phone: true } },
      items: {
        include: { service: { select: { name: true, pricingType: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return {
    id: 'service-requests',
    name: 'طلبات الخدمات',
    description: 'الخدمات المساندة وحالات التسعير والتنفيذ',
    columns: [
      { key: 'reference', label: 'المرجع', width: 22 },
      { key: 'buyer', label: 'طالب الخدمة', width: 22 },
      { key: 'email', label: 'البريد الإلكتروني', width: 28 },
      { key: 'phone', label: 'رقم الجوال', width: 18 },
      { key: 'services', label: 'الخدمات المطلوبة', width: 48 },
      { key: 'status', label: 'الحالة', width: 20 },
      { key: 'estimatedTotal', label: 'التقدير', width: 16 },
      { key: 'quotedTotal', label: 'السعر المعتمد', width: 16 },
      { key: 'notes', label: 'ملاحظات العميل', width: 35 },
      { key: 'adminNotes', label: 'ملاحظات الإدارة', width: 35 },
      { key: 'createdAt', label: 'تاريخ الطلب', width: 21 },
      { key: 'updatedAt', label: 'آخر تحديث', width: 21 },
    ],
    rows: requests.map((request) => ({
      reference: request.publicRef,
      buyer: request.buyer.name,
      email: request.buyer.email,
      phone: request.buyer.phone,
      services: request.items
        .map((item) => `${item.service.name} × ${item.quantity}`)
        .join('، '),
      status: request.status,
      estimatedTotal: request.estimatedTotal,
      quotedTotal: request.quotedTotal,
      notes: request.notes,
      adminNotes: request.adminNotes,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
    })),
  }
}

async function spaceNeedsSheet(range: DateRange): Promise<ExportSheet> {
  const requests = await prisma.spaceNeedRequest.findMany({
    where: dateWhere(range),
    include: { buyer: { select: { name: true, email: true, phone: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return {
    id: 'space-needs',
    name: 'احتياجات المساحات',
    description: 'طلبات البحث المخصصة والميزانيات والحالات',
    columns: [
      { key: 'id', label: 'مرجع الطلب', width: 25 },
      { key: 'buyer', label: 'طالب المساحة', width: 22 },
      { key: 'email', label: 'البريد الإلكتروني', width: 28 },
      { key: 'phone', label: 'رقم الجوال', width: 18 },
      { key: 'spaceType', label: 'نوع المساحة', width: 22 },
      { key: 'city', label: 'المدينة', width: 16 },
      { key: 'district', label: 'الحي', width: 18 },
      { key: 'expectedDate', label: 'التاريخ المتوقع', width: 18 },
      { key: 'capacity', label: 'السعة', width: 12 },
      { key: 'budgetMin', label: 'الميزانية من', width: 16 },
      { key: 'budgetMax', label: 'الميزانية إلى', width: 16 },
      { key: 'details', label: 'التفاصيل', width: 45 },
      { key: 'status', label: 'الحالة', width: 18 },
      { key: 'adminNote', label: 'ملاحظة الإدارة', width: 35 },
      { key: 'createdAt', label: 'تاريخ الطلب', width: 21 },
      { key: 'updatedAt', label: 'آخر تحديث', width: 21 },
    ],
    rows: requests.map((request) => ({
      id: request.id,
      buyer: request.buyer.name,
      email: request.buyer.email,
      phone: request.buyer.phone,
      spaceType: request.spaceType,
      city: request.city,
      district: request.district,
      expectedDate: request.expectedDate,
      capacity: request.capacity,
      budgetMin: request.budgetMin,
      budgetMax: request.budgetMax,
      details: request.details,
      status: request.status,
      adminNote: request.adminNote,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
    })),
  }
}

async function contactMessagesSheet(range: DateRange): Promise<ExportSheet> {
  const messages = await prisma.contactMessage.findMany({
    where: dateWhere(range),
    select: {
      id: true,
      type: true,
      name: true,
      email: true,
      phone: true,
      subject: true,
      message: true,
      isRead: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return {
    id: 'contact-messages',
    name: 'رسائل التواصل',
    description: 'الاستفسارات والاقتراحات والشكاوى الواردة',
    columns: [
      { key: 'id', label: 'المرجع', width: 25 },
      { key: 'type', label: 'النوع', width: 16 },
      { key: 'name', label: 'الاسم', width: 22 },
      { key: 'email', label: 'البريد الإلكتروني', width: 28 },
      { key: 'phone', label: 'رقم الجوال', width: 18 },
      { key: 'subject', label: 'الموضوع', width: 30 },
      { key: 'message', label: 'الرسالة', width: 60 },
      { key: 'isRead', label: 'تمت القراءة', width: 15 },
      { key: 'createdAt', label: 'تاريخ الاستلام', width: 21 },
    ],
    rows: messages.map((message) => ({
      id: message.id,
      type: message.type,
      name: message.name,
      email: message.email,
      phone: message.phone,
      subject: message.subject,
      message: message.message,
      isRead: message.isRead,
      createdAt: message.createdAt,
    })),
  }
}

async function reviewsSheet(range: DateRange): Promise<ExportSheet> {
  const reviews = await prisma.spaceReview.findMany({
    where: dateWhere(range),
    include: {
      space: { select: { name: true, publicRef: true } },
      buyer: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return {
    id: 'reviews',
    name: 'التقييمات',
    description: 'تقييمات الحجوزات وحالة ظهورها',
    columns: [
      { key: 'id', label: 'المرجع', width: 25 },
      { key: 'spaceReference', label: 'مرجع المساحة', width: 20 },
      { key: 'space', label: 'المساحة', width: 28 },
      { key: 'buyer', label: 'طالب المساحة', width: 22 },
      { key: 'buyerEmail', label: 'البريد الإلكتروني', width: 28 },
      { key: 'rating', label: 'التقييم', width: 12 },
      { key: 'comment', label: 'التعليق', width: 55 },
      { key: 'isVisible', label: 'ظاهر للعامة', width: 15 },
      { key: 'createdAt', label: 'تاريخ التقييم', width: 21 },
      { key: 'updatedAt', label: 'آخر تحديث', width: 21 },
    ],
    rows: reviews.map((review) => ({
      id: review.id,
      spaceReference: review.space.publicRef || review.spaceId,
      space: review.space.name,
      buyer: review.buyer.name,
      buyerEmail: review.buyer.email,
      rating: review.rating,
      comment: review.comment,
      isVisible: review.isVisible,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    })),
  }
}

async function auditLogSheet(range: DateRange): Promise<ExportSheet> {
  const logs = await prisma.adminAuditLog.findMany({
    where: dateWhere(range),
    include: { actor: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return {
    id: 'audit-log',
    name: 'سجل الإدارة',
    description: 'الأثر الرقابي لإجراءات مديري المنصة',
    columns: [
      { key: 'id', label: 'المرجع', width: 25 },
      { key: 'actor', label: 'المدير', width: 22 },
      { key: 'actorEmail', label: 'بريد المدير', width: 28 },
      { key: 'action', label: 'الإجراء', width: 25 },
      { key: 'entityType', label: 'نوع السجل', width: 20 },
      { key: 'entityId', label: 'معرّف السجل', width: 25 },
      { key: 'before', label: 'قبل التغيير', width: 55 },
      { key: 'after', label: 'بعد التغيير', width: 55 },
      { key: 'createdAt', label: 'وقت الإجراء', width: 21 },
    ],
    rows: logs.map((log) => ({
      id: log.id,
      actor: log.actor.name,
      actorEmail: log.actor.email,
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      before: log.before ? JSON.stringify(log.before) : null,
      after: log.after ? JSON.stringify(log.after) : null,
      createdAt: log.createdAt,
    })),
  }
}

const loaders: Record<Exclude<AdminExportDataset, 'all'>, (range: DateRange) => Promise<ExportSheet>> = {
  users: usersSheet,
  spaces: spacesSheet,
  bookings: bookingsSheet,
  'seller-applications': sellerApplicationsSheet,
  'service-requests': serviceRequestsSheet,
  'space-needs': spaceNeedsSheet,
  'contact-messages': contactMessagesSheet,
  reviews: reviewsSheet,
  'audit-log': auditLogSheet,
}

export async function loadAdminExportData(
  dataset: AdminExportDataset,
  range: DateRange = {}
): Promise<ExportSheet[]> {
  if (dataset === 'all') {
    return Promise.all(Object.values(loaders).map((loader) => loader(range)))
  }
  return [await loaders[dataset](range)]
}
