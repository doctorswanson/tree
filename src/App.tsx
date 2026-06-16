import { useState } from 'react'
import StatusBar from '@/components/shell/StatusBar'
import ModuleNav from '@/components/shell/ModuleNav'
import type { ModuleId } from '@/components/shell/ModuleNav'
import ProfileModule from '@/components/profile/ProfileModule'
import SkillConstellation from '@/components/skilltree/SkillConstellation'
import QuestBoard from '@/components/quests/QuestBoard'
import ClassGrid from '@/components/classes/ClassGrid'
import FactionPanel from '@/components/factions/FactionPanel'
import EventLog from '@/components/logs/EventLog'
import SettingsDrawer from '@/components/character/SettingsDrawer'
import { useCharacter } from '@/store/CharacterProvider'
import Onboarding from '@/components/layout/Onboarding'

export default function App() {
  const [module, setModule] = useState<ModuleId>('trees')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { character, isReady } = useCharacter()

  if (!isReady) return null

  if (!character) return <Onboarding />

  return (
    <div className="relative flex flex-col h-full overflow-hidden bg-void">
      <StatusBar onOpenSettings={() => setSettingsOpen(true)} />

      <main className="relative z-10 flex-1 scroll-area min-h-0">
        {module === 'profile'  && <ProfileModule />}
        {module === 'trees'    && <SkillConstellation />}
        {module === 'quests'   && <QuestBoard />}
        {module === 'classes'  && <ClassGrid />}
        {module === 'factions' && <FactionPanel />}
        {module === 'logs'     && <EventLog />}
      </main>

      {module !== 'quests' && (
        <button
          className="absolute right-4 bottom-[72px] z-30 w-14 h-14 rounded-full bg-green text-void
                     text-2xl font-display font-bold flex items-center justify-center shadow-lg
                     shadow-green/30 active:scale-95 transition-transform"
          onClick={() => setModule('quests')}
          aria-label="Log an achievement"
        >
          +
        </button>
      )}

      <ModuleNav active={module} onChange={setModule} />

      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
