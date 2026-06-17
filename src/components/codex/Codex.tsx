import { useMemo, useState } from 'react'
import type { CharacterState } from '@/engine/types'
import { BOUGHS } from '@/data/arbor'

interface Props {
  state: CharacterState
  selectedNodeId: string | null
  onSelectNode: (nodeId: string) => void
}

export default function Codex({ state, selectedNodeId, onSelectNode }: Props) {
  const [query, setQuery] = useState('')
  const [boughFilter, setBoughFilter] = useState<string | null>(null)

  const allNodes = useMemo(() => Object.values(state.nodes), [state.nodes])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allNodes
      .filter((n) => (boughFilter ? n.boughId === boughFilter : true))
      .filter((n) => (q ? n.name.toLowerCase().includes(q) || n.desc.toLowerCase().includes(q) : true))
      .sort((a, b) => a.boughName.localeCompare(b.boughName) || a.name.localeCompare(b.name))
  }, [allNodes, query, boughFilter])

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="p-4 border-b border-shadow/60 flex flex-col gap-3 shrink-0">
        <input
          type="text"
          className="w-full bg-void/60 border border-shadow/80 rounded-lg px-3 py-2
                     font-body text-starlight text-sm placeholder:text-meta
                     focus:outline-none focus:border-accent/60 focus:bg-void transition-colors"
          placeholder="search nodes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          <button
            className={`px-2.5 py-1 rounded-md font-mono text-[11px] whitespace-nowrap border transition-colors ${
              boughFilter === null ? 'text-accent border-accent/50 bg-accent/10' : 'text-meta border-shadow/60'
            }`}
            onClick={() => setBoughFilter(null)}
          >
            all
          </button>
          {BOUGHS.map((b) => (
            <button
              key={b.id}
              className="px-2.5 py-1 rounded-md font-mono text-[11px] whitespace-nowrap border transition-colors"
              style={
                boughFilter === b.id
                  ? { color: b.color, borderColor: `${b.color}80`, backgroundColor: `${b.color}1a` }
                  : { color: '#56666a', borderColor: 'rgba(28,38,48,1)' }
              }
              onClick={() => setBoughFilter(b.id)}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-area p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {filtered.map((node) => {
            const active = node.rank > 0 || node.achieved
            const selected = node.id === selectedNodeId
            const started = node.logCount > 0 || node.achieved
            const badge = node.achieved
              ? { cls: 'rank-3', text: 'done' }
              : node.rank > 0
                ? { cls: `rank-${node.rank}`, text: `rank ${node.rank}` }
                : node.logCount > 0
                  ? { cls: 'rank-1', text: `logged ×${node.logCount}` }
                  : node.focusState === 'available'
                    ? { cls: 'rank-0', text: 'available' }
                    : { cls: 'rank-0', text: '—' }
            const progressPct = node.repeatable && node.rank < 3 ? Math.min(100, Math.round((node.xp / 1200) * 100)) : null
            return (
              <button
                key={node.id}
                onClick={() => onSelectNode(node.id)}
                className={`text-left rounded-md border p-3 transition-all hover:border-shadow ${selected ? 'bg-white/5' : 'bg-panel/30'}`}
                style={{
                  borderColor: selected ? node.boughColor : 'rgba(28,38,48,1)',
                  boxShadow: selected ? `0 0 14px ${node.boughColor}33` : undefined,
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: node.boughColor }}>
                    {node.boughName}
                  </span>
                  <span className={badge.cls}>{badge.text}</span>
                </div>
                <p className={`font-display text-sm ${active ? 'text-starlight' : started ? 'text-mist' : 'text-mist/70'}`}>
                  {node.name}
                </p>
                <p className="font-body text-xs text-meta mt-1 line-clamp-2">{node.desc}</p>
                {progressPct !== null && progressPct > 0 && (
                  <div className="h-0.5 rounded-full bg-shadow/70 overflow-hidden mt-2">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%`, backgroundColor: node.boughColor }}
                    />
                  </div>
                )}
              </button>
            )
          })}
          {filtered.length === 0 && (
            <p className="font-mono text-xs text-meta col-span-full text-center py-8">no nodes match.</p>
          )}
        </div>
      </div>
    </div>
  )
}
