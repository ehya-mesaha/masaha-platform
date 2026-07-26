export default function Loading() {
  return (
    <main className="masaha-route-loading" aria-label="جاري تحميل الصفحة">
      <div className="route-loading-frame" aria-hidden="true">
        <span className="route-loading-corner route-loading-corner-a" />
        <span className="route-loading-corner route-loading-corner-b" />
        <div className="route-loading-mark">
          <span className="route-loading-roof" />
          <span className="route-loading-home" />
        </div>
        <strong>EHYA MASAHA</strong>
        <div className="route-loading-line"><span /></div>
      </div>
    </main>
  )
}
