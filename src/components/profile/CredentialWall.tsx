import type { NodeState } from '@/engine/types'

interface Props {
  credentials: NodeState[]
}

export default function CredentialWall({ credentials }: Props) {
  if (credentials.length === 0) {
    return (
      <div className="panel p-4">
        <p className="panel-title mb-2">credentials</p>
        <p className="font-mono text-xs text-meta">none achieved yet. certifications and degrees will appear here.</p>
      </div>
    )
  }

  return (
    <div className="panel p-4">
      <p className="panel-title mb-3">credentials</p>
      <div className="flex flex-wrap gap-2">
        {credentials.map((c) => (
          <span
            key={c.id}
            className="text-xs font-display font-medium rounded-lg px-2.5 py-1.5 border"
            style={{ color: c.boughColor, borderColor: `${c.boughColor}66`, backgroundColor: `${c.boughColor}14` }}
          >
            {c.name}
          </span>
        ))}
      </div>
    </div>
  )
}
