import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'إحياء مساحة | لإحياء المساحات غير المستغلة',
    short_name: 'إحياء مساحة',
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
