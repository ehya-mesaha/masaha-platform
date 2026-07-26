import BrandLogo from '@/components/brand/BrandLogo'

export default function Loading() {
  return (
    <main className="masaha-route-loading" aria-label="جاري تحميل الصفحة">
      <div className="route-loading-frame" aria-hidden="true">
        <span className="route-loading-corner route-loading-corner-a" />
        <span className="route-loading-corner route-loading-corner-b" />
        <BrandLogo variant="mark" tone="white" className="route-loading-logo" priority alt="" />
        <div className="route-loading-line"><span /></div>
      </div>
    </main>
  )
}
