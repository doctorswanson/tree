import { Handle, Position, type NodeProps, type Node } from '@xyflow/react'
import type { NodeState } from '@/engine/types'

type Data = { kind: 'node'; node: NodeState; boughColor: string }

const RANK_OPACITY = ['33', '66', 'aa', 'ff']

export default function SkillNode({ data, selected }: NodeProps<Node<Data>>) {
  const { node, boughColor } = data
  const active = node.rank > 0 || node.achieved
  const shape = node.repeatable ? 'rounded-full' : 'rotate-45 rounded-sm'

  return (
    <div className="flex flex-col items-center w-[88px] cursor-pointer group" title={node.name}>
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <div
        className={`w-4 h-4 ${shape} transition-all group-hover:scale-125 ${node.rank === 3 ? 'animate-pulse-glow' : ''}`}
        style={{
          background: active ? `${boughColor}${RANK_OPACITY[node.rank]}` : 'transparent',
          border: `1.5px solid ${active ? boughColor : '#3a4750'}`,
          boxShadow: selected ? `0 0 12px ${boughColor}` : active ? `0 0 6px ${boughColor}66` : 'none',
        }}
      />
      <span className={`font-mono text-[9px] mt-1 text-center leading-tight ${active ? 'text-mist' : 'text-meta'}`}>
        {node.name}
      </span>
    </div>
  )
}
