import { Handle, Position, type NodeProps, type Node } from '@xyflow/react'
import type { BoughState } from '@/engine/types'
import { FOCUS_OPACITY, DIM_MULTIPLIER } from '../visual'
import { BOUGH_ICONS } from '../boughIcons'
import Hex from './Hex'

type Data = { kind: 'bough'; bough: BoughState; dim?: boolean }

const SIZE = 132

export default function BoughNode({ data, selected }: NodeProps<Node<Data>>) {
  const { bough, dim } = data
  const pct = bough.totalNodes === 0 ? 0 : Math.round((bough.nodesMaxed / bough.totalNodes) * 100)
  const baseOpacity = FOCUS_OPACITY[bough.focusState]
  const opacity = dim ? baseOpacity * DIM_MULTIPLIER : baseOpacity
  const Icon = BOUGH_ICONS[bough.id]

  const strokeAlpha = selected ? 'ff' : bough.focusState === 'active' ? 'cc' : '70'
  const glow = dim
    ? undefined
    : selected
      ? `0 0 28px ${bough.color}cc`
      : bough.focusState === 'active'
        ? `0 0 16px ${bough.color}66`
        : `0 0 8px ${bough.color}33`

  return (
    <div
      className="relative flex items-center justify-center cursor-pointer transition-all hover:scale-105"
      style={{ width: SIZE, height: SIZE, opacity }}
      title={`${bough.name} — ${pct}% maxed — ${bough.focusState.toUpperCase()}`}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Hex
        size={SIZE}
        fill={`${bough.color}1f`}
        stroke={`${bough.color}${strokeAlpha}`}
        strokeWidth={selected ? 3 : 2}
        glow={glow}
        className="absolute inset-0"
      />
      <div className="relative flex flex-col items-center gap-1 pointer-events-none px-2">
        {Icon && <Icon size={26} strokeWidth={1.75} style={{ color: bough.color }} />}
        <span className="font-mono text-sm font-semibold tracking-wide text-center" style={{ color: bough.color }}>
          {bough.name}
        </span>
        <span className="font-mono text-[10px] text-mist">{pct}% maxed</span>
      </div>
    </div>
  )
}
