interface Props {
  value: number   // 0–100
  color?: string  // Tailwind gradient or bg class
  className?: string
  thin?: boolean
}

export default function ProgressBar({ value, color, className = '', thin = false }: Props) {
  const clipped = Math.max(0, Math.min(100, value))
  const height = thin ? 'h-1' : 'h-1.5'
  const fill = color ?? 'bg-gradient-to-r from-accent/70 to-accent'
  return (
    <div className={`${height} rounded-full bg-shadow/40 overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-700 ease-out ${fill}`}
        style={{ width: `${clipped}%` }}
      />
    </div>
  )
}
