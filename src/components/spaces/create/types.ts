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
  'يمنع التدخين داخل المساحة',
  'يمنع إدخال الأطعمة من الخارج',
  'يمنع اصطحاب الحيوانات الأليفة',
  'الالتزام بالهدوء وعدم إزعاج المكاتب المجاورة',
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
