import { Handle, Position, type NodeProps, type Node } from '@xyflow/react'
import type { NodeState } from '@/engine/types'
import { FOCUS_OPACITY, DIM_MULTIPLIER } from '../visual'

type Data = { kind: 'node'; node: NodeState; boughColor: string; dim?: boolean }

const RANK_OPACITY = ['33', '66', 'aa', 'ff']

export default function SkillNode({ data, selected }: NodeProps<Node<Data>>) {
  const { node, boughColor, dim } = data
  const active = node.rank > 0 || node.achieved
  const shape = node.repeatable ? 'rounded-full' : 'rotate-45 rounded-sm'
  const baseOpacity = FOCUS_OPACITY[node.focusState]
  const opacity = dim ? baseOpacity * DIM_MULTIPLIER : baseOpacity

  return (
    <div
      className="flex flex-col items-center w-[88px] cursor-pointer group transition-opacity"
      style={{ opacity }}
      title={node.name}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <div
        className={`w-4 h-4 ${shape} transition-all group-hover:scale-125 ${node.rank === 3 && !dim ? 'animate-pulse-glow' : ''}`}
        style={{
          background: active ? `${boughColor}${RANK_OPACITY[node.rank]}` : 'transparent',
          border: `${selected ? 2 : 1.5}px solid ${
            active ? boughColor : node.focusState === 'available' ? `${boughColor}88` : '#3a4750'
          }`,
          boxShadow: dim
            ? 'none'
            : selected
              ? `0 0 14px ${boughColor}, 0 0 0 2px #e7f6eeaa`
              : active
                ? `0 0 6px ${boughColor}66`
                : node.focusState === 'available'
                  ? `0 0 4px ${boughColor}33`
                  : 'none',
        }}
      />
      <span
        className={`font-mono text-[9px] mt-1 text-center leading-tight ${
          active ? 'text-mist' : node.focusState === 'available' ? 'text-mist/80' : 'text-meta'
        }`}
      >
        {node.name}
      </span>
    </div>
  )
}
