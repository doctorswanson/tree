import { useState, useMemo } from 'react'
import { v4 as uuid } from 'uuid'
import Modal from '@/components/ui/Modal'
import type { LogEntry, CatalogItem, EntryType, DifficultyTier } from '@/engine/types'
import { SKILLS } from '@/data/skills'
import { TIER_BUDGET, splitXPByTier } from '@/engine/xp'

interface Props {
  open: boolean
  onClose: () => void
  onLog: (entry: Omit<LogEntry, 'id'>, saveToMyCatalog?: CatalogItem) => void
}

const TYPE_OPTIONS: EntryType[] = ['cert', 'degree', 'role', 'project', 'side', 'milestone', 'other']
const TIER_OPTIONS: DifficultyTier[] = ['minor', 'standard', 'major', 'epic']
const TIER_DESC: Record<DifficultyTier, string> = {
  minor:    `~${TIER_BUDGET.minor} XP — quick win, script, meetup`,
  standard: `~${TIER_BUDGET.standard} XP — cert, CTF, side project`,
  major:    `~${TIER_BUDGET.major} XP — major cert, a year in a role`,
  epic:     `~${TIER_BUDGET.epic} XP — degree, OSCP, multi-year role`,
}

const CATEGORY_ORDER = ['Security', 'Infrastructure', 'Development', 'Data & AI', 'Cloud', 'Leadership', 'Rare Arts']

