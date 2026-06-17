import { Handle, Position } from '@xyflow/react'

export default function RootNode() {
  return (
    <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-accent/10 border-2 border-accent/60 animate-pulse-glow">
      <Handle type="source" position={Position.Top} style={{ opacity: 0 }} />
      <span className="font-display text-xs tracking-[0.25em] text-accent uppercase">Arbor</span>
    </div>
  )
}
