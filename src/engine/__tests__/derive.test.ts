import { describe, it, expect } from 'vitest'
import { deriveCharacter } from '../derive'
import type { LogEntry, SkillDef, ClassDef, CatalogItem } from '../types'

// ── Minimal fixtures ────────────────────────────────────────────────────────

const SKILLS: SkillDef[] = [
  { id: 'security',           name: 'Security',            category: 'Security',        feeds: ['INT', 'WIS'] },
  { id: 'offensive-security', name: 'Offensive Security',  category: 'Security',        feeds: ['INT', 'DEX'] },
  { id: 'networking',         name: 'Networking',          category: 'Infrastructure',  feeds: ['DEX', 'INT'] },
  { id: 'programming',        name: 'Programming',         category: 'Development',     feeds: ['INT', 'WIL'] },
]

const CLASSES: ClassDef[] = [
  { id: 'security-analyst', name: 'Security Analyst', tier: 'advanced',  desc: '', requirements: { 'security': 40 } },
  { id: 'pen-tester',       name: 'Penetration Tester', tier: 'prestige', desc: '', requirements: { 'security': 70, 'offensive-security': 70, 'networking': 70 } },
]

const CATALOG: CatalogItem[] = [
  {
    id: 'secplus',
    name: 'CompTIA Security+',
    type: 'cert',
    line: 'cert',
    desc: '',
    skillXP: { 'security': 120 },
    credential: 'CompTIA Security+',
    unlocks: ['cysa'],
  },
  {
    id: 'cysa',
    name: 'CompTIA CySA+',
    type: 'cert',
    line: 'cert',
    desc: '',
    skillXP: { 'security': 100 },
    hidden: true,
  },
]

const EMPTY_LOG: LogEntry[] = []

// ── Helpers ─────────────────────────────────────────────────────────────────

