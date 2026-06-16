import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import type { CatalogItem } from '@/engine/types'

interface Props {
  item: CatalogItem | null
  onConfirm: (catalogId: string, date?: string, note?: string) => void
  onClose: () => void
}

export default function LogConfirmModal({ item, onConfirm, onClose }: Props) {
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')

  if (!item) return null

  const handleLog = () => {
    onConfirm(item.id, date || undefined, note || undefined)
    setDate('')
    setNote('')
  }

  return (
    <Modal open={!!item} onClose={onClose} title={`Log: ${item.name}`}>
      <div className="p-5 space-y-4">
        <p className="font-body text-sm text-mist italic">{item.desc}</p>

        <div>
          <label className="block font-display text-[10px] text-meta tracking-[0.3em] uppercase mb-1.5">
            When (optional)
          </label>
          <input
            type="date"
            className="w-full bg-void/60 border border-shadow/80 rounded-lg px-3 py-2.5 font-body text-starlight
                       focus:outline-none focus:border-cyan/60 min-h-[44px] text-sm"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-display text-[10px] text-meta tracking-[0.3em] uppercase mb-1.5">
            Note (optional)
          </label>
          <textarea
            rows={2}
            placeholder="Any context you want to remember…"
            className="w-full bg-void/60 border border-shadow/80 rounded-lg px-3 py-2.5 font-body text-starlight
                       placeholder:text-meta focus:outline-none focus:border-cyan/60 text-sm resize-none"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="flex gap-3 pt-1">
          <button className="btn-ghost flex-1 text-sm" onClick={onClose}>Cancel</button>
          <button className="btn-green flex-1 text-sm" onClick={handleLog}>
            Log it ✓
          </button>
        </div>
      </div>
    </Modal>
  )
}
