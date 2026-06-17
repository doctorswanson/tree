// Pure derivation of visual focus state. No React, no persistence — recomputed
// at render alongside the rest of CharacterState. There is no real prerequisite
// graph (every node is always loggable per the "visible but dormant" design);
// these functions exist purely to drive "where should I look next" styling.

import type { NodeState, FocusState, ProgressionLayer } from './types'

/** A node is active once it has any progress, available if it's a sensible
 *  next step (first in its branch, or a branch you've already started), and
 *  locked (visually dormant) otherwise. */
export function nodeFocusState(node: NodeState, branchNodes: NodeState[]): FocusState {
  if (node.rank > 0 || node.achieved) return 'active'
  const isFirstInBranch = branchNodes[0]?.id === node.id
  const branchStarted = branchNodes.some((n) => n.rank > 0 || n.achieved)
  return isFirstInBranch || branchStarted ? 'available' : 'locked'
}

/** Branches are always at least an entry point — never fully locked. */
export function branchFocusState(branchNodes: NodeState[]): FocusState {
  return branchNodes.some((n) => n.rank > 0 || n.achieved) ? 'active' : 'available'
}

/** Boughs are always reachable too — 'locked' is reserved for nodes. */
export function boughFocusState(totalXP: number): FocusState {
  return totalXP > 0 ? 'active' : 'available'
}

/**
 * Branches aren't authored with an explicit layer, so infer one: a branch
 * whose nodes are mostly one-shot credentials reads as Mastery regardless of
 * position (that's where OSCP/CISSP/degree-style nodes live); otherwise
 * position within the bough maps early -> fundamentals, late -> advanced.
 */
export function progressionLayer(branchNodes: NodeState[], index: number, count: number): ProgressionLayer {
  if (branchNodes.length === 0) return 'fundamentals'
  const t = count <= 1 ? 0 : index / (count - 1)
  // Position wins for the earliest branch — fundamentals nodes are authored as
  // one-and-done credentials (see ALL_NODES in data/arbor.ts), which would
  // otherwise satisfy the credential-ratio check below and get mislabeled mastery.
  if (t <= 0.15) return 'fundamentals'
  const credentialRatio = branchNodes.filter((n) => !n.repeatable).length / branchNodes.length
  if (credentialRatio > 0.5) return 'mastery'
  if (t <= 0.55) return 'applied'
  return 'advanced'
}
