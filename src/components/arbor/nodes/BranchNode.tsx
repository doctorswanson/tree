import { Handle, Position, type NodeProps, type Node } from '@xyflow/react'
import type { BranchState } from '@/engine/types'
import { FOCUS_OPACITY, DIM_MULTIPLIER } from '../visual'

type Data = { kind: 'branch'; branch: BranchState; boughColor: string; dim?: boolean }

export default function BranchNode({ data }: NodeProps<Node<Data>>) {
  const { branch, boughColor, dim } = data
  const baseOpacity = FOCUS_OPACITY[branch.focusState] * 0.7
  const opacity = dim ? baseOpacity * DIM_MULTIPLIER : baseOpacity

  return (
    <div className="px-1.5 py-0.5 text-center pointer-events-none transition-opacity" style={{ opacity }}>
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <span
        className="font-mono text-[9px] tracking-wide whitespace-nowrap"
        style={{ color: `${boughColor}99` }}
      >
        {branch.name}
      </span>
    </div>
  )
}
