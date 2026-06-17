// Pure read-only selectors over derived CharacterState + raw log. No React imports.

import type { Character, CharacterState, NodeState } from './types'
import { xpToNextRank } from './xp'

export interface RecentLogItem {
  id: string
  node: NodeState | undefined
  note?: string
  date?: string
}

export function recentActivity(character: Character, state: CharacterState, limit = 6): RecentLogItem[] {
  return [...character.log]
    .reverse()
    .slice(0, limit)
    .map((entry) => ({
      id: entry.id,
      node: state.nodes[entry.nodeId],
      note: entry.note,
      date: entry.date,
    }))
}

export interface OnDeckItem {
  node: NodeState
  remaining: number
}

export function onDeck(state: CharacterState, limit = 3): OnDeckItem[] {
  const candidates: OnDeckItem[] = []
  for (const node of Object.values(state.nodes)) {
    if (!node.repeatable || node.xp === 0) continue
    const next = xpToNextRank(node.xp)
    if (!next) continue
    candidates.push({ node, remaining: next.remaining })
  }
  return candidates.sort((a, b) => a.remaining - b.remaining).slice(0, limit)
}
