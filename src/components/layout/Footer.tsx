import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1B3A2D] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-[#C49A3C] mb-3">مساحة</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              منصة رائدة لاستئجار المساحات المكتبية وقاعات التدريب والاستوديوهات في المملكة العربية السعودية.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/spaces" className="hover:text-[#C49A3C] transition-colors">تصفح المساحات</Link></li>
              <li><Link href="/auth/register?seller=1" className="hover:text-[#C49A3C] transition-colors">أضف مساحتك</Link></li>
              <li><Link href="/auth/login" className="hover:text-[#C49A3C] transition-colors">تسجيل الدخول</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">تواصل معنا</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>info@masaha.sa</li>
              <li>+966 50 000 0000</li>
              <li>الرياض، المملكة العربية السعودية</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} مساحة. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  )
}
