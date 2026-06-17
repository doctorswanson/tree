import { Handle, Position } from '@xyflow/react'
import { Sprout } from 'lucide-react'
import Hex from './Hex'

const SIZE = 116

export default function RootNode() {
  return (
    <div className="relative flex items-center justify-center animate-pulse-glow" style={{ width: SIZE, height: SIZE }}>
      <Handle type="source" position={Position.Top} style={{ opacity: 0 }} />
      <Hex
        size={SIZE}
        fill="#39ff8a14"
        stroke="#39ff8a"
        strokeWidth={2.5}
        glow="0 0 22px #39ff8a99"
        className="absolute inset-0"
      />
      <div className="relative flex flex-col items-center gap-1 pointer-events-none">
        <Sprout size={28} strokeWidth={1.75} className="text-accent" />
        <span className="font-mono text-[10px] tracking-[0.25em] text-accent uppercase">Arbor</span>
      </div>
    </div>
  )
}
