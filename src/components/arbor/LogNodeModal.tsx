import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import ScrollDatePicker from '@/components/ui/ScrollDatePicker'
import type { NodeState } from '@/engine/types'
import { useCharacter } from '@/store/CharacterProvider'
import { showToast } from '@/components/ui/Toast'

interface Props {
  node: NodeState | null
  onClose: () => void
}

export default function LogNodeModal({ node, onClose }: Props) {
  const { addLogEntry } = useCharacter()
  const [note, setNote] = useState('')
  const [date, setDate] = useState('')

  if (!node) return null

  const handleSubmit = () => {
    addLogEntry({
      nodeId: node.id,
      note: note.trim() || undefined,
      date: date || undefined,
    })
    showToast(node.repeatable ? `logged: ${node.name}` : `achieved: ${node.name}`)
    setNote('')
    setDate('')
    onClose()
  }

  return (
    <Modal open={!!node} onClose={onClose} title={`log: ${node.name}`}>
      <div className="p-5 flex flex-col gap-4">
        <p className="font-body text-sm text-mist">{node.desc}</p>

        {!node.repeatable && node.achieved && (
          <p className="font-mono text-xs text-accent">already achieved — this credential is logged once.</p>
        )}

        <div>
          <label className="block font-display text-[11px] tracking-[0.2em] text-meta mb-2">
            note (optional)
          </label>
          <textarea
            className="w-full bg-void/60 border border-shadow/80 rounded-lg px-3 py-2
                       font-body text-starlight text-sm placeholder:text-meta resize-none
                       focus:outline-none focus:border-accent/60 focus:bg-void transition-colors"
            rows={3}
            placeholder="What did you do?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-display text-[11px] tracking-[0.2em] text-meta mb-2">
            date (optional)
          </label>
          <ScrollDatePicker value={date} onChange={setDate} />
        </div>

        <button
          className="btn-primary w-full disabled:opacity-40 disabled:scale-100"
          disabled={!node.repeatable && node.achieved}
          onClick={handleSubmit}
        >
          {node.repeatable ? 'log entry' : 'mark achieved'}
        </button>
      </div>
    </Modal>
  )
}
