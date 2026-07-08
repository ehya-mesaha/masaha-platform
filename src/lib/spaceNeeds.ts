export const SPACE_NEED_STATUSES = [
  { value: 'NEW', label: 'جديد' },
  { value: 'IN_REVIEW', label: 'قيد المراجعة' },
  { value: 'MATCHED', label: 'تم توفير خيارات' },
  { value: 'CLOSED', label: 'مغلق' },
]

export function getSpaceNeedStatusMeta(status: string) {
  const map: Record<string, { label: string; className: string }> = {
    NEW: { label: 'جديد', className: 'border-amber-200 bg-amber-50 text-amber-800' },
    IN_REVIEW: { label: 'قيد المراجعة', className: 'border-blue-200 bg-blue-50 text-blue-800' },
    MATCHED: { label: 'تم توفير خيارات', className: 'border-green-200 bg-green-50 text-green-800' },
    CLOSED: { label: 'مغلق', className: 'border-gray-200 bg-gray-100 text-gray-700' },
  }
  return map[status] || { label: status, className: 'border-gray-200 bg-gray-100 text-gray-700' }
}

export function formatBudgetRange(min?: number | null, max?: number | null) {
  if (min && max) return `${min.toLocaleString('ar-SA')} - ${max.toLocaleString('ar-SA')} ر.س / ساعة`
  if (min) return `من ${min.toLocaleString('ar-SA')} ر.س / ساعة`
  if (max) return `حتى ${max.toLocaleString('ar-SA')} ر.س / ساعة`
  return 'غير محددة'
}
