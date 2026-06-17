// Pure, framework-agnostic character derivation. No React imports.
// deriveCharacter(name, avatarStyle, log) → CharacterState
// Log is the only persisted state — everything here is recomputed at render.

import { BOUGHS, ALL_NODES, NODE_MAP } from '@/data/arbor'
import { XP_PER_LOG, RANK_THRESHOLDS, nodeRank, overallLevel } from './xp'
import { deriveTitle } from './titleEngine'
import { nodeFocusState, branchFocusState, boughFocusState, progressionLayer } from './focus'
import type { LogEntry, NodeState, BranchState, BoughState, CharacterState } from './types'

const MAX_CREDENTIAL_XP = RANK_THRESHOLDS[2]

export function deriveCharacter(
  name: string,
  avatarStyle: string | undefined,
  log: LogEntry[]
): CharacterState {
  const xpByNode: Record<string, number> = {}
  const countByNode: Record<string, number> = {}
  const lastLoggedByNode: Record<string, string> = {}
  const achievedNodes = new Set<string>()

  for (const entry of log) {
    const def = NODE_MAP[entry.nodeId]
    if (!def) continue
    countByNode[entry.nodeId] = (countByNode[entry.nodeId] ?? 0) + 1
    if (def.repeatable) {
      xpByNode[entry.nodeId] = (xpByNode[entry.nodeId] ?? 0) + XP_PER_LOG
    } else {
      achievedNodes.add(entry.nodeId)
    }
    const stamp = entry.date ?? entry.id
    if (!lastLoggedByNode[entry.nodeId] || stamp > lastLoggedByNode[entry.nodeId]) {
      lastLoggedByNode[entry.nodeId] = stamp
    }
  }

  const nodes: Record<string, NodeState> = {}
  let totalXP = 0
  const boughXP: Record<string, number> = {}

  for (const def of ALL_NODES) {
    const achieved = !def.repeatable && achievedNodes.has(def.id)
    const xp = def.repeatable ? (xpByNode[def.id] ?? 0) : achieved ? MAX_CREDENTIAL_XP : 0
    const rank = def.repeatable ? nodeRank(xp) : achieved ? 3 : 0

    totalXP += xp
    boughXP[def.boughId] = (boughXP[def.boughId] ?? 0) + xp

    nodes[def.id] = {
      id: def.id,
      name: def.name,
      desc: def.desc,
      repeatable: def.repeatable,
      branchId: def.branchId,
      branchName: def.branchName,
      boughId: def.boughId,
      boughName: def.boughName,
      boughColor: def.boughColor,
      xp,
      rank,
      logCount: countByNode[def.id] ?? 0,
      achieved,
      lastLoggedAt: lastLoggedByNode[def.id],
      focusState: 'locked', // overwritten below once branch siblings are known
    }
  }

  const boughs: BoughState[] = BOUGHS.map((bough) => {
    const branchCount = bough.branches.length
    const branches: BranchState[] = bough.branches.map((branch, branchIndex) => {
      const branchNodes = branch.nodes.map((n) => nodes[n.id])
      for (const n of branchNodes) n.focusState = nodeFocusState(n, branchNodes)
      return {
        id: branch.id,
        name: branch.name,
        boughId: bough.id,
        nodes: branchNodes,
        focusState: branchFocusState(branchNodes),
        layer: progressionLayer(branchNodes, branchIndex, branchCount),
      }
    })
    const boughNodes = branches.flatMap((b) => b.nodes)
    const boughTotalXP = boughXP[bough.id] ?? 0
    return {
      id: bough.id,
      name: bough.name,
      color: bough.color,
      desc: bough.desc,
      branches,
      totalXP: boughTotalXP,
      nodesStarted: boughNodes.filter((n) => n.logCount > 0).length,
      nodesMaxed: boughNodes.filter((n) => n.rank === 3).length,
      totalNodes: boughNodes.length,
      focusState: boughFocusState(boughTotalXP),
    }
  })

  const credentialsEarned = Object.values(nodes).filter((n) => n.achieved)

  return {
    name,
    avatarStyle,
    boughs,
    nodes,
    title: deriveTitle(boughXP),
    overallLevel: overallLevel(totalXP),
    totalXP,
    totalLogs: log.length,
    credentialsEarned,
  }
}
