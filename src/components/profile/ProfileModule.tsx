import { useCharacter } from '@/store/CharacterProvider'
import CredentialWall from './CredentialWall'

export default function ProfileModule() {
  const { state } = useCharacter()
  if (!state) return null

  const sortedBoughs = [...state.boughs].sort((a, b) => b.totalXP - a.totalXP)

  return (
    <div className="scroll-area flex-1 px-6 py-6 max-w-4xl mx-auto w-full space-y-4">
      {/* Header */}
      <div className="panel-raised p-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-full border-2 border-accent/50 bg-accent/10 flex items-center justify-center shrink-0">
          <span className="font-mono text-accent text-3xl">{state.name.slice(0, 1).toUpperCase()}</span>
        </div>
        <div>
          <p className="font-display text-2xl text-starlight">{state.name}</p>
          <p className="font-mono text-sm text-accent mt-0.5">{state.title.title}</p>
          <p className="font-body text-sm text-mist mt-1 italic">{state.title.flavor}</p>
        </div>
      </div>

      {/* Stats strip */}
      <div className="panel p-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="font-mono text-xl text-starlight">{state.overallLevel}</p>
          <p className="font-mono text-[10px] text-meta uppercase tracking-wider">Level</p>
        </div>
        <div>
          <p className="font-mono text-xl text-starlight">{state.totalXP.toLocaleString()}</p>
          <p className="font-mono text-[10px] text-meta uppercase tracking-wider">Total XP</p>
        </div>
        <div>
          <p className="font-mono text-xl text-starlight">{state.totalLogs}</p>
          <p className="font-mono text-[10px] text-meta uppercase tracking-wider">Logs</p>
        </div>
      </div>

      {/* Bough mastery */}
      <div className="panel p-4">
        <p className="panel-title mb-3">Bough Mastery</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {sortedBoughs.map((bough) => {
            const pct = bough.totalNodes === 0 ? 0 : Math.round((bough.nodesMaxed / bough.totalNodes) * 100)
            return (
              <div key={bough.id} className="rounded-md border border-shadow/60 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display text-sm font-medium" style={{ color: bough.color }}>{bough.name}</span>
                  <span className="font-mono text-[10px] text-meta">{bough.nodesMaxed}/{bough.totalNodes}</span>
                </div>
                <div className="h-1.5 rounded-full bg-shadow/40 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${pct}%`, backgroundColor: bough.color }}
                  />
                </div>
                <p className="font-mono text-[10px] text-meta mt-1.5">{bough.totalXP.toLocaleString()} XP</p>
              </div>
            )
          })}
        </div>
      </div>

      <CredentialWall credentials={state.credentialsEarned} />
    </div>
  )
}
