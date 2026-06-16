import type { CharacterState } from '@/engine/types'

interface Props {
  state: CharacterState
}

export default function ProfileHeader({ state }: Props) {
  const { title, overallLevel, totalXP, name } = state
  const isEmpty = totalXP === 0

  return (
    <div className="panel-raised p-5 text-center">
      <p className="font-display text-[11px] text-meta tracking-[0.25em] uppercase mb-1">{name}</p>
      <h1 className={`font-display font-bold leading-tight mb-1 ${isEmpty ? 'text-xl text-mist' : 'text-2xl text-purple text-glow-purple'}`}>
        {title.title}
      </h1>
      <p className="text-mist text-sm leading-relaxed max-w-xs mx-auto mb-3">{title.flavor}</p>

      <div className="flex items-center justify-center gap-2">
        <span className="font-mono text-2xl text-starlight font-semibold">{overallLevel}</span>
        <span className="font-display text-[10px] text-meta uppercase tracking-wider">Overall Level</span>
      </div>

      {isEmpty && (
        <p className="text-xs text-meta mt-3 border-t border-shadow/40 pt-3">
          Log your first achievement to begin leveling.
        </p>
      )}
    </div>
  )
}
