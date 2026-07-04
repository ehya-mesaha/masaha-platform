type BadgeVariant = 'success' | 'warning' | 'danger' | 'gray' | 'blue'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-amber-100 text-amber-800 border-amber-200',
  danger: 'bg-red-100 text-red-800 border-red-200',
  gray: 'bg-gray-100 text-gray-600 border-gray-200',
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
}

const dotColors: Record<BadgeVariant, string> = {
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  gray: 'bg-gray-400',
  blue: 'bg-blue-500',
}

export default function Badge({ variant = 'gray', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      {children}
    </span>
  )
}

export function getSpaceStatusBadge(status: string) {
  const map: Record<string, { variant: BadgeVariant; label: string }> = {
    DRAFT: { variant: 'gray', label: 'مسودة' },
    PENDING_REVIEW: { variant: 'warning', label: 'بانتظار المراجعة' },
    APPROVED: { variant: 'success', label: 'معتمدة' },
    REJECTED: { variant: 'danger', label: 'مرفوضة' },
    INACTIVE: { variant: 'gray', label: 'غير نشطة' },
  }
  return map[status] ?? { variant: 'gray' as BadgeVariant, label: status }
}

export function getBookingStatusBadge(status: string) {
  const map: Record<string, { variant: BadgeVariant; label: string }> = {
    PENDING: { variant: 'warning', label: 'بانتظار القبول' },
    ACCEPTED: { variant: 'success', label: 'مقبول' },
    REJECTED: { variant: 'danger', label: 'مرفوض' },
    CANCELLED: { variant: 'gray', label: 'ملغي' },
    COMPLETED: { variant: 'blue', label: 'مكتمل' },
  }
  return map[status] ?? { variant: 'gray' as BadgeVariant, label: status }
}
