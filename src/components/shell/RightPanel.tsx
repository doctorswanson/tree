import type { CharacterState, ProgressionLayer } from '@/engine/types'
import type { ArborSelection } from '@/components/arbor/ArborGraph'
import { xpToNextRank } from '@/engine/xp'

interface Props {
  state: CharacterState
  selection: ArborSelection
  onLogNode: (nodeId: string) => void
}

const LAYERS: { id: ProgressionLayer; label: string; hint: string }[] = [
  { id: 'fundamentals', label: 'Fundamentals', hint: 'Where this path begins.' },
  { id: 'applied', label: 'Applied', hint: 'Putting the basics to work.' },
  { id: 'advanced', label: 'Advanced', hint: 'Specialized, harder-won ground.' },
  { id: 'mastery', label: 'Mastery / Certification', hint: 'Recognized, named achievement.' },
]

const FOCUS_LABEL: Record<string, { label: string; hint: string }> = {
  active: { label: 'ACTIVE', hint: "You've already put work in here." },
  available: { label: 'AVAILABLE', hint: 'A sensible next step.' },
  locked: { label: 'DORMANT', hint: 'No prerequisite — jump in anytime.' },
}

export default function RightPanel({ state, selection, onLogNode }: Props) {
  if (!selection) {
    return (
      <aside className="w-80 shrink-0 border-l border-shadow/60 bg-panel/40 p-4 flex items-center justify-center">
        <p className="font-mono text-xs text-meta text-center leading-relaxed">
          Select a node in the Arbor<br />to see what you can achieve.
        </p>
      </aside>
    )
  }

  if (selection.kind === 'bough') {
    const bough = state.boughs.find((b) => b.id === selection.id)
    if (!bough) return null
    return (
      <aside className="w-80 shrink-0 border-l border-shadow/60 bg-panel/40 scroll-area p-4 flex flex-col gap-4">
        <div>
          <p className="font-display text-lg font-semibold" style={{ color: bough.color }}>{bough.name}</p>
          <p className="font-body text-sm text-mist mt-1">{bough.desc}</p>
        </div>
        <div className="panel p-3 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="font-mono text-base text-starlight">{bough.totalXP}</p>
            <p className="font-mono text-[10px] text-meta">XP</p>
          </div>
          <div>
            <p className="font-mono text-base text-starlight">{bough.nodesStarted}</p>
            <p className="font-mono text-[10px] text-meta">started</p>
          </div>
          <div>
            <p className="font-mono text-base text-starlight">{bough.nodesMaxed}/{bough.totalNodes}</p>
            <p className="font-mono text-[10px] text-meta">maxed</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {LAYERS.map((layer) => {
            const layerBranches = bough.branches.filter((b) => b.layer === layer.id)
            if (layerBranches.length === 0) return null
            const layerNodes = layerBranches.flatMap((b) => b.nodes)
            const pct = Math.round((layerNodes.filter((n) => n.rank > 0 || n.achieved).length / layerNodes.length) * 100)
            return (
              <div key={layer.id} className="rounded-md border border-shadow/60 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display text-xs font-semibold uppercase tracking-wider" style={{ color: bough.color }}>
                    {layer.label}
                  </span>
                  <span className="font-mono text-[10px] text-meta">{pct}%</span>
                </div>
                <p className="font-mono text-[10px] text-meta mb-2">{layer.hint}</p>
                <div className="h-1 rounded-full bg-shadow/40 overflow-hidden mb-3">
                  <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${pct}%`, backgroundColor: bough.color }} />
                </div>
                <div className="flex flex-col gap-2">
                  {layerBranches.map((branch) => (
                    <div key={branch.id}>
                      <p className="font-mono text-[10px] text-mist mb-1">{branch.name}</p>
                      <div className="flex flex-wrap gap-1">
                        {branch.nodes.map((n) => (
                          <span
                            key={n.id}
                            className="font-mono text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-1"
                            style={{
                              borderColor: n.focusState === 'locked' ? '#3a4750' : bough.color,
                              color: n.focusState === 'active' ? bough.color : n.focusState === 'available' ? '#8aa39c' : '#56666a',
                              opacity: n.focusState === 'locked' ? 0.55 : 1,
                            }}
                          >
                            {n.focusState === 'locked' && '🔒'}
                            {n.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </aside>
    )
  }

  const node = state.nodes[selection.id]
  if (!node) return null
  const next = node.repeatable ? xpToNextRank(node.xp) : null
  const focus = FOCUS_LABEL[node.focusState]

  return (
    <aside className="w-80 shrink-0 border-l border-shadow/60 bg-panel/40 scroll-area p-4 flex flex-col gap-4">
      <div>
        <p className="font-mono text-[10px] text-meta uppercase tracking-wider">{node.boughName} / {node.branchName}</p>
        <p className="font-display text-lg font-semibold text-starlight mt-1">{node.name}</p>
        <p className="font-body text-sm text-mist mt-2">{node.desc}</p>
      </div>

      <div className="panel p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-meta">Focus</span>
          <span
            className="font-mono text-[10px] font-medium tracking-widest px-2 py-0.5 rounded border"
            style={{
              color: node.focusState === 'locked' ? '#56666a' : node.boughColor,
              borderColor: node.focusState === 'locked' ? '#3a4750' : `${node.boughColor}66`,
            }}
            title={focus.hint}
          >
            {focus.label}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-meta">Rank</span>
          <span className={`rank-${node.rank}`}>{node.achieved ? 'ACHIEVED' : `RANK ${node.rank}`}</span>
        </div>
        {node.repeatable && (
          <>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-meta">XP</span>
              <span className="font-mono text-xs text-starlight">{node.xp}</span>
            </div>
            {next && (
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-meta">Next rank in</span>
                <span className="font-mono text-xs text-starlight">{next.remaining} XP</span>
              </div>
            )}
          </>
        )}
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-meta">Logged</span>
          <span className="font-mono text-xs text-starlight">{node.logCount}×</span>
        </div>
        {node.lastLoggedAt && (
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-meta">Last logged</span>
            <span className="font-mono text-xs text-starlight">{node.lastLoggedAt.slice(0, 10)}</span>
          </div>
        )}
      </div>

      <button
        className="btn-primary disabled:opacity-40 disabled:scale-100"
        disabled={!node.repeatable && node.achieved}
        onClick={() => onLogNode(node.id)}
      >
        {node.repeatable ? 'Log Entry' : node.achieved ? 'Already Achieved' : 'Mark Achieved'}
      </button>
    </aside>
  )
}
