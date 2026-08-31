import Image from 'next/image'
import { BRAND_NAME_AR } from '@/lib/brand'

type BrandLogoVariant = 'horizontal' | 'stacked' | 'lockup' | 'mark'
type BrandLogoTone = 'green' | 'white'

type BrandLogoProps = {
  variant?: BrandLogoVariant
  tone?: BrandLogoTone
  className?: string
  priority?: boolean
  alt?: string
}

const ASSETS: Record<
  BrandLogoVariant,
  Record<BrandLogoTone, { src: string; width: number; height: number }>
> = {
  // Wordmark + mark, side by side. The default lockup.
  horizontal: {
    green: { src: '/brand/logo-horizontal-green.png', width: 1400, height: 507 },
    white: { src: '/brand/logo-horizontal-white.png', width: 1400, height: 507 },
  },
  // Mark above the wordmark, for square-ish spaces.
  stacked: {
    green: { src: '/brand/logo-stacked-green.png', width: 1000, height: 806 },
    white: { src: '/brand/logo-stacked-white.png', width: 1000, height: 806 },
  },
  // Horizontal lockup with the descriptor line underneath.
  lockup: {
    green: { src: '/brand/logo-lockup-green.png', width: 1400, height: 566 },
    white: { src: '/brand/logo-lockup-white.png', width: 1400, height: 566 },
  },
  // The monogram on its own.
  mark: {
    green: { src: '/brand/logo-mark-green.png', width: 1272, height: 868 },
    white: { src: '/brand/logo-mark-white.png', width: 1272, height: 868 },
  },
}

export default function BrandLogo({
  variant = 'horizontal',
  tone = 'green',
  className = '',
  priority = false,
  alt = BRAND_NAME_AR,
}: BrandLogoProps) {
  const asset = ASSETS[variant][tone]

  return (
    <Image
      src={asset.src}
      width={asset.width}
      height={asset.height}
      alt={alt}
      priority={priority}
      className={`brand-logo brand-logo-${variant} ${className}`.trim()}
    />
  )
}
