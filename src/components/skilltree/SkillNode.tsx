import type { SkillState } from '@/engine/types'

interface Props {
  skill: SkillState
  x: number
  y: number
  onTap: (skill: SkillState) => void
}

function levelColors(level: number) {
  if (level === 0) {
    return { stroke: '#3a2f1f', fill: '#1a150f', text: '#7a6c4f' }
  }
  if (level < 40) {
    return { stroke: '#6f93b3', fill: 'rgba(111,147,179,0.15)', text: '#9fc1dd' }
  }
  if (level < 70) {
    return { stroke: '#5c8a52', fill: 'rgba(92,138,82,0.18)', text: '#84b876' }
  }
  return { stroke: '#c9a227', fill: 'rgba(201,162,39,0.2)', text: '#f0cf6b' }
}

export default function SkillNode({ skill, x, y, onTap }: Props) {
  const c = levelColors(skill.level)
  const r = 17

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={() => onTap(skill)}
      className="cursor-pointer"
    >
      {skill.rare && (
        <circle r={r + 4} fill="none" stroke="#8b5fbf" strokeWidth={1.25} strokeDasharray="2 2" opacity={0.7} />
      )}
      <circle r={r} fill={c.fill} stroke={c.stroke} strokeWidth={2} />
      <text
        y={4}
        textAnchor="middle"
        fontSize={11}
        fontFamily="JetBrains Mono, monospace"
        fill={c.text}
        fontWeight={600}
      >
        {skill.level > 0 ? skill.level : '·'}
      </text>
      <text
        y={r + 14}
        textAnchor="middle"
        fontSize={9.5}
        fontFamily="EB Garamond, serif"
        fill="#b3a584"
      >
        {skill.name.length > 14 ? skill.name.slice(0, 13) + '…' : skill.name}
      </text>
    </g>
  )
}
