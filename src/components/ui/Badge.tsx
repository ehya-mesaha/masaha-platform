export type BadgeVariant = 'success' | 'warning' | 'danger' | 'gray' | 'blue'

const variants: Record<BadgeVariant, string> = {
  success: 'border-green-200 bg-green-100 text-green-800',
  warning: 'border-amber-200 bg-amber-100 text-amber-800',
  danger: 'border-red-200 bg-red-100 text-red-800',
  gray: 'border-gray-200 bg-gray-100 text-gray-600',
  blue: 'border-blue-200 bg-blue-100 text-blue-800',
}
const dots: Record<BadgeVariant, string> = {
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  gray: 'bg-gray-400',
  blue: 'bg-blue-500',
}

export default function Badge({ variant = 'gray', children, className = '' }: { variant?: BadgeVariant; children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${variants[variant]} ${className}`}><span className={`h-1.5 w-1.5 rounded-full ${dots[variant]}`} />{children}</span>
}

export function getSpaceStatusBadge(status: string): { variant: BadgeVariant; label: string } {
  return ({
    DRAFT: { variant: 'gray', label: 'مسودة' },
    PENDING_REVIEW: { variant: 'warning', label: 'بانتظار المراجعة' },
    APPROVED: { variant: 'success', label: 'معتمدة' },
    REJECTED: { variant: 'danger', label: 'مرفوضة' },
    INACTIVE: { variant: 'gray', label: 'غير نشطة' },
  } satisfies Record<string, { variant: BadgeVariant; label: string }>)[status] || { variant: 'gray', label: status }
}

export function getBookingStatusBadge(status: string): { variant: BadgeVariant; label: string } {
  return ({
    PENDING_PAYMENT: { variant: 'warning', label: 'بانتظار الدفع' },
    CONFIRMED: { variant: 'success', label: 'مؤكد' },
    PAYMENT_FAILED: { variant: 'danger', label: 'فشل الدفع' },
    PAYMENT_EXPIRED: { variant: 'gray', label: 'انتهت مهلة الدفع' },
    CANCELLED_BY_BUYER: { variant: 'gray', label: 'ألغاه طالب المساحة' },
    CANCELLED_BY_SELLER: { variant: 'danger', label: 'ألغاه صاحب المساحة' },
    COMPLETED: { variant: 'blue', label: 'مكتمل' },
  } satisfies Record<string, { variant: BadgeVariant; label: string }>)[status] || { variant: 'gray', label: status }
}
