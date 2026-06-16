import type { CatalogItem, CharacterState } from '@/engine/types'
import Badge from '@/components/ui/Badge'
import { SKILLS } from '@/data/skills'

interface Props {
  item: CatalogItem
  state: CharacterState
  loggedCount: number
  onLog: (item: CatalogItem) => void
}

const LINE_COLOR: Record<string, 'cyan' | 'amber' | 'green' | 'purple' | 'mist'> = {
  cert:    'cyan',
  degree:  'amber',
  side:    'green',
  faction: 'purple',
  main:    'amber',
  hidden:  'mist',
}

const SKILL_NAME = Object.fromEntries(SKILLS.map((s) => [s.id, s.name]))

function prereqStatus(item: CatalogItem, state: CharacterState): 'ready' | 'stretch' | 'none' {
  const { prereq } = item
  if (!prereq) return 'none'
  const skillsMet = !prereq.skills || Object.entries(prereq.skills).every(
    ([id, needed]) => (state.skills[id]?.level ?? 0) >= needed
  )
  return skillsMet ? 'ready' : 'stretch'
}

export default function QuestCard({ item, state, loggedCount, onLog }: Props) {
  const status = prereqStatus(item, state)
  const totalXP = Object.values(item.skillXP).reduce((s, v) => s + v, 0)
  const isLogged = loggedCount > 0
  const isComplete = isLogged && !item.repeatable

  return (
    <div
      className={`panel px-4 py-3 space-y-2 animate-fade-in ${isComplete ? 'opacity-80' : ''}`}
      style={isComplete ? { borderColor: 'rgba(92,138,82,0.45)' } : undefined}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display text-sm font-medium text-starlight leading-snug">{item.name}</span>
            {isComplete && <Badge color="green" size="xs">✓ logged</Badge>}
            {item.repeatable && isLogged && <Badge color="green" size="xs">logged ×{loggedCount}</Badge>}
            {status === 'stretch' && <Badge color="amber" size="xs">stretch</Badge>}
            {item.repeatable && !isLogged && <Badge color="mist" size="xs">repeatable</Badge>}
          </div>
          {item.desc && (
            <p className="font-body text-xs text-mist mt-0.5 leading-relaxed">{item.desc}</p>
          )}
        </div>
        <Badge color={LINE_COLOR[item.line]} size="xs">{item.line}</Badge>
      </div>

      {Object.keys(item.skillXP).length > 0 && (
        <div className="flex flex-wrap gap-1">
          {Object.entries(item.skillXP).map(([skillId, xp]) => (
            <span key={skillId} className="text-[10px] font-mono bg-void/60 border border-shadow/40 rounded px-1.5 py-0.5 text-cyan">
              {SKILL_NAME[skillId] ?? skillId} +{xp}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {item.credential && (
            <span className="text-[10px] font-body text-amber/90 flex items-center gap-1">
              🏅 {item.credential}
            </span>
          )}
          {item.gold && (
            <span className="meta-num text-[10px] text-amber/80">${item.gold.toLocaleString()}</span>
          )}
          <span className="meta-num text-[10px]">{totalXP} XP</span>
        </div>
        {isComplete ? (
          <span className="px-4 py-1.5 text-xs min-h-[36px] flex items-center justify-center font-display font-semibold tracking-wide text-green border border-green/40 bg-green/10 rounded-lg">
            ✓ Logged
          </span>
        ) : (
          <button className="btn-primary px-4 py-1.5 text-xs min-h-[36px]" onClick={() => onLog(item)}>
            Log
          </button>
        )}
      </div>

      {status === 'stretch' && item.prereq?.skills && (
        <div className="border-t border-shadow/40 pt-2 space-y-0.5">
          {Object.entries(item.prereq.skills).map(([skillId, needed]) => {
            const current = state.skills[skillId]?.level ?? 0
            const met = current >= needed
            return (
              <div key={skillId} className={`text-[10px] font-body ${met ? 'text-green' : 'text-meta'}`}>
                {met ? '✓' : '·'} {SKILL_NAME[skillId] ?? skillId}: {current}/{needed}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