interface SkillPick {
  id: string
  xp: number
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

export default function CustomEntryModal({ open, onClose, onLog }: Props) {
  const [name, setName]         = useState('')
  const [type, setType]         = useState<EntryType>('cert')
  const [tier, setTier]         = useState<DifficultyTier>('standard')
  const [picks, setPicks]       = useState<SkillPick[]>([])
  const [advanced, setAdvanced] = useState(false)
  const [date, setDate]         = useState('')
  const [note, setNote]         = useState('')
  const [saveToLib, setSaveToLib] = useState(false)
  const [credential, setCredential] = useState('')

  const budget = TIER_BUDGET[tier]

  const autoXP = useMemo(() => {
    if (picks.length === 0) return {}
    return splitXPByTier(tier, picks.map((p) => p.id))
  }, [tier, picks])

  const resolvedPicks = picks.map((p) =>
    advanced ? p : { id: p.id, xp: autoXP[p.id] ?? 0 }
  )
  const totalCustomXP = resolvedPicks.reduce((s, p) => s + p.xp, 0)

  const toggleSkill = (skillId: string) => {
    setPicks((prev) => {
      const exists = prev.find((p) => p.id === skillId)
      if (exists) return prev.filter((p) => p.id !== skillId)
      if (prev.length >= 5) return prev
      return [...prev, { id: skillId, xp: 0 }]
    })
  }

  const setSkillXP = (skillId: string, xp: number) => {
    setPicks((prev) => prev.map((p) => p.id === skillId ? { ...p, xp: clamp(xp, 0, 5000) } : p))
  }

  const handleLog = () => {
    if (!name.trim() || picks.length === 0) return
    const skillXP: Record<string, number> = {}
    resolvedPicks.forEach((p) => { if (p.xp > 0) skillXP[p.id] = p.xp })

    const entry: Omit<LogEntry, 'id'> = {
      catalogId: null,
      custom: {
        name: name.trim(),
        type,
        skillXP,
        credential: credential.trim() || undefined,
      },
      date: date || undefined,
      note: note.trim() || undefined,
    }

    const savedItem: CatalogItem | undefined = saveToLib
      ? {
          id: uuid(),
          name: name.trim(),
          type,
          line: type === 'role' ? 'faction' : type === 'cert' ? 'cert' : type === 'degree' ? 'degree' : 'side',
          desc: '',
          skillXP,
          credential: credential.trim() || undefined,
          difficultyTier: tier,
        }
      : undefined

    onLog(entry, savedItem)
    resetForm()
  }

  const resetForm = () => {
    setName(''); setType('cert'); setTier('standard')
    setPicks([]); setAdvanced(false); setDate(''); setNote('')
    setSaveToLib(false); setCredential('')
  }

  const handleClose = () => { resetForm(); onClose() }

  const canLog = name.trim().length > 0 && picks.length > 0

  const groupedSkills = CATEGORY_ORDER.map((cat) => ({
    cat,
    skills: SKILLS.filter((s) => s.category === cat),
  }))

  return (
    <Modal open={open} onClose={handleClose} title="Log Something Else">
      <div className="p-4 space-y-5 pb-6">

        <div>
          <label className="block font-display text-[10px] text-meta tracking-[0.3em] uppercase mb-1.5">
            What did you accomplish?
          </label>
          <input
            type="text"
            placeholder="e.g., CRTO, built a malware sandbox, promoted to lead…"
            className="w-full bg-void/60 border border-shadow/80 rounded-lg px-3 py-2.5 font-body text-starlight
                       placeholder:text-meta focus:outline-none focus:border-cyan/60 text-sm min-h-[44px]"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoCapitalize="words"
            autoComplete="off"
          />
        </div>

        <div>
          <label className="block font-display text-[10px] text-meta tracking-[0.3em] uppercase mb-1.5">
            Type
          </label>
          <div className="flex flex-wrap gap-2">
            {TYPE_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-display tracking-wide min-h-[36px] transition-all capitalize ${
                  type === t
                    ? 'bg-cyan/15 text-cyan border border-cyan/40'
                    : 'bg-panel/60 text-mist border border-shadow/40'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-display text-[10px] text-meta tracking-[0.3em] uppercase mb-1.5">
            Difficulty
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TIER_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={`px-3 py-2 rounded-lg text-xs font-display tracking-wide min-h-[44px] transition-all text-left ${
                  tier === t
                    ? 'bg-green/10 text-green border border-green/40'
                    : 'bg-panel/60 text-mist border border-shadow/40'
                }`}
              >
                <div className="capitalize font-semibold">{t}</div>
                <div className={`text-[10px] mt-0.5 font-body normal-case ${tier === t ? 'text-green/70' : 'text-meta'}`}>
                  {TIER_DESC[t]}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-display text-[10px] text-meta tracking-[0.3em] uppercase">
              Skills raised (up to 5)
            </label>
            {picks.length > 0 && (
              <span className="meta-num text-[10px] text-cyan">
                {advanced ? `${totalCustomXP} XP total` : `~${budget} XP auto-split`}
              </span>
            )}
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto scroll-area rounded-lg border border-shadow/40 p-2">
            {groupedSkills.map(({ cat, skills }) => (
              <div key={cat}>
                <p className={`text-[10px] font-display tracking-wider uppercase px-1 py-0.5 ${cat === 'Rare Arts' ? 'text-purple' : 'text-meta'}`}>
                  {cat}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s) => {
                    const selected = picks.some((p) => p.id === s.id)
                    return (
                      <button
                        key={s.id}
                        onClick={() => toggleSkill(s.id)}
                        className={`px-2.5 py-1 rounded text-xs font-body min-h-[32px] transition-all ${
                          selected
                            ? 'bg-green/15 text-green border border-green/50'
                            : 'bg-panel/40 text-mist border border-shadow/40'
                        } ${s.rare ? 'italic' : ''}`}
                      >
                        {s.rare && <span className="text-purple/60 text-[9px] mr-0.5">✦</span>}
                        {s.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {picks.length > 0 && (
            <div className="mt-2">
              <button
                onClick={() => {
                  if (!advanced) {
                    setPicks((prev) => prev.map((p) => ({ ...p, xp: autoXP[p.id] ?? 0 })))
                  }
                  setAdvanced((v) => !v)
                }}
                className="text-xs font-display text-meta tracking-wide underline underline-offset-2"
              >
                {advanced ? 'Use auto-split' : 'Advanced: set XP manually'}
              </button>

              {advanced && (
                <div className="mt-2 space-y-2">
                  {picks.map((p) => {
                    const skill = SKILLS.find((s) => s.id === p.id)
                    return (
                      <div key={p.id} className="flex items-center gap-3">
                        <span className="text-xs text-mist font-body flex-1 min-w-0 truncate">{skill?.name}</span>
                        <input
                          type="number"
                          min={0}
                          max={700}
                          value={p.xp}
                          onChange={(e) => setSkillXP(p.id, parseInt(e.target.value, 10) || 0)}
                          className="w-20 bg-void/60 border border-shadow/60 rounded px-2 py-1 font-mono text-xs text-starlight
                                     focus:outline-none focus:border-cyan/60 text-right min-h-[36px]"
                        />
                        <span className="text-[10px] text-meta w-4">XP</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Credential name (e.g., CRTO, HTB Pro Hacker) — optional"
            className="w-full bg-void/60 border border-shadow/60 rounded-lg px-3 py-2.5 font-body text-starlight
                       placeholder:text-meta focus:outline-none focus:border-cyan/60 text-sm min-h-[44px]"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
          />
          <div className="flex gap-3">
            <input
              type="date"
              className="flex-1 bg-void/60 border border-shadow/60 rounded-lg px-3 py-2.5 font-body text-starlight
                         focus:outline-none focus:border-cyan/60 text-sm min-h-[44px]"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <textarea
            rows={2}
            placeholder="Note — optional"
            className="w-full bg-void/60 border border-shadow/60 rounded-lg px-3 py-2.5 font-body text-starlight
                       placeholder:text-meta focus:outline-none focus:border-cyan/60 text-sm resize-none"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer no-select min-h-[44px]">
          <input
            type="checkbox"
            checked={saveToLib}
            onChange={(e) => setSaveToLib(e.target.checked)}
            className="w-4 h-4 accent-cyan"
          />
          <span className="font-body text-sm text-mist">Save to my catalog (reuse later)</span>
        </label>

        <div className="flex gap-3 pt-1">
          <button className="btn-ghost flex-1 text-sm" onClick={handleClose}>Cancel</button>
          <button
            className="btn-green flex-1 text-sm disabled:opacity-40 disabled:scale-100"
            disabled={!canLog}
            onClick={handleLog}
          >
            Log it ✓
          </button>
        </div>
      </div>
    </Modal>
  )
}
