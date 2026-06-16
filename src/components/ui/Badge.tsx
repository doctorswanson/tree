interface Props {
  children: React.ReactNode
  color?: 'gold' | 'cyan' | 'purple' | 'green' | 'amber' | 'aurora' | 'mist' | 'red'
  size?: 'sm' | 'xs'
}

const COLOR_MAP: Record<string, string> = {
  gold:   'text-amber  border-amber/40  bg-amber/10',
  amber:  'text-amber  border-amber/40  bg-amber/10',
  cyan:   'text-cyan   border-cyan/40   bg-cyan/10',
  purple: 'text-purple border-purple/40 bg-purple/10',
  green:  'text-green  border-green/40  bg-green/10',
  aurora: 'text-green  border-green/40  bg-green/10',
  mist:   'text-mist   border-shadow/60  bg-shadow/20',
  red:    'text-red-400 border-red-700/40 bg-red-900/20',
}

export default function Badge({ children, color = 'mist', size = 'sm' }: Props) {
  const sz = size === 'xs' ? 'text-[10px] px-1.5 py-0' : 'text-xs px-2 py-0.5'
  return (
    <span className={`inline-flex items-center font-display tracking-wider border rounded ${sz} ${COLOR_MAP[color]}`}>
      {children}
    </span>
  )
}
