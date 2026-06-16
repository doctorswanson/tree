import { useEffect, useState, type ReactNode } from 'react'
import StarfieldBg from './StarfieldBg'

// SHA-256 hash of the passcode — never store the plaintext code here.
const PASSCODE_HASH = 'dfeafa5bf26f6ba5319d8ddaf48725c83ae33b294ca2413baaf386f8e21a1b4d'
const UNLOCK_KEY = 'tree_unlocked'

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

export default function PasscodeGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false)
  const [checked, setChecked] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setUnlocked(localStorage.getItem(UNLOCK_KEY) === '1')
    setChecked(true)
  }, [])

  const handleSubmit = async () => {
    if (!code.trim() || busy) return
    setBusy(true)
    const hash = await sha256Hex(code.trim())
    setBusy(false)
    if (hash === PASSCODE_HASH) {
      localStorage.setItem(UNLOCK_KEY, '1')
      setUnlocked(true)
    } else {
      setError(true)
      setCode('')
    }
  }

  if (!checked) return null
  if (unlocked) return <>{children}</>

  return (
    <div className="relative flex flex-col h-full items-center justify-center px-6 overflow-hidden bg-void">
      <StarfieldBg />

      <div className="relative z-10 w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <p className="font-display text-4xl text-gold text-glow-gold mb-2">✦</p>
          <h1 className="font-display text-3xl font-bold text-starlight tracking-[0.1em] mb-1">.tree</h1>
          <p className="font-body text-mist text-sm">Sealed. Speak the passcode.</p>
        </div>

        <div className="panel-raised p-6 corner-flourish">
          <label className="block font-display text-[11px] tracking-[0.2em] text-meta uppercase mb-3">
            Passcode
          </label>
          <input
            type="password"
            inputMode="numeric"
            autoComplete="off"
            className={`w-full bg-void/60 border rounded-lg px-4 py-3
                       font-mono text-starlight text-lg tracking-[0.3em] text-center placeholder:text-meta
                       focus:outline-none focus:bg-void transition-colors min-h-[48px]
                       ${error ? 'border-red-700/70' : 'border-shadow/80 focus:border-gold/60'}`}
            placeholder="••••••"
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(false) }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
            autoFocus
          />
          {error && (
            <p className="font-body text-red-400 text-xs mt-2">That's not it. Try again.</p>
          )}

          <button
            className="btn-primary w-full mt-5 text-base disabled:opacity-40 disabled:scale-100"
            disabled={!code.trim() || busy}
            onClick={handleSubmit}
          >
            {busy ? 'Checking…' : 'Unseal'}
          </button>
        </div>
      </div>
    </div>
  )
}
