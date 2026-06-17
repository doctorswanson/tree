import { Handle, Position, type NodeProps, type Node } from '@xyflow/react'
import type { BoughState } from '@/engine/types'
import { FOCUS_OPACITY, DIM_MULTIPLIER } from '../visual'

type Data = { kind: 'bough'; bough: BoughState; dim?: boolean }

export default function BoughNode({ data, selected }: NodeProps<Node<Data>>) {
  const { bough, dim } = data
  const pct = bough.totalNodes === 0 ? 0 : Math.round((bough.nodesMaxed / bough.totalNodes) * 100)
  const baseOpacity = FOCUS_OPACITY[bough.focusState]
  const opacity = dim ? baseOpacity * DIM_MULTIPLIER : baseOpacity
  const glow = dim
    ? 'none'
    : selected
      ? `0 0 24px ${bough.color}99`
      : bough.focusState === 'active'
        ? `0 0 14px ${bough.color}55`
        : `0 0 6px ${bough.color}22`

  return (
    <div
      className="relative flex flex-col items-center justify-center w-28 h-28 rounded-full cursor-pointer transition-all hover:scale-105"
      style={{
        opacity,
        background: `radial-gradient(circle, ${bough.color}22 0%, #0d111799 70%)`,
        border: `2px solid ${bough.color}${selected ? 'ff' : bough.focusState === 'active' ? 'aa' : '55'}`,
        boxShadow: glow,
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <span className="font-display text-sm font-semibold tracking-wide" style={{ color: bough.color }}>
        {bough.name}
      </span>
      <span className="font-mono text-[10px] text-mist mt-1">{pct}% maxed</span>
    </div>
  )
}
