import type { SpaceFormData } from './types'

const VALID_POLICIES = new Set(['FLEXIBLE', 'MODERATE', 'STRICT'])

export const STEP_LABELS = [
  'المعلومات الأساسية',
  'الموقع والعنوان',
  'الصور والوسائط',
  'المرافق والتجهيزات',
  'خدمات المساحة',
  'التوفر والجدول',
  'التسعير',
  'الشروط والأحكام',
  'المراجعة والنشر',
] as const

export function getStepError(step: number, form: SpaceFormData): string {
  if (step === 1) {
    if (form.name.trim().length < 3) return 'أدخل اسمًا واضحًا للمساحة لا يقل عن 3 أحرف.'
    if (!form.typeId) return 'اختر تصنيف المساحة.'
    if (form.description.trim().length < 20) return 'أضف وصفًا مفيدًا للمساحة لا يقل عن 20 حرفًا.'
    if (!Number.isFinite(Number(form.capacity)) || Number(form.capacity) < 1) return 'أدخل السعة الاستيعابية للمساحة.'
    if (!Number.isFinite(Number(form.identicalUnitsCount)) || Number(form.identicalUnitsCount) < 1) return 'حدد عدد القاعات المماثلة.'
  }

  if (step === 2) {
    if (!form.city) return 'اختر المدينة.'
    if (!form.district.trim()) return 'أدخل اسم الحي.'
    if (!form.streetName.trim()) return 'أدخل اسم الشارع.'
    if (!/^\d{5}$/.test(form.postalCode.trim())) return 'أدخل رمزًا بريديًا صحيحًا من 5 أرقام.'
    const latitude = Number(form.latitude)
    const longitude = Number(form.longitude)
    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) return 'حدد خط عرض صحيحًا من الخريطة.'
    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) return 'حدد خط طول صحيحًا من الخريطة.'
  }

  if (step === 3 && form.images.length < 1) {
    return 'أضف صورة واحدة على الأقل للمساحة.'
  }

  if (step === 4 && form.amenityIds.length < 1) {
    return 'اختر مرفقًا أو تجهيزًا واحدًا على الأقل.'
  }

  if (step === 5) {
    const enabledServices = form.services.filter(service => service.isEnabled)
    if (enabledServices.length < 1) return 'فعّل خدمة واحدة على الأقل من الخدمات المعتمدة.'
    if (enabledServices.some(service => service.price === '' || Number(service.price) < 0 || !Number.isFinite(Number(service.price)))) {
      return 'أدخل سعرًا صحيحًا لكل خدمة مفعلة.'
    }
  }

  if (step === 6) {
    const openDays = form.workingHours.filter(day => day.isOpen)
    if (openDays.length < 1) return 'افتح يومًا واحدًا على الأقل في جدول التوفر.'
    if (openDays.some(day => !day.openTime || !day.closeTime || day.openTime >= day.closeTime)) {
      return 'تأكد أن وقت الإغلاق بعد وقت الافتتاح في جميع الأيام المتاحة.'
    }
    if (Number(form.minBookingHours) < 1) return 'حدد الحد الأدنى لمدة الحجز.'
    if (Number(form.maxAdvanceBookingDays) < 1) return 'حدد مدة الحجز المسبق.'
  }

  if (step === 7) {
    if (!Number.isFinite(Number(form.price)) || Number(form.price) <= 0) return 'أدخل سعرًا صحيحًا للساعة أكبر من صفر.'
    if (form.pricingTiers.some(tier => Number(tier.minHours) <= 0 || Number(tier.discountPercent) < 0 || Number(tier.discountPercent) > 90)) {
      return 'راجع خصومات المدة؛ يجب أن تكون بين 0% و90%.'
    }
  }

  if (step === 8) {
    if (!VALID_POLICIES.has(form.cancellationPolicy)) return 'اختر سياسة إلغاء.'
    if (!form.rules.some(rule => rule.isDefault && rule.rule.trim())) return 'فعّل قاعدة استخدام واحدة على الأقل.'
  }

  if (step === 9) {
    for (let currentStep = 1; currentStep <= 8; currentStep += 1) {
      const error = getStepError(currentStep, form)
      if (error) return `${STEP_LABELS[currentStep - 1]}: ${error}`
    }
  }

  return ''
}

export function getCompletedSteps(form: SpaceFormData) {
  return new Set(
    Array.from({ length: 8 }, (_, index) => index + 1)
      .filter(step => !getStepError(step, form)),
  )
}
