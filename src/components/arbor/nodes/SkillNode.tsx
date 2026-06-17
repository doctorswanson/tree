import { Handle, Position, type NodeProps, type Node } from '@xyflow/react'
import { Award } from 'lucide-react'
import type { NodeState } from '@/engine/types'
import { FOCUS_OPACITY, DIM_MULTIPLIER } from '../visual'
import { BOUGH_ICONS } from '../boughIcons'
import Hex from './Hex'

type Data = { kind: 'node'; node: NodeState; boughColor: string; dim?: boolean }

const SIZE = 62
const FILL_ALPHA = ['00', '2a', '55', '80']

export default function SkillNode({ data, selected }: NodeProps<Node<Data>>) {
  const { node, boughColor, dim } = data
  const active = node.rank > 0 || node.achieved
  const baseOpacity = FOCUS_OPACITY[node.focusState]
  const opacity = dim ? baseOpacity * DIM_MULTIPLIER : baseOpacity
  const Icon = node.repeatable ? BOUGH_ICONS[node.boughId] : Award

  const stroke = active ? boughColor : node.focusState === 'available' ? `${boughColor}88` : `${boughColor}45`
  const glow = dim
    ? undefined
    : selected
      ? `0 0 16px ${boughColor}`
      : active
        ? `0 0 8px ${boughColor}77`
        : node.focusState === 'available'
          ? `0 0 4px ${boughColor}33`
          : undefined

  const tooltip = `${node.name}\n${node.achieved ? 'Achieved' : `Rank ${node.rank}/3`}${
    node.repeatable ? ` · ${node.xp} XP · logged ${node.logCount}×` : ''
  }`

  return (
    <div
      className="flex flex-col items-center w-24 cursor-pointer group transition-opacity"
      style={{ opacity }}
      title={tooltip}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <div
        className={`relative flex items-center justify-center transition-transform group-hover:scale-110 ${
          node.rank === 3 && !dim ? 'animate-pulse-glow' : ''
        }`}
        style={{ width: SIZE, height: SIZE }}
      >
        <Hex
          size={SIZE}
          fill={`${boughColor}${FILL_ALPHA[node.rank]}`}
          stroke={selected ? stroke : stroke}
          strokeWidth={selected ? 2.5 : 1.75}
          glow={selected ? `0 0 16px ${boughColor}, 0 0 0 1px #e7f6eeaa` : glow}
          className="absolute inset-0"
        />
        <Icon
          size={22}
          strokeWidth={1.75}
          className="relative pointer-events-none"
          style={{ color: active ? stroke : '#56666a' }}
        />
      </div>
      <span
        className={`font-mono text-[10px] mt-1.5 text-center leading-tight opacity-0 group-hover:opacity-100 transition-opacity ${
          active ? 'text-mist' : node.focusState === 'available' ? 'text-mist/80' : 'text-meta'
        }`}
      >
        {node.name}
      </span>
    </div>
  )
}
