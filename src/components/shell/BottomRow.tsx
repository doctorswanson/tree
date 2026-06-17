import type { Character, CharacterState } from '@/engine/types'
import { recentActivity, onDeck } from '@/engine/selectors'

interface Props {
  character: Character
  state: CharacterState
}

export default function BottomRow({ character, state }: Props) {
  const recent = recentActivity(character, state, 6)
  const deck = onDeck(state, 4)

  return (
    <div className="h-44 shrink-0 border-t border-shadow/60 bg-panel/40 grid grid-cols-3 divide-x divide-shadow/60">
      {/* System Log */}
      <div className="flex flex-col min-h-0">
        <p className="panel-title px-3 py-2 border-b border-shadow/40">System Log</p>
        <div className="flex-1 overflow-y-auto scroll-area px-3 py-2 font-mono text-[11px] text-mist leading-relaxed">
          {recent.length === 0 && <p className="text-meta">No activity yet.</p>}
          {recent.map((item) => (
            <p key={item.id}>
              <span className="text-accent">$</span> log {item.node?.id ?? 'unknown'}
              {item.date && <span className="text-meta"> @ {item.date}</span>}
            </p>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="flex flex-col min-h-0">
        <p className="panel-title px-3 py-2 border-b border-shadow/40">Recent Activity</p>
        <div className="flex-1 overflow-y-auto scroll-area px-3 py-2 flex flex-col gap-1.5">
          {recent.length === 0 && <p className="font-mono text-[11px] text-meta">Nothing logged yet.</p>}
          {recent.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-2">
              <span className="font-body text-xs text-starlight truncate" style={{ color: item.node?.boughColor }}>
                {item.node?.name ?? 'Unknown node'}
              </span>
              {item.note && <span className="font-body text-[10px] text-meta truncate">{item.note}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* On Deck */}
      <div className="flex flex-col min-h-0">
        <p className="panel-title px-3 py-2 border-b border-shadow/40">On Deck</p>
        <div className="flex-1 overflow-y-auto scroll-area px-3 py-2 flex flex-col gap-1.5">
          {deck.length === 0 && <p className="font-mono text-[11px] text-meta">Log a node to start a streak.</p>}
          {deck.map(({ node, remaining }) => (
            <div key={node.id} className="flex items-center justify-between gap-2">
              <span className="font-body text-xs text-starlight truncate" style={{ color: node.boughColor }}>
                {node.name}
              </span>
              <span className="font-mono text-[10px] text-meta whitespace-nowrap">{remaining} XP to rank up</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
