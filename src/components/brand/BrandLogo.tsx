import Image from 'next/image'

type BrandLogoVariant = 'horizontal' | 'stacked' | 'mark'
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
  horizontal: {
    green: {
      src: '/brand/logo-horizontal-green.png',
      width: 482,
      height: 224,
    },
    white: {
      src: '/brand/logo-horizontal-white.png',
      width: 482,
      height: 224,
    },
  },
  stacked: {
    green: {
      src: '/brand/logo-stacked-green.png',
      width: 673,
      height: 414,
    },
    white: {
      src: '/brand/logo-stacked-white.png',
      width: 673,
      height: 414,
    },
  },
  mark: {
    green: {
      src: '/brand/logo-mark-green.png',
      width: 1272,
      height: 868,
    },
    white: {
      src: '/brand/logo-mark-white.png',
      width: 1272,
      height: 868,
    },
  },
}

export default function BrandLogo({
  variant = 'horizontal',
  tone = 'green',
  className = '',
  priority = false,
  alt = 'إحياء مساحة',
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
