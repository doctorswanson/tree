import { Handle, Position, type NodeProps, type Node } from '@xyflow/react'
import type { BranchState } from '@/engine/types'
import { FOCUS_OPACITY, DIM_MULTIPLIER } from '../visual'

type Data = { kind: 'branch'; branch: BranchState; boughColor: string; dim?: boolean }

export default function BranchNode({ data }: NodeProps<Node<Data>>) {
  const { branch, boughColor, dim } = data
  const baseOpacity = FOCUS_OPACITY[branch.focusState]
  const opacity = dim ? baseOpacity * DIM_MULTIPLIER : baseOpacity
  const borderWidth = branch.focusState === 'active' ? 1.5 : 1

  return (
    <div
      className="px-2 py-1 rounded-md text-center pointer-events-none transition-opacity"
      style={{
        opacity,
        border: `${borderWidth}px dashed ${boughColor}${branch.focusState === 'active' ? 'aa' : '55'}`,
        background: '#0d111799',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <span className="font-mono text-[9px] tracking-wide text-mist whitespace-nowrap">{branch.name}</span>
    </div>
  )
}
