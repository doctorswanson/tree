import type { CharacterState } from '@/engine/types'
import type { ArborSelection } from '@/components/arbor/ArborGraph'
import { xpToNextRank } from '@/engine/xp'

interface Props {
  state: CharacterState
  selection: ArborSelection
  onLogNode: (nodeId: string) => void
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
          {bough.branches.map((branch) => (
            <div key={branch.id}>
              <p className="font-mono text-[11px] text-mist mb-1">{branch.name}</p>
              <div className="flex flex-wrap gap-1">
                {branch.nodes.map((n) => (
                  <span
                    key={n.id}
                    className="font-mono text-[9px] px-1.5 py-0.5 rounded border"
                    style={{
                      borderColor: n.rank > 0 || n.achieved ? bough.color : '#3a4750',
                      color: n.rank > 0 || n.achieved ? bough.color : '#56666a',
                    }}
                  >
                    {n.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>
    )
  }

  const node = state.nodes[selection.id]
  if (!node) return null
  const next = node.repeatable ? xpToNextRank(node.xp) : null

  return (
    <aside className="w-80 shrink-0 border-l border-shadow/60 bg-panel/40 scroll-area p-4 flex flex-col gap-4">
      <div>
        <p className="font-mono text-[10px] text-meta uppercase tracking-wider">{node.boughName} / {node.branchName}</p>
        <p className="font-display text-lg font-semibold text-starlight mt-1">{node.name}</p>
        <p className="font-body text-sm text-mist mt-2">{node.desc}</p>
      </div>

      <div className="panel p-3 flex flex-col gap-2">
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
