import type { SkillState, CharacterState } from '@/engine/types'
import { CLASSES } from '@/data/classes'
import Modal from '@/components/ui/Modal'
import ProgressBar from '@/components/ui/ProgressBar'

interface Props {
  skill: SkillState | null
  state: CharacterState | null
  onClose: () => void
}

export default function SkillNodeDetail({ skill, state, onClose }: Props) {
  if (!skill) return null

  const feedingClasses = CLASSES.filter((c) => Object.keys(c.requirements).includes(skill.id))
  const lockedFeeding = feedingClasses.filter((c) => {
    const cs = state?.classes.find((x) => x.def.id === c.id)
    return cs && !cs.unlocked
  })

  return (
    <Modal open={!!skill} onClose={onClose} title={skill.name}>
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-3xl text-starlight">{skill.level}</span>
          <span className="meta-num text-xs">{skill.xp} / 5000 XP</span>
        </div>
        <ProgressBar value={skill.level} color="bg-gradient-to-r from-green/60 to-green" />

        <div className="flex flex-wrap gap-1.5">
          <span className="text-[10px] font-display tracking-wide text-mist border border-shadow/60 rounded px-2 py-0.5">
            {skill.category}
          </span>
          {skill.rare && (
            <span className="text-[10px] font-display tracking-wide text-purple border border-purple/40 bg-purple/10 rounded px-2 py-0.5">
              ✦ Rare Art
            </span>
          )}
          {skill.feeds.map((a) => (
            <span key={a} className="text-[10px] font-mono text-cyan border border-cyan/30 bg-cyan/10 rounded px-1.5 py-0.5">
              {a}
            </span>
          ))}
        </div>

        {lockedFeeding.length > 0 && (
          <div className="border-t border-shadow/40 pt-3">
            <p className="panel-title mb-2">Feeds these unlocks</p>
            <div className="space-y-1.5">
              {lockedFeeding.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-center justify-between text-xs">
                  <span className="text-mist">{c.name}</span>
                  <span className="meta-num">{c.requirements[skill.id]}+ needed</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
