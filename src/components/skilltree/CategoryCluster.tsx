import type { SkillCategory, SkillState } from '@/engine/types'
import SkillNode from './SkillNode'

interface Props {
  category: SkillCategory
  skills: SkillState[]
  onTapSkill: (skill: SkillState) => void
}

const SIZE = 300
const CENTER = SIZE / 2

function nodePosition(i: number, n: number): { x: number; y: number } {
  const angle = (i / n) * 2 * Math.PI - Math.PI / 2
  const radius = n > 6 ? (i % 2 === 0 ? 82 : 112) : 96
  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
  }
}

export default function CategoryCluster({ category, skills, onTapSkill }: Props) {
  const n = skills.length
  const positions = skills.map((_, i) => nodePosition(i, n))
  const avgLevel = Math.round(skills.reduce((s, sk) => s + sk.level, 0) / Math.max(1, n))

  return (
    <div className="w-full snap-center shrink-0 px-2">
      <div className="panel-raised overflow-hidden">
        <div className="panel-header">
          <h3 className="panel-title text-starlight">{category}</h3>
          <span className="meta-num text-[11px]">avg {avgLevel}</span>
        </div>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full select-none" style={{ maxHeight: 340 }}>
          {/* Spokes from hub to each node */}
          {positions.map((p, i) => (
            <line
              key={`spoke-${skills[i].id}`}
              x1={CENTER} y1={CENTER} x2={p.x} y2={p.y}
              stroke={skills[i].level > 0 ? '#c9a227' : '#3a2f1f'}
              strokeOpacity={skills[i].level > 0 ? 0.45 : 0.6}
              strokeWidth={1.25}
            />
          ))}
          {/* Hub */}
          <circle cx={CENTER} cy={CENTER} r={10} fill="#241d14" stroke="#c9a227" strokeWidth={1.5} />
          {/* Nodes */}
          {skills.map((s, i) => (
            <SkillNode key={s.id} skill={s} x={positions[i].x} y={positions[i].y} onTap={onTapSkill} />
          ))}
        </svg>
      </div>
    </div>
  )
}
