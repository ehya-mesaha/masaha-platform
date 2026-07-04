'use client'

import { useState, useRef, useCallback } from 'react'

type Props = {
  images: string[]
  onChange: (urls: string[]) => void
  max?: number
}

export default function ImageUploader({ images, onChange, max = 6 }: Props) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = useCallback(async (files: FileList | File[]) => {
    const toUpload = Array.from(files).slice(0, max - images.length)
    if (toUpload.length === 0) return

    setUploading(true)
    const newUrls: string[] = []

    for (const file of toUpload) {
      const fd = new FormData()
      fd.append('file', file)

      try {
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (res.ok && data.url) {
          newUrls.push(data.url)
        }
      } catch {
        // skip failed uploads silently
      }
    }

    if (newUrls.length > 0) {
      onChange([...images, ...newUrls])
    }
    setUploading(false)
  }, [images, onChange, max])

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length > 0) {
      upload(e.dataTransfer.files)
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      {/* Uploaded images grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((url, i) => (
            <div key={i} className="relative group aspect-video rounded-xl overflow-hidden border border-[#E8E3D8]">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {i === 0 && (
                <span className="absolute bottom-2 right-2 bg-[#1B3A2D]/80 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                  رئيسية
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {images.length < max && (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-[#1B3A2D] bg-[#1B3A2D]/5'
              : 'border-[#E8E3D8] hover:border-[#1B3A2D]/50 hover:bg-[#F7F3EB]/50'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <svg className="animate-spin h-8 w-8 text-[#1B3A2D]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-sm text-[#6B7566]">جاري الرفع...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <svg className="w-10 h-10 text-[#C49A3C]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <p className="text-sm font-medium text-[#14201A]">اضغط أو اسحب الصور هنا</p>
              <p className="text-xs text-[#6B7566]">JPG, PNG, WebP — حد أقصى 5 ميجابايت لكل صورة ({images.length}/{max})</p>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={e => {
              if (e.target.files && e.target.files.length > 0) {
                upload(e.target.files)
                e.target.value = ''
              }
            }}
          />
        </div>
      )}
    </div>
  )
}