function makeEntry(overrides: Partial<LogEntry> = {}): LogEntry {
  return { id: 'e1', catalogId: null, ...overrides }
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('deriveCharacter — empty log', () => {
  const state = deriveCharacter('Tyler', EMPTY_LOG, SKILLS, CLASSES, CATALOG)

  it('name is preserved', () => expect(state.name).toBe('Tyler'))
  it('totalXP is 0', () => expect(state.totalXP).toBe(0))
  it('overallLevel is 1', () => expect(state.overallLevel).toBe(1))
  it('all skill levels are 0', () => {
    for (const s of Object.values(state.skills)) expect(s.level).toBe(0)
  })
  it('no classes unlocked', () => expect(state.unlockedClasses).toHaveLength(0))
  it('formalRank is null', () => expect(state.formalRank).toBeNull())
  it('title is Unspecced Initiate', () => expect(state.title.title).toBe('Unspecced Initiate'))
  it('credentials list is empty', () => expect(state.credentials).toHaveLength(0))
})

describe('deriveCharacter — single catalog entry', () => {
  const log: LogEntry[] = [makeEntry({ id: 'e1', catalogId: 'secplus' })]
  const state = deriveCharacter('Tyler', log, SKILLS, CLASSES, CATALOG)

  it('security XP is 120', () => expect(state.skills['security'].xp).toBe(120))
  it('credential is recorded', () => expect(state.credentials).toContain('CompTIA Security+'))
  it('secplus unlocks cysa', () => expect(state.revealedEntries.has('cysa')).toBe(true))
})

describe('deriveCharacter — custom entry', () => {
  const log: LogEntry[] = [
    makeEntry({
      id: 'e2',
      catalogId: null,
      custom: {
        name: 'Custom CTF',
        type: 'side',
        skillXP: { 'offensive-security': 80, 'networking': 40 },
      },
    }),
  ]
  const state = deriveCharacter('Tyler', log, SKILLS, CLASSES, CATALOG)

  it('offensive-security XP is 80', () => expect(state.skills['offensive-security'].xp).toBe(80))
  it('networking XP is 40', () => expect(state.skills['networking'].xp).toBe(40))
})

describe('deriveCharacter — PURITY: same log always produces same result', () => {
  const log: LogEntry[] = [
    makeEntry({ id: 'e1', catalogId: 'secplus' }),
    makeEntry({ id: 'e2', catalogId: null, custom: { name: 'CTF', type: 'side', skillXP: { 'offensive-security': 80 } } }),
  ]
  const a = deriveCharacter('Tyler', log, SKILLS, CLASSES, CATALOG)
  const b = deriveCharacter('Tyler', log, SKILLS, CLASSES, CATALOG)

  it('totalXP is identical', () => expect(a.totalXP).toBe(b.totalXP))
  it('skills are identical', () => {
    for (const id of Object.keys(a.skills)) {
      expect(a.skills[id].xp).toBe(b.skills[id].xp)
      expect(a.skills[id].level).toBe(b.skills[id].level)
    }
  })
  it('title is identical', () => expect(a.title.title).toBe(b.title.title))
  it('unlockedClasses count is identical', () => expect(a.unlockedClasses.length).toBe(b.unlockedClasses.length))
})

describe('deriveCharacter — ORDER INDEPENDENCE: skill XP is a commutative sum', () => {
  const logAB: LogEntry[] = [
    makeEntry({ id: 'e1', catalogId: 'secplus' }),
    makeEntry({ id: 'e2', catalogId: null, custom: { name: 'Project', type: 'project', skillXP: { 'security': 50 } } }),
  ]
  const logBA: LogEntry[] = [logAB[1], logAB[0]]

  const stateAB = deriveCharacter('Tyler', logAB, SKILLS, CLASSES, CATALOG)
  const stateBA = deriveCharacter('Tyler', logBA, SKILLS, CLASSES, CATALOG)

  it('security XP is order-independent', () =>
    expect(stateAB.skills['security'].xp).toBe(stateBA.skills['security'].xp))
  it('totalXP is order-independent', () =>
    expect(stateAB.totalXP).toBe(stateBA.totalXP))
  it('overallLevel is order-independent', () =>
    expect(stateAB.overallLevel).toBe(stateBA.overallLevel))
  it('title is order-independent', () =>
    expect(stateAB.title.title).toBe(stateBA.title.title))
})

describe('deriveCharacter — class unlocking', () => {
  // Need security ≥ 40 for Security Analyst
  // Security+ gives 120 XP → skillLevel(120) = floor((120/5)^(1/1.5)) = floor(24^0.667) = floor(8.32) = 8
  // Need more XP. Let's use a custom entry to reach level 40.
  // xpForLevel(40) = round(5 * 40^1.5) = round(5 * 252.98) = round(1264.9) = 1265
  const log: LogEntry[] = [
    makeEntry({ id: 'e1', catalogId: null, custom: { name: 'Test', type: 'other', skillXP: { 'security': 1265 } } }),
  ]
  const state = deriveCharacter('Tyler', log, SKILLS, CLASSES, CATALOG)

  it('security level is at least 40', () => expect(state.skills['security'].level).toBeGreaterThanOrEqual(40))
  it('Security Analyst is unlocked', () => expect(state.unlockedClasses.map(c => c.id)).toContain('security-analyst'))
  it('Pen Tester is NOT unlocked (other skills too low)', () => expect(state.unlockedClasses.map(c => c.id)).not.toContain('pen-tester'))
  it('formalRank is Security Analyst', () => expect(state.formalRank?.id).toBe('security-analyst'))
})

describe('deriveCharacter — XP cap per skill', () => {
  const log: LogEntry[] = [
    makeEntry({ id: 'e1', catalogId: null, custom: { name: 'x', type: 'other', skillXP: { 'security': 9999 } } }),
  ]
  const state = deriveCharacter('Tyler', log, SKILLS, CLASSES, CATALOG)
  it('security XP is capped at 5000', () => expect(state.skills['security'].xp).toBe(5000))
  it('security level is 100', () => expect(state.skills['security'].level).toBe(100))
})
