import { useState } from 'react'
import TopNav, { type TabId } from '@/components/shell/TopNav'
import LeftSidebar from '@/components/shell/LeftSidebar'
import RightPanel from '@/components/shell/RightPanel'
import BottomRow from '@/components/shell/BottomRow'
import ArborGraph, { type ArborSelection } from '@/components/arbor/ArborGraph'
import LogNodeModal from '@/components/arbor/LogNodeModal'
import Codex from '@/components/codex/Codex'
import ProfileModule from '@/components/profile/ProfileModule'
import SettingsDrawer from '@/components/character/SettingsDrawer'
import { useCharacter } from '@/store/CharacterProvider'
import Onboarding from '@/components/layout/Onboarding'
import ToastHost from '@/components/ui/Toast'

export default function App() {
  const [tab, setTab] = useState<TabId>('arbor')
  const [selection, setSelection] = useState<ArborSelection>(null)
  const [loggingNodeId, setLoggingNodeId] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { character, state, isReady } = useCharacter()

  if (!isReady) return null
  if (!character || !state) return <Onboarding />

  const loggingNode = loggingNodeId ? state.nodes[loggingNodeId] ?? null : null

  return (
    <div className="relative flex flex-col h-full overflow-hidden bg-void">
      <TopNav
        active={tab}
        onChange={setTab}
        characterName={state.name}
        title={state.title.title}
        level={state.overallLevel}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {tab === 'profile' ? (
        <ProfileModule />
      ) : (
        <>
          <div className="flex-1 flex min-h-0">
            <LeftSidebar state={state} selection={selection} />
            {tab === 'arbor' ? (
              <ArborGraph boughs={state.boughs} selection={selection} onSelect={setSelection} />
            ) : (
              <Codex
                state={state}
                selectedNodeId={selection?.kind === 'node' ? selection.id : null}
                onSelectNode={(id) => setSelection({ kind: 'node', id })}
              />
            )}
            <RightPanel state={state} selection={selection} onLogNode={(id) => setLoggingNodeId(id)} />
          </div>
          <BottomRow character={character} state={state} />
        </>
      )}

      <LogNodeModal node={loggingNode} onClose={() => setLoggingNodeId(null)} />
      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <ToastHost />
    </div>
  )
}
