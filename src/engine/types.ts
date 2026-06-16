// ─────────────────────────────────────────────────────────────
//  PERSISTED STATE  (the only thing written to localStorage)
// ─────────────────────────────────────────────────────────────

export const SCHEMA_VERSION = 1

export interface Character {
  schemaVersion: number
  name: string
  log: LogEntry[]
  customCatalog: CatalogItem[]
  createdAt: string
  updatedAt: string
}

export interface LogEntry {
  id: string
  catalogId: string | null
  custom?: {
    name: string
    type: EntryType
    skillXP: Record<string, number>
    credential?: string
    gold?: number
    rep?: number
    faction?: FactionId
  }
  date?: string
  note?: string
}

// ─────────────────────────────────────────────────────────────
//  CATALOG  (seed + user-created)
// ─────────────────────────────────────────────────────────────

export type EntryType = 'cert' | 'degree' | 'role' | 'project' | 'side' | 'milestone' | 'other'
export type CatalogLine = 'main' | 'cert' | 'degree' | 'side' | 'faction' | 'hidden'
export type DifficultyTier = 'minor' | 'standard' | 'major' | 'epic'
export type FactionId = 'government' | 'bigtech' | 'startup' | 'consulting' | 'defense'

export interface CatalogItem {
  id: string
  name: string
  type: EntryType
  line: CatalogLine
  desc: string
  skillXP: Record<string, number>
  prereq?: {
    skills?: Record<string, number>
    entries?: string[]
  }
  credential?: string
  gold?: number
  rep?: number
  faction?: FactionId
  unlocks?: string[]
  repeatable?: boolean
  hidden?: boolean
  difficultyTier?: DifficultyTier
}

// ─────────────────────────────────────────────────────────────
//  SKILL DEFINITIONS
// ─────────────────────────────────────────────────────────────

export type AttributeId = 'INT' | 'WIS' | 'DEX' | 'CON' | 'CHA' | 'WIL'
export type SkillCategory =
  | 'Development'
  | 'Infrastructure'
  | 'Security'
  | 'Data & AI'
  | 'Cloud'
  | 'Leadership'
  | 'Rare Arts'

export interface SkillDef {
  id: string
  name: string
  category: SkillCategory
  rare?: boolean
  feeds: AttributeId[]
}

// ─────────────────────────────────────────────────────────────
//  CLASS DEFINITIONS
// ─────────────────────────────────────────────────────────────

export type ClassTier = 'advanced' | 'prestige' | 'legendary'

export interface ClassDef {
  id: string
  name: string
  tier: ClassTier
  desc: string
  requirements: Record<string, number>
}

// ─────────────────────────────────────────────────────────────
//  DERIVED CHARACTER STATE  (never persisted)
// ─────────────────────────────────────────────────────────────

export interface SkillState {
  id: string
  name: string
  category: SkillCategory
  rare: boolean
  feeds: AttributeId[]
  xp: number
  level: number
}

export interface AttributeState {
  id: AttributeId
  pct: number
  score: number
  modifier: number
}

export interface ClassState {
  def: ClassDef
  unlocked: boolean
  metRequirements: Record<string, boolean>
}

export interface TitleState {
  title: string
  flavor: string
}

export interface FactionState {
  id: FactionId
  rep: number
  roles: { name: string; date?: string }[]
}

export const FACTION_LABEL: Record<FactionId, string> = {
  government: 'Government',
  bigtech: 'Big Tech',
  startup: 'Startup',
  consulting: 'Consulting',
  defense: 'Defense',
}

export interface CharacterState {
  name: string
  skills: Record<string, SkillState>
  attributes: Record<AttributeId, AttributeState>
  classes: ClassState[]
  unlockedClasses: ClassDef[]
  formalRank: ClassDef | null
  title: TitleState
  overallLevel: number
  totalXP: number
  credentials: string[]
  revealedEntries: Set<string>
  totalGold: number
  factions: Record<FactionId, FactionState>
}
