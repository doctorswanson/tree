import { useState } from 'react'
import StarfieldBg from './StarfieldBg'
import { useCharacter } from '@/store/CharacterProvider'

export default function Onboarding() {
  const [name, setName] = useState('')
  const { createCharacter } = useCharacter()

  const canSubmit = name.trim().length > 0

  return (
    <div className="relative flex flex-col h-full items-center justify-center px-6 overflow-hidden bg-void">
      <StarfieldBg />

      <div className="relative z-10 w-full max-w-sm animate-fade-in">
        {/* Crest */}
        <div className="text-center mb-8">
          <p className="font-mono text-3xl text-accent text-glow-accent mb-2">{'>_'}</p>
          <h1 className="font-display text-3xl font-bold text-starlight tracking-[0.1em] mb-1">tree</h1>
          <p className="font-body text-mist text-sm">
            knowledge takes root.
          </p>
        </div>

        {/* Name prompt */}
        <div className="panel-raised p-6">
          <label className="block font-display text-[11px] tracking-[0.2em] text-meta uppercase mb-3">
            Your Handle
          </label>
          <input
            type="text"
            className="w-full bg-void/60 border border-shadow/80 rounded-lg px-4 py-3
                       font-body text-starlight text-lg placeholder:text-meta
                       focus:outline-none focus:border-accent/60 focus:bg-void
                       transition-colors min-h-[48px]"
            placeholder="Enter your name…"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && canSubmit) createCharacter(name.trim()) }}
            autoFocus
            autoComplete="off"
            autoCapitalize="words"
          />
          <p className="font-body text-meta text-xs mt-2">
            All data is stored locally on this device. Nothing leaves.
          </p>

          <button
            className="btn-primary w-full mt-5 text-base disabled:opacity-40 disabled:scale-100"
            disabled={!canSubmit}
            onClick={() => canSubmit && createCharacter(name.trim())}
          >
            Plant the Tree
          </button>
        </div>

        <p className="text-center font-body text-meta text-xs mt-6">
          Log your first node to begin.
        </p>
      </div>
    </div>
  )
}
