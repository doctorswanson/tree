// Pure, framework-agnostic character derivation. No React imports.
// deriveCharacter(log, skillDefs, classDefs, catalog, name) → CharacterState

import { skillLevel, overallLevel } from './xp'
import { deriveTitle } from './titleEngine'
import type {
  LogEntry,
  SkillDef,
  ClassDef,
  CatalogItem,
  SkillState,
  AttributeState,
  AttributeId,
  ClassState,
  CharacterState,
  FactionId,
  FactionState,
} from './types'

const FACTION_IDS: FactionId[] = ['government', 'bigtech', 'startup', 'consulting', 'defense']

// ── Attribute derivation ────────────────────────────────────────────────────

function deriveAttribute(
  attrId: AttributeId,
  skillStates: Record<string, SkillState>,
  skillDefs: SkillDef[]
): AttributeState {
  const feeders = skillDefs.filter((s) => s.feeds.includes(attrId))
  const pct =
    feeders.length === 0
      ? 0
      : feeders.reduce((sum, s) => sum + (skillStates[s.id]?.level ?? 0), 0) /
        feeders.length

  const score = 8 + Math.round((pct / 100) * 12)
  const modifier = Math.floor((score - 10) / 2)
  return { id: attrId, pct, score, modifier }
}

// ── Main derive function ────────────────────────────────────────────────────

export function deriveCharacter(
  name: string,
  log: LogEntry[],
  skillDefs: SkillDef[],
  classDefs: ClassDef[],
  catalog: CatalogItem[]
): CharacterState {
  // 1. Accumulate skill XP from log (order-independent: pure sum)
  const xpMap: Record<string, number> = {}
  const credentials: string[] = []
  const revealedEntries = new Set<string>()
  let totalGold = 0
  const factionRep: Record<FactionId, number> = { government: 0, bigtech: 0, startup: 0, consulting: 0, defense: 0 }
  const factionRoles: Record<FactionId, { name: string; date?: string }[]> = {
    government: [], bigtech: [], startup: [], consulting: [], defense: [],
  }

  for (const entry of log) {
    // Resolve skillXP: catalog item XP, overridden by custom XP if present
    let skillXP: Record<string, number> = {}
    let entryName: string | undefined
    let gold: number | undefined
    let rep: number | undefined
    let faction: FactionId | undefined

    if (entry.catalogId) {
      const item = catalog.find((c) => c.id === entry.catalogId)
      if (item) {
        skillXP = { ...item.skillXP }
        entryName = item.name
        gold = item.gold
        rep = item.rep
        faction = item.faction
        if (item.credential) credentials.push(item.credential)
        if (item.unlocks) item.unlocks.forEach((id) => revealedEntries.add(id))
      }
    }
    if (entry.custom?.skillXP) {
      // custom XP merges on top (full override per skill)
      Object.assign(skillXP, entry.custom.skillXP)
      entryName = entry.custom.name
      if (entry.custom.credential) credentials.push(entry.custom.credential)
      if (entry.custom.gold !== undefined) gold = entry.custom.gold
      if (entry.custom.rep !== undefined) rep = entry.custom.rep
      if (entry.custom.faction !== undefined) faction = entry.custom.faction
    }
    for (const [skillId, xp] of Object.entries(skillXP)) {
      xpMap[skillId] = (xpMap[skillId] ?? 0) + (xp > 0 ? xp : 0)
    }
    if (gold) totalGold += gold
    if (faction && rep) {
      factionRep[faction] += rep
      factionRoles[faction].push({ name: entryName ?? 'Unknown role', date: entry.date })
    }
  }

  // 2. Build skill states
  const skills: Record<string, SkillState> = {}
  let totalXP = 0
  for (const def of skillDefs) {
    const xp = Math.min(xpMap[def.id] ?? 0, 5000)
    totalXP += xp
    skills[def.id] = {
      id: def.id,
      name: def.name,
      category: def.category,
      rare: def.rare ?? false,
      feeds: def.feeds,
      xp,
      level: skillLevel(xp),
    }
  }

  // 3. Derive attributes
  const ATTR_IDS: AttributeId[] = ['INT', 'WIS', 'DEX', 'CON', 'CHA', 'WIL']
  const attributes = {} as Record<AttributeId, AttributeState>
  for (const id of ATTR_IDS) {
    attributes[id] = deriveAttribute(id, skills, skillDefs)
  }

  // 4. Derive classes
  const skillLevels: Record<string, number> = {}
  for (const [id, s] of Object.entries(skills)) skillLevels[id] = s.level

  const classes: ClassState[] = classDefs.map((def) => {
    const metRequirements: Record<string, boolean> = {}
    let unlocked = true
    for (const [skillId, needed] of Object.entries(def.requirements)) {
      const met = (skillLevels[skillId] ?? 0) >= needed
      metRequirements[skillId] = met
      if (!met) unlocked = false
    }
    return { def, unlocked, metRequirements }
  })

  const unlockedClasses = classes
    .filter((c) => c.unlocked)
    .map((c) => c.def)

  // Formal rank = highest tier unlocked (legendary > prestige > advanced)
  const TIER_ORDER: Record<string, number> = { legendary: 3, prestige: 2, advanced: 1 }
  const formalRank =
    unlockedClasses.reduce<ClassDef | null>((best, c) => {
      if (!best) return c
      return (TIER_ORDER[c.tier] ?? 0) > (TIER_ORDER[best.tier] ?? 0) ? c : best
    }, null)

  // 5. Adaptive title
  const titleResult = deriveTitle(skillLevels)

  // 6. Factions
  const factions = {} as Record<FactionId, FactionState>
  for (const id of FACTION_IDS) {
    factions[id] = { id, rep: factionRep[id], roles: factionRoles[id] }
  }

  return {
    name,
    skills,
    attributes,
    classes,
    unlockedClasses,
    formalRank,
    title: titleResult,
    overallLevel: overallLevel(totalXP),
    totalXP,
    credentials: [...new Set(credentials)],
    revealedEntries,
    totalGold,
    factions,
  }
}
