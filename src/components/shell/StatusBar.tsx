import { useCharacter } from '@/store/CharacterProvider'

interface Props {
  onOpenSettings: () => void
}

export default function StatusBar({ onOpenSettings }: Props) {
  const { state } = useCharacter()
  if (!state) return null

  const { name, overallLevel, formalRank, totalGold } = state

  return (
    <div className="pt-safe relative z-20 flex items-center gap-3 px-4 py-2.5 border-b border-shadow/60 bg-panel/80 backdrop-blur-md">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className="font-display text-sm font-semibold text-starlight truncate">{name}</span>
        <span className="meta-num text-[11px] shrink-0">Lv {overallLevel}</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {formalRank && (
          <span className="hidden xs:inline text-[10px] font-display font-medium tracking-wide text-purple border border-purple/40 bg-purple/10 rounded px-1.5 py-0.5 truncate max-w-[120px]">
            {formalRank.name}
          </span>
        )}
        {totalGold > 0 && (
          <span className="meta-num text-[11px] text-amber">${Math.round(totalGold / 1000)}k</span>
        )}
        <button
          className="text-mist hover:text-starlight w-9 h-9 flex items-center justify-center shrink-0"
          onClick={onOpenSettings}
          aria-label="Settings"
        >
          <span className="text-base">⚙</span>
        </button>
      </div>
    </div>
  )
}
