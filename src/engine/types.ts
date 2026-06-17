// ─────────────────────────────────────────────────────────────
//  PERSISTED STATE  (the only thing written to localStorage)
// ─────────────────────────────────────────────────────────────

export const SCHEMA_VERSION = 2

export interface Character {
  schemaVersion: number
  name: string
  avatarStyle?: string
  log: LogEntry[]
  createdAt: string
  updatedAt: string
}

export interface LogEntry {
  id: string
  nodeId: string
  date?: string
  note?: string
}

// ─────────────────────────────────────────────────────────────
//  DERIVED CHARACTER STATE  (never persisted)
//  tree → Arbor → Bough → Branch → Node → Rank
// ─────────────────────────────────────────────────────────────

export type NodeRank = 0 | 1 | 2 | 3

/**
 * Visual/decision focus, not a real prerequisite gate — every node is always
 * loggable. 'locked' means "no nearby progress, not an obvious next step";
 * 'available' means "an entry point or natural continuation"; 'active' means
 * "you've already put XP into this." See engine/focus.ts for derivation rules.
 */
export type FocusState = 'locked' | 'available' | 'active'

/** Inferred step in a branch's learning path — used to group Dissect-panel content. */
export type ProgressionLayer = 'fundamentals' | 'applied' | 'advanced' | 'mastery'

export interface NodeState {
  id: string
  name: string
  desc: string
  repeatable: boolean
  branchId: string
  branchName: string
  boughId: string
  boughName: string
  boughColor: string
  xp: number
  rank: NodeRank
  logCount: number
  achieved: boolean
  lastLoggedAt?: string
  focusState: FocusState
}

export interface BranchState {
  id: string
  name: string
  boughId: string
  nodes: NodeState[]
  focusState: FocusState
  layer: ProgressionLayer
}

export interface BoughState {
  id: string
  name: string
  color: string
  desc: string
  branches: BranchState[]
  totalXP: number
  nodesStarted: number
  nodesMaxed: number
  totalNodes: number
  focusState: FocusState
}

export interface TitleState {
  title: string
  flavor: string
}

export interface CharacterState {
  name: string
  avatarStyle?: string
  boughs: BoughState[]
  nodes: Record<string, NodeState>
  title: TitleState
  overallLevel: number
  totalXP: number
  totalLogs: number
  credentialsEarned: NodeState[]
}
