'use client'

import { StepProps } from './types'
import ImageUploader from '@/components/ui/ImageUploader'

export default function StepPhotos({ form, update }: StepProps) {
  return (
    <div>
      <h2 className="font-display text-xl font-extrabold text-[#14201A] mb-1">الصور والوسائط</h2>
      <p className="text-[#6B7566] text-sm mb-6">أضف صوراً احترافية لمساحتك لجذب العملاء. الصورة الأولى ستكون الصورة الرئيسية.</p>

      <ImageUploader
        images={form.images}
        onChange={urls => update('images', urls)}
        max={8}
      />

      <div className="mt-4 p-4 rounded-xl bg-[#F7F3EB] border border-[#ECE6D8]">
        <p className="text-xs font-bold text-[#1B3A2D] mb-2">نصائح للصور الاحترافية</p>
        <ul className="text-xs text-[#6B7566] space-y-1">
          <li>• استخدم إضاءة طبيعية أو إضاءة جيدة</li>
          <li>• صوّر من زوايا مختلفة لإظهار المساحة بالكامل</li>
          <li>• تأكد من نظافة وترتيب المساحة قبل التصوير</li>
          <li>• الحد الأقصى 8 صور، كل صورة بحد أقصى 5 ميجابايت</li>
        </ul>
      </div>
    </div>
  )
}
