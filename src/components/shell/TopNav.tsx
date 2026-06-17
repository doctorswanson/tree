export type TabId = 'arbor' | 'codex' | 'profile'

interface Props {
  active: TabId
  onChange: (tab: TabId) => void
  characterName: string
  title: string
  level: number
  onOpenSettings: () => void
}

const TABS: { id: TabId; label: string; subtitle: string }[] = [
  { id: 'arbor', label: 'Arbor', subtitle: 'Growth & progression' },
  { id: 'codex', label: 'Codex', subtitle: 'Reference library' },
  { id: 'profile', label: 'Profile', subtitle: 'Identity & stats' },
]

export default function TopNav({ active, onChange, characterName, title, level, onOpenSettings }: Props) {
  const activeSubtitle = TABS.find((t) => t.id === active)?.subtitle ?? ''

  return (
    <header className="flex items-center justify-between h-14 px-4 border-b border-shadow/60 bg-panel/60 shrink-0">
      <div className="flex items-center gap-6">
        <span className="font-mono text-accent text-glow-accent text-sm tracking-widest">{'>_'} tree</span>
        <nav className="flex items-center gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`tab-item ${active === tab.id ? 'active' : ''}`}
              onClick={() => onChange(tab.id)}
              title={tab.subtitle}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <span className="hidden md:inline font-mono text-[10px] text-meta border-l border-shadow/60 pl-3">
          // {activeSubtitle}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="font-display text-sm text-starlight leading-tight">{characterName}</p>
          <p className="font-mono text-[10px] text-accent leading-tight">{title} · Lv.{level}</p>
        </div>
        <button
          className="w-9 h-9 rounded-md border border-shadow/80 text-mist hover:text-accent hover:border-accent/50 flex items-center justify-center transition-colors"
          onClick={onOpenSettings}
          aria-label="Settings"
        >
          ⚙
        </button>
      </div>
    </header>
  )
}
