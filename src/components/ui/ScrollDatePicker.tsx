import { useEffect, useRef } from 'react'

const ITEM_HEIGHT = 32
const VISIBLE_ITEMS = 5
const PAD = (ITEM_HEIGHT * (VISIBLE_ITEMS - 1)) / 2

interface Option {
  value: number
  label: string
}

interface WheelColumnProps {
  options: Option[]
  value: number
  onChange: (value: number) => void
}

function WheelColumn({ options, value, onChange }: WheelColumnProps) {
  const ref = useRef<HTMLDivElement>(null)
  const scrollTimeout = useRef<number>()
  // Sentinel so the first run (mount) always syncs scroll position to `value`.
  const lastValue = useRef<number | null>(null)

  useEffect(() => {
    const idx = options.findIndex((o) => o.value === value)
    if (idx >= 0 && ref.current && lastValue.current !== value) {
      ref.current.scrollTop = idx * ITEM_HEIGHT
    }
    lastValue.current = value
  }, [value, options])

  function handleScroll() {
    if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current)
    scrollTimeout.current = window.setTimeout(() => {
      if (!ref.current) return
      const idx = Math.round(ref.current.scrollTop / ITEM_HEIGHT)
      const clamped = Math.max(0, Math.min(options.length - 1, idx))
      ref.current.scrollTo({ top: clamped * ITEM_HEIGHT, behavior: 'smooth' })
      const opt = options[clamped]
      if (opt && opt.value !== value) {
        lastValue.current = opt.value
        onChange(opt.value)
      }
    }, 110)
  }

  return (
    <div
      ref={ref}
      onScroll={handleScroll}
      className="overflow-y-auto snap-y snap-mandatory no-scrollbar"
      style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS, paddingTop: PAD, paddingBottom: PAD }}
    >
      {options.map((opt) => (
        <div
          key={opt.value}
          className={`snap-center flex items-center justify-center font-mono text-sm transition-colors ${
            opt.value === value ? 'text-starlight font-semibold' : 'text-meta'
          }`}
          style={{ height: ITEM_HEIGHT }}
        >
          {opt.label}
        </div>
      ))}
    </div>
  )
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

interface Props {
  /** ISO date string ('YYYY-MM-DD') or '' when unset. Always optional for the caller. */
  value: string
  onChange: (value: string) => void
}

export default function ScrollDatePicker({ value, onChange }: Props) {
  const today = new Date()
  const parsed = value ? new Date(`${value}T00:00:00`) : null
  const year = parsed ? parsed.getFullYear() : today.getFullYear()
  const month = parsed ? parsed.getMonth() + 1 : today.getMonth() + 1
  const day = parsed ? parsed.getDate() : today.getDate()
  const maxDay = daysInMonth(year, month)
  const clampedDay = Math.min(day, maxDay)

  function commit(next: { year: number; month: number; day: number }) {
    const clampedNextDay = Math.min(next.day, daysInMonth(next.year, next.month))
    const mm = String(next.month).padStart(2, '0')
    const dd = String(clampedNextDay).padStart(2, '0')
    onChange(`${next.year}-${mm}-${dd}`)
  }

  if (!value) {
    return (
      <button
        type="button"
        className="w-full text-left bg-void/60 border border-shadow/80 rounded-lg px-3 py-2
                   font-mono text-meta text-sm hover:border-accent/40 hover:text-mist transition-colors"
        onClick={() => commit({ year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() })}
      >
        + set a date
      </button>
    )
  }

  const monthOptions = MONTHS.map((label, i) => ({ value: i + 1, label }))
  const dayOptions = Array.from({ length: maxDay }, (_, i) => ({ value: i + 1, label: String(i + 1) }))
  const yearOptions = Array.from({ length: 16 }, (_, i) => {
    const y = today.getFullYear() - 12 + i
    return { value: y, label: String(y) }
  })

  return (
    <div className="rounded-lg border border-shadow/80 bg-void/60 p-2">
      <div className="relative flex">
        <div className="absolute left-2 right-2 top-1/2 -translate-y-1/2 h-8 bg-accent/10 border-y border-accent/30 pointer-events-none rounded-sm" />
        <div className="flex-[1.3]">
          <WheelColumn options={monthOptions} value={month} onChange={(m) => commit({ year, month: m, day: clampedDay })} />
        </div>
        <div className="flex-1">
          <WheelColumn options={dayOptions} value={clampedDay} onChange={(d) => commit({ year, month, day: d })} />
        </div>
        <div className="flex-[1.2]">
          <WheelColumn options={yearOptions} value={year} onChange={(y) => commit({ year: y, month, day: clampedDay })} />
        </div>
      </div>
      <button
        type="button"
        className="mt-1.5 w-full text-center font-mono text-[10px] text-meta hover:text-danger transition-colors"
        onClick={() => onChange('')}
      >
        clear date
      </button>
    </div>
  )
}
