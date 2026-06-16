import { useState } from 'react'
import { useCharacter } from '@/store/CharacterProvider'
import type { ClassState, ClassDef, ClassTier } from '@/engine/types'
import Badge from '@/components/ui/Badge'

const TIER_COLOR: Record<ClassTier, 'cyan' | 'purple' | 'amber'> = {
  advanced: 'cyan', prestige: 'purple', legendary: 'amber',
}
const TIER_LABEL: Record<ClassTier, string> = {
  advanced: 'Advanced', prestige: 'Prestige', legendary: 'Legendary',
}
const TIER_ORDER: ClassTier[] = ['legendary', 'prestige', 'advanced']

function LockedClassRow({ cs, skills }: { cs: ClassState; skills: Record<string, { name: string; level: number }> }) {
  const missing = Object.entries(cs.def.requirements).filter(([id]) => !cs.metRequirements[id])
  return (
    <div className="py-2.5 border-t border-shadow/40 first:border-t-0">
      <div className="flex items-center justify-between mb-1">
        <span className="font-display text-xs text-mist">{cs.def.name}</span>
        <Badge color={TIER_COLOR[cs.def.tier]} size="xs">{TIER_LABEL[cs.def.tier]}</Badge>
      </div>
      <div className="space-y-0.5 mt-1">
        {missing.map(([skillId, needed]) => {
          const current = skills[skillId]?.level ?? 0
          return (
            <div key={skillId} className="flex items-center justify-between text-[11px]">
              <span className="text-meta font-body">{skills[skillId]?.name ?? skillId}</span>
              <span className="meta-num">{current} <span className="text-mist">/ {needed}</span></span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function ClassGrid() {
  const { state } = useCharacter()
  const [showAll, setShowAll] = useState(false)
  if (!state) return null

  const { classes, skills } = state
  const unlockedByTier = TIER_ORDER.map((tier) => ({
    tier,
    list: classes.filter((c) => c.unlocked && c.def.tier === tier).map((c) => c.def),
  })).filter((g) => g.list.length > 0)

  const lockedClasses = classes.filter((c) => !c.unlocked)
  const scored = lockedClasses.map((cs) => {
    const missingCount = Object.values(cs.metRequirements).filter((m) => !m).length
    const totalGap = Object.entries(cs.def.requirements)
      .filter(([id]) => !cs.metRequirements[id])
      .reduce((sum, [id, needed]) => sum + (needed - (skills[id]?.level ?? 0)), 0)
    return { cs, score: missingCount * 1000 + totalGap }
  })
  scored.sort((a, b) => a.score - b.score)
  const nearest = scored.slice(0, showAll ? 12 : 4)

  return (
    <div className="px-4 py-3 space-y-3">
      <p className="font-display text-xs font-semibold tracking-[0.18em] uppercase text-mist">Classes</p>

      <div className="panel p-4">
        <p className="panel-title mb-2">Unlocked</p>
        {unlockedByTier.length > 0 ? (
          <div className="space-y-3">
            {unlockedByTier.map(({ tier, list }) => (
              <div key={tier}>
                <p className="text-[10px] font-display tracking-wider uppercase text-meta mb-1.5">{TIER_LABEL[tier]}</p>
                <div className="flex flex-wrap gap-2">
                  {list.map((c: ClassDef) => (
                    <Badge key={c.id} color={TIER_COLOR[c.tier]} size="sm">{c.name}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-body text-sm text-meta italic">No classes unlocked yet. Level up your skills.</p>
        )}
      </div>

      {nearest.length > 0 && (
        <div className="panel px-3 py-1">
          <p className="panel-title pt-2 pb-1">Within Reach</p>
          {nearest.map(({ cs }) => <LockedClassRow key={cs.def.id} cs={cs} skills={skills} />)}
          {lockedClasses.length > 4 && (
            <button
              className="w-full text-center text-xs font-display text-meta tracking-wide py-2.5 border-t border-shadow/40"
              onClick={() => setShowAll((v) => !v)}
            >
              {showAll ? 'Show less' : `+ ${lockedClasses.length - 4} more classes`}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
