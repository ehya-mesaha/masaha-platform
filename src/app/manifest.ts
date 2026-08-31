import type { MetadataRoute } from 'next'
import { SITE_TITLE_AR, BRAND_NAME_AR } from '@/lib/brand'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_TITLE_AR,
    short_name: BRAND_NAME_AR,
    description: 'منصة سعودية لإحياء المساحات غير المستغلة وحجز القاعات والمساحات بالساعة.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F5F1E8',
    theme_color: '#0E3B34',
    lang: 'ar-SA',
    dir: 'rtl',
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  }
}
