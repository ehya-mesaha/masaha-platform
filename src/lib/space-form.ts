import {
  DEFAULT_RULES, getInitialForm,
  type PrintMatrixConfig, type ServiceCatalogItem, type SpaceFormData,
} from '@/components/spaces/create/types'

/**
 * The shape `GET /api/spaces/[id]` returns, as far as the edit wizard cares about it.
 *
 * Deliberately loose: the endpoint serves the public detail page too and carries plenty
 * the wizard never reads, and a stricter type here would only have to be widened again.
 */
export type SpaceApiPayload = {
  name?: string | null
  typeId?: string | null
  description?: string | null
  capacity?: number | null
  identicalUnitsCount?: number | null
  city?: string | null
  district?: string | null
  streetName?: string | null
  buildingNumber?: string | null
  postalCode?: string | null
  address?: string | null
  landmarks?: string | null
  latitude?: number | null
  longitude?: number | null
  price?: number | null
  pricePeriod?: string | null
  minBookingHours?: number | null
  maxAdvanceBookingDays?: number | null
  cancellationPolicy?: string | null
  advertisingLicenseNumber?: string | null
  adminNotes?: string | null
  status?: string | null
  ownerTermsAcceptedAt?: string | null
  images?: { url: string; order?: number }[] | null
  amenities?: { amenity: { id: string } }[] | null
  workingHours?: { dayOfWeek: number; isOpen: boolean; openTime: string; closeTime: string }[] | null
  pricingTiers?: { minHours: number; discountPercent: number }[] | null
  rules?: { rule: string; isDefault?: boolean }[] | null
  services?: { catalogId?: string | null; price?: number | null; description?: string | null; config?: PrintMatrixConfig | null }[] | null
  units?: { id: string }[] | null
}

/** `null`/`undefined` become an empty field rather than the string "null". */
function text(value: unknown) {
  return value === null || value === undefined ? '' : String(value)
}

/**
 * Turn a saved space back into wizard form state, so editing starts from exactly what is
 * published rather than from blanks.
 *
 * Every field the wizard can write is mapped. Anything the space has no value for falls
 * back to the same default a new space would get, which keeps the step validators happy
 * on spaces created before a field existed.
 */
export function spaceToFormData(space: SpaceApiPayload, catalog: ServiceCatalogItem[] = []): SpaceFormData {
  const base = getInitialForm()

  const savedServices = new Map(
    (space.services || [])
      .filter(service => service.catalogId)
      .map(service => [String(service.catalogId), service]),
  )

  // Working hours are stored only for open days, so start from all seven closed and
  // switch on the ones that came back — otherwise a closed day would read as open.
  const savedHours = new Map((space.workingHours || []).map(hour => [hour.dayOfWeek, hour]))

  // A rule the owner removed must come back unchecked, not missing, or they could never
  // re-enable it. The saved set is merged onto the standard list, keeping custom rules.
  const savedRules = new Map((space.rules || []).map(rule => [rule.rule.trim(), rule]))
  const customRules = (space.rules || [])
    .filter(rule => !DEFAULT_RULES.includes(rule.rule.trim()))
    .map(rule => ({ rule: rule.rule, isDefault: true }))

  return {
    ...base,
    name: text(space.name),
    typeId: text(space.typeId),
    description: text(space.description),
    capacity: space.capacity == null ? '' : String(space.capacity),
    identicalUnitsCount: String(space.identicalUnitsCount || space.units?.length || 1),

    city: text(space.city),
    district: text(space.district),
    streetName: text(space.streetName),
    buildingNumber: text(space.buildingNumber),
    postalCode: text(space.postalCode),
    address: text(space.address),
    landmarks: text(space.landmarks),
    latitude: space.latitude == null ? '' : String(space.latitude),
    longitude: space.longitude == null ? '' : String(space.longitude),

    images: (space.images || []).map(image => image.url),
    amenityIds: (space.amenities || []).map(entry => entry.amenity.id),

    services: catalog.map(item => {
      const saved = savedServices.get(item.id)
      return {
        catalogId: item.id,
        name: item.name,
        description: item.description,
        price: saved
          ? (saved.price == null ? '' : String(saved.price))
          : (item.defaultPrice == null ? '' : String(item.defaultPrice)),
        pricingType: item.pricingType,
        category: item.category,
        isEnabled: Boolean(saved),
        details: saved?.description ? String(saved.description) : '',
        config: (saved?.config || item.defaultConfig || {}) as PrintMatrixConfig,
      }
    }),

    workingHours: base.workingHours.map(day => {
      const saved = savedHours.get(day.dayOfWeek)
      return saved
        ? { dayOfWeek: day.dayOfWeek, isOpen: saved.isOpen !== false, openTime: saved.openTime, closeTime: saved.closeTime }
        : { ...day, isOpen: false }
    }),
    minBookingHours: String(space.minBookingHours ?? base.minBookingHours),
    maxAdvanceBookingDays: String(space.maxAdvanceBookingDays ?? base.maxAdvanceBookingDays),

    price: space.price == null ? '' : String(space.price),
    pricePeriod: 'hour',
    pricingTiers: (space.pricingTiers || []).length
      ? (space.pricingTiers || []).map(tier => ({
          minHours: String(tier.minHours),
          discountPercent: String(tier.discountPercent),
        }))
      : [],

    cancellationPolicy: text(space.cancellationPolicy) || base.cancellationPolicy,
    rules: [
      ...DEFAULT_RULES.map(rule => ({ rule, isDefault: savedRules.has(rule) })),
      ...customRules,
    ],
    // Already agreed to when the space was first published; re-publishing an edit does
    // not ask the owner to accept the same documents over again.
    legalAccepted: true,
  }
}
