import { useRef } from 'react'
import Modal from '@/components/ui/Modal'
import { useCharacter } from '@/store/CharacterProvider'

interface Props {
  open: boolean
  onClose: () => void
}

export default function SettingsDrawer({ open, onClose }: Props) {
  const { character, exportJSON, importJSON, resetCharacter } = useCharacter()
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const ok = importJSON(text)
      if (!ok) alert('Import failed: invalid character file.')
      else onClose()
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleReset = () => {
    if (confirm('Delete all data and start over? This cannot be undone.')) {
      resetCharacter()
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="settings">
      <div className="p-5 space-y-5">
        {/* Character info */}
        {character && (
          <div>
            <p className="font-display text-[10px] text-meta tracking-[0.3em] mb-1">character</p>
            <p className="font-body text-starlight">{character.name}</p>
            <p className="font-body text-mist text-xs mt-0.5">
              {character.log.length} log entr{character.log.length === 1 ? 'y' : 'ies'}
              {' · '}Created {new Date(character.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}

        <div className="h-px bg-shadow/40" />

        {/* Export */}
        <div>
          <p className="font-display text-[10px] text-meta tracking-[0.3em] mb-2">data</p>
          <button className="btn-cyan w-full mb-2 text-sm" onClick={exportJSON}>
            export character JSON
          </button>
          <button className="btn-ghost w-full text-sm" onClick={() => fileRef.current?.click()}>
            import character JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
          <p className="font-body text-mist text-xs mt-2 italic">
            Your data never leaves this device. Export to back up or transfer.
          </p>
        </div>

        <div className="h-px bg-shadow/40" />

        {/* Danger zone */}
        <div>
          <button className="btn-danger w-full text-sm" onClick={handleReset}>
            reset & start over
          </button>
        </div>
      </div>
    </Modal>
  )
}
