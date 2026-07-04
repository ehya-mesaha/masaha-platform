interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: boolean
}

export default function Card({ children, className = '', padding = true }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-[#E8E3D8] shadow-sm ${padding ? 'p-6' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
