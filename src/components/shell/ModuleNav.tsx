export type ModuleId = 'profile' | 'trees' | 'quests' | 'classes' | 'factions' | 'logs'

interface Props {
  active: ModuleId
  onChange: (m: ModuleId) => void
}

const TABS: { id: ModuleId; label: string; icon: string }[] = [
  { id: 'profile',  label: 'Profile',  icon: '◉' },
  { id: 'trees',    label: 'Trees',    icon: '✦' },
  { id: 'quests',   label: 'Quests',   icon: '◫' },
  { id: 'classes',  label: 'Class',    icon: '◆' },
  { id: 'factions', label: 'Factions', icon: '⚑' },
  { id: 'logs',     label: 'Logs',     icon: '▤' },
]

export default function ModuleNav({ active, onChange }: Props) {
  return (
    <nav
      className="relative z-20 flex border-t border-shadow/60 bg-panel/95 backdrop-blur-md pb-safe no-select"
      role="tablist"
    >
      {TABS.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          className={`tab-item relative ${active === t.id ? 'active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          <span className="text-lg leading-none">{t.icon}</span>
          <span className="tab-item-label">{t.label}</span>
          {active === t.id && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gold rounded-full" />
          )}
        </button>
      ))}
    </nav>
  )
}
