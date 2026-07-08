interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: boolean
}

export default function Card({ children, className = '', padding = true }: CardProps) {
  return (
    <div
      className={`premium-card hover-lift ${padding ? 'p-6' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
