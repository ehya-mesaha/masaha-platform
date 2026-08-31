/**
 * Brand vocabulary in one place.
 *
 * The company registered its trade name as "إحياء مساحة" ("Ehya Masaha") and that name
 * stays on anything legal or official — contracts, policies, payment descriptors,
 * structured data, the commercial-registration footer.
 *
 * Everything the customer reads as *the product* — the logo, page titles, the app
 * manifest, email greetings, marketing copy — uses the trademark, "مساحة" ("Mesaha").
 *
 * Import from here instead of hard-coding either name so the distinction stays intentional.
 */

/** Consumer-facing brand (trademark). */
export const BRAND_NAME_AR = 'مساحة'
export const BRAND_NAME_EN = 'Mesaha'

/** Registered trade name — legal, official, and contractual contexts only. */
export const LEGAL_NAME_AR = 'إحياء مساحة'
export const LEGAL_NAME_EN = 'Ehya Masaha'

export const BRAND_TAGLINE_AR = 'لإحياء المساحات غير المستغلة'
export const BRAND_TAGLINE_EN = 'Reviving underutilized spaces'

/** Title-bar suffix, e.g. "تصفح المساحات | مساحة". */
export const SITE_TITLE_AR = `${BRAND_NAME_AR} | ${BRAND_TAGLINE_AR}`
export const SITE_TITLE_EN = `${BRAND_NAME_EN} | ${BRAND_TAGLINE_EN}`

export const SITE_URL = 'https://ehyamesaha.sa'
export const SUPPORT_EMAIL = 'info@ehyamesaha.sa'
export const SUPPORT_PHONE = '+966504913274'
export const SUPPORT_PHONE_DISPLAY = '+966 50 491 3274'

export function brandName(locale: 'ar' | 'en') {
  return locale === 'en' ? BRAND_NAME_EN : BRAND_NAME_AR
}

export function legalName(locale: 'ar' | 'en') {
  return locale === 'en' ? LEGAL_NAME_EN : LEGAL_NAME_AR
}
