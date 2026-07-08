export type SpaceFormData = {
  name: string
  typeId: string
  description: string
  capacity: string
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
  // Terms
  cancellationPolicy: string
  rules: RuleItem[]
}

export type ServiceItem = {
  name: string
  description: string
  price: string
  pricingType: string
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
export type Amenity = { id: string; name: string; icon: string | null; category: string | null }

export type StepProps = {
  form: SpaceFormData
  update: (field: string, value: unknown) => void
  types?: SpaceType[]
  amenities?: Amenity[]
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
    cancellationPolicy: 'FLEXIBLE',
    rules: DEFAULT_RULES.map(r => ({ rule: r, isDefault: true })),
  }
}
