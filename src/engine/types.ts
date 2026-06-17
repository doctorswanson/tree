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
}

export interface BranchState {
  id: string
  name: string
  boughId: string
  nodes: NodeState[]
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
