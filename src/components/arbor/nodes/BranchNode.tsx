import { Handle, Position, type NodeProps, type Node } from '@xyflow/react'

type Data = { kind: 'branch'; name: string; boughColor: string }

export default function BranchNode({ data }: NodeProps<Node<Data>>) {
  return (
    <div
      className="px-2 py-1 rounded-md text-center pointer-events-none"
      style={{ border: `1px dashed ${data.boughColor}55`, background: '#0d111799' }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <span className="font-mono text-[9px] tracking-wide text-mist whitespace-nowrap">{data.name}</span>
    </div>
  )
}
