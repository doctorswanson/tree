import type { CharacterState } from '@/engine/types'
import type { ArborSelection } from '@/components/arbor/ArborGraph'

interface Props {
  state: CharacterState
  selection: ArborSelection
}

export default function LeftSidebar({ state, selection }: Props) {
  const focusBoughId =
    selection?.kind === 'bough' ? selection.id : selection?.kind === 'node' ? state.nodes[selection.id]?.boughId ?? null : null
  const focusBough = focusBoughId ? state.boughs.find((b) => b.id === focusBoughId) : null
  const sortedBoughs = [...state.boughs].sort((a, b) => b.totalXP - a.totalXP)

  return (
    <aside className="w-64 shrink-0 border-r border-shadow/60 bg-panel/40 scroll-area flex flex-col gap-3 p-3">
      {/* Identity */}
      <div className="panel p-3 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-full border-2 border-accent/50 bg-accent/10 flex items-center justify-center mb-2.5">
          <span className="font-mono text-accent text-lg">{state.name.slice(0, 1).toUpperCase()}</span>
        </div>
        <p className="font-display text-sm text-starlight">{state.name}</p>
        <p className="font-mono text-[11px] text-accent mt-1">{state.title.title}</p>
        <p className="font-body text-[10px] text-meta mt-1.5 italic">{state.title.flavor}</p>
      </div>

      {/* Progression */}
      <div className="panel p-3">
        <p className="panel-title mb-2">progression</p>
        <div className="flex justify-between font-mono text-[11px] text-mist mb-1">
          <span>level</span><span className="text-starlight">[{state.overallLevel}]</span>
        </div>
        <div className="flex justify-between font-mono text-[11px] text-mist mb-1">
          <span>total xp</span><span className="text-starlight">[{state.totalXP.toLocaleString()}]</span>
        </div>
        <div className="flex justify-between font-mono text-[11px] text-mist">
          <span>logs</span><span className="text-starlight">[{state.totalLogs}]</span>
        </div>
      </div>

      {/* Current focus — mirrors whatever is selected in the Arbor */}
      {focusBough && (
        <div className="panel-raised p-3 animate-fade-in" style={{ borderColor: `${focusBough.color}55` }}>
          <p className="font-mono text-[10px] tracking-wider text-meta mb-1">current focus</p>
          <p className="font-display text-sm font-semibold" style={{ color: focusBough.color }}>{focusBough.name}</p>
          <p className="font-body text-[11px] text-mist mt-1 line-clamp-2">{focusBough.desc}</p>
          <div className="h-1.5 rounded-full bg-shadow/70 border border-shadow overflow-hidden mt-3">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${focusBough.totalNodes === 0 ? 0 : Math.round((focusBough.nodesMaxed / focusBough.totalNodes) * 100)}%`,
                backgroundColor: focusBough.color,
                boxShadow: `0 0 6px ${focusBough.color}aa`,
              }}
            />
          </div>
          <p className="font-mono text-[10px] text-meta mt-1.5">{focusBough.nodesMaxed}/{focusBough.totalNodes} maxed · {focusBough.totalXP} XP</p>
        </div>
      )}

      {/* Bough breakdown */}
      <div className="panel p-3 flex-1 min-h-0 flex flex-col">
        <p className="panel-title mb-2">boughs</p>
        <div className="flex flex-col gap-2.5 overflow-y-auto scroll-area pr-1">
          {sortedBoughs.map((bough) => {
            const pct = bough.totalNodes === 0 ? 0 : Math.round((bough.nodesMaxed / bough.totalNodes) * 100)
            const isFocused = bough.id === focusBoughId
            const dimmed = focusBoughId !== null && !isFocused
            return (
              <div key={bough.id} className="transition-opacity duration-300" style={{ opacity: dimmed ? 0.4 : 1 }}>
                <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-sm shrink-0" style={{ backgroundColor: bough.color, boxShadow: `0 0 4px ${bough.color}` }} />
                    <span style={{ color: bough.color, fontWeight: bough.focusState === 'active' ? 600 : 400 }}>{bough.name}</span>
                  </span>
                  <span className="text-meta">[{bough.nodesMaxed}/{bough.totalNodes}]</span>
                </div>
                <div className="h-1 rounded-full bg-shadow/70 border border-shadow overflow-hidden">
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
