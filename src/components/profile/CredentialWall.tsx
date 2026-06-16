interface Props {
  credentials: string[]
}

export default function CredentialWall({ credentials }: Props) {
  if (credentials.length === 0) return null

  return (
    <div className="panel p-4">
      <p className="panel-title mb-2">Credentials</p>
      <div className="flex flex-wrap gap-2">
        {credentials.map((c) => (
          <span
            key={c}
            className="text-xs font-display font-medium text-amber border border-amber/40 bg-amber/10 rounded-lg px-2.5 py-1.5"
          >
            🏅 {c}
          </span>
        ))}
      </div>
    </div>
  )
}
