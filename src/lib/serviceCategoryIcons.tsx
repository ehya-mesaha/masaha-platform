import type { ReactNode } from 'react'

export const SERVICE_CATEGORY_META: Record<string, { label: string; icon: ReactNode }> = {
  'ضيافة': { label: 'ضيافة', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8m-4-4v4M6 3h12l-1 8.5A5 5 0 0112 16a5 5 0 01-5-4.5L6 3zm12 2h1.5a2.5 2.5 0 010 5H18" /> },
  'مطبوعات': { label: 'مطبوعات', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M6 9V3h12v6M6 18H4a1 1 0 01-1-1v-6a1 1 0 011-1h16a1 1 0 011 1v6a1 1 0 01-1 1h-2m-12 0h12v5H6v-5z" /> },
  'تنظيم': { label: 'تنظيم', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /> },
  'تنظيف': { label: 'تنظيف', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" /> },
  other: { label: 'أخرى', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.734-.05a2.548 2.548 0 10-3.259-3.259c-.14.57-.164 1.184 0 1.734m0 0l-1.5 1.5" /> },
}

export function getServiceCategoryMeta(category: string | null | undefined) {
  return SERVICE_CATEGORY_META[category || ''] || SERVICE_CATEGORY_META.other
}
