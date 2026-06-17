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
    <div className="h-40 shrink-0 border-t border-shadow/60 bg-panel/40 grid grid-cols-3 divide-x divide-shadow/60">
      {/* System Log */}
      <div className="flex flex-col min-h-0">
        <p className="panel-title px-3 py-1.5 border-b" style={{ borderColor: 'rgba(57,255,138,0.18)', color: '#39ff8acc' }}>System Log</p>
        <div className="flex-1 overflow-y-auto scroll-area px-3 py-1.5 font-mono text-[11px] text-mist leading-relaxed">
          {recent.length === 0 && (
            <p className="text-meta">
              <span className="text-accent">$</span> awaiting input… select a node in the Arbor and log it to start the trace.
            </p>
          )}
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
        <p className="panel-title px-3 py-1.5 border-b" style={{ borderColor: 'rgba(34,211,238,0.18)', color: '#22d3eecc' }}>Recent Activity</p>
        <div className="flex-1 overflow-y-auto scroll-area px-3 py-1.5 flex flex-col gap-1.5">
          {recent.length === 0 && (
            <p className="font-mono text-[11px] text-meta leading-relaxed">
              Nothing logged yet — click any node and hit <span className="text-accent">Log Entry</span> to start your history.
            </p>
          )}
          {recent.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-sm shrink-0"
                style={{ backgroundColor: item.node?.boughColor, boxShadow: item.node?.boughColor ? `0 0 4px ${item.node.boughColor}` : undefined }}
              />
              <span className="font-body text-xs text-starlight truncate" style={{ color: item.node?.boughColor }}>
                {item.node?.name ?? 'Unknown node'}
              </span>
              {item.note && <span className="font-body text-[10px] text-meta truncate ml-auto">{item.note}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* On Deck */}
      <div className="flex flex-col min-h-0">
        <p className="panel-title px-3 py-1.5 border-b" style={{ borderColor: 'rgba(250,204,21,0.18)', color: '#facc15cc' }}>On Deck</p>
        <div className="flex-1 overflow-y-auto scroll-area px-3 py-1.5 flex flex-col gap-1.5">
          {deck.length === 0 && (
            <p className="font-mono text-[11px] text-meta leading-relaxed">
              Log a node once and we'll surface whatever's closest to its next rank — right here.
            </p>
          )}
          {deck.map(({ node, remaining }) => (
            <div key={node.id} className="flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-sm shrink-0"
                style={{ backgroundColor: node.boughColor, boxShadow: `0 0 4px ${node.boughColor}` }}
              />
              <span className="font-body text-xs text-starlight truncate" style={{ color: node.boughColor }}>
                {node.name}
              </span>
              <span className="font-mono text-[10px] text-meta whitespace-nowrap ml-auto">{remaining} XP</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
