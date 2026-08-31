export type SpaceFormData = {
  name: string
  typeId: string
  description: string
  capacity: string
  identicalUnitsCount: string
  // Location
  city: string
  district: string
  streetName: string
  buildingNumber: string
  postalCode: string
  address: string
  landmarks: string
  latitude: string
  longitude: string
  // Images
  images: string[]
  // Amenities
  amenityIds: string[]
  // Services
  services: ServiceItem[]
  // Schedule
  workingHours: WorkingHoursItem[]
  minBookingHours: string
  maxAdvanceBookingDays: string
  // Pricing
  price: string
  pricePeriod: string
  pricingTiers: PricingTierItem[]
  // Terms
  cancellationPolicy: string
  rules: RuleItem[]
  legalAccepted: boolean
}

export type PrintMatrixConfig = {
  bwSingle?: number
  bwDouble?: number
  colorSingle?: number
  colorDouble?: number
}

export type ServiceItem = {
  catalogId: string
  name: string
  description: string
  price: string
  pricingType: string
  category: string
  isEnabled: boolean
  details: string
  config: PrintMatrixConfig
}

export type PricingTierItem = { minHours: string; discountPercent: string }
export type ServiceCatalogItem = {
  id: string
  name: string
  description: string
  category: string
  pricingType: string
  defaultPrice: number | null
  defaultConfig: PrintMatrixConfig | null
}

export type WorkingHoursItem = {
  dayOfWeek: number
  isOpen: boolean
  openTime: string
  closeTime: string
}

export type RuleItem = {
  rule: string
  isDefault: boolean
}

export type SpaceType = { id: string; name: string }
export type City = { id: string; name: string }
export type Amenity = { id: string; name: string; icon: string | null; category: string | null }

export type StepProps = {
  form: SpaceFormData
  update: (field: string, value: unknown) => void
  types?: SpaceType[]
  cities?: City[]
  amenities?: Amenity[]
  serviceCatalog?: ServiceCatalogItem[]
  categoriesLoading?: boolean
  categoriesError?: string
}

export const SAUDI_CITIES = [
  'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام',
  'الخبر', 'الظهران', 'تبوك', 'بريدة', 'حائل',
  'الطائف', 'أبها', 'خميس مشيط', 'نجران', 'جازان',
  'ينبع', 'الجبيل', 'القطيف', 'الأحساء', 'عنيزة',
]

export const DAY_NAMES = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

export const DEFAULT_RULES = [
  'يلتزم طالب المساحة باستخدام القاعة للغرض المحدد في الحجز فقط، وعدم استخدامها لأي نشاط مخالف للأنظمة أو الآداب العامة.',
  'يجب الالتزام بعدد الحضور المحدد وفق السعة القصوى للقاعة، ولا يسمح بتجاوزها دون موافقة مسبقة من صاحب المساحة.',
  'يلتزم المستفيد بالمحافظة على القاعة والأثاث والأجهزة والمرافق، ويتحمل مسؤولية أي تلف أو ضرر ناتج عن استخدامه أو استخدام الحضور التابعين له.',
  'يجب الالتزام بوقت بداية ونهاية الحجز، ويعد أي وقت إضافي خاضعًا لموافقة صاحب المساحة وقد تترتب عليه رسوم إضافية.',
  'يلتزم المستفيد بإعادة القاعة بعد الاستخدام بحالة مناسبة، والمحافظة على النظافة وترتيب الأثاث والمرافق.',
  'لا يجوز نقل الأثاث أو المعدات أو إجراء أي تعديل داخل القاعة إلا بعد الحصول على موافقة صاحب المساحة.',
  'يمنع التدخين داخل القاعة، كما يمنع إدخال أي مواد أو معدات قد تسبب ضررًا للمكان أو تشكل خطرًا على الحضور.',
  'يحق لصاحب المساحة وضع اشتراطات إضافية بحسب طبيعة النشاط، وطلب مبلغ ضمان عند الحاجة، على أن يتم توضيح ذلك قبل تأكيد الحجز.',
  'يكون المستفيد مسؤولًا عن الحضور التابعين له وعن التزامهم بأنظمة وتعليمات الموقع طوال مدة الحجز.',
  'يخضع إلغاء الحجز أو تعديله لسياسة الإلغاء المعتمدة والمبيّنة عند إجراء الحجز.',
]

export function getInitialForm(): SpaceFormData {
  return {
    name: '',
    typeId: '',
    description: '',
    capacity: '',
    identicalUnitsCount: '1',
    city: '',
    district: '',
    streetName: '',
    buildingNumber: '',
    postalCode: '',
    address: '',
    landmarks: '',
    latitude: '',
    longitude: '',
    images: [],
    amenityIds: [],
    services: [],
    workingHours: Array.from({ length: 7 }, (_, i) => ({
      dayOfWeek: i,
      isOpen: i < 5,
      openTime: '08:00',
      closeTime: '22:00',
    })),
    minBookingHours: '1',
    maxAdvanceBookingDays: '90',
    price: '',
    pricePeriod: 'hour',
    pricingTiers: [
      { minHours: '3', discountPercent: '5' },
      { minHours: '5', discountPercent: '10' },
      { minHours: '8', discountPercent: '15' },
    ],
    cancellationPolicy: 'FLEXIBLE',
    rules: DEFAULT_RULES.map(r => ({ rule: r, isDefault: true })),
    legalAccepted: false,
  }
}
