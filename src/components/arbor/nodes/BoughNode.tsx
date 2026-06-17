import { Handle, Position, type NodeProps, type Node } from '@xyflow/react'
import type { BoughState } from '@/engine/types'

type Data = { kind: 'bough'; bough: BoughState }

export default function BoughNode({ data, selected }: NodeProps<Node<Data>>) {
  const { bough } = data
  const pct = bough.totalNodes === 0 ? 0 : Math.round((bough.nodesMaxed / bough.totalNodes) * 100)

  return (
    <div
      className="relative flex flex-col items-center justify-center w-28 h-28 rounded-full cursor-pointer transition-transform hover:scale-105"
      style={{
        background: `radial-gradient(circle, ${bough.color}22 0%, #0d111799 70%)`,
        border: `2px solid ${bough.color}${selected ? 'ff' : '88'}`,
        boxShadow: selected ? `0 0 24px ${bough.color}66` : `0 0 10px ${bough.color}33`,
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
