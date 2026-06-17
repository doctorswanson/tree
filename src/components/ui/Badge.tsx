interface Props {
  children: React.ReactNode
  color?: 'accent' | 'cyan' | 'magenta' | 'amber' | 'mist' | 'danger'
  size?: 'sm' | 'xs'
}

const COLOR_MAP: Record<string, string> = {
  accent:  'text-accent  border-accent/40  bg-accent/10',
  amber:   'text-amber   border-amber/40   bg-amber/10',
  cyan:    'text-cyan    border-cyan/40    bg-cyan/10',
  magenta: 'text-magenta border-magenta/40 bg-magenta/10',
  mist:    'text-mist    border-shadow/60  bg-shadow/20',
  danger:  'text-danger  border-danger/40  bg-danger/10',
}

export default function Badge({ children, color = 'mist', size = 'sm' }: Props) {
  const sz = size === 'xs' ? 'text-[10px] px-1.5 py-0' : 'text-xs px-2 py-0.5'
  return (
    <span className={`inline-flex items-center font-display tracking-wider border rounded ${sz} ${COLOR_MAP[color]}`}>
      {children}
    </span>
  )
}
