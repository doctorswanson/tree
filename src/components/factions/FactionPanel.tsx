import { useCharacter } from '@/store/CharacterProvider'
import { FACTION_LABEL } from '@/engine/types'
import type { FactionId } from '@/engine/types'
import ProgressBar from '@/components/ui/ProgressBar'

const FACTION_ORDER: FactionId[] = ['government', 'bigtech', 'startup', 'consulting', 'defense']
const MAX_REP = 100

export default function FactionPanel() {
  const { state } = useCharacter()
  if (!state) return null

  const anyRep = FACTION_ORDER.some((id) => state.factions[id].rep > 0)

  return (
    <div className="px-4 py-3 space-y-3">
      <p className="font-display text-xs font-semibold tracking-[0.18em] uppercase text-mist">Factions</p>

      {!anyRep && (
        <div className="panel p-4">
          <p className="font-body text-sm text-meta italic">
            No reputation yet. Logging roles tied to a sector — government, big tech, startup, consulting, defense — builds standing there.
          </p>
        </div>
      )}

      {FACTION_ORDER.map((id) => {
        const f = state.factions[id]
        if (f.rep === 0 && f.roles.length === 0) return null
        const pct = Math.min(100, (f.rep / MAX_REP) * 100)
        return (
          <div key={id} className="panel p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-display text-sm font-medium text-starlight">{FACTION_LABEL[id]}</span>
              <span className="meta-num text-xs text-purple">{f.rep} rep</span>
            </div>
            <ProgressBar value={pct} color="bg-gradient-to-r from-purple/60 to-purple" />

            {f.roles.length > 0 && (
              <div className="mt-3 space-y-1 border-t border-shadow/40 pt-2">
                {f.roles.map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-mist">{r.name}</span>
                    {r.date && <span className="meta-num">{r.date}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
