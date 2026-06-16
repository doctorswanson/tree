import { useCharacter } from '@/store/CharacterProvider'
import { CATALOG } from '@/data/catalog'

function resolveName(catalogId: string | null, customName: string | undefined, customCatalog: { id: string; name: string }[]): string {
  if (customName) return customName
  if (!catalogId) return 'Unknown entry'
  const item = [...CATALOG, ...customCatalog].find((c) => c.id === catalogId)
  return item?.name ?? catalogId
}

function totalXP(entry: { catalogId: string | null; custom?: { skillXP: Record<string, number> } }, customCatalog: { id: string; skillXP: Record<string, number> }[]): number {
  if (entry.custom?.skillXP) return Object.values(entry.custom.skillXP).reduce((s, v) => s + v, 0)
  if (entry.catalogId) {
    const item = [...CATALOG, ...customCatalog].find((c) => c.id === entry.catalogId)
    if (item) return Object.values(item.skillXP).reduce((s, v) => s + v, 0)
  }
  return 0
}

export default function EventLog() {
  const { character, removeLogEntry } = useCharacter()
  if (!character) return null

  const entries = [...character.log].reverse()

  return (
    <div className="px-4 py-3 space-y-3">
      <p className="font-display text-xs font-semibold tracking-[0.18em] uppercase text-mist">System Log</p>

      <div className="panel">
        {entries.length === 0 ? (
          <p className="font-body text-sm text-meta italic p-4">No events logged yet.</p>
        ) : (
          <div className="divide-y divide-shadow/40">
            {entries.map((e) => {
              const name = resolveName(e.catalogId, e.custom?.name, character.customCatalog)
              const xp = totalXP(e, character.customCatalog)
              return (
                <div key={e.id} className="px-4 py-2.5 flex items-start gap-3">
                  <span className="font-mono text-[10px] text-meta shrink-0 pt-0.5 w-20">
                    {e.date ?? '—'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm text-starlight truncate">{name}</p>
                    {e.note && <p className="font-mono text-[11px] text-meta mt-0.5">{e.note}</p>}
                  </div>
                  <span className="font-mono text-[11px] text-green shrink-0">+{xp}xp</span>
                  <button
                    className="text-meta hover:text-red-400 text-xs shrink-0 w-6 h-6 flex items-center justify-center"
                    onClick={() => removeLogEntry(e.id)}
                    aria-label="Remove entry"
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
