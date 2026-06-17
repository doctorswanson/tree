import { useState } from 'react'
import { useCharacter } from '@/store/CharacterProvider'
import CredentialWall from './CredentialWall'

export default function ProfileModule() {
  const { state } = useCharacter()
  const [expandedBoughId, setExpandedBoughId] = useState<string | null>(null)
  if (!state) return null

  const sortedBoughs = [...state.boughs].sort((a, b) => b.totalXP - a.totalXP)

  return (
    <div className="scroll-area flex-1 px-6 py-6 max-w-4xl mx-auto w-full space-y-4">
      {/* Header */}
      <div className="panel-raised p-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-full border-2 border-accent/50 bg-accent/10 flex items-center justify-center shrink-0">
          <span className="font-mono text-accent text-3xl">{state.name.slice(0, 1).toUpperCase()}</span>
        </div>
        <div>
          <p className="font-display text-2xl text-starlight">{state.name}</p>
          <p className="font-mono text-sm text-accent mt-0.5">{state.title.title}</p>
          <p className="font-body text-sm text-mist mt-1 italic">{state.title.flavor}</p>
        </div>
      </div>

      {/* Stats strip */}
      <div className="panel p-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="font-mono text-xl text-starlight">{state.overallLevel}</p>
          <p className="font-mono text-[10px] text-meta tracking-wider">level</p>
        </div>
        <div>
          <p className="font-mono text-xl text-starlight">{state.totalXP.toLocaleString()}</p>
          <p className="font-mono text-[10px] text-meta tracking-wider">total xp</p>
        </div>
        <div>
          <p className="font-mono text-xl text-starlight">{state.totalLogs}</p>
          <p className="font-mono text-[10px] text-meta tracking-wider">logs</p>
        </div>
      </div>

      {/* Bough mastery */}
      <div className="panel p-4">
        <p className="panel-title mb-3">bough mastery</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {sortedBoughs.map((bough) => {
            const pct = bough.totalNodes === 0 ? 0 : Math.round((bough.nodesMaxed / bough.totalNodes) * 100)
            const expanded = expandedBoughId === bough.id
            return (
              <button
                key={bough.id}
                onClick={() => setExpandedBoughId(expanded ? null : bough.id)}
                className={`text-left rounded-md border p-3 transition-colors col-span-1 ${expanded ? 'sm:col-span-3' : ''}`}
                style={{ borderColor: expanded ? bough.color : 'rgba(28,38,48,1)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display text-sm font-medium" style={{ color: bough.color }}>{bough.name}</span>
                  <span className="font-mono text-[10px] text-meta">{bough.nodesMaxed}/{bough.totalNodes}</span>
                </div>
                <div className="h-1.5 rounded-full bg-shadow/40 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${pct}%`, backgroundColor: bough.color }}
                  />
                </div>
                <p className="font-mono text-[10px] text-meta mt-1.5">{bough.totalXP.toLocaleString()} xp</p>

                {expanded && (
                  <div className="mt-3 pt-3 border-t border-shadow/60 flex flex-col gap-2 cursor-default" onClick={(e) => e.stopPropagation()}>
                    {bough.branches.map((branch) => (
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
                              {n.achieved || n.rank === 3 ? '✓' : n.focusState === 'locked' && '🔒'}
                              {n.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <CredentialWall credentials={state.credentialsEarned} />
    </div>
  )
}
