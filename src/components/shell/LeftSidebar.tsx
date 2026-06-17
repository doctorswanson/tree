import type { CharacterState } from '@/engine/types'

interface Props {
  state: CharacterState
}

export default function LeftSidebar({ state }: Props) {
  const sortedBoughs = [...state.boughs].sort((a, b) => b.totalXP - a.totalXP)

  return (
    <aside className="w-64 shrink-0 border-r border-shadow/60 bg-panel/40 scroll-area flex flex-col gap-4 p-4">
      {/* Identity */}
      <div className="panel p-4 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full border-2 border-accent/50 bg-accent/10 flex items-center justify-center mb-3">
          <span className="font-mono text-accent text-xl">{state.name.slice(0, 1).toUpperCase()}</span>
        </div>
        <p className="font-display text-base text-starlight">{state.name}</p>
        <p className="font-mono text-xs text-accent mt-1">{state.title.title}</p>
        <p className="font-body text-[11px] text-meta mt-2 italic">{state.title.flavor}</p>
      </div>

      {/* Stats */}
      <div className="panel p-4">
        <p className="panel-title mb-3">Stats</p>
        <div className="flex justify-between font-mono text-xs text-mist mb-1">
          <span>Level</span><span className="text-starlight">{state.overallLevel}</span>
        </div>
        <div className="flex justify-between font-mono text-xs text-mist mb-1">
          <span>Total XP</span><span className="text-starlight">{state.totalXP.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-mono text-xs text-mist">
          <span>Logs</span><span className="text-starlight">{state.totalLogs}</span>
        </div>
      </div>

      {/* Bough breakdown */}
      <div className="panel p-4 flex-1 min-h-0 flex flex-col">
        <p className="panel-title mb-3">Boughs</p>
        <div className="flex flex-col gap-3 overflow-y-auto scroll-area pr-1">
          {sortedBoughs.map((bough) => {
            const pct = bough.totalNodes === 0 ? 0 : Math.round((bough.nodesMaxed / bough.totalNodes) * 100)
            return (
              <div key={bough.id}>
                <div className="flex justify-between font-mono text-[11px] mb-1">
                  <span style={{ color: bough.color }}>{bough.name}</span>
                  <span className="text-meta">{bough.nodesMaxed}/{bough.totalNodes}</span>
                </div>
                <div className="h-1 rounded-full bg-shadow/40 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${pct}%`, backgroundColor: bough.color }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
