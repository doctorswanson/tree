import { useState, useMemo } from 'react'
import { useCharacter } from '@/store/CharacterProvider'
import { CATALOG } from '@/data/catalog'
import type { CatalogItem, CatalogLine } from '@/engine/types'
import QuestCard from './QuestCard'
import LogConfirmModal from './LogConfirmModal'
import CustomEntryModal from './CustomEntryModal'

const LINE_TABS: { id: CatalogLine | 'all'; label: string }[] = [
  { id: 'all',     label: 'All' },
  { id: 'cert',    label: 'Certs' },
  { id: 'degree',  label: 'Degrees' },
  { id: 'faction', label: 'Roles' },
  { id: 'side',    label: 'Projects' },
  { id: 'main',    label: 'Milestones' },
]

export default function QuestBoard() {
  const { state, character, addLogEntry, saveCustomCatalogItem } = useCharacter()
  const [lineFilter, setLineFilter] = useState<CatalogLine | 'all'>('all')
  const [pendingItem, setPendingItem] = useState<CatalogItem | null>(null)
  const [customOpen, setCustomOpen] = useState(false)
  const [search, setSearch] = useState('')

  const fullCatalog = useMemo(() => [
    ...CATALOG,
    ...(character?.customCatalog ?? []),
  ], [character?.customCatalog])

  const loggedCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const entry of character?.log ?? []) {
      if (entry.catalogId) counts[entry.catalogId] = (counts[entry.catalogId] ?? 0) + 1
    }
    return counts
  }, [character?.log])

  const visible = useMemo(() => {
    return fullCatalog.filter((item) => {
      if (item.hidden && !state?.revealedEntries.has(item.id)) return false
      if (lineFilter !== 'all' && item.line !== lineFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        if (!item.name.toLowerCase().includes(q) && !item.desc.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [fullCatalog, lineFilter, search, state?.revealedEntries])

  const handleLogCatalog = (catalogId: string, date?: string, note?: string) => {
    addLogEntry({ catalogId, date, note })
    setPendingItem(null)
  }

  if (!state) return null

  return (
    <>
      <div className="pb-4">
        <div className="px-4 pt-3 pb-1">
          <p className="font-display text-xs font-semibold tracking-[0.18em] uppercase text-mist">Quests</p>
        </div>

        <div className="px-4 pt-2 pb-2">
          <input
            type="search"
            placeholder="Search catalog…"
            className="w-full bg-panel/80 border border-shadow/60 rounded-lg px-3 py-2.5 font-body text-starlight
                       placeholder:text-meta focus:outline-none focus:border-cyan/60 text-sm min-h-[44px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex overflow-x-auto no-scrollbar px-3 pb-2 gap-2">
          {LINE_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setLineFilter(t.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-display tracking-wide min-h-[36px] transition-all ${
                lineFilter === t.id
                  ? 'bg-cyan/15 text-cyan border border-cyan/40'
                  : 'bg-panel/60 text-mist border border-shadow/40'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="px-4 mb-3">
          <button className="btn-green w-full text-sm" onClick={() => setCustomOpen(true)}>
            + Log something else
          </button>
        </div>

        <div className="px-4 space-y-2">
          {visible.length === 0 ? (
            <div className="text-center py-10">
              <p className="font-body text-mist text-sm italic">
                {search ? 'No matching entries.' : 'Nothing to show in this category.'}
              </p>
            </div>
          ) : (
            visible.map((item) => (
              <QuestCard
                key={item.id}
                item={item}
                state={state}
                loggedCount={loggedCounts[item.id] ?? 0}
                onLog={(i) => setPendingItem(i)}
              />
            ))
          )}
        </div>

        {character && character.log.length > 0 && (
          <div className="text-center mt-4">
            <p className="meta-num text-xs">
              {character.log.length} entr{character.log.length === 1 ? 'y' : 'ies'} in your chronicle
            </p>
          </div>
        )}
      </div>

      <LogConfirmModal item={pendingItem} onConfirm={handleLogCatalog} onClose={() => setPendingItem(null)} />

      <CustomEntryModal
        open={customOpen}
        onClose={() => setCustomOpen(false)}
        onLog={(entry, saveToMyCatalog) => {
          if (saveToMyCatalog) saveCustomCatalogItem(saveToMyCatalog)
          addLogEntry(entry)
          setCustomOpen(false)
        }}
      />
    </>
  )
}
